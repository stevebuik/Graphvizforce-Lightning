window.GraphvizForce;
(function(GraphvizForce){

    var DiagramUtils = (function(){
        return {
            onSearchDiagrams : function(component, event, helper) {
                var diagrams = component.get('v.diagrams');
                var term = component.get('v.searchTerm').toLowerCase();
                diagrams.forEach(function(diagram){
                    diagram.visible = (term === '' || diagram.label.toLowerCase().indexOf(term) !== -1);
                });
                component.set('v.diagrams', diagrams);
            },

            gotoDiagramDetail : function(component, event, helper){
                component.set('v.currentState', 'DETAIL');
                component.find('diagramConfigurator').find('sourcePanel').find('objectPanel').set('v.searchTerm', '');
                var diagram = event.getParam('scope');
                component.set('v.selectedDiagram', diagram);
                helper.initialiseObjects(component, event, helper);
            },

            onDiagramCreated : function(component, event, helper){
                var scope = event.getParam('scope');
                var newRecord = scope.diagramObject;
                var isClone = scope.isClone;
                var diagrams = component.get('v.diagrams');
                var diagramName = newRecord.label;
                diagrams.forEach(function (diagram, index){
                   if(diagram.value === newRecord.value){
                       diagrams[index] = newRecord;
                       component.set('v.diagrams', diagrams);
                       return;
                   }
                });
                component.set('v.selectedDiagram', newRecord);

                if(isClone){
                    component.find('diagramConfigurator').find('sourcePanel').find('objectPanel').set('v.searchTerm', '');
                    helper.initialiseObjects(component, event, helper);
                    Core.AuraUtils.showNotification("Info", "The diagram '" + diagramName + "' was cloned successfully.")
                }
                else{
                    Core.AuraUtils.showNotification("Info", "The diagram '" + diagramName + "' was created successfully.")
                }
            },

            onRemoveDiagram : function(component, event, helper){
               var diagrams = component.get('v.diagrams');
               var diagramToRemove = event.getParam('scope');
               diagrams.forEach(function (diagram, index) {
                   if(diagram.value === diagramToRemove.value){
                       diagrams.splice(index, 1);
                       component.set('v.diagrams', diagrams);
                       return;
                   }
               });
               component.find('diagramDataService').deleteDiagramRecord(diagramToRemove);
            },

            onDragObjectToGroup : function(component, event, helper){
                var objects = component.get('v.objects');
                var selectedDiagram = component.get('v.selectedDiagram');
                var scope = event.getParam('scope');
                var objectToAdd = JSON.parse(scope.object);
                var groupValue = 'ContainerGroup';
                console.log('@@@@ onDragObjectToGroup');
                console.log(objectToAdd);
                console.log(groupValue);
                helper.addObjectToGroup(component, helper, objectToAdd, groupValue);
            },

            onTargetPanelRemoveObject : function(component, event, helper){
                var obj = event.getParam('scope');
                var selectedDiagram = component.get('v.selectedDiagram');
                var objects = component.get('v.objects');
                var group = selectedDiagram.groups[0];

                var objectIndex = -1;
                var objectToRemove;
                group.entities.forEach(function (targetObject, objectIndex) {
                    if(targetObject.value === obj.value){
                        objectToRemove = targetObject;
                        selectedDiagram.groups[0].entities.splice(objectIndex, 1);
                        objects.push(objectToRemove);
                        objects.sort(GraphvizForce.DiagramHelper.compare);
                        component.set('v.selectedDiagram', selectedDiagram);
                        component.set('v.objects', objects);
                        return;
                    }
                });
            },

            onObjectAttributesUpdated : function(component, event, helper){
                var attribute = event.getParam('scope');
                var selectedDiagram = component.get('v.selectedDiagram');
                var objects = component.get('v.objects');
                var selectedObject = component.get('v.selectedObject');

                // Find target object in groups and propagate attribute changes
                selectedDiagram.groups.forEach(function (group) {
                    group.entities.forEach(function (targetObject) {
                        if(targetObject.value === selectedObject.value){
                            targetObject.attributes.forEach(function (targetAttribute) {
                                if(targetAttribute.value === attribute.value){
                                    targetAttribute.selected = attribute.selected;
                                    component.set('v.selectedDiagram', selectedDiagram);
                                    component.set('v.selectedObject', targetObject);
                                    return;
                                }
                            });
                        }
                    });
                });

                // Find target object in objects and propagate attribute changes
                objects.forEach(function (targetObject) {
                    if(targetObject.value === selectedObject.value){
                        targetObject.attributes.forEach(function (targetAttribute) {
                            if(targetAttribute.value === attribute.value){
                                targetAttribute.selected = attribute.selected;
                                component.set('v.objects', objects);
                                component.set('v.selectedObject', targetObject);
                                return;
                            }
                        });
                    }
                });
            },
        };
    })();
    GraphvizForce.DiagramUtils = DiagramUtils;

    var DiagramHelper = (function(){
        return {
            inspectSchema : function(component, event, helper, result){
                var allObjects = [];
                result.forEach(function (item){
                    var object = {
                        label: item.label,
                        value: item.apiName,
                        isCustom: item.isCustom,
                        visible: false,
                        children: item.childRelationships
                    };
                    var attributes = [];
                    if(!$A.util.isEmpty(item.fields)){
                        item.fields.forEach(function (fieldItem){
                            attributes.push({
                                label: fieldItem.label,
                                value: fieldItem.apiName,
                                type: fieldItem.type,
                                isCustom: fieldItem.isCustom,
                                isMDOrCascadeDelete: fieldItem.isMDOrCascadeDelete,
                                references: fieldItem.referenceFields,
                                selected: false
                            });
                        });
                        object.attributes = attributes;
                    }
                    allObjects.push(object);
                });

                allObjects.sort(GraphvizForce.DiagramHelper.compare);
                component.set('v.allObjects', allObjects);
            },

            compare : function(a,b) {
                if (a.label < b.label)
                    return -1;
                if (a.label > b.label)
                    return 1;
                return 0;
            },

            initialiseObjects : function(component, event, helper){
                var allObjects = component.get('v.allObjects');
                var selectedDiagram = component.get('v.selectedDiagram');
                var displayAllObjects = component.get('v.displayAllObjects');
                var objects = [];
                allObjects.forEach(function (obj) {
                    var exists = false;
                    selectedDiagram.groups.forEach(function (group) {
                        group.entities.forEach(function (selectedObj){
                            if(obj.value === selectedObj.value){
                                exists = true;
                                return;
                            }
                        });
                        if(exists) return;
                    });
                    if(!exists){
                        obj.visible = displayAllObjects;
                        objects.push(JSON.parse(JSON.stringify(obj)));
                    }
                });

                objects.sort(GraphvizForce.DiagramHelper.compare);
                component.set('v.objects', objects);
            },

            addObjectToGroup : function(component, helper, objectToAdd, groupValue){
                var objects = component.get('v.objects');
                var selectedDiagram = component.get('v.selectedDiagram');
                var groups = selectedDiagram.groups;
                var groupRemoved = false;
                var groupAdded = false;
                var i;

                // Remove object from object list
                for(i=0;i<objects.length;i++){
                    var targetObject = objects[i];
                    if(targetObject.value === objectToAdd.value){
                        objects.splice(i, 1);
                        groupRemoved = true;
                        break;
                    }
                }

                // Add object to group AND Remove object from current group
                for(i=0;i<groups.length;i++){
                    if(groupRemoved && groupAdded) break;

                    var group = groups[i];

                    group.entities.forEach(function (entity, index) {
                        if(entity.value === objectToAdd.value){
                            if(index !== -1){
                                group.entities.splice(index, 1);
                                groupRemoved = true;
                            }
                        }
                    });

                    if(group.value === groupValue){
                        group.entities.push(objectToAdd);
                        group.entities.sort(GraphvizForce.DiagramHelper.compare);
                        groupAdded = true;
                    }

                }

                selectedDiagram.groups = groups;
                component.set('v.objects', objects);
                component.set('v.selectedDiagram', selectedDiagram);

                if(window.showUserGuide) $A.get("e.c:UserGuideEvent").setParams({scope:'step3'}).fire();
            },

            onSaveDiagram : function(component, event, helper) {
                var diagrams = component.get('v.diagrams');
                var selectedDiagram = component.get('v.selectedDiagram');
                diagrams.forEach(function (diagram, index){
                   if(diagram.value === selectedDiagram.value){
                       diagrams[index] = selectedDiagram;
                       component.set('v.diagrams', diagrams);
                       return;
                   }
                });
                component.find('diagramDataService').updateDiagramRecord(selectedDiagram);
            },

            onCloneDiagram : function(component, event, helper) {

                var diagrams = component.get('v.diagrams');
                var selectedDiagram = component.get('v.selectedDiagram');
                var diagramName = component.get('v.cloneDiagramName');

                var exists = false;
                diagrams.forEach(function (diagram){
                    if(diagram.label === diagramName){
                        exists = true;
                        return;
                    }
                });

                if(exists){
                    component.find('notifLib').showToast({
                        "title": "Info",
                        "message": 'This diagram name "'+ diagramName +'" already exists.'
                    });
                }
                else{
                    var newDiagram = {label:diagramName, value:diagramName, visible:true, groups:selectedDiagram.groups};
                    diagrams.push(newDiagram);
                    diagrams.sort(GraphvizForce.DiagramHelper.compare);
                    component.set('v.diagrams', diagrams);
                    //component.set('v.selectedDiagram', newDiagram);
                    helper.initialiseObjects(component, event, helper);
                    component.find('diagramDataService').createDiagramRecord(newDiagram, true);
                }
            },

            handleAddDiagram : function(component, event, helper) {
                var diagrams = component.get('v.diagrams');
                var newDiagramName = component.get('v.newDiagramName');
                var groups = [{label:'ContainerGroup', value:'ContainerGroup', entities:[]}];

                var exists = false;
                diagrams.forEach(function (diagram){
                    if(diagram.label === newDiagramName){
                        exists = true;
                        return;
                    }
                });

                if(exists){
                    component.find('notifLib').showToast({
                        "title": "Info",
                        "message": 'This diagram name "'+ newDiagramName +'" already exists.'
                    });
                }
                else{
                    var newDiagramObject = {label:newDiagramName, value:newDiagramName, visible:true, groups:groups};
                    diagrams.push(newDiagramObject);
                    diagrams.sort(GraphvizForce.DiagramHelper.compare);
                    component.set('v.diagrams', diagrams);
                    component.find('diagramDataService').createDiagramRecord(newDiagramObject, false);
                }
            },
        };
    })();
    GraphvizForce.DiagramHelper = DiagramHelper;
	
})(window.GraphvizForce || ( window.GraphvizForce = {} ));
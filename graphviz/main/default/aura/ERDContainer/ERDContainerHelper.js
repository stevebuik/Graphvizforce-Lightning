/**
 * Created by guan on 30/11/17.
 */
({
    loadSchema : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadSchema', null, function (returnValue){
            var result;
            if(returnValue != null) result = JSON.parse(returnValue);
            helper.inspectSchema(component, event, helper, result);
            // action is complete
            helper.loadDiagrams(component, event, helper);
        });
    },

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

    loadDiagrams : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadDiagrams', null, function (returnValue){
            $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
            var diagrams = [];
            returnValue.forEach(function (item){
                var diagram = JSON.parse(item.gvf2__Content__c);
                diagram.recordId = item.Id;
                diagrams.push(diagram);
            });
            diagrams.sort(GraphvizForce.DiagramHelper.compare);
            component.set('v.diagrams', diagrams);
        });
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

        if(window.showUserGuide) $A.get("e.gvf2:UserGuideEvent").setParams({scope:'step3'}).fire();
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

        // Update diagram via apex controller
        Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(selectedDiagram), 'recordId':selectedDiagram.recordId}, function (returnValue){
        var result = JSON.parse(returnValue);
            if(result.serviceStatus.status != 'success'){
                window.alert('Error: Faield to save diagram.');
            }
        });
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
            window.alert('This diagram name "'+ diagramName +'" already exists.');
        }
        else{
            var newDiagram = {label:diagramName, value:diagramName, visible:true, groups:selectedDiagram.groups};
            diagrams.push(newDiagram);
            diagrams.sort(GraphvizForce.DiagramHelper.compare);
            component.set('v.diagrams', diagrams);

            helper.initialiseObjects(component, event, helper);
            //component.find('diagramDataService').createDiagramRecord(newDiagram, true);

            // Clone diagram via apex controller
            Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(newDiagram)}, function (returnValue){
            var resultWrapper = JSON.parse(returnValue);
                if(resultWrapper.serviceStatus.status != 'success'){
                    window.alert('Error: Faield to save diagram.');
                }
                else{
                    helper.onDiagramCreated(component, event, helper, resultWrapper.result, true);
                }
            });
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
            window.alert('This diagram name "'+ newDiagramName +'" already exists.');
        }
        else{
            var newDiagramObject = {label:newDiagramName, value:newDiagramName, visible:true, groups:groups};
            diagrams.push(newDiagramObject);
            diagrams.sort(GraphvizForce.DiagramHelper.compare);
            component.set('v.diagrams', diagrams);
            //component.find('diagramDataService').createDiagramRecord(newDiagramObject, false);
            // Clone diagram via apex controller
            console.log('@@@@ newDiagramObject:', newDiagramObject);
            Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(newDiagramObject)}, function (returnValue){
                console.log('@@@@ returnValue:', returnValue);
                var resultWrapper = JSON.parse(returnValue);
                console.log('@@@@ resultWrapper:', resultWrapper);
                if(resultWrapper.serviceStatus.status != 'success'){
                    window.alert('Error: Faield to save diagram.');
                }
                else{
                    helper.onDiagramCreated(component, event, helper, resultWrapper.result, false);
                }
            });
        }
    },

    onDiagramCreated : function(component, event, helper, scope, isClone){
        console.log('@@@@ scope', scope);
        var newRecord = JSON.parse(scope.gvf2__Content__c);
        newRecord.recordId = scope.Id;
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
        }
    },
})
/**
 * Created by guan on 30/11/17.
 */
({
    /*
    Initialisation Functions
    */
    loadSchema : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadSchema', null, function (returnValue){
            var result;
            if(returnValue != null) result = JSON.parse(returnValue);
            // Store the entire schema (wrappers) to GraphvizForce.fullSchema
            GraphvizForce.fullSchema = result;
            helper.inspectSchema(component, event, helper);
            // action is complete
            helper.loadDiagrams(component, event, helper);
        });
    },

    inspectSchema : function(component, event, helper){
        var allObjects = [];
        GraphvizForce.fullSchema.forEach(function (item){
            var object = {
                label: item.label,
                apiName: item.apiName,
                fields: []
            };

            var attributes = [];
            if(!$A.util.isEmpty(item.fields)){
                item.fields.forEach(function (fieldItem){
                    object.fields.push({
                        label: fieldItem.label,
                        apiName: fieldItem.apiName
                    });
                });
            }

            allObjects.push(object);
        });

        allObjects.sort(GraphvizForce.DiagramHelper.compare);
        GraphvizForce.allObjects = allObjects;
        console.log('@@@@ load schema completed');
    },

    loadDiagrams : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadDiagrams', null, function (returnValue){
            $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
            var diagrams = [];
            returnValue.forEach(function (item){
                var diagram = JSON.parse(item.gvf2__Content__c);
                diagram.id = item.Id;
                diagrams.push(diagram);
            });
            diagrams.sort(GraphvizForce.DiagramHelper.compareName);
            component.set('v.diagrams', diagrams);
            console.log('@@@@ load diagrams completed');
        });
    },

    /*
    UI Functions
    */

    /*
    @description When user select a diagram and view diagram details
    Update selected diagram
    Update selected map
    */
    handleSelectionMapUpdate : function(diagram){
        var selectionMap = {};
        console.log('@@@@ diagram:', JSON.stringify(diagram));
        diagram.entities.forEach(function(entity){
            var selectedFieldsMap = {};
            if(!$A.util.isEmpty(entity.fields)){
                entity.fields.forEach(function(field){
                    selectedFieldsMap[field.apiName] = true;
                });
            }
            selectionMap[entity.apiName] = selectedFieldsMap;
        });
        GraphvizForce.selectionMap = selectionMap;
        console.log('@@@@ selectionMap:', selectionMap);
    },

    handleDiagramMutate : function(component, helper, entitiesToAdd, entitiesToRemove, fieldsMap){
        // Mutate diagram
        var selectedDiagram = helper.getMutatedDiagram(component.get('v.selectedDiagram'), entitiesToAdd, entitiesToRemove, fieldsMap);

        // Update diagram list with mutated data
        component.set('v.selectedDiagram', selectedDiagram);
        component.set('v.diagrams', helper.propagateDiagramList(component.get('v.diagrams'), selectedDiagram));

        // Reflect mutated diagram to Selection Map
        helper.handleSelectionMapUpdate(selectedDiagram);

        // Persist the diagram to server
        if(component.get("v.isAutoBuildActive")) helper.handlePersistDiagramData(component, selectedDiagram);

        // Dispatch DiagramUpdatedEvent to subscribers
        $A.get("e.gvf2:DiagramUpdatedEvent").setParams({type:'MUTATION'}).fire();
    },

    getMutatedDiagram : function(diagram, entitiesToAdd, entitiesToRemove, fieldsMap){
        var entities = diagram.entities;
        var entityAPINames = [];

        // Process entity (object) manipulation
        if(entitiesToAdd != null){
            entities = diagram.entities.concat(entitiesToAdd);
        }
        else if(entitiesToRemove != null){
            var apiNames = [];
            entitiesToRemove.forEach(function(entityToRemove){
                apiNames.push(entityToRemove.apiName);
            });
            entities = diagram.entities.filter(function(entity) {
                return !apiNames.includes(entity.apiName);
            });
        }
        console.log('@@@@ new entities:', JSON.stringify(entities));

        // Process field manipulation and prepare entityAPINames
        entities.forEach(function(entity){
            entityAPINames.push(entity.apiName);
            if(fieldsMap != null){
                var fields = fieldsMap[entity.apiName];
                if(fields != null) entity.fields = fields;
            }
        });
        console.log('@@@@ new entities after processed fields:', JSON.stringify(entities));

        // Update entities list of diagram (object and field selection)
        diagram.entities = entities;
        // Also update groups accordingly
        diagram.groups[0].entities = entityAPINames;
        return diagram;
    },

    /*getMutatedDiagramList : function(component, diagram){
        component.set('v.selectedDiagram', diagram);
        var diagrams = component.get('v.diagrams');
        component.set('v.diagrams', helper.propagateDiagramList(diagrams, diagram));
    },*/

    handlePersistDiagramData : function(component, diagram){

        // Convert to well-formed json object
        var diagramToPersist = JSON.parse(JSON.stringify(diagram));
        diagramToPersist.entities.forEach(function(entity){
            delete entity.selected;
        });

        // Validate new diagram object before persisting
        if(!GraphvizForce.DiagramHelper.isDiagramValidToPersist(diagramToPersist)){
            //window.alert('Error: diagram is not valid.');
            console.log('############### diagram is not valid');
        }
        else{
            console.log('########### diagram to save:', JSON.stringify(diagramToPersist));
            // Calling apex controller to save the diagram
            Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(diagramToPersist), 'recordId':diagramToPersist.id}, function (returnValue){
                var resultWrapper = JSON.parse(returnValue);
                if(resultWrapper.serviceStatus.status != 'success'){
                    window.alert('Error: Faield to save diagram.');
                }
                else{
                    // Set the record id and then save it again
                    console.log('Success: Diagram saved!');
                }
            });
        }
    },






    /*
    Old Functions
    */
    //DEPRECATED
    initialiseObjects : function(){
        // Update allObjects by selected diagram
        // Update selectedDiagram by allObjects
        GraphvizForce.allObjects.forEach(function (obj) {
            if(GraphvizForce.selectionMap[obj.apiName] != null){
                obj.selected = true;
            }
        });
    },

    handleDiagramChange : function(component, event, helper){
        var selectionMap = {};
        var selectedDiagram = component.get('v.selectedDiagram');
        selectedDiagram.entities.forEach(function(selectedEntity){
            var selectedFields = {};
            selectedEntity.fields.forEach(function(selectedField){
                selectedFields[selectedField.apiName] = true;
            });
            selectionMap[selectedEntity.apiName] = selectedFields;
        });
        GraphvizForce.selectionMap = selectionMap;

    },

    addObjectToGroup : function(component, helper, objectToAdd, groupName){
        var allObjects = component.get('v.allObjects');
        var selectedDiagram = component.get('v.selectedDiagram');
        var groups = selectedDiagram.groups;
        var groupRemoved = false;
        var groupAdded = false;
        var i;

        console.log('@@@@ objectToAdd:', objectToAdd.label);
        console.log('@@@@ selectedDiagram:', selectedDiagram);

        // Add object to entities list
        selectedDiagram.entities.push(objectToAdd);

        // Add object to group AND Remove object from current group if exists
        for(i=0;i<groups.length;i++){
            if(groupRemoved && groupAdded) break;

            var group = groups[i];

            group.entities.forEach(function (entity, index) {
                if(entity.apiName === objectToAdd.value){
                    if(index !== -1){
                        group.entities.splice(index, 1);
                        groupRemoved = true;
                    }
                }
            });

            if(group.name === groupName){
                group.entities.push(objectToAdd);
                group.entities.sort(GraphvizForce.DiagramHelper.compare);
                groupAdded = true;
            }

        }

        selectedDiagram.groups = groups;
        component.set('v.selectedDiagram', selectedDiagram);
        console.log('@@@@ added > selectedDiagram:', JSON.stringify(selectedDiagram));

        if(window.showUserGuide) $A.get("e.gvf2:UserGuideEvent").setParams({scope:'step3'}).fire();
    },

    /*onSaveDiagram : function(component, event, helper) {
        var diagrams = component.get('v.diagrams');
        var selectedDiagram = component.get('v.selectedDiagram');
        component.set('v.diagrams', helper.propagateDiagramList(diagrams, selectedDiagram));

        // Validate new diagram object before persisting
        if(!GraphvizForce.DiagramHelper.isDiagramValidToPersist(selectedDiagram)){
            //window.alert('Error: diagram is not valid.');
            console.log('############### diagram is not valid');
        }
        else{
            // Update diagram via apex controller
            Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(selectedDiagram), 'recordId':selectedDiagram.id}, function (returnValue){
                var result = JSON.parse(returnValue);
                if(result.serviceStatus.status != 'success'){
                    window.alert('Error: Faield to save diagram.');
                }
            });
        }
    },*/

    onCloneDiagram : function(component, event, helper) {

        var diagrams = component.get('v.diagrams');
        var selectedDiagram = component.get('v.selectedDiagram');
        var diagramName = component.get('v.cloneDiagramName');

        var exists = false;
        diagrams.forEach(function (diagram){
            if(diagram.name === diagramName){
                exists = true;
                return;
            }
        });

        if(exists){
            window.alert('This diagram name "'+ diagramName +'" already exists.');
        }
        else{
            var newDiagramObject = {name:diagramName, entities:selectedDiagram.entities, groups:selectedDiagram.groups, settings:selectedDiagram.settings};
            //helper.initialiseObjects(component, event, helper);

            // Validate new diagram object before persisting
            if(!GraphvizForce.DiagramHelper.isDiagramValidToPersist(newDiagramObject)){
                //window.alert('Error: diagram is not valid.');
                console.log('############### diagram is not valid');
            }
            else{
                // Calling apex controller to save the diagram
                Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(newDiagramObject)}, function (returnValue){
                    var resultWrapper = JSON.parse(returnValue);
                    if(resultWrapper.serviceStatus.status != 'success'){
                        window.alert('Error: Faield to save diagram.');
                    }
                    else{
                        // Set the record id and then save it again
                        var savedRecord = JSON.parse(resultWrapper.result.gvf2__Content__c);
                        savedRecord.id = resultWrapper.result.Id;
                        Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(savedRecord), 'recordId':savedRecord.id}, function (returnValue){
                            if(resultWrapper.serviceStatus.status != 'success'){
                                window.alert('Error: Faield to save diagram.');
                            }
                            else{
                                helper.onDiagramCreated(component, event, helper, savedRecord, true);
                                window.alert('Diagram ' + newDiagramObject.name + ' cloned successfully.');
                            }
                        });
                    }
                });
            }
        }
    },

    handleAddDiagram : function(component, event, helper) {
        var diagrams = component.get('v.diagrams');
        var newDiagramName = component.get('v.newDiagramName');
        var groups = [{name:'ContainerGroup', entities:[]}];

        var exists = false;
        diagrams.forEach(function (diagram){
            if(diagram.name === newDiagramName){
                exists = true;
                return;
            }
        });

        if(exists){
            window.alert('This diagram name "'+ newDiagramName +'" already exists.');
        }
        else{
            var newDiagramObject = {name:newDiagramName, entities:[], groups:groups, settings:{}};

            // Validate new diagram object before persisting
            if(!GraphvizForce.DiagramHelper.isDiagramValidToPersist(newDiagramObject)){
                //window.alert('Error: diagram is not valid.');
                console.log('############### diagram is not valid');
            }
            else{
                // Calling apex controller to save the diagram
                Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(newDiagramObject)}, function (returnValue){
                    var resultWrapper = JSON.parse(returnValue);
                    if(resultWrapper.serviceStatus.status != 'success'){
                        window.alert('Error: Faield to save diagram.');
                    }
                    else{
                        // Set the record id and then save it again
                        var savedRecord = JSON.parse(resultWrapper.result.gvf2__Content__c);
                        savedRecord.id = resultWrapper.result.Id;
                        Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(savedRecord), 'recordId':savedRecord.id}, function (returnValue){
                            if(resultWrapper.serviceStatus.status != 'success'){
                                window.alert('Error: Faield to save diagram.');
                            }
                            else{
                                helper.onDiagramCreated(component, event, helper, savedRecord, false);
                            }
                        });
                    }
                });
            }
        }
    },

    onDiagramCreated : function(component, event, helper, savedRecord, isClone){
        var diagrams = component.get('v.diagrams');
        diagrams.push(savedRecord);
        diagrams.sort(GraphvizForce.DiagramHelper.compareName);
        component.set('v.diagrams', diagrams);
        component.set('v.selectedDiagram', savedRecord);

        if(isClone){
            component.find('diagramConfigurator').find('objectPanel').set('v.searchTerm', '');
            //helper.initialiseObjects(component, event, helper);
        }
    },

    propagateDiagramList: function(diagrams, selectedDiagram){
        diagrams.forEach(function (diagram, index){
           if(diagram.name === selectedDiagram.name){
               diagrams[index] = selectedDiagram;
               return;
           }
        });
        diagrams.sort(GraphvizForce.DiagramHelper.compareName);
        return diagrams;
    },
})
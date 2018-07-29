({
    /***********************
    Initialisation Functions
    ************************/
    /**
    * Makes server call to load full schema
    */
    loadSchema : function(component, event, helper){
        Core.AuraUtils.execute(component, 'loadSchema', null, function (returnValue){
            var result;
            if(returnValue != null) result = JSON.parse(returnValue);
            // Store the entire schema (wrappers)
            component.set("v.describes", result);
            helper.inspectSchema(component, event, helper);
            // action is complete
            component.set("v.schemaReady", true);
            if(component.get('v.diagramsReady')) $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
        });
    },

    /**
    * Inspect the full schema and stores the all object list
    */
    inspectSchema : function(component, event, helper){
        var allObjects = [];
        var describes = component.get('v.describes');
        describes.forEach(function (item){
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
        component.set('v.allObjects', allObjects);
    },

    /**
    * Makes server call to load the diagrams belong to current user
    */
    loadDiagrams : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadDiagrams', null, function (returnValue){
            var diagrams = [];
            returnValue.forEach(function (item){
                var diagram = JSON.parse(item.gvf2__Content__c);
                diagram.id = item.Id;
                diagrams.push(diagram);
            });
            diagrams.sort(GraphvizForce.DiagramHelper.compareName);
            component.set('v.diagrams', diagrams);

            component.set("v.diagramsReady", true);
            if(component.get('v.schemaReady')) $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
        });
    },

    /***********************
    UI Functions
    ************************/
    /**
    * When user select a diagram and view diagram details
    * Update selected diagram
    * Update selected map
    */
    getUpdatedSelectionMap : function(diagram){
        var selectionMap = {};
        diagram.entities.forEach(function(entity){
            var selectedFieldsMap = {};
            if(!$A.util.isEmpty(entity.fields)){
                entity.fields.forEach(function(field){
                    selectedFieldsMap[field.apiName] = true;
                });
            }
            selectionMap[entity.apiName] = selectedFieldsMap;
        });
        return selectionMap;
    },

    /**
    * Process diagram mutation functionality
    */
    handleDiagramMutate : function(component, helper, entitiesToAdd, entitiesToRemove, fieldsMap){
        // Mutate diagram
        var selectionMap = component.get('v.selectionMap');
        var selectedDiagram = helper.getMutatedDiagram(component.get('v.selectedDiagram'), entitiesToAdd, entitiesToRemove, fieldsMap, selectionMap);

        // Update diagram list with mutated data
        component.set('v.selectedDiagram', selectedDiagram);
        component.set('v.diagrams', helper.propagateDiagramList(component.get('v.diagrams'), selectedDiagram));

        // Reflect mutated diagram to Selection Map
        component.set('v.selectionMap', helper.getUpdatedSelectionMap(selectedDiagram));

        // Persist the diagram to server
        helper.handlePersistDiagramData(component, selectedDiagram);

        // Dispatch DiagramUpdatedEvent to subscribers
        $A.get("e.gvf2:DiagramUpdatedEvent").setParams({type:'MUTATION'}).fire();
    },

    /**
    * Takes the DiagramMutateEvent and its attributes to calculate a mutated diagram
    * @returns mutated diagram
    */
    getMutatedDiagram : function(diagram, entitiesToAdd, entitiesToRemove, fieldsMap, selectionMap){
        var entities = diagram.entities;
        var entityAPINames = [];

        // Step 1: Process entity (object) manipulation
        if(entitiesToAdd != null){
            var entitiesNotExist = [];
            entitiesToAdd.forEach(function(entityToAdd){
                if(selectionMap[entityToAdd.apiName] == null){
                    entitiesNotExist.push(entityToAdd);
                }
            });
            if(entitiesNotExist.length > 0) entities = diagram.entities.concat(entitiesNotExist);
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

        // Step 2: Process field manipulation and prepare entityAPINames
        entities.forEach(function(entity){
            entityAPINames.push(entity.apiName);
            if(fieldsMap != null){
                var fields = fieldsMap[entity.apiName];
                if(fields != null) entity.fields = fields;
            }
        });

        // Step 3: Finalise mutation on the diagram
        // Update entities list of diagram (object and field selection)
        diagram.entities = entities;
        // Also update groups accordingly
        diagram.groups[0].entities = entityAPINames;

        return diagram;
    },

    /**
    * Update the diagram list with mutated diagram
    */
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

    /***********************
    CRUD Functions
    ************************/
    /**
    * Transform the diagram data and saves back to server
    */
    handlePersistDiagramData : function(component, diagram){

        // Convert to well-formed json object, remove UI attributes
        var diagramToPersist = JSON.parse(JSON.stringify(diagram));
        diagramToPersist.entities.forEach(function(entity){
            delete entity.selected;
            delete entity.label;
        });

        // Validate new diagram object before persisting
        if(!GraphvizForce.DiagramHelper.isDiagramValidToPersist(diagramToPersist)){
            window.alert('Error: diagram is not valid.');
        }
        else{
            // Calling apex controller to save the diagram
            Core.AuraUtils.execute(component, 'saveDiagram', {'content':JSON.stringify(diagramToPersist), 'recordId':diagramToPersist.id}, function (returnValue){
                var resultWrapper = JSON.parse(returnValue);
                if(resultWrapper.serviceStatus.status != 'success'){
                    window.alert('Error: Faield to save diagram.');
                }
                else{
                    // TODO: Add logger function
                }
            });
        }
    },

    /**
    * Process clone diagram action
    */
    handleCloneDiagram : function(component, event, helper) {

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
                window.alert('Error: diagram is not valid.');
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

    /**
    * Process add new diagram action
    */
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
                window.alert('Error: diagram is not valid.');
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

    /**
    * Process delete diagram action
    */
    handleRemoveDiagram : function(component, recordId){
        Core.AuraUtils.execute(component, 'deleteDiagram', {'recordId':recordId}, function (returnValue){
            var result = JSON.parse(returnValue);
            if(result.serviceStatus.status != 'success'){
                window.alert('Error: Faield to delete diagram.');
            }
            else{
                // TODO: Add logger function
            }
        });
    },

    /**
    * UI Function to update view after diagram is created/cloned
    */
    onDiagramCreated : function(component, event, helper, savedRecord, isClone){
        var diagrams = component.get('v.diagrams');
        diagrams.push(savedRecord);
        diagrams.sort(GraphvizForce.DiagramHelper.compareName);
        component.set('v.diagrams', diagrams);
        component.set('v.selectedDiagram', savedRecord);

        if(isClone){
            component.find('diagramConfigurator').find('objectPanel').set('v.searchTerm', '');
        }
    },
})
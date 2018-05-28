/**
 * Created by guan on 13/3/18.
 */
({

    handleRecordUpdated: function(component, event, helper) {
        var eventParams = event.getParams();
        if(eventParams.changeType === "LOADED") {
            // record is loaded (render other component which needs record data value)
            // Save the record:
            var content = component.get('v.content');
            component.set("v.simpleRecord.Content__c", JSON.stringify(content));
            var operation = component.get('v.operation');
            if(operation == 'UPDATE'){
                helper.saveRecord(component);
            }
            else if(operation == 'DELETE'){
                helper.deleteRecord(component);
            }
        } else if(eventParams.changeType === "CHANGED") {
            // record is changed
            console.log('Record Updater: CHANGED');
        } else if(eventParams.changeType === "REMOVED") {
            console.log('Record Updater: REMOVED');
            // record is deleted, show a toast UI message
            Core.AuraUtils.showNotification("Deleted", "The diagram was deleted.")
        } else if(eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
            console.log('Record Updater: ERROR');
        }
    },

    updateDiagramRecord : function(component, event, helper){
        var params = event.getParam('arguments');
        if (params == null) return;

        var diagramObject = params.diagramObject;
        var currentRecordId = component.get('v.recordId');
        if(currentRecordId != diagramObject.recordId){
            console.log('update diagram called');
            component.set('v.recordId', diagramObject.recordId);
            component.set('v.content', diagramObject);
            component.set('v.operation', 'UPDATE');
            component.find("diagramRecordUpdater").reloadRecord();
        }
        else{
            component.set("v.simpleRecord.Content__c", JSON.stringify(diagramObject));
            helper.saveRecord(component);
        }
    },

    createDiagramRecord : function(component, event, helper){
        var params = event.getParam('arguments');
        if (params == null) return;
        var diagramObject = params.diagramObject;
        var isClone = params.isClone;

        // Prepare a new record from template
        $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
        component.find("diagramRecordCreator").getNewRecord(
            "Graphviz_Diagram__c", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function() {
                $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
                var rec = component.get("v.newDiagram");
                var error = component.get("v.newDiagramError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                console.log("Record template initialized: " + rec.sobjectType);
                component.set("v.simpleNewDiagram.Content__c", JSON.stringify(diagramObject));
                helper.createRecord(component, diagramObject, isClone);
            })
        );
    },

    deleteDiagramRecord: function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params == null) return;

        var diagramObject = params.diagramObject;
        component.set('v.recordId', diagramObject.recordId);
        component.set('v.operation', 'DELETE');
        component.find("diagramRecordUpdater").reloadRecord();
    },
})
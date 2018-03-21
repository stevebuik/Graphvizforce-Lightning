/**
 * Created by guan on 21/3/18.
 */
({
    saveRecord : function(component){
        component.find("diagramRecordUpdater").saveRecord($A.getCallback(function(saveResult) {
           // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful
           // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
           if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
           // handle component related logic in event handler
               console.log('UPDATE DIAGRAM SUCCESS');
           } else if (saveResult.state === "INCOMPLETE") {
               console.log("User is offline, device doesn't support drafts.");
           } else if (saveResult.state === "ERROR") {
               console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
           } else {
               console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
           }
       }));
    },

    createRecord : function(component, diagramObject){
        component.find("diagramRecordCreator").saveRecord(function(saveResult) {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                console.log('CREATE DIAGRAM SUCCESS');
                diagramObject.recordId = component.get("v.simpleNewDiagram.Id");
                component.getEvent('onDiagramCreated').setParams({scope:diagramObject}).fire();
            } else if (saveResult.state === "INCOMPLETE") {
                // handle the incomplete state
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                // handle the error state
                console.log('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        });
    },

    deleteRecord : function(component){
        component.find("diagramRecordUpdater").deleteRecord($A.getCallback(function(deleteResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful
            // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
            if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
                // record is deleted
                console.log("Record is deleted.");
            } else if (deleteResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (deleteResult.state === "ERROR") {
                console.log('Problem deleting record, error: ' + JSON.stringify(deleteResult.error));
            } else {
                console.log('Unknown problem, state: ' + deleteResult.state + ', error: ' + JSON.stringify(deleteResult.error));
            }
        }));
    },
})
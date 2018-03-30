/**
 * Created by guan on 30/11/17.
 */
({
    loadSchema : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadSchema', null, function (returnValue){
            var result;
            if(returnValue != null) result = JSON.parse(returnValue);
            GraphvizForce.DiagramHelper.inspectSchema(component, event, helper, result);
            // action is complete
            helper.loadDiagrams(component, event, helper);
        });
    },

    loadDiagrams : function(component, event, helper){

        Core.AuraUtils.execute(component, 'loadDiagrams', null, function (returnValue){
            $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
            var diagrams = [];
            returnValue.forEach(function (item){
                var diagram = JSON.parse(item.Content__c);
                diagram.recordId = item.Id;
                diagrams.push(diagram);
            });
            diagrams.sort(GraphvizForce.DiagramHelper.compare);
            component.set('v.diagrams', diagrams);
        });
    },

    initialiseObjects : function(component, event, helper){
        GraphvizForce.DiagramHelper.initialiseObjects(component, event, helper);
    },

    addObjectToGroup : function(component, helper, objectToAdd, groupValue){
        GraphvizForce.DiagramHelper.addObjectToGroup(component, helper, objectToAdd, groupValue);
    },

    onSaveDiagram : function(component, event, helper) {
        GraphvizForce.DiagramHelper.onSaveDiagram(component, event, helper);
    },

    onCloneDiagram : function(component, event, helper) {
        GraphvizForce.DiagramHelper.onCloneDiagram(component, event, helper);
    },

    handleAddDiagram : function(component, event, helper) {
        GraphvizForce.DiagramHelper.handleAddDiagram(component, event, helper);
    },
})
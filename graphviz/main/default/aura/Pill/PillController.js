/**
 * Created by guan on 23/3/18.
 */
({
	/*onLabelClicked : function(component, event, helper) {
        component.getEvent('onLabelClicked').setParams({scope:component.get('v.value')}).fire();
	},*/

    /*onDragStart : function(component, event, helper) {
        event.dataTransfer.setData("value", JSON.stringify(component.get('v.value')));
	},*/

    onSelectionChange : function(component, event, helper) {
        console.log('@@@@ onSelectionChange');
        var value = component.get('v.value');
        if(value.selected){
            // Create well-formed entity object and fire mutate event
            value.fields = [];
            component.getEvent('onDiagramMutate').setParams({entitiesToAdd:[value]}).fire();
            component.getEvent('onGoToDetails').setParams({scope:value}).fire();
        }
        else{
            component.getEvent('onDiagramMutate').setParams({entitiesToRemove:[value]}).fire();
            component.getEvent('onGoToDetails').setParams({scope:null}).fire();
        }
	},

	onGoToDetails : function(component, event, helper) {
	    var value = component.get('v.value');
        component.getEvent('onGoToDetails').setParams({scope:value}).fire();
        //component.getEvent('onDiagramMutate').setParams({entitiesToAdd:[value]}).fire();
	},
})
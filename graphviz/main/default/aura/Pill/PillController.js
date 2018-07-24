/**
 * Created by guan on 23/3/18.
 */
({
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
	},
})
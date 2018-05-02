/**
 * Created by guan on 23/3/18.
 */
({
	onLabelClicked : function(component, event, helper) {
        component.getEvent('onLabelClicked').setParams({scope:component.get('v.value')}).fire();
	},

    onIconClicked : function(component, event, helper) {
        component.getEvent('onIconClicked').setParams({scope:component.get('v.value')}).fire();
	},

    onDragStart : function(component, event, helper) {
        event.dataTransfer.setData("value", JSON.stringify(component.get('v.value')));
	},
})
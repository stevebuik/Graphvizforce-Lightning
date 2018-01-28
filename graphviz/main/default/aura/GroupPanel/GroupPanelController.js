({
	onRemovePanel : function(component, event, helper) {
        component.set('v.showRemoveConfirm', true);
	},

	onConfirmRemoveGroup : function(component, event, helper) {
        component.getEvent('onRemoveGroup').setParams({scope:component.get('v.group')}).fire();
    },

	onEditPanelTitle : function(component, event, helper) {
        component.getEvent('onEditGroupName').setParams(event.getParams()).fire();
    },
})
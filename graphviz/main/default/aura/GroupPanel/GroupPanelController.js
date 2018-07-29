({
    /**
    * Show modal when user press remove
    */
	onRemovePanel : function(component, event, helper) {
        component.set('v.showRemoveConfirm', true);
	},

    /**
    * Fires event when remove confirmed
    */
	onConfirmRemoveGroup : function(component, event, helper) {
        component.getEvent('onRemoveGroup').setParams({scope:component.get('v.group')}).fire();
    },

    /**
    * Fires event when group is modified
    */
	onEditPanelTitle : function(component, event, helper) {
        component.getEvent('onEditGroupName').setParams(event.getParams()).fire();
    },
})
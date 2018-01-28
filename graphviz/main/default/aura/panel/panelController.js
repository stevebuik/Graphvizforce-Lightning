({
	onToggle : function(component, event, helper) {
		component.set('v.collapsed', !component.get('v.collapsed'));
	},
    
    onRemove : function(component, event, helper) {
		component.getEvent("onRemovePanel").setParams({scope:'REMOVE'}).fire();
	},

	onEditMode : function(component, event, helper) {
	    component.set('v.newTitle', component.get('v.title'));
        component.set('v.isEditMode', true);
    },

    onBlur : function(component, event, helper) {
        component.set('v.isEditMode', false);
        helper.handleTitleChange(component, event, helper);
    },

    onKeyUp : function(component, event, helper) {
        if(event.keyCode == 13){
        component.set('v.isEditMode', false);
            helper.handleTitleChange(component, event, helper);
        }
    },
})
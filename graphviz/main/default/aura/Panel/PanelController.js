/**
 * Created by guan on 23/3/18.
 */
({
    /**
    * Handler when user toggle collapse state
    */
	onToggle : function(component, event, helper) {
		component.set('v.collapsed', !component.get('v.collapsed'));
	},

    /**
    * Handler when user delete the panel
    */
    onRemove : function(component, event, helper) {
		component.getEvent("onRemovePanel").setParams({scope:'REMOVE'}).fire();
	},

    /**
    * Handler when user enter title edit mode
    */
	onEditMode : function(component, event, helper) {
	    component.set('v.newTitle', component.get('v.title'));
        component.set('v.isEditMode', true);
    },

    /**
    * Handler when user finish updating title
    */
    onBlur : function(component, event, helper) {
        component.set('v.isEditMode', false);
        helper.handleTitleChange(component, event, helper);
    },

    /**
    * Handler when user editing the title
    */
    onKeyUp : function(component, event, helper) {
        if(event.keyCode === 13){
        component.set('v.isEditMode', false);
            helper.handleTitleChange(component, event, helper);
        }
    },
})
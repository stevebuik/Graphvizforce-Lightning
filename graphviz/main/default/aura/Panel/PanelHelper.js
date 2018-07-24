/**
 * Created by guan on 9/12/17.
 */
({
    /**
    * Fires component event when user changes the title, to be handled outside of the panel
    */
    handleTitleChange : function(component, event, helper){
        var title = component.get('v.title');
        var newTitle = component.get('v.newTitle');
        if(title !== newTitle){
            component.getEvent("onEditPanelTitle").setParams({scope:{oldValue:title, newValue:newTitle}}).fire();
        }
    }
})
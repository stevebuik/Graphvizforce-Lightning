/**
 * Created by guan on 9/12/17.
 */
({
    handleTitleChange : function(component, event, helper){
        var title = component.get('v.title');
        var newTitle = component.get('v.newTitle');
        if(title != newTitle){
            component.getEvent("onEditPanelTitle").setParams({scope:{oldValue:title, newValue:newTitle}}).fire();
        }
    }
})
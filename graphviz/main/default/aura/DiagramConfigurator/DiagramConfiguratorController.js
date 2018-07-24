/**
 * Created by guan on 21/7/18.
 */
({
    /**
    * Set selected object attribute when onGoToDetails event is captured
    */
    onSelectObject : function(component, event, helper){
        component.set('v.selectedObject', event.getParam('scope'));
    },
})
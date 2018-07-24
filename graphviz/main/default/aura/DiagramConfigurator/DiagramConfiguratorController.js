/**
 * Created by guan on 21/7/18.
 */
({
    onSelectObject : function(component, event, helper){
        component.set('v.selectedObject', event.getParam('scope'));
    },
})
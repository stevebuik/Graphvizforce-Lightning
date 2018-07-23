/**
 * Created by guan on 21/7/18.
 */
({
    onSelectObject : function(component, event, helper){
        component.set('v.selectedObject', event.getParam('scope'));
    },

    /*
    On diagram selection change, reset selected object in configurator
    */
    /*onDiagramUpdated : function(component, event, helper){
        console.log('@@@@ configurator onDiagramUpdated');
        if(event.getParam('type') == 'SELECTION'){
            console.log('@@@@ set selected object null');
            component.set('v.selectedObject', null);
        }
    },*/
})
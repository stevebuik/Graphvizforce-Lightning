({
    /**
    * Set selected object attribute when onGoToDetails event is captured
    */
    onSelectObject : function(component, event, helper){
        component.set('v.selectedObject', event.getParam('scope'));
    },
})
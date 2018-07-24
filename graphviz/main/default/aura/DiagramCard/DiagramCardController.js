/**
 * Created by guan on 29/11/17.
 */
({
    /**
    * Fires event when user select a diagram and go to detail view
    */
    onViewDiagram : function(component, event, helper){
        component.getEvent('onViewDiagram').setParams({scope:component.get('v.diagram')}).fire();
    },

    /**
    * Show confirmation modal when user press delete
    */
    onRemoveDiagram : function(component, event, helper){
        component.set('v.showRemoveConfirm', true);
    },

    /**
    * Fires remove diagram event when user confirm deletion
    */
    onConfirmDeleteDiagram : function(component, event, helper){
        component.getEvent('onRemoveDiagram').setParams({scope:component.get('v.diagram')}).fire();
    },

})
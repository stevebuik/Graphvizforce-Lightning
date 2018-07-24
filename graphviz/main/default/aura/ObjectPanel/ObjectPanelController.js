({
    onSearchState : function(component, event, helper) {
        component.set('v.currentState', 'SEARCH');
        helper.handleObjectListUpdate(component, event, helper);
    },

    onAllState : function(component, event, helper) {
        component.set('v.currentState', 'ALL');
        component.set('v.searchTerm', '');
        helper.handleObjectListUpdate(component, event, helper);
    },

    onSelectedState : function(component, event, helper) {
        component.set('v.currentState', 'SELECTED');
        component.set('v.searchTerm', '');
        helper.handleObjectListUpdate(component, event, helper);
    },

    onUpdateSearchTerm : function(component, event, helper){
        if(GraphvizForce.searchObjectDebounce == null){
            GraphvizForce.searchObjectDebounce = Core.SystemUtils.debounce(function() {
                // All the taxing stuff you do
                helper.handleObjectListUpdate(component, event, helper);
            }, 1000);
        }
        GraphvizForce.searchObjectDebounce();
    },

    // App event DiagramUpdatedEvent (type:SELECTION) handler
    onDiagramUpdated : function(component, event, helper){
        if(event.getParam('type') == 'SELECTION'){
            component.set('v.currentState', 'SEARCH');
            helper.handleObjectListUpdate(component, event, helper);
        }
    },
})
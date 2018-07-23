({
    doInit : function(component, event, helper) {
        //component.set('v.showHelp1', window.showUserGuide);
        //helper.filterObjects(component, event, helper);
    },

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

    /*onAddObject : function(component, event, helper) {
        component.getEvent('onAddObject').setParams(event.getParams()).fire();
    },*/

    /*
    onSearchObject : function(component, event, helper) {
        var objects = component.get('v.objects');
        var term = component.get('v.searchTerm').toLowerCase();
        var objectFound = false;
        objects.forEach(function(object){
            objectFound = (term === '' ? component.get('v.displayAllObjects') : (object.label.toLowerCase().indexOf(term) !== -1 || object.apiName.toLowerCase().indexOf(term) !== -1));
            object.visible = objectFound;
        });
        component.set('v.objects', objects);

        if(objectFound && window.showUserGuide){
            $A.get("e.gvf2:UserGuideEvent").setParams({scope:'step2'}).fire();
        }
    },
    */

    /*handleUserGuideEvent : function(component, event, helper){
        var step = event.getParam('scope');
        component.set('v.showHelp1', step === 'step1' && window.showUserGuide);
        component.set('v.showHelp2', step === 'step2' && window.showUserGuide);
    },*/

    onUpdateSearchTerm : function(component, event, helper){
        //helper.handleUpdateObjectPanel(component, event, helper);
        console.log('@@@@ onUpdateSearchTerm');
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
            console.log('@@@@ Object Panel onDiagramUpdated');
            component.set('v.currentState', 'SEARCH');
            helper.handleObjectListUpdate(component, event, helper);
        }
    },
})
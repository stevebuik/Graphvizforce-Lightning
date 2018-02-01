({
    doInit : function(component, event, helper) {
        component.set('v.showHelp1', window.showUserGuide);
    },

    onAddObject : function(component, event, helper) {
        component.getEvent('onAddObject').setParams(event.getParams()).fire();
    },
    
    onSearchObject : function(component, event, helper) {
        var objects = component.get('v.objects');
        var term = component.get('v.searchTerm').toLowerCase();
        var objectFound = false;
        objects.forEach(function(object){
            objectFound = (term == '' ? component.get('v.displayAllObjects') : object.label.toLowerCase().indexOf(term) != -1);
            object.visible = objectFound;
        });
        component.set('v.objects', objects);
        if(objectFound && window.showUserGuide){
            $A.get("e.c:UserGuideEvent").setParams({scope:'step2'}).fire();
        }
    },

    handleUserGuideEvent : function(component, event, helper){
        var step = event.getParam('scope');
        component.set('v.showHelp1', step == 'step1' && window.showUserGuide);
        component.set('v.showHelp2', step == 'step2' && window.showUserGuide);
    },

    onToggleAllObjects : function(component, event, helper){
        helper.handleToggleObjects(component, event, helper);
    },
    
})
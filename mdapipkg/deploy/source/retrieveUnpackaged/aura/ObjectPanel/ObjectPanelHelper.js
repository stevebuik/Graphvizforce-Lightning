/**
 * Created by guan on 9/12/17.
 */
({
    handleToggleObjects : function(component, event, helper){
        var displayAllObjects = !component.get('v.displayAllObjects');
        component.set('v.displayAllObjects', displayAllObjects);
        var objects = component.get('v.objects');
        objects.forEach(function(object){
            object.visible = displayAllObjects;
        });
        component.set('v.objects', objects);
    }
})
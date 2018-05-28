({
    doInit: function (component, event, helper) {
        Core.AuraUtils.execute(component, 'getSourceTypes', {}, function (sources) {
            component.set("v.sources", sources)
        });
    },
    handleSelection: function (component, event, helper) {
        var selectedType = component.find("select").get("v.value");
        if (selectedType != "prompt") {
            var startEvent = component.getEvent("startEvent");
            startEvent.setParams({type: selectedType});
            startEvent.fire();
        }
        component.find("select").set("v.value", "prompt");
    }
})
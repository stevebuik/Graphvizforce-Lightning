({
    start: function (component, event, helper) {
        component.set('v.active', true);
        Core.AuraUtils.execute(component, 'getSources', {sourceType: component.get("v.sourceType")},
            $A.getCallback(function (sources) {
                component.set("v.sources", sources);
                component.set("v.currentSourceIndex", 0);
                component.set("v.progress", 0);
                helper.analyzeSource(component, sources[0], $A.getCallback(helper.nextSource));
            }));
    }
})
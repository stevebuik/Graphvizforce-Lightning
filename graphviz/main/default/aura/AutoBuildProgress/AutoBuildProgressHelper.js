({
    analyzeSource: function (component, source, completeCallback) {
        component.set("v.currentSource", source.source);
        Core.AuraUtils.execute(component, 'startSource', {
                sourceType: component.get("v.sourceType"),
                diagramId: component.get("v.diagramId"),
                source: JSON.stringify(source) // workaround SFDC bug that fails to deserialize custom classes
            },
            this.pollSource(component, source));
    },
    pollSource: function (component, source) {
        var self = this;
        return $A.getCallback(function (builderUpdate) {
            if ($A.util.isEmpty(builderUpdate.diagramJSON)) {
                Core.AuraUtils.execute(component, 'pollSource', {
                        sourceType: component.get("v.sourceType"),
                        diagramId: component.get("v.diagramId"),
                        // workaround SFDC bug that fails to deserialize custom classes
                        source: JSON.stringify(source),
                        prevUpdate: JSON.stringify(builderUpdate)
                    },
                    function (builderUpdate) {
                        var poll = self.pollSource(component, source);
                        poll(builderUpdate);
                    });
            } else {
                // continue processing the source list
                self.nextSource(component);
                // notify of progress
                var updateEvent = component.getEvent("updateEvent");
                updateEvent.setParams({diagram: JSON.parse(builderUpdate.diagramJSON)});
                updateEvent.fire();
            }
        });
    },
    nextSource: function (component) {
        var current = component.get("v.currentSourceIndex");
        var sources = component.get("v.sources");
        var isLastSource = current == sources.length - 1;
        if (isLastSource) {
            component.set("v.active", false);
            component.set("v.currentSource", '');
            component.set("v.progress", 0);
        } else {
            current++;
            component.set("v.currentSourceIndex", current);
            component.set("v.currentSource", sources[current].source);
            component.set("v.progress", current * 100 / sources.length);
            this.analyzeSource(component, sources[current], $A.getCallback(this.nextSource));
        }
    }
})
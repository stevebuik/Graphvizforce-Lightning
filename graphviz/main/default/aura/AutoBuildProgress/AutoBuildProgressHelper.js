({
    analyzeSource: function (component, source, completeCallback) {
        component.set("v.currentSource", source.source);
        Core.AuraUtils.execute(component, 'startSource', {
                sourceType: component.get("v.sourceType"),
                source: JSON.stringify(source) // workaround SFDC bug that fails to deserialize custom classes
            },
            this.pollSource(component, source));
    },
    pollSource: function (component, source) {
        var self = this;
        return $A.getCallback(function (builderUpdate) {
            if (builderUpdate.status == 'working') {
                Core.AuraUtils.execute(component, 'pollSource', {
                        sourceType: component.get("v.sourceType"),
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

                // fire the diagram mutation event to allow the ERD to update UI and persist
                var updateDiagramEvent = component.getEvent("onDiagramMutate");
                updateDiagramEvent.setParams({
                    entitiesToAdd: builderUpdate.entitiesToAdd,
                    fieldsMap: builderUpdate.fieldsMap,
                    fieldsMode: 'MERGE'
                });
                updateDiagramEvent.fire();
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
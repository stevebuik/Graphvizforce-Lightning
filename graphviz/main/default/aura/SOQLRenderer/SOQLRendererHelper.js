({
    updateEntities: function (component, entities) {
        var opts = [];
        var from = component.get("v.from");
        entities.forEach(function (entity) {
            opts.push({
                label: entity,
                value: entity,
                selected: entity == from // required to help select dom stay correct when options change. see lightning:select docs race condition
            });
        });
        component.set("v.entityOptions", opts);
    }
})
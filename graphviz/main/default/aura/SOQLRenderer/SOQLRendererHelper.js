({
    updateEntities: function (component, entities) {
        var opts = [];
        entities.forEach(function (entity) {
            opts.push({label: entity, value: entity});
        });
        component.set("v.entityOptions", opts);
    }
})
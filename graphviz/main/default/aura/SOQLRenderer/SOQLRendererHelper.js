({
    updateSOQL: function (component, selectLists) {
        var soql = "SELECT ";
        selectLists.forEach(function (list) {
            soql += list;
            soql += ",";
            soql += "\n";
        });

        // trim the comma from the last select list
        soql = soql.substr(0, soql.length - 2);
        soql += "\n";

        soql += "FROM ";
        soql += component.get("v.from");

        component.set("v.soql", soql);
    },
    updateEntities: function (component, entities) {
        var opts = [];
        entities.forEach(function (entity) {
            opts.push({label: entity, value: entity});
        });
        component.set("v.entityOptions", opts);
    }
})
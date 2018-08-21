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
    },
    handleError: function(component, error) {
        // the SOQL generation pure fn can throw errors intended to be seen by the user for
        // some combinations of entities. handle that here
        var isMessageForUser = error.name == "UserException";
        if (isMessageForUser) {
            // error intended for the user from pure fns
            window.alert(error.message);
        } else {
            window.alert(error);
        }
        return isMessageForUser;
    }
})
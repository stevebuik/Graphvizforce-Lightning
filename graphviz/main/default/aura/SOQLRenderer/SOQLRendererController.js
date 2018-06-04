({
    doInit: function (component, event, helper) {
        component.set("v.ready", true);
    },
    fromChange: function (component, event, helper) {

        var newFrom = event.getParam("value");

        var obscured = {};

        // update the UI, generating new SOQL if required
        if ($A.util.isEmpty(component.get("v.from"))) {
            component.set("v.prompt", "Choose a SOQL FROM object:")
        } else {
            component.set("v.prompt", "FROM")
            var rendered = window.pure.soql.diagramAsSelects(component.get("v.diagram"), newFrom);
            var soql = window.pure.soql.diagramSelectsAsSOQL(rendered.selectLists, newFrom, false);
            component.set("v.soql", soql);
            component.set("v.selectLists", rendered.selectLists);

            // populate the obscured entities
            rendered.entities.forEach(function (entity) {
                obscured[entity] = true;
            })
            for (var key in rendered.selectedFields) {
                delete obscured[key];
            }
        }

        // translate obscured into a list
        var obscuredList = [];
        for (var e in obscured) {
            obscuredList.push(e);
        }

        // now fire the component event to notify parent components
        component.getEvent('fromChange')
            .setParams({
                from: newFrom,
                obscuredEntities: obscuredList
            })
            .fire();
    },
    diagramChange: function (component, event, helper) {
        if ($A.util.isEmpty(component.get("v.from"))) {
            // load entities from diagram but don't generate SOQL
            var entities = window.pure.soql.entities(event.getParam("value"));
            helper.updateEntities(component, entities);
        } else {
            var rendered = window.pure.soql.diagramAsSelects(event.getParam("value"), component.get("v.from"));
            helper.updateEntities(component, rendered.entities);
            var soql = window.pure.soql.diagramSelectsAsSOQL(rendered.selectLists, event.getParam("value"), false);
            component.set("v.soql", soql);
            component.set("v.selectLists", rendered.selectLists);
        }
    },
    handleClearClick: function (component, event, helper) {
        component.set("v.from", undefined);
    },
    handleCopyClick: function (component, event, helper) {
        var success = Core.AuraUtils.copyToClipboard(component.get("v.soql"));
        if (!success) {
            window.alert("Copy to clipboard failed. Try another browser?");
        }
    },
    handleSOQLClick: function (component, event, helper) {
        component.set("v.mode", "soql");
    },
    handlePreviewClick: function (component, event, helper) {
        component.set("v.mode", "preview");
    }
})
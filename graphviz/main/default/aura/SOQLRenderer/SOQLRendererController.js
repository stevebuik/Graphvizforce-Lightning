({
    doInit: function (component, event, helper) {
        component.set("v.ready", true);
    },
    fromChange: function (component, event, helper) {

        var newFrom = event.getParam("value");

        var obscured = {};

        try {
            // update the UI, generating new SOQL if required
            if ($A.util.isEmpty(component.get("v.from"))) {
                component.set("v.prompt", "Choose a SOQL FROM object:");
                component.set("v.fromStyle", "");
            } else {
                var rendered = window.pure.soql.v2.diagramAsSelects(component.get("v.diagram"), component.get("v.describes"), newFrom);
                var soql = window.pure.soql.v2.diagramSelectsAsSOQL(rendered.selectLists, newFrom, false);
                component.set("v.fromStyle", "border: solid 2px " + window.pure.graphviz.entityFrom + ";padding:3px;border-radius:7px;");
                component.set("v.prompt", "FROM")
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
            component.getEvent('onSettingsChange')
                .setParams({
                    from: newFrom,
                    obscuredEntities: obscuredList
                }).fire();

        } catch (error) {
            // the SOQL generation pure fn can throw errors intended to be seen by the user for
            // some combinations of entities. handle that here
            window.alert(error);
        }
    },
    diagramChange: function (component, event, helper) {
        var newDiagram = event.getParam("value");
        component.set("v.from", newDiagram.settings.from);
        if ($A.util.isEmpty(component.get("v.from"))) {
            // load entities from diagram but don't generate SOQL
            var entities = window.pure.soql.v2.entities(event.getParam("value"));
            helper.updateEntities(component, entities);
        } else {
            var rendered = window.pure.soql.v2.diagramAsSelects(newDiagram, component.get("v.describes"), component.get("v.from"));
            helper.updateEntities(component, rendered.entities);
            var soql = window.pure.soql.v2.diagramSelectsAsSOQL(rendered.selectLists, component.get("v.from"), false);
            component.set("v.soql", soql);
            component.set("v.selectLists", rendered.selectLists);
        }
    },
    handleClearClick: function (component, event, helper) {
        component.set("v.from", undefined);
    },
    handleCopyClick: function (component, event, helper) {
        var success = Core.AuraUtils.copyToClipboard(component.get("v.soql"));
        var c = component.find("copied");
        if (!success) {
            window.alert("Copy to clipboard failed. Try another browser?");
        }

        c.getElement().setAttribute("style", "opacity: 1;")
        setTimeout($A.getCallback(function () {
            c.getElement().setAttribute("style", "opacity: 0;")
        }), 1000);
    },
    handleSOQLClick: function (component, event, helper) {
        component.set("v.mode", "soql");
    },
    handlePreviewClick: function (component, event, helper) {
        component.set("v.mode", "preview");
    }
})
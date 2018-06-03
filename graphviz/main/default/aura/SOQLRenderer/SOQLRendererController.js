({
    doInit: function (component, event, helper) {
        component.set("v.ready", true);
    },
    fromChange: function (component, event, helper) {
        if ($A.util.isEmpty(component.get("v.from"))) {

        } else {
            try {
                var rendered = window.pure.soql.diagramAsSelects(component.get("v.diagram"), event.getParam("value"));
                helper.updateSOQL(component, rendered.selectLists);
            } catch (e) {
                console.log(e);
            }
        }
    },
    diagramChange: function (component, event, helper) {
        if ($A.util.isEmpty(component.get("v.from"))) {
            // load entities from diagram but don't generate SOQL
            var entities = window.pure.soql.entities(event.getParam("value"));
            helper.updateEntities(component, entities);
        } else {
            var rendered = window.pure.soql.diagramAsSelects(event.getParam("value"), component.get("v.from"));
            helper.updateEntities(component, rendered.entities);
            helper.updateSOQL(component, rendered.selectLists);
        }
    }
})
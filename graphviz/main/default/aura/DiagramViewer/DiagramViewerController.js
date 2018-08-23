({
    /**
     * Set initialised when static resources are loaded
     */
    doInit: function (component, event, helper) {
        component.set('v.initialised', true);
    },

    onContentChange: function (component, event, helper) {
        var graphvizContent = component.get('v.graphvizContent');
        var initialised = component.get('v.initialised');
        if (initialised && !$A.util.isEmpty(graphvizContent)) {

            // store the selection and re-use to maintain zoom state
            var graphvizSelection = component.get("v.graphvizSelection");
            if ($A.util.isEmpty(graphvizSelection)) {
                graphvizSelection = d3.select("#graph").graphviz({useWorker: false});
                component.set("v.graphvizSelection", graphvizSelection);
            }
            graphvizSelection
                .attributer(helper.attributer)
                .engine("dot")
                .transition(d3.transition("diagram-update").duration(helper.transitionTime()).ease(d3.easeLinear))
                .dot(graphvizContent)
                .render()
                .zoom(true)
                .on("end", function () {
                    // fire event to allow parent components to use the SVG content from the diagram
                    var s = component.find("content").getElement();
                    component.getEvent('onDiagramRendered').setParams({scope: s.innerHTML}).fire();
                });
        }
    },

    onResetZoom: function (component, event, helper) {
        var graphvizSelection = component.get("v.graphvizSelection");
        graphvizSelection.resetZoom(d3.transition("reset").duration(helper.transitionTime()).ease(d3.easeLinear));
    }
})
({
    /**
    * Set initialised when static resources are loaded
    */
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    /**
    * Render and set the diagram markup
    */
    onContentChange : function(component, event, helper){
        var graphvizContent = component.get('v.graphvizContent');
        var initialised = component.get('v.initialised');
        if(initialised && !$A.util.isEmpty(graphvizContent)){
            // Clear diagram svg (Required step)
            document.getElementById("graph").innerHTML = "";

            // Generate markup
            var erdMarkup = d3.select("#graph")
                                .graphviz()
                                .fade(false)
                                .zoom(true)
                                .renderDot(graphvizContent, function(){
                                    d3.select("#graph > svg")
                                        .attr("width", "100%")
                                        .attr("height", "70vh");
                                });

            // Set markup
            component.set('v.graphviz', erdMarkup);
            component.getEvent('onDiagramRendered').setParams({scope:erdMarkup}).fire();
        }
    },
})
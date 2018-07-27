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
        if(component.get('v.initialised') && !$A.util.isEmpty(graphvizContent)){
            var erdMarkup = GraphvizForce.DiagramHelper.renderSVGMarkup(graphvizContent, 'svg');
            document.getElementById("graph").innerHTML = erdMarkup;
            component.getEvent('onDiagramRendered').setParams({scope:erdMarkup}).fire();
        }
    },

})
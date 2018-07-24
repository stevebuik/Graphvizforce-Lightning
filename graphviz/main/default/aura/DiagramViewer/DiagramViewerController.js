/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    onContentChange : function(component, event, helper){
        var graphvizContent = component.get('v.graphvizContent');
        if(component.get('v.initialised') && !$A.util.isEmpty(graphvizContent)){
            var erdMarkup = GraphvizForce.DiagramHelper.renderSVGMarkup(graphvizContent, 'svg');
            document.getElementById("graph").innerHTML = erdMarkup;
            component.getEvent('onDiagramRendered').setParams({scope:erdMarkup}).fire();
        }
    },

})
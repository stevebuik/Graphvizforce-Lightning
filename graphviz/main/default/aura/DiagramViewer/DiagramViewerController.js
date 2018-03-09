/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    onContentChange : function(component, event, helper){
        if(component.get('v.initialised')){
            var format = 'svg';
            var graphvizContent = component.get('v.graphvizContent');
            var erdMarkup = Viz(graphvizContent, format);
            document.getElementById("graph").innerHTML = erdMarkup;
            component.getEvent('onDiagramRendered').setParams({scope:erdMarkup}).fire();
        }
    },

})
/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    onContentChange : function(component, event, helper){
        if(component.get('v.initialised')){
            var erdMarkup = helper.renderSVGMarkup(component.get('v.graphvizContent'));
            document.getElementById("graph").innerHTML = erdMarkup;
            component.getEvent('onDiagramRendered').setParams({scope:erdMarkup}).fire();
        }
    },

})
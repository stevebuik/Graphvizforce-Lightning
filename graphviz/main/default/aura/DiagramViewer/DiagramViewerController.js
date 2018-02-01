/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    renderDiagram : function(component, event, helper){
        if(component.get('v.initialised')){
            var format = 'svg';
            var content = helper.generateGraphviz(component, event, helper);
            var erdMarkup = Viz(content, format);
            document.getElementById("graph").innerHTML = erdMarkup;
            return erdMarkup;
        }
    },

    onToggleState : function(component, event, helper){
        var isExpanded = !component.get('v.isExpanded');
        component.set('v.isExpanded', isExpanded);

        component.getEvent('onTogglePreview').setParams({scope:isExpanded}).fire();
    },

})
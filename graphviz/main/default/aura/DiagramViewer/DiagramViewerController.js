/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    renderDiagram : function(component, event, helper){
        if(component.get('v.initialised')){
            let format = 'svg';
            let content = helper.generateGraphviz(component, event, helper);
            let erdMarkup = Viz(content, format);
            document.getElementById("graph").innerHTML = erdMarkup;
            return erdMarkup;
        }
    },

    onToggleState : function(component, event, helper){
        let isExpanded = !component.get('v.isExpanded');
        component.set('v.isExpanded', isExpanded);

        component.getEvent('onTogglePreview').setParams({scope:isExpanded}).fire();
    },

})
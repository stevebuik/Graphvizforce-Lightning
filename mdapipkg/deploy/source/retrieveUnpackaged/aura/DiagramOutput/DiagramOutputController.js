/**
 * Created by guan on 15/2/18.
 */
({
    doInit : function(component, event, helper){
        component.set('v.initialised', true);
    },

    onToggleState : function(component, event, helper){
        var isExpanded = !component.get('v.isExpanded');
        component.set('v.isExpanded', isExpanded);

        component.getEvent('onTogglePreview').setParams({scope:isExpanded}).fire();
    },

    renderDiagram : function(component, event, helper){
        var graphvizContent = helper.generateGraphviz(component, event, helper);
        //component.find('diagramViewer').renderDiagram(component, event, helper);
        component.set('v.graphvizContent', graphvizContent);
    },

    onDiagramRendered : function(component, event, helper){
        component.set('v.svgContent', event.getParam('scope'));
    },

    handleCopyGraphviz : function(component, event, helper){
        helper.copyContent(component, helper, 'graphvizContent');
    },

    handleCopySVG : function(component, event, helper){
        helper.copyContent(component, helper, 'svgContent');
    },

    handleDownloadGraphviz : function(component, event, helper){
        var selectedDiagram = component.get('v.selectedDiagram');
        var content = component.get('v.graphvizContent');
        helper.saveToFile(selectedDiagram.label + '.gv', content);
    },

    handleDownloadSVG : function(component, event, helper){
        var selectedDiagram = component.get('v.selectedDiagram');
        var content = component.get('v.svgContent');
        helper.saveToFile(selectedDiagram.label + '.svg', content);
    },
})
/**
 * Created by guan on 15/2/18.
 */
({
    copyContent: function (component, helper, type) {
        var text = type == 'graphvizContent' ? component.get('v.graphvizContent') : component.get('v.svgContent');
        if (text == null) return;

        var success = Core.AuraUtils.copyToClipboard(text);

        if (success) {
            window.alert('Copied Successfully.');
        }
    },

    saveToFile: function (label, content) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:svg/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', label);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    render: function (component) {
        var diagram = component.get("v.diagram");
        if (diagram) {
            // Get settings from the tool bar
            var opts = {
                showSelfRelations: component.get("v.showSelfRelations"),
                obscureEntities: component.get("v.obscuredEntities"),
            };
            diagram.settings = opts;

            // Validate diagram and output
            var translated;
            if(GraphvizForce.DiagramHelper.isDiagramValidToPersist(diagram)){
                translated = pure.graphviz.diagramAsView(diagram, GraphvizForce.fullSchema);
            }
            if(GraphvizForce.DiagramHelper.isTranslatedValidToOutput(translated)){
                var graphvizContent = pure.graphviz.diagramAsText(translated);
                component.set('v.graphvizContent', graphvizContent);
            }
        }
    }
})
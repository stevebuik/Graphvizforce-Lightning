({
    /**
    * Process copy content action
    */
    copyContent: function (component, helper, type) {
        var text = type == 'graphvizContent' ? component.get('v.graphvizContent') : component.get('v.svgContent');
        if (text == null) return;

        var success = Core.AuraUtils.copyToClipboard(text);

        if (success) {
            window.alert('Copied Successfully.');
        }
    },

    /**
    * Process save to local file action
    */
    saveToFile: function (label, content) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:svg/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', label);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    /**
    * Process diagram rendering
    */
    render: function (component) {
        var describes = component.get('v.describes');
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
                translated = pure.graphviz.diagramAsView(diagram, describes);
            }
            if(GraphvizForce.DiagramHelper.isTranslatedValidToOutput(translated)){
                var graphvizContent = pure.graphviz.diagramAsText(translated);
                component.set('v.graphvizContent', graphvizContent);
            }
        }
    },
})
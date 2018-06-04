/**
 * Created by guan on 15/2/18.
 */
({
    copyContent: function (component, helper, type) {
        var text = type == 'graphvizContent' ? component.get('v.graphvizContent') : component.get('v.svgContent');
        console.log('@@@@ text:', text);
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
        var diagram = component.get("v.selectedDiagram");
        if (diagram) {
            var opts = {
                showSelfRelations: component.get("v.showSelfRelations"),
                obscureEntities: component.get("v.obscuredEntities"),
            };
            var translated = window.pure.graphviz.diagramAsMustacheView(diagram, opts);
            var graphvizContent = window.pure.graphviz.diagramAsText(translated);
            component.set('v.graphvizContent', graphvizContent);
        }
    }
})
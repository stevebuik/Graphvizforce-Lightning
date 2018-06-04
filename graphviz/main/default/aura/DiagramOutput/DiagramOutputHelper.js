/**
 * Created by guan on 15/2/18.
 */
({
    copyContent : function(component, helper, type){
        var text = type == 'graphvizContent' ? component.get('v.graphvizContent') : component.get('v.svgContent');
        console.log('@@@@ text:', text);
        if(text == null) return;

        var success = Core.AuraUtils.copyToClipboard(text);

        if(success){
            component.find('notifLib').showToast({
                "title": "Info",
                "message": 'Copied Successfully.'
            });
        }
    },

    saveToFile : function(label, content){
        var element = document.createElement('a');
        element.setAttribute('href', 'data:svg/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', label);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    generateGraphviz: function (component, event, helper) {
        var selectedDiagram = component.get('v.selectedDiagram');
        var translated = window.pure.graphviz.diagramAsMustacheView(selectedDiagram, {});
        return window.pure.graphviz.diagramAsText(translated);
    }
})
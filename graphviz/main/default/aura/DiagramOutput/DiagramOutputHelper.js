/**
 * Created by guan on 15/2/18.
 */
({
    copyContent : function(component, helper, type){
        var text = type == 'graphvizContent' ? component.get('v.graphvizContent') : component.get('v.svgContent');
        console.log('@@@@ text:', text);
        if(text == null) return;

        var success = helper.copyToClipboard(text);

        if(success){
            component.find('notifLib').showToast({
                "title": "Info",
                "message": 'Copied Successfully.'
            });
        }
    },

    copyToClipboard : function(text){
        // Copies a string to the clipboard. Must be called from within an
        // event handler such as click. May return false if it failed, but
        // this is not always possible. Browser support for Chrome 43+,
        // Firefox 42+, Safari 10+, Edge and IE 10+.
        // IE: The clipboard feature may be disabled by an administrator. By
        // default a prompt is shown the first time the clipboard is
        // used (per session).
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
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

    generateGraphviz : function(component, event, helper){
        /* Sample Diagram
        var content = 'digraph G { \n'+
                       'node [shape=plaintext, fontsize=12]; \n'+
                       'edge  [arrowhead=crow]; \n'+
                       'a [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n'+
                        '                      <TR><TD PORT="c" BGCOLOR="gray">Object 1</TD></TR> \n'+
                        '                      <TR><TD PORT="d">second</TD></TR> \n'+
                        '                      <TR><TD PORT="e">third</TD></TR> \n'+
                        '         </TABLE>>]; \n'+
                       'b [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n'+
                       '                       <TR><TD PORT="c" BGCOLOR="gray">Object 2</TD></TR> \n'+
                       '                       <TR><TD PORT="d">second</TD></TR> \n'+
                       '                       <TR><TD PORT="e">third</TD></TR> \n'+
                       '          </TABLE>>]; \n'+
                       'a:c -> b:c; \n'+
                   '}';
        */

        var allObjects = component.get('v.allObjects');
        var selectedDiagram = component.get('v.selectedDiagram');
        var objectReferenceMap = new Map();
        var masterDetailMap = new Map();
        var relationshipList = [];

        var graphviz = 'digraph G { \n'+
                       'graph [rankdir=LR,nodesep=1.0]; \n'+
                       'node [shape=plaintext, fontsize=12]; \n'+
                       'edge  [arrowhead=crow]; \n';
        selectedDiagram.groups.forEach(function (group){
            group.entities.forEach(function (object){
                var customFlag = object.isCustom ? ' [C]' : '';
                var objectNode = object.value + ' [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n' +
                                    ' <TR><TD PORT="' + object.value + '" BGCOLOR="lightgray">' + object.label + customFlag + '</TD></TR> \n';
                var referenceFields = [];
                object.attributes.forEach(function (attribute){
                    if(attribute.selected){
                        objectNode += ' <TR><TD PORT="' + attribute.value + '">' + attribute.label + '</TD></TR> \n';
                    }
                    if(attribute.type === 'REFERENCE' && attribute.references !== null){
                        referenceFields = referenceFields.concat(attribute.references);
                    }
                    //console.log('@@@@ attribute.label:', attribute.label);

                    if(attribute.isMDOrCascadeDelete){
                        var mdKey = attribute.value + '-' + object.value;
                        masterDetailMap.set(mdKey, true);
                    }
                });
                objectReferenceMap.set(object.value, referenceFields);
                objectNode += ' </TABLE>>]; \n';
                graphviz += objectNode;
            });
        });

        objectReferenceMap.forEach(function (value, key, map) {
            value.forEach(function (reference){
                //var relationship = reference.parentAPIName + ':' + reference.parentAPIName + ' -> ' + key + ':' + reference.referenceFieldAPIName;
                var relationshipKey = reference.referenceFieldAPIName + '-' + key;
                var isMD = masterDetailMap.has(relationshipKey);
                var mdColor = isMD ? ' [color="red"]' : '';
                var relationship = reference.parentAPIName + ':' + reference.parentAPIName + ' -> ' + key + ':' + key + mdColor;
                if(objectReferenceMap.has(reference.parentAPIName) && relationshipList.indexOf(relationship) === -1){
                    relationshipList.push(relationship);
                }
            });
        });

        relationshipList.forEach(function (relationship){
            graphviz += relationship + ' \n';
        });

        graphviz += '}';

        //console.log('#### Graphviz Content:', graphviz);

        return graphviz;
    },
})
/**
 * Created by guan on 12/12/17.
 */
({
    generateGraphviz : function(component, event, helper){
        /* Sample Diagram
        let content = 'digraph G { \n'+
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

        let allObjects = component.get('v.allObjects');
        let selectedDiagram = component.get('v.selectedDiagram');
        let objectReferenceMap = new Map();
        let relationshipList = [];

        let graphviz = 'digraph G { \n'+
                       'graph [rankdir=LR,nodesep=1.0]; \n'+
                       'node [shape=plaintext, fontsize=12]; \n'+
                       'edge  [arrowhead=crow]; \n';
        selectedDiagram.groups.forEach(function (group){
            group.entities.forEach(function (object){
                let objectNode = object.value + ' [label=<<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0"> \n' +
                                    ' <TR><TD PORT="' + object.value + '" BGCOLOR="lightgray">' + object.label + '</TD></TR> \n';
                let referenceFields = [];
                object.attributes.forEach(function (attribute){
                    if(attribute.selected){
                        objectNode += ' <TR><TD PORT="' + attribute.value + '">' + attribute.label + '</TD></TR> \n';
                    }
                    if(attribute.type == 'REFERENCE' && attribute.references != null){
                        referenceFields = referenceFields.concat(attribute.references);
                    }
                });
                objectReferenceMap.set(object.value, referenceFields);
                objectNode += ' </TABLE>>]; \n';
                graphviz += objectNode;
            });
        });

        objectReferenceMap.forEach(function (value, key, map) {
            value.forEach(function (reference){
                //let relationship = reference.parentAPIName + ':' + reference.parentAPIName + ' -> ' + key + ':' + reference.referenceFieldAPIName;
                let relationship = reference.parentAPIName + ':' + reference.parentAPIName + ' -> ' + key + ':' + key;
                if(objectReferenceMap.has(reference.parentAPIName) && relationshipList.indexOf(relationship) == -1){
                    relationshipList.push(relationship);
                }
            });
        });

        relationshipList.forEach(function (relationship){
            graphviz += relationship + ' \n';
        });

        graphviz += '}';

        console.log('#### Graphviz Content:', graphviz);

        return graphviz;
    },
})
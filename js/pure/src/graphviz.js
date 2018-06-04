var Mustache = require("mustache");

var gv = {

    template:

    "digraph G { \n\n" +
    "   graph [rankdir=LR,nodesep=1.0]; \n" +
    "   node [shape=plaintext, fontsize=12]; \n" +
    "   edge  []; \n\n" +

    "{{#groups}}" +

    "   {{#entities}}" +

    "{{id}} [label=<<TABLE BORDER='0' CELLBORDER='1' CELLSPACING='0' COLOR='{{color}}'>\n" +
    "     <TR><TD PORT='{{id}}' BGCOLOR='lightgray'><FONT COLOR='{{color}}'>{{name}}</FONT></TD></TR>\n" +
    "  {{#fields}}" +
    "   <TR>\n" +
    "       <TD PORT='{{id}}' BGCOLOR='white'><FONT COLOR='{{color}}'>{{name}}</FONT></TD>\n" +
    "     </TR>\n" +
    "{{/fields}}" +
    "     </TABLE>>];\n" +

    "   {{/entities}}" +

    "{{/groups}}" +
    "\n\n" +

    "{{#relationships}}" +
    "{{from}}:{{field}}:e -> {{to}}:{{to}}:w [style={{style}}] \n" +
    "{{/relationships}}" +

    "}",

    /** translate a persisted diagram into a rendering view object. the result will be validated using gv.schemaDiagram.
     *  the opts arg contains values which change the way the view data is transformed. valid opts are:
     *
     *  showSelfRelations : true will show heirarchical relationships i.e. loops
     *  obscureEntities : an array of entity names that should be faded to de-emphasise them in the diagram
     * TODO
     *  showEdgeSingularLabels : true will show relationship labels for child to parent
     *  showEdgePluralLabels : true will show relationship labels for parent to children
     *  fromEntity : an entity name that should be highlight to emphasise it in the diagram
     *  showTypes : true will show field types
     *  showAPINames : true will show field using their API Names instead of Labels
     *  layout : TD (topdown) or LR (leftright). default is LR.
     *
     * @param diagram
     * @param opts
     * @returns a valid schemaDiagram object
     */
    diagramAsMustacheView: function (diagram, opts) {
        var result = {
            groups: [],
            relationships: []
        };

        // create lookups for entities
        var persistedEntitiesInDiagramByAPIName = {}; // the input entities
        var entitiesInDiagramByAPIName = {}; // the view/output entities
        diagram.groups.forEach(function (group) {
            group.entities.forEach(function (entity) {
                persistedEntitiesInDiagramByAPIName[entity.value] = entity
                entitiesInDiagramByAPIName[entity.value] = true; // this will be replaced by an object in the loop below
            });
        });

        // create lookups for options data
        var obscured = {};
        if (opts.obscureEntities) {
            opts.obscureEntities.forEach(function (name) {
                obscured[name] = true;
            })
        }

        // translate the input diagram into the view shape
        diagram.groups.forEach(function (group) {
            var viewGroup = {
                name: group.label,
                entities: []
            };

            group.entities.forEach(function (entity) {
                var viewEntity = {
                    name: entity.label,
                    id: entity.value,
                    color: gv.entityFocused,
                    fields: []
                };
                if (obscured[entity.value]) {
                    viewEntity.color = gv.entityObscured;
                }
                entitiesInDiagramByAPIName[entity.value] = viewEntity;

                entity.attributes.forEach(function (attribute) {
                    if (attribute.selected) {
                        var viewField = {
                            name: attribute.label,
                            id: attribute.value,
                            type: attribute.type
                        };
                        viewEntity.fields.push(viewField);
                    }

                    if (attribute.type == "REFERENCE") {
                        attribute.references.forEach(function (reference) {
                            if (entitiesInDiagramByAPIName[reference.parentAPIName]) {
                                if (opts.showSelfRelations || (!opts.showSelfRelations && entity.value != reference.parentAPIName)) {
                                    result.relationships.push({
                                        from: entity.value,
                                        to: reference.parentAPIName,
                                        field: reference.referenceFieldAPIName,
                                        style: attribute.isMDOrCascadeDelete ? "solid" : "dashed"
                                    });
                                }
                            }
                        })
                    }

                });

                viewGroup.entities.push(viewEntity);
            });
            result.groups.push(viewGroup);
        });

        // for each relationship, ensure that the Foreign Key field is present in the child entity
        result.relationships.forEach(function (relationship) {
            var viewEntity = entitiesInDiagramByAPIName[relationship.from];
            var isReferenceFieldPresent = false;
            viewEntity.fields.forEach(function (field) {
                if (field.id == relationship.field) {
                    isReferenceFieldPresent = true;
                }
            });
            if (!isReferenceFieldPresent) {
                var viewField;
                persistedEntitiesInDiagramByAPIName[relationship.from].attributes.forEach(function (attribute) {
                    if (attribute.value == relationship.field) {
                        viewField = {
                            name: attribute.label,
                            id: attribute.value,
                            type: attribute.type
                        }
                    }
                });
                if (viewField) {
                    viewEntity.fields.push(viewField);
                } else {
                    throw Error(JSON.stringify({
                        error: "reference field not found",
                        relationship: relationship
                    }));
                }

            }
        })

        // finally sort entities and fields
        result.groups.forEach(function (group) {
            group.entities = group.entities.sort(gv.compareNames);
            group.entities.forEach(function (entity) {
                entity.fields = entity.fields.sort(gv.compareNames);
            });
        });

        return result;
    },

    entityFocused: "#000000",
    entityObscured: "#AAAAAA",

    compareNames: function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    },

    diagramAsText: function (view) {
        return Mustache.render(gv.template, view);
    }

}

Mustache.parse(gv.template); // pre-cache the template

module.exports = gv;
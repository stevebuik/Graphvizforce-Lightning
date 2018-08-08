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
    "       <TD PORT='{{id}}' BGCOLOR='white' ALIGN='LEFT'><FONT COLOR='{{color}}'>{{name}}</FONT></TD>\n" +
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

    /** translate a persisted diagram into a rendering view object. the input and outputs will be validated using schemas in tests.
     *  the settings key in the diagram contains values which change the way the view data is transformed. valid settings are:
     *
     *  showSelfRelations : true will show hierarchical relationships i.e. loops
     *  obscureEntities : an array of entity names that should be faded to de-emphasise them in the diagram
     *  from : the entity used as the SOQL from. It is rendered using a green color to highlight it
     *  showStandardUserRelationships : true will show OwnerId, CreatedBy and LastModifiedBy fields and the relationships to user. defaults to false
     *  showAPINames : true will show objects/fields using their API Names instead of Labels
     * TODO
     *  showEdgeSingularLabels : true will show relationship labels for child to parent
     *  showEdgePluralLabels : true will show relationship labels for parent to children
     *  showTypes : true will show field types
     *  layout : TD (topdown) or LR (leftright). default is LR.
     *
     * @param diagram a valid persisted diagram object
     * @param objectWrappers the list of wrappers returned by the Apex GraphVizForceController.loadSchema method
     * @returns a valid schemaDiagram object
     */
    diagramAsView: function (diagram, objectWrappers) {
        var result = {
            groups: [],
            relationships: []
        };

        // create lookup for object wrappers / describes
        var entityDescribesByAPIName = {}; // the input wrappers
        objectWrappers.forEach(function (entity) {
            entityDescribesByAPIName[entity.apiName] = entity
        });

        // create lookup for all entities in diagram
        var entitiesInDiagramByAPIName = {};
        diagram.entities.forEach(function (entity) {
            entitiesInDiagramByAPIName[entity.apiName] = true;
        });

        // create lookups for options data that has entity specific flags
        var obscured = {};
        if (diagram.settings.obscureEntities) {
            diagram.settings.obscureEntities.forEach(function (name) {
                obscured[name] = true;
            })
        }

        var viewEntitiesByAPIName = {};

        // main loop to add view entities
        diagram.entities.forEach(function (entity) {
            var entityDescribe = entityDescribesByAPIName[entity.apiName];
            if (entityDescribe) {

                var isNotObscured = obscured[entity.apiName] === undefined;

                var color;
                if (isNotObscured) {
                    var isFromEntity = diagram.settings.from == entity.apiName;
                    if (isFromEntity) {
                        color = gv.entityFrom;
                    } else {
                        color = gv.entityFocused;
                    }
                } else {
                    color = gv.entityObscured;
                }

                var entityLabel = entityDescribe.label;
                if (diagram.settings.showAPINames) {
                    entityLabel = entityDescribe.apiName;
                }
                var viewEntity = {
                    "name": entityLabel,
                    "id": entity.apiName,
                    "color": color,
                    "fields": []
                };
                viewEntitiesByAPIName[entity.apiName] = viewEntity;

                var userReferenceFields = {"OwnerId": true, "LastModifiedById": true, "CreatedById": true};
                var fieldDescribesByAPIName = {};
                entityDescribe.fields.forEach(function (fieldDescribe) {
                    // load all field describes into a lookup for use below
                    fieldDescribesByAPIName[fieldDescribe.apiName] = fieldDescribe;

                    // add relationships and fields for reference fields in the entities (if parent is also present)
                    if (fieldDescribe.type == "REFERENCE") {
                        fieldDescribe.referenceFields.forEach(function (reference) {
                            if (entitiesInDiagramByAPIName[reference.parentAPIName]) {
                                var isStandardUserReference = userReferenceFields[reference.referenceFieldAPIName];
                                var isBlockedUserReference = isStandardUserReference && !diagram.settings.showStandardUserRelationships;
                                if (!isBlockedUserReference) {
                                    if (diagram.settings.showSelfRelations || (!diagram.settings.showSelfRelations && entity.apiName != reference.parentAPIName)) {

                                        // add the relationship
                                        result.relationships.push({
                                            from: entity.apiName,
                                            to: reference.parentAPIName,
                                            field: reference.referenceFieldAPIName,
                                            style: fieldDescribe.isMDOrCascadeDelete ? "solid" : "dashed"
                                        });

                                        // add the reference field to the entity
                                        var fieldLabel = fieldDescribe.label;
                                        if (diagram.settings.showAPINames) {
                                            fieldLabel = fieldDescribe.apiName;
                                        }
                                        viewEntity.fields.push({
                                            "name": fieldLabel,
                                            "id": fieldDescribe.apiName,
                                            "type": fieldDescribe.type
                                        });
                                    }
                                }
                            }
                        })
                    }
                })

                // add view fields to view entity
                entity.fields.forEach(function (field) {

                    // create a lookup for fields already added by the describe/reference loop above
                    var fieldsAlreadyAdded = {};
                    viewEntity.fields.forEach(function (field) {
                        fieldsAlreadyAdded[field.name] = true;
                    })

                    var fieldDescribe = fieldDescribesByAPIName[field.apiName];
                    if (fieldDescribe) {
                        var fieldLabel = fieldDescribe.label;
                        if (diagram.settings.showAPINames) {
                            fieldLabel = fieldDescribe.apiName;
                        }
                        var viewField = {
                            "name": fieldLabel,
                            "id": field.apiName,
                            "type": fieldDescribe.type
                        };

                        if (!fieldsAlreadyAdded[viewField.name]) {

                            viewEntity.fields.push(viewField);

                            // for foreign key fields selected by the user, add a relationship (if target entity is in diagram)
                            if (fieldDescribe.type == "REFERENCE") {
                                fieldDescribe.referenceFields.forEach(function (reference) {
                                    if (entitiesInDiagramByAPIName[reference.parentAPIName]) {
                                        if (diagram.settings.showSelfRelations || (!diagram.settings.showSelfRelations && entity.apiName != reference.parentAPIName)) {
                                            var userSelectedReference = {
                                                from: entity.apiName,
                                                to: reference.parentAPIName,
                                                field: reference.referenceFieldAPIName,
                                                style: fieldDescribe.isMDOrCascadeDelete ? "solid" : "dashed"
                                            };
                                            // don't add the relationship if it was already added by the reference loop above
                                            var relationshipAlreadyAdded = false;
                                            result.relationships.forEach(function (rel) {
                                                if (relationshipAlreadyAdded == false &&
                                                    rel.from == userSelectedReference.from &&
                                                    rel.to == userSelectedReference.to &&
                                                    rel.field == userSelectedReference.field) {
                                                    relationshipAlreadyAdded = true;
                                                }
                                            });
                                            if (!relationshipAlreadyAdded) {
                                                result.relationships.push(userSelectedReference);
                                            }
                                        }
                                    }
                                })
                            }
                        }

                    } else {
                        console.log("Ignoring field: " + field.apiName);
                    }
                });
            } else {
                console.log("Ignoring entity: " + entity.apiName);
            }
        });

        // put the view entities into groups
        if (diagram.groups.length > 0) {
            diagram.groups.forEach(function (group) {
                var viewGroup = {
                    name: group.name,
                    entities: []
                };
                result.groups.push(viewGroup);
                group.entities.forEach(function (entityAPIName) {
                    viewGroup.entities.push(viewEntitiesByAPIName[entityAPIName]);
                });
            });
        } else {
            var defaultGroup = {
                name: "Default",
                entities: []
            };
            result.groups.push(defaultGroup);
            for (var entityAPIName in viewEntitiesByAPIName) {
                defaultGroup.entities.push(viewEntitiesByAPIName[entityAPIName]);
            }
        }

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
    entityFrom: "#0a9905",

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
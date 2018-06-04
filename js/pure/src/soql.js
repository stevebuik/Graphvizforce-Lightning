var soql = {

    selectList: function (entity, prefix) {
        var selectList = "";
        var fields = "";
        entity.attributes.forEach(function (attribute) {
            if (attribute.selected) {
                if (fields.length > 0) {
                    fields += ",";
                }
                if (prefix) {
                    fields += prefix + ".";
                }
                fields += attribute.value;
            }
        });
        selectList += fields;
        return selectList;
    },

    selectedFieldsFromEntity: function (entity) {
        var selected = [];
        entity.attributes.forEach(function (attribute) {
            if (attribute.selected) {
                selected.push(attribute.value);
            }
        });
        return selected;
    },

    /** return a list of entities present in a diagram
     *
     * @param diagram
     */
    entities: function (diagram) {
        var result = [];
        diagram.groups.forEach(function (group) {
            group.entities.forEach(function (entity) {
                result.push(entity.value);
            });
        });
        return result;
    },

    diagramAsSelects: function (diagram, from) {

        // prepare some lookups to be used in the generation logic below

        var entitiesInDiagramByAPIName = {};
        var allChildRelationships = {};
        var childRelationshipsInDiagram = {};
        var parentRelationshipsInDiagram = {};

        diagram.groups[0].entities.forEach(function (entity) {
            // record entities present in diagram
            entitiesInDiagramByAPIName[entity.value] = entity;

            // record relationships to other objects
            if (entity.children) {
                entity.children.forEach(function (rel) {
                    if (!allChildRelationships[entity.value]) {
                        allChildRelationships[entity.value] = {};
                    }
                    allChildRelationships[entity.value][rel.childAPIName] = rel.relationshipName;
                });
            }
        });

        diagram.groups[0].entities.forEach(function (entity) {
            entity.attributes.forEach(function (attribute) {
                if (attribute.type == "REFERENCE") {
                    attribute.references.forEach(function (ref) {
                        var isReferenceToAnEntityInDiagram = entitiesInDiagramByAPIName[ref.parentAPIName];
                        var isSelfReference = ref.parentAPIName == entity.value;
                        if (isReferenceToAnEntityInDiagram && !isSelfReference) {
                            var relation = {
                                field: attribute.value,
                                relationshipNameFromChild: ref.relationshipName,
                                relationshipNameToChild: allChildRelationships[ref.parentAPIName][entity.value],
                                parentEntity: ref.parentAPIName,
                                childEntity: entity.value,
                            };
                            if (childRelationshipsInDiagram[ref.parentAPIName]) {
                                childRelationshipsInDiagram[ref.parentAPIName].push(relation);
                            } else {
                                childRelationshipsInDiagram[ref.parentAPIName] = [relation];
                            }
                            if (parentRelationshipsInDiagram[entity.value]) {
                                parentRelationshipsInDiagram[entity.value].push(relation);
                            } else {
                                parentRelationshipsInDiagram[entity.value] = [relation];
                            }
                        }
                    });
                }
            });
        });

        // ready for generation

        var selectLists = [];
        var selectedFields = {};

        // generate fields from the "FROM" entity
        diagram.groups[0].entities.forEach(function (entity) {
            if (entity.value == from) {
                var sl = soql.selectList(entity);
                if (sl.length > 0) {
                    selectLists.push(sl);
                }
                selectedFields[from] = soql.selectedFieldsFromEntity(entity);
            }
        });

        // generate parent joins, traversing up 5 levels
        if (parentRelationshipsInDiagram[from]) {
            var ancestorPaths = soql.ancestorEntityPaths(0, {}, entitiesInDiagramByAPIName[from], [], parentRelationshipsInDiagram, entitiesInDiagramByAPIName);
            var ancestorSelectLists = [];
            for (var ancestorEntity in ancestorPaths) {
                var path = ancestorPaths[ancestorEntity];
                var prefix = "";
                path.forEach(function (relationshipName) {
                    if (prefix.length > 0) {
                        prefix += ".";
                    }
                    prefix += relationshipName;
                });
                selectedFields[ancestorEntity] = soql.selectedFieldsFromEntity(entitiesInDiagramByAPIName[ancestorEntity]);
                ancestorSelectLists.push(soql.selectList(entitiesInDiagramByAPIName[ancestorEntity], prefix));
            }
            selectLists = selectLists.concat(ancestorSelectLists)
        }

        // generate child relationship joins, traversing down a single level
        if (childRelationshipsInDiagram[from]) {
            childRelationshipsInDiagram[from].forEach(function (childRelation) {
                var selectListForChildEntity = soql.selectList(entitiesInDiagramByAPIName[childRelation.childEntity]);
                selectedFields[childRelation.childEntity] = soql.selectedFieldsFromEntity(entitiesInDiagramByAPIName[childRelation.childEntity]);

                // TODO child joins can also traverse up 5 levels from the child entity

                var childSubQuery = "SELECT " + selectListForChildEntity + " FROM " + childRelation.relationshipNameToChild;
                selectLists.push("(" + childSubQuery + ")");
            });
        }

        return {
            entities: soql.entities(diagram),
            selectLists: selectLists,
            selectedFields: selectedFields
        };
    },

    /** return an object which has entity api names as keys and relationship paths as values e.g. "Account" -> ["Parent","Account"]
     *  This is done by traversing up to all ancestors recursively up to a max of 5 levels
     *
     * @param descendantPaths the object for all entities below this entity
     * @param entity the current entity
     * @param parentRelationshipsInDiagram an object mapping entity names to parent relationships
     * @param entitiesInDiagramByAPIName an object mapping entity names to entities
     */
    ancestorEntityPaths: function (level, descendantPaths, entity, descendentPath, parentRelationshipsInDiagram, entitiesInDiagramByAPIName) {
        if (level < 5) {
            if (parentRelationshipsInDiagram[entity.value]) {
                parentRelationshipsInDiagram[entity.value].forEach(function (parentRelationship) {
                    var pathToParent = descendentPath.slice(0); // clone the path passed in
                    pathToParent.push(parentRelationship.relationshipNameFromChild);
                    descendantPaths[parentRelationship.parentEntity] = pathToParent;
                    // recurse up to parent here
                    soql.ancestorEntityPaths(level + 1, descendantPaths, entitiesInDiagramByAPIName[parentRelationship.parentEntity], pathToParent,
                        parentRelationshipsInDiagram, entitiesInDiagramByAPIName);
                });
            }
        }
        return descendantPaths;
    },

    diagramSelectsAsSOQL: function (selectLists, from, newlines) {
        var query = "";

        selectLists.forEach(function (fields) {
            if (query.length > 0) {
                query += ",";
            }
            query += fields;
        });

        query += " FROM " + from;
        return "SELECT " + query;
    }
}

module.exports = soql;
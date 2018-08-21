var soql = {

    ///// FNS USING VERSION 2 PERSISTENCE FNS I.E. VALIDATED PERSISTENCE /////
    v2: {
        /** return a list of entities present in a diagram
         *
         * @param diagram
         */
        entities: function (diagram) {
            var result = [];
            diagram.entities.forEach(function (entity) {
                result.push(entity.apiName);
            });
            return result;
        },

        /** Generate SOQL and select lists from a persisted diagram and object-wrappers
         *
         * @param diagram the validated persisted diagram JSON object
         * @param describes the ObjectWrappers for all entities, from Apex
         * @param from the driving entity for the query
         * @returns {{entities: *, selectLists: Array, selectedFields: {}}}
         */
        diagramAsSelects: function (diagram, describes, from) {

            // lookups used internally
            var describesByAPIName = {};
            var persistedEntitiesInDiagramByAPIName = {};
            var allChildRelationships = {};
            var childRelationshipsInDiagram = {};
            var parentRelationshipsInDiagram = {};

            // create a lookup for all describes
            describes.forEach(function (describe) {
                describesByAPIName[describe.apiName] = describe;
            });

            diagram.entities.forEach(function (persistedEntity) {

                var entityDescribe = describesByAPIName[persistedEntity.apiName];

                // record entities present in diagram
                persistedEntitiesInDiagramByAPIName[persistedEntity.apiName] = persistedEntity;

                // record relationships to other objects
                if (entityDescribe.childRelationships) {
                    entityDescribe.childRelationships.forEach(function (rel) {
                        // ensure a lookup for each entity
                        if (!allChildRelationships[entityDescribe.apiName]) {
                            allChildRelationships[entityDescribe.apiName] = {};
                        }
                        // ensure a lookup for each child entity
                        if (!allChildRelationships[entityDescribe.apiName][rel.childAPIName]) {
                            allChildRelationships[entityDescribe.apiName][rel.childAPIName] = {};
                        }
                        // record the relationship name using parent.child.child-fk-field
                        allChildRelationships[entityDescribe.apiName][rel.childAPIName][rel.childFieldAPIName] = rel.relationshipName;
                    });
                }

            });

            // load the bi-directional relationship lookups (only for entities in the diagram)
            diagram.entities.forEach(function (persistedEntity) {
                var entityDescribe = describesByAPIName[persistedEntity.apiName];
                entityDescribe.fields.forEach(function (attribute) {
                    if (attribute.type == "REFERENCE") {
                        attribute.referenceFields.forEach(function (ref) { // all references fields from the describe

                            var isReferenceToAnEntityInDiagram = persistedEntitiesInDiagramByAPIName[ref.parentAPIName];

                            var isSelfReference = ref.parentAPIName == entityDescribe.apiName; // don't use self-relations in SOQL

                            if (isReferenceToAnEntityInDiagram && !isSelfReference) {

                                var relation = {
                                    field: attribute.apiName,
                                    relationshipNameFromChild: ref.relationshipName,
                                    parentEntity: ref.parentAPIName,
                                    childEntity: entityDescribe.apiName,
                                };

                                // for some "system" entities, parent relationship data is not present
                                var relationshipsFromParent = allChildRelationships[ref.parentAPIName];
                                if (relationshipsFromParent && relationshipsFromParent[entityDescribe.apiName]) {
                                    relation.relationshipNameToChild = relationshipsFromParent[entityDescribe.apiName][ref.referenceFieldAPIName];
                                }

                                // add child relations for entities in the diagram
                                if (childRelationshipsInDiagram[ref.parentAPIName]) {
                                    childRelationshipsInDiagram[ref.parentAPIName].push(relation);
                                } else { // first one seen
                                    childRelationshipsInDiagram[ref.parentAPIName] = [relation];
                                }

                                // add parent relations for entities in the diagram
                                if (parentRelationshipsInDiagram[entityDescribe.apiName]) {
                                    parentRelationshipsInDiagram[entityDescribe.apiName].push(relation);
                                } else { // first one seen
                                    parentRelationshipsInDiagram[entityDescribe.apiName] = [relation];
                                }
                            }
                        });
                    }
                });
            });

            ///// START SOQL GENERATION /////

            // arrays to be returned
            var selectLists = [];
            var selectedFields = {};

            // generate fields from the "FROM" entity
            diagram.entities.forEach(function (entity) {
                if (entity.apiName == from) {
                    var sl = soql.v2.selectList(entity);
                    if (sl.length > 0) {
                        selectLists.push(sl);
                    }
                    selectedFields[from] = soql.v2.selectedFieldsFromEntity(entity);
                }
            });

            // generate parent joins, traversing up 5 levels
            if (parentRelationshipsInDiagram[from]) {
                var ancestorPaths = soql.v2.ancestorEntityPaths(
                    0,
                    {},
                    persistedEntitiesInDiagramByAPIName[from],
                    [],
                    parentRelationshipsInDiagram,
                    persistedEntitiesInDiagramByAPIName);

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
                    selectedFields[ancestorEntity] = soql.v2.selectedFieldsFromEntity(
                        persistedEntitiesInDiagramByAPIName[ancestorEntity]);
                    ancestorSelectLists.push(soql.v2.selectList(persistedEntitiesInDiagramByAPIName[ancestorEntity], prefix));
                }
                selectLists = selectLists.concat(ancestorSelectLists)
            }

            // generate child relationship joins, traversing down a single level
            if (childRelationshipsInDiagram[from]) {
                childRelationshipsInDiagram[from].forEach(function (childRelation) {

                    // some entities are not supported by SOQL joins. In that case, throw an error to be displayed to the user
                    if (childRelation.relationshipNameToChild === undefined) {
                        throw new Error("The '"
                            + childRelation.childEntity
                            + "' object cannot be used in a parent -> child relationship query from the '"
                            + childRelation.parentEntity
                            + "' entity!");
                    }

                    var selectListForChildEntity = soql.v2.selectList(persistedEntitiesInDiagramByAPIName[childRelation.childEntity]);
                    selectedFields[childRelation.childEntity] = soql.v2.selectedFieldsFromEntity(persistedEntitiesInDiagramByAPIName[childRelation.childEntity]);

                    // TODO child joins can also traverse up 5 levels from the child entity

                    var childSubQuery = "SELECT " + selectListForChildEntity + " FROM " + childRelation.relationshipNameToChild;
                    selectLists.push("(" + childSubQuery + ")");
                });
            }

            return {
                entities: soql.v2.entities(diagram),
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
            var excluded = {
                "OwnerId": true,
                "CreatedById": true,
                "LastModifiedById": true
            };
            if (level < 5) {
                if (parentRelationshipsInDiagram[entity.apiName]) {
                    parentRelationshipsInDiagram[entity.apiName].forEach(function (parentRelationship) {
                        if (!excluded[parentRelationship.field]) {
                            var pathToParent = descendentPath.slice(0); // clone the path passed in
                            pathToParent.push(parentRelationship.relationshipNameFromChild);
                            descendantPaths[parentRelationship.parentEntity] = pathToParent;
                            // recurse up to parent here
                            soql.v2.ancestorEntityPaths(level + 1, descendantPaths, entitiesInDiagramByAPIName[parentRelationship.parentEntity], pathToParent,
                                parentRelationshipsInDiagram, entitiesInDiagramByAPIName);
                        }
                    });
                }
            }
            return descendantPaths;
        },

        selectList: function (entity, prefix) {
            var selectList = "";
            var fields = "";
            entity.fields.forEach(function (field) {
                if (fields.length > 0) {
                    fields += ",";
                }
                if (prefix) {
                    fields += prefix + ".";
                }
                fields += field.apiName;
            });
            selectList += fields;
            if (selectList.length == 0) {
                if (prefix === undefined) {
                    selectList += "Id";
                } else {
                    selectList += prefix + ".Id";
                }
            }
            return selectList;
        },

        selectedFieldsFromEntity: function (entity) {
            var selected = [];
            entity.fields.forEach(function (field) {
                selected.push(field.apiName);
            });
            if (selected.length == 0) {
                selected.push("Id");
            }
            return selected;
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

}

module.exports = soql;
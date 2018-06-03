(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["pure"] = factory();
	else
		root["pure"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var all = {

    selectList: function selectList(entity, prefix) {
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

    selectedFieldsFromEntity: function selectedFieldsFromEntity(entity) {
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
    entities: function entities(diagram) {
        var result = [];
        diagram.groups.forEach(function (group) {
            group.entities.forEach(function (entity) {
                result.push(entity.value);
            });
        });
        return result;
    },

    diagramAsSelects: function diagramAsSelects(diagram, from) {

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
                                childEntity: entity.value
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
                var sl = all.selectList(entity);
                if (sl.length > 0) {
                    selectLists.push(sl);
                }
                selectedFields[from] = all.selectedFieldsFromEntity(entity);
            }
        });

        // generate parent joins, traversing up 5 levels
        if (parentRelationshipsInDiagram[from]) {
            var ancestorPaths = all.ancestorEntityPaths(0, {}, entitiesInDiagramByAPIName[from], [], parentRelationshipsInDiagram, entitiesInDiagramByAPIName);
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
                selectedFields[ancestorEntity] = all.selectedFieldsFromEntity(entitiesInDiagramByAPIName[ancestorEntity]);
                ancestorSelectLists.push(all.selectList(entitiesInDiagramByAPIName[ancestorEntity], prefix));
            }
            selectLists = selectLists.concat(ancestorSelectLists);
        }

        // generate child relationship joins, traversing down a single level
        if (childRelationshipsInDiagram[from]) {
            childRelationshipsInDiagram[from].forEach(function (childRelation) {
                var selectListForChildEntity = all.selectList(entitiesInDiagramByAPIName[childRelation.childEntity]);
                selectedFields[childRelation.childEntity] = all.selectedFieldsFromEntity(entitiesInDiagramByAPIName[childRelation.childEntity]);

                // TODO child joins can also traverse up 5 levels from the child entity

                var childSubQuery = "SELECT " + selectListForChildEntity + " FROM " + childRelation.relationshipNameToChild;
                selectLists.push("(" + childSubQuery + ")");
            });
        }

        return {
            entities: all.entities(diagram),
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
    ancestorEntityPaths: function ancestorEntityPaths(level, descendantPaths, entity, descendentPath, parentRelationshipsInDiagram, entitiesInDiagramByAPIName) {
        if (level < 5) {
            if (parentRelationshipsInDiagram[entity.value]) {
                parentRelationshipsInDiagram[entity.value].forEach(function (parentRelationship) {
                    var pathToParent = descendentPath.slice(0); // clone the path passed in
                    pathToParent.push(parentRelationship.relationshipNameFromChild);
                    descendantPaths[parentRelationship.parentEntity] = pathToParent;
                    // recurse up to parent here
                    all.ancestorEntityPaths(level + 1, descendantPaths, entitiesInDiagramByAPIName[parentRelationship.parentEntity], pathToParent, parentRelationshipsInDiagram, entitiesInDiagramByAPIName);
                });
            }
        }
        return descendantPaths;
    },

    diagramSelectsAsSOQL: function diagramSelectsAsSOQL(selectLists, from, newlines) {
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
};

module.exports = all;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var soql = __webpack_require__(0);

module.exports = {
    soql: soql,
    testFoo: function testFoo(c) {
        return "foo " + c;
    }
};

/***/ })
/******/ ]);
});
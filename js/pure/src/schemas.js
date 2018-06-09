// this schema was generated (and manually adjusted) from the sample using https://www.liquid-technologies.com/online-json-to-schema-converter
var persisted =
    {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "entities": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "fields": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["name", "fields"]
                }
            },
            "settings": {
                "type": "object",
                "properties": {
                    "showSelfRelations": {"type": "boolean"}
                },
                "required": []
            }
        },
        "required": ["entities", "settings"]
    };

// this schema was manually built
var view = {
    "type": "object",
    "properties": {
        "groups":
            {
                "type": "array", "required": true,
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "String", "required": true},
                        "entities": {
                            "type": "array",
                            "required": true,
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "String", "required": true},
                                    "id": {"type": "String", "required": true},
                                    "color": {"type": "String", "required": true},
                                    "fields": {
                                        "type": "array",
                                        "required": true,
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "name": {"type": "String", "required": true},
                                                "id": {"type": "String", "required": true},
                                                "type": {"type": "String", "required": true},
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        "relationships": {
            "type": "array", "required": true,
            "items": {
                "type": "object",
                "properties": {
                    "from": {"type": "string", "required": true},
                    "field": {"type": "string", "required": true},
                    "to": {"type": "string", "required": true},
                    "style": {"type": "string", "required": true},
                }
            }
        }
    }
};

module.exports = {
    persisted: persisted,
    view: view
};
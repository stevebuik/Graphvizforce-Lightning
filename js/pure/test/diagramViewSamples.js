// this file contains the JSON schema for a view object i.e. the shape of the data expected by the Mustache template
// and enough valid samples to visually check each feature of the diagram.
// the schema is used to check samples in this file as well as translations from persisted diagram samples.

var samples =
    {
        "account_contact":
            {
                "groups": [{
                    "name": "",
                    "entities": [
                        {
                            "name": "Account",
                            "id": "Account",
                            "color": "black",
                            "fields": [
                                {
                                    "name": "Phone",
                                    "id": "Phone",
                                    "type": "String"
                                },
                                {
                                    "name": "Email",
                                    "id": "Email",
                                    "type": "String"
                                },
                                {
                                    "name": "Parent Account",
                                    "id": "Parent",
                                    "type": "Id"
                                }]
                        },
                        {
                            "name": "Contact",
                            "id": "Contact",
                            "color": "lightgrey",
                            "fields": [
                                {
                                    "name": "Phone",
                                    "id": "Phone",
                                    "type": "String"
                                },
                                {
                                    "name": "Account",
                                    "id": "AccountId",
                                    "type": "Id"
                                }]
                        }]
                }],
                "relationships": [
                    {
                        "from": "Contact",
                        "field": "AccountId",
                        "to": "Account",
                        "style": "solid"
                    },
                    {
                        "from": "Account",
                        "field": "Parent",
                        "to": "Account",
                        "style": "dashed"
                    }

                ]
            }
    };

var schema = {
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
    samples: samples,
    schema: schema
};




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

module.exports = {
    samples: samples
};




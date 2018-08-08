// this file contains samples of diagrams persisted in the custom object
// these objects are translated into a "view" object when being rendered to graphviz
// they're also translated to SOQL
// to create/update them, just create a diagram in the Lightning client and then copy the JSON from the custom object record

exports.account_contact_user =
    {
        "name": "AccountContactUser",
        "entities": [
            {
                "apiName": "Account",
                "fields": []
            },
            {
                "apiName": "Contact",
                "fields": []
            },
            {
                "apiName": "User",
                "fields": []
            }],
        "groups": [{"name": "ContainerGroup", "entities": ["Account", "Contact", "User"]}],
        "settings": {
            "showStandardUserRelationships": false,
            "showSelfRelations": false,
            "obscureEntities": []
        },
        "id": "a01p0000006pVQQAA2"
    };

exports.account_contact_feed2 =
    {
        "name": "Customer Support",
        "id": "a000l000009yeCLAAY",
        "entities":
            [
                // all references (even fields) to SFDC meta-data are stored as objects
                // so that they can have useful keys i.e. extra settings added later

                // not in alpha order, to test sorting of view model output
                {
                    "apiName": "Contact",
                    "fields": [
                        {"apiName": "LastName"},
                        {"apiName": "FirstName"},
                        {"apiName": "AccountId"} // auto-added by reference, but only one should be visible
                    ]
                },
                {
                    "apiName": "Account",
                    "fields": [
                        {"apiName": "Name"},
                        {"apiName": "Type"}
                    ]
                },
                {
                    "apiName": "ContactFeed",
                    "fields": [
                        {"apiName": "Type"},
                        {"apiName": "CreatedDate"}
                    ]
                }
            ],
        // when no groups are present, the render will show all entities from above
        "groups": [
            {
                "name": "Base",
                "entities": ["Account", "Contact"]
            },
            {
                "name": "Social",
                "entities": ["ContactFeed"]
            }
        ],
        "settings": {
            "showSelfRelations": true,
            "obscureEntities": ["ContactFeed"],
            "from": "Account"
        }
    };

exports.master_detail_relationship =
    {
        "name": "Master Detail Sample",
        "id": "a000l000009yeCLAAY",
        "entities":
            [
                // all references (even fields) to SFDC meta-data are stored as objects
                // so that they can have useful keys i.e. extra settings added later

                // not in alpha order, to test sorting of view model output
                {
                    "apiName": "Contact",
                    "fields": [
                        {"apiName": "LastName"},
                        {"apiName": "FirstName"},
                        {"apiName": "AccountId"} // auto-added by reference, but only one should be visible
                    ]
                },
                {
                    "apiName": "Account",
                    "fields": [
                        {"apiName": "Name"},
                        {"apiName": "Type"}
                    ]
                },
                {
                    "apiName": "MasterObject__c",
                    "fields": [
                        {"apiName": "Name"},
                        {"apiName": "CreatedDate"}
                    ]
                },
                {
                    "apiName": "DetailObject__c",
                    "fields": [
                        {"apiName": "Name"},
                        {"apiName": "MasterParent__c"},
                        {"apiName": "CreatedDate"}
                    ]
                },
            ],
        // when no groups are present, the render will show all entities from above
        "groups": [
            {
                "name": "Base",
                "entities": ["Account", "Contact"]
            },
            {
                "name": "Master Detail",
                "entities": ["MasterObject__c", "DetailObject__c"]
            }
        ],
        "settings": {
            "showSelfRelations": true,
            "obscureEntities": ["MasterObject__c"]
        }
    };
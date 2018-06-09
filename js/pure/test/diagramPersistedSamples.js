// this file contains samples of diagrams persisted in the custom object
// these objects are translated into a "view" object when being rendered to graphviz
// they're also translated to SOQL
// to create/update them, just create a diagram in the Lightning client and then copy the JSON from the custom object record

exports.account_contact_feed_case2 =
    {
        "entities":
            [
                {
                    "name": "Account",
                    "fields": ["Name", "Type"]
                },
                {
                    "name": "Contact",
                    "fields": ["FirstName", "LastName"]
                },
                {
                    "name": "ContactFeed",
                    "fields": ["ParentId"]
                }
            ],
        "settings": {"showSelfRelations": true}
    };

exports.account_contact_feed_case =
    {
        "visible": true,
        "value": "fff",
        "recordId": "a000l000009yeCLAAY",
        "label": "fff",
        "groups": [{
            "value": "ContainerGroup",
            "label": "ContainerGroup",
            "entities": [{
                "label": "Account",
                "value": "Account",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "ChildAccounts",
                    "childAPIName": "Account"
                }, {
                    "relationshipName": "AccountCleanInfos",
                    "childAPIName": "AccountCleanInfo"
                }, {
                    "relationshipName": "AccountContactRoles",
                    "childAPIName": "AccountContactRole"
                }, {"relationshipName": "Feeds", "childAPIName": "AccountFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "AccountHistory"
                }, {
                    "relationshipName": "AccountPartnersFrom",
                    "childAPIName": "AccountPartner"
                }, {
                    "relationshipName": "AccountPartnersTo",
                    "childAPIName": "AccountPartner"
                }, {
                    "relationshipName": "Shares",
                    "childAPIName": "AccountShare"
                }, {
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {"relationshipName": "Assets", "childAPIName": "Asset"}, {
                    "relationshipName": "ProvidedAssets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "ServicedAssets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "AssociatedLocations",
                    "childAPIName": "AssociatedLocation"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {"relationshipName": "Attachments", "childAPIName": "Attachment"}, {
                    "relationshipName": "Cases",
                    "childAPIName": "Case"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "Contacts",
                    "childAPIName": "Contact"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {
                    "relationshipName": "Contracts",
                    "childAPIName": "Contract"
                }, {
                    "relationshipName": "DuplicateRecordItems",
                    "childAPIName": "DuplicateRecordItem"
                }, {
                    "relationshipName": "Emails",
                    "childAPIName": "EmailMessage"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "MaintenancePlans",
                    "childAPIName": "MaintenancePlan"
                }, {"relationshipName": "Notes", "childAPIName": "Note"}, {
                    "relationshipName": "NotesAndAttachments",
                    "childAPIName": "NoteAndAttachment"
                }, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "Opportunities",
                    "childAPIName": "Opportunity"
                }, {
                    "relationshipName": "OpportunityPartnersTo",
                    "childAPIName": "OpportunityPartner"
                }, {"relationshipName": "Orders", "childAPIName": "Order"}, {
                    "relationshipName": "PartnersFrom",
                    "childAPIName": "Partner"
                }, {
                    "relationshipName": "PartnersTo",
                    "childAPIName": "Partner"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ProductRequests",
                    "childAPIName": "ProductRequest"
                }, {
                    "relationshipName": "ProductRequestLineItems",
                    "childAPIName": "ProductRequestLineItem"
                }, {
                    "relationshipName": "ResourcePreferences",
                    "childAPIName": "ResourcePreference"
                }, {
                    "relationshipName": "ServiceAppointments",
                    "childAPIName": "ServiceAppointment"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {
                    "relationshipName": "RelatedObjects",
                    "childAPIName": "WorkFeedbackRequest"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Account ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Master Record ID",
                    "value": "MasterRecordId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "MasterRecord",
                        "referenceFieldAPIName": "MasterRecordId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Name",
                    "value": "Name",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Type",
                    "value": "Type",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Parent Account ID",
                    "value": "ParentId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Parent",
                        "referenceFieldAPIName": "ParentId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Street",
                    "value": "BillingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing City",
                    "value": "BillingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing State/Province",
                    "value": "BillingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Zip/Postal Code",
                    "value": "BillingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Country",
                    "value": "BillingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Latitude",
                    "value": "BillingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Longitude",
                    "value": "BillingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Geocode Accuracy",
                    "value": "BillingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Address",
                    "value": "BillingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Street",
                    "value": "ShippingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping City",
                    "value": "ShippingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping State/Province",
                    "value": "ShippingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Zip/Postal Code",
                    "value": "ShippingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Country",
                    "value": "ShippingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Latitude",
                    "value": "ShippingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Longitude",
                    "value": "ShippingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Geocode Accuracy",
                    "value": "ShippingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Address",
                    "value": "ShippingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Phone",
                    "value": "Phone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Fax",
                    "value": "Fax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Number",
                    "value": "AccountNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Website",
                    "value": "Website",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Photo URL",
                    "value": "PhotoUrl",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "SIC Code",
                    "value": "Sic",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Industry",
                    "value": "Industry",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Annual Revenue",
                    "value": "AnnualRevenue",
                    "type": "CURRENCY",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Employees",
                    "value": "NumberOfEmployees",
                    "type": "INTEGER",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Ownership",
                    "value": "Ownership",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Ticker Symbol",
                    "value": "TickerSymbol",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Account Rating",
                    "value": "Rating",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Site",
                    "value": "Site",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Activity",
                    "value": "LastActivityDate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Data.com Key",
                    "value": "Jigsaw",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Jigsaw Company ID",
                    "value": "JigsawCompanyId",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Clean Status",
                    "value": "CleanStatus",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Source",
                    "value": "AccountSource",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "D-U-N-S Number",
                    "value": "DunsNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Tradestyle",
                    "value": "Tradestyle",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "NAICS Code",
                    "value": "NaicsCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "NAICS Description",
                    "value": "NaicsDesc",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Year Started",
                    "value": "YearStarted",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "SIC Description",
                    "value": "SicDesc",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "D&B Company ID",
                    "value": "DandbCompanyId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "DandbCompany",
                        "referenceFieldAPIName": "DandbCompanyId",
                        "parentLabel": "D&B Company",
                        "parentAPIName": "DandBCompany"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Operating Hour ID",
                    "value": "OperatingHoursId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "OperatingHours",
                        "referenceFieldAPIName": "OperatingHoursId",
                        "parentLabel": "Operating Hours",
                        "parentAPIName": "OperatingHours"
                    }],
                    "selected": false,
                    "visible": true
                }]
            }, {
                "label": "Case",
                "value": "Case",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {"relationshipName": "Attachments", "childAPIName": "Attachment"}, {
                    "relationshipName": "Cases",
                    "childAPIName": "Case"
                }, {
                    "relationshipName": "CaseComments",
                    "childAPIName": "CaseComment"
                }, {
                    "relationshipName": "CaseContactRoles",
                    "childAPIName": "CaseContactRole"
                }, {"relationshipName": "Feeds", "childAPIName": "CaseFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "CaseHistory"
                }, {"relationshipName": "Shares", "childAPIName": "CaseShare"}, {
                    "relationshipName": "CaseSolutions",
                    "childAPIName": "CaseSolution"
                }, {
                    "relationshipName": "TeamMembers",
                    "childAPIName": "CaseTeamMember"
                }, {
                    "relationshipName": "TeamTemplateRecords",
                    "childAPIName": "CaseTeamTemplateRecord"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {"relationshipName": "EmailMessages", "childAPIName": "EmailMessage"}, {
                    "relationshipName": "Emails",
                    "childAPIName": "EmailMessage"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ProductRequests",
                    "childAPIName": "ProductRequest"
                }, {
                    "relationshipName": "ProductRequestLineItems",
                    "childAPIName": "ProductRequestLineItem"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Case ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Number",
                    "value": "CaseNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Contact ID",
                    "value": "ContactId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Contact",
                        "referenceFieldAPIName": "ContactId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account ID",
                    "value": "AccountId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Account",
                        "referenceFieldAPIName": "AccountId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Asset ID",
                    "value": "AssetId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Asset",
                        "referenceFieldAPIName": "AssetId",
                        "parentLabel": "Asset",
                        "parentAPIName": "Asset"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Business Hours ID",
                    "value": "BusinessHoursId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "BusinessHours",
                        "referenceFieldAPIName": "BusinessHoursId",
                        "parentLabel": "Business Hours",
                        "parentAPIName": "BusinessHours"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Parent Case ID",
                    "value": "ParentId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Parent",
                        "referenceFieldAPIName": "ParentId",
                        "parentLabel": "Case",
                        "parentAPIName": "Case"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Name",
                    "value": "SuppliedName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Address",
                    "value": "SuppliedEmail",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Phone",
                    "value": "SuppliedPhone",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Company",
                    "value": "SuppliedCompany",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Type",
                    "value": "Type",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Status",
                    "value": "Status",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Reason",
                    "value": "Reason",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Origin",
                    "value": "Origin",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Subject",
                    "value": "Subject",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Priority",
                    "value": "Priority",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed",
                    "value": "IsClosed",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed Date",
                    "value": "ClosedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Escalated",
                    "value": "IsEscalated",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "Group",
                        "parentAPIName": "Group"
                    }, {
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed When Created",
                    "value": "IsClosedOnCreate",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Phone",
                    "value": "ContactPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Mobile",
                    "value": "ContactMobile",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Email",
                    "value": "ContactEmail",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Fax",
                    "value": "ContactFax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }]
            }, {
                "label": "Contact",
                "value": "Contact",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "AcceptedEventRelations",
                    "childAPIName": "AcceptedEventRelation"
                }, {
                    "relationshipName": "AccountContactRoles",
                    "childAPIName": "AccountContactRole"
                }, {
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {
                    "relationshipName": "Assets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {
                    "relationshipName": "Attachments",
                    "childAPIName": "Attachment"
                }, {
                    "relationshipName": "CampaignMembers",
                    "childAPIName": "CampaignMember"
                }, {"relationshipName": "Cases", "childAPIName": "Case"}, {
                    "relationshipName": "CaseContactRoles",
                    "childAPIName": "CaseContactRole"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "ContactCleanInfos",
                    "childAPIName": "ContactCleanInfo"
                }, {"relationshipName": "Feeds", "childAPIName": "ContactFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "ContactHistory"
                }, {
                    "relationshipName": "Shares",
                    "childAPIName": "ContactShare"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {
                    "relationshipName": "ContractsSigned",
                    "childAPIName": "Contract"
                }, {
                    "relationshipName": "ContractContactRoles",
                    "childAPIName": "ContractContactRole"
                }, {
                    "relationshipName": "DeclinedEventRelations",
                    "childAPIName": "DeclinedEventRelation"
                }, {
                    "relationshipName": "DuplicateRecordItems",
                    "childAPIName": "DuplicateRecordItem"
                }, {
                    "relationshipName": "EmailMessageRelations",
                    "childAPIName": "EmailMessageRelation"
                }, {
                    "relationshipName": "EmailStatuses",
                    "childAPIName": "EmailStatus"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "EventRelations",
                    "childAPIName": "EventRelation"
                }, {
                    "relationshipName": "MaintenancePlans",
                    "childAPIName": "MaintenancePlan"
                }, {"relationshipName": "Notes", "childAPIName": "Note"}, {
                    "relationshipName": "NotesAndAttachments",
                    "childAPIName": "NoteAndAttachment"
                }, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "OpportunityContactRoles",
                    "childAPIName": "OpportunityContactRole"
                }, {
                    "relationshipName": "OutgoingEmailRelations",
                    "childAPIName": "OutgoingEmailRelation"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ServiceAppointments",
                    "childAPIName": "ServiceAppointment"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {
                    "relationshipName": "UndecidedEventRelations",
                    "childAPIName": "UndecidedEventRelation"
                }, {
                    "relationshipName": "RelatedObjects",
                    "childAPIName": "WorkFeedbackRequest"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Contact ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Master Record ID",
                    "value": "MasterRecordId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "MasterRecord",
                        "referenceFieldAPIName": "MasterRecordId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account ID",
                    "value": "AccountId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Account",
                        "referenceFieldAPIName": "AccountId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Name",
                    "value": "LastName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "First Name",
                    "value": "FirstName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Salutation",
                    "value": "Salutation",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Full Name",
                    "value": "Name",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Street",
                    "value": "OtherStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other City",
                    "value": "OtherCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other State/Province",
                    "value": "OtherState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Zip/Postal Code",
                    "value": "OtherPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Country",
                    "value": "OtherCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Latitude",
                    "value": "OtherLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Longitude",
                    "value": "OtherLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Geocode Accuracy",
                    "value": "OtherGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Address",
                    "value": "OtherAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Street",
                    "value": "MailingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing City",
                    "value": "MailingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing State/Province",
                    "value": "MailingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Zip/Postal Code",
                    "value": "MailingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Country",
                    "value": "MailingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Latitude",
                    "value": "MailingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Longitude",
                    "value": "MailingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Geocode Accuracy",
                    "value": "MailingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Address",
                    "value": "MailingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Business Phone",
                    "value": "Phone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Business Fax",
                    "value": "Fax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mobile Phone",
                    "value": "MobilePhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Home Phone",
                    "value": "HomePhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Phone",
                    "value": "OtherPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Asst. Phone",
                    "value": "AssistantPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Reports To ID",
                    "value": "ReportsToId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "ReportsTo",
                        "referenceFieldAPIName": "ReportsToId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email",
                    "value": "Email",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Title",
                    "value": "Title",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Department",
                    "value": "Department",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Assistant's Name",
                    "value": "AssistantName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Lead Source",
                    "value": "LeadSource",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Birthdate",
                    "value": "Birthdate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Opt Out",
                    "value": "HasOptedOutOfEmail",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Fax Opt Out",
                    "value": "HasOptedOutOfFax",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Do Not Call",
                    "value": "DoNotCall",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Activity",
                    "value": "LastActivityDate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Stay-in-Touch Request Date",
                    "value": "LastCURequestDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Stay-in-Touch Save Date",
                    "value": "LastCUUpdateDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Bounced Reason",
                    "value": "EmailBouncedReason",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Bounced Date",
                    "value": "EmailBouncedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Is Email Bounced",
                    "value": "IsEmailBounced",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Photo URL",
                    "value": "PhotoUrl",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Data.com Key",
                    "value": "Jigsaw",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Jigsaw Contact ID",
                    "value": "JigsawContactId",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Clean Status",
                    "value": "CleanStatus",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }]
            }, {
                "label": "Contact Feed",
                "value": "ContactFeed",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "FeedAttachments",
                    "childAPIName": "FeedAttachment"
                }, {
                    "relationshipName": "FeedComments",
                    "childAPIName": "FeedComment"
                }, {"relationshipName": "FeedLikes", "childAPIName": "FeedLike"}, {
                    "relationshipName": "FeedSignals",
                    "childAPIName": "FeedSignal"
                }, {"relationshipName": "FeedTrackedChanges", "childAPIName": "FeedTrackedChange"}],
                "attributes": [{
                    "label": "Feed Item ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Parent ID",
                    "value": "ParentId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Parent",
                        "referenceFieldAPIName": "ParentId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Feed Item Type",
                    "value": "Type",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Comment Count",
                    "value": "CommentCount",
                    "type": "INTEGER",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Like Count",
                    "value": "LikeCount",
                    "type": "INTEGER",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Title",
                    "value": "Title",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Body",
                    "value": "Body",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Link Url",
                    "value": "LinkUrl",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Is Rich Text",
                    "value": "IsRichText",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Related Record ID",
                    "value": "RelatedRecordId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": null,
                        "referenceFieldAPIName": "RelatedRecordId",
                        "parentLabel": "Content Version",
                        "parentAPIName": "ContentVersion"
                    }, {
                        "relationshipName": null,
                        "referenceFieldAPIName": "RelatedRecordId",
                        "parentLabel": "Thanks",
                        "parentAPIName": "WorkThanks"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "InsertedBy ID",
                    "value": "InsertedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "InsertedBy",
                        "referenceFieldAPIName": "InsertedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }]
            }]
        }]
    };

exports.account_contact_case =
    {
        "visible": true,
        "value": "fff",
        "recordId": "a000l000009yeCLAAY",
        "label": "fff",
        "groups": [{
            "value": "ContainerGroup",
            "label": "ContainerGroup",
            "entities": [{
                "label": "Account",
                "value": "Account",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "ChildAccounts",
                    "childAPIName": "Account"
                }, {
                    "relationshipName": "AccountCleanInfos",
                    "childAPIName": "AccountCleanInfo"
                }, {
                    "relationshipName": "AccountContactRoles",
                    "childAPIName": "AccountContactRole"
                }, {"relationshipName": "Feeds", "childAPIName": "AccountFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "AccountHistory"
                }, {
                    "relationshipName": "AccountPartnersFrom",
                    "childAPIName": "AccountPartner"
                }, {
                    "relationshipName": "AccountPartnersTo",
                    "childAPIName": "AccountPartner"
                }, {
                    "relationshipName": "Shares",
                    "childAPIName": "AccountShare"
                }, {
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {"relationshipName": "Assets", "childAPIName": "Asset"}, {
                    "relationshipName": "ProvidedAssets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "ServicedAssets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "AssociatedLocations",
                    "childAPIName": "AssociatedLocation"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {"relationshipName": "Attachments", "childAPIName": "Attachment"}, {
                    "relationshipName": "Cases",
                    "childAPIName": "Case"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "Contacts",
                    "childAPIName": "Contact"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {
                    "relationshipName": "Contracts",
                    "childAPIName": "Contract"
                }, {
                    "relationshipName": "DuplicateRecordItems",
                    "childAPIName": "DuplicateRecordItem"
                }, {
                    "relationshipName": "Emails",
                    "childAPIName": "EmailMessage"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "MaintenancePlans",
                    "childAPIName": "MaintenancePlan"
                }, {"relationshipName": "Notes", "childAPIName": "Note"}, {
                    "relationshipName": "NotesAndAttachments",
                    "childAPIName": "NoteAndAttachment"
                }, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "Opportunities",
                    "childAPIName": "Opportunity"
                }, {
                    "relationshipName": "OpportunityPartnersTo",
                    "childAPIName": "OpportunityPartner"
                }, {"relationshipName": "Orders", "childAPIName": "Order"}, {
                    "relationshipName": "PartnersFrom",
                    "childAPIName": "Partner"
                }, {
                    "relationshipName": "PartnersTo",
                    "childAPIName": "Partner"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ProductRequests",
                    "childAPIName": "ProductRequest"
                }, {
                    "relationshipName": "ProductRequestLineItems",
                    "childAPIName": "ProductRequestLineItem"
                }, {
                    "relationshipName": "ResourcePreferences",
                    "childAPIName": "ResourcePreference"
                }, {
                    "relationshipName": "ServiceAppointments",
                    "childAPIName": "ServiceAppointment"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {
                    "relationshipName": "RelatedObjects",
                    "childAPIName": "WorkFeedbackRequest"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Account ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Master Record ID",
                    "value": "MasterRecordId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "MasterRecord",
                        "referenceFieldAPIName": "MasterRecordId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Name",
                    "value": "Name",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Type",
                    "value": "Type",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Parent Account ID",
                    "value": "ParentId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Parent",
                        "referenceFieldAPIName": "ParentId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Street",
                    "value": "BillingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing City",
                    "value": "BillingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing State/Province",
                    "value": "BillingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Zip/Postal Code",
                    "value": "BillingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Country",
                    "value": "BillingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Latitude",
                    "value": "BillingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Longitude",
                    "value": "BillingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Geocode Accuracy",
                    "value": "BillingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Billing Address",
                    "value": "BillingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Street",
                    "value": "ShippingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping City",
                    "value": "ShippingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping State/Province",
                    "value": "ShippingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Zip/Postal Code",
                    "value": "ShippingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Country",
                    "value": "ShippingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Latitude",
                    "value": "ShippingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Longitude",
                    "value": "ShippingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Geocode Accuracy",
                    "value": "ShippingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Shipping Address",
                    "value": "ShippingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Phone",
                    "value": "Phone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Fax",
                    "value": "Fax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Number",
                    "value": "AccountNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Website",
                    "value": "Website",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Photo URL",
                    "value": "PhotoUrl",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "SIC Code",
                    "value": "Sic",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Industry",
                    "value": "Industry",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Annual Revenue",
                    "value": "AnnualRevenue",
                    "type": "CURRENCY",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Employees",
                    "value": "NumberOfEmployees",
                    "type": "INTEGER",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Ownership",
                    "value": "Ownership",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Ticker Symbol",
                    "value": "TickerSymbol",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Account Rating",
                    "value": "Rating",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Site",
                    "value": "Site",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Activity",
                    "value": "LastActivityDate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Data.com Key",
                    "value": "Jigsaw",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Jigsaw Company ID",
                    "value": "JigsawCompanyId",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Clean Status",
                    "value": "CleanStatus",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account Source",
                    "value": "AccountSource",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "D-U-N-S Number",
                    "value": "DunsNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Tradestyle",
                    "value": "Tradestyle",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "NAICS Code",
                    "value": "NaicsCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "NAICS Description",
                    "value": "NaicsDesc",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Year Started",
                    "value": "YearStarted",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "SIC Description",
                    "value": "SicDesc",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "D&B Company ID",
                    "value": "DandbCompanyId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "DandbCompany",
                        "referenceFieldAPIName": "DandbCompanyId",
                        "parentLabel": "D&B Company",
                        "parentAPIName": "DandBCompany"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Operating Hour ID",
                    "value": "OperatingHoursId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "OperatingHours",
                        "referenceFieldAPIName": "OperatingHoursId",
                        "parentLabel": "Operating Hours",
                        "parentAPIName": "OperatingHours"
                    }],
                    "selected": false,
                    "visible": true
                }]
            }, {
                "label": "Case",
                "value": "Case",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {"relationshipName": "Attachments", "childAPIName": "Attachment"}, {
                    "relationshipName": "Cases",
                    "childAPIName": "Case"
                }, {
                    "relationshipName": "CaseComments",
                    "childAPIName": "CaseComment"
                }, {
                    "relationshipName": "CaseContactRoles",
                    "childAPIName": "CaseContactRole"
                }, {"relationshipName": "Feeds", "childAPIName": "CaseFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "CaseHistory"
                }, {"relationshipName": "Shares", "childAPIName": "CaseShare"}, {
                    "relationshipName": "CaseSolutions",
                    "childAPIName": "CaseSolution"
                }, {
                    "relationshipName": "TeamMembers",
                    "childAPIName": "CaseTeamMember"
                }, {
                    "relationshipName": "TeamTemplateRecords",
                    "childAPIName": "CaseTeamTemplateRecord"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {"relationshipName": "EmailMessages", "childAPIName": "EmailMessage"}, {
                    "relationshipName": "Emails",
                    "childAPIName": "EmailMessage"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ProductRequests",
                    "childAPIName": "ProductRequest"
                }, {
                    "relationshipName": "ProductRequestLineItems",
                    "childAPIName": "ProductRequestLineItem"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Case ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Number",
                    "value": "CaseNumber",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Contact ID",
                    "value": "ContactId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Contact",
                        "referenceFieldAPIName": "ContactId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account ID",
                    "value": "AccountId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Account",
                        "referenceFieldAPIName": "AccountId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Asset ID",
                    "value": "AssetId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Asset",
                        "referenceFieldAPIName": "AssetId",
                        "parentLabel": "Asset",
                        "parentAPIName": "Asset"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Business Hours ID",
                    "value": "BusinessHoursId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "BusinessHours",
                        "referenceFieldAPIName": "BusinessHoursId",
                        "parentLabel": "Business Hours",
                        "parentAPIName": "BusinessHours"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Parent Case ID",
                    "value": "ParentId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Parent",
                        "referenceFieldAPIName": "ParentId",
                        "parentLabel": "Case",
                        "parentAPIName": "Case"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Name",
                    "value": "SuppliedName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Address",
                    "value": "SuppliedEmail",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Phone",
                    "value": "SuppliedPhone",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Company",
                    "value": "SuppliedCompany",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Type",
                    "value": "Type",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Status",
                    "value": "Status",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Reason",
                    "value": "Reason",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Case Origin",
                    "value": "Origin",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Subject",
                    "value": "Subject",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Priority",
                    "value": "Priority",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed",
                    "value": "IsClosed",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed Date",
                    "value": "ClosedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Escalated",
                    "value": "IsEscalated",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "Group",
                        "parentAPIName": "Group"
                    }, {
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Closed When Created",
                    "value": "IsClosedOnCreate",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Phone",
                    "value": "ContactPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Mobile",
                    "value": "ContactMobile",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Email",
                    "value": "ContactEmail",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Fax",
                    "value": "ContactFax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }]
            }, {
                "label": "Contact",
                "value": "Contact",
                "isCustom": false,
                "visible": true,
                "children": [{
                    "relationshipName": "AcceptedEventRelations",
                    "childAPIName": "AcceptedEventRelation"
                }, {
                    "relationshipName": "AccountContactRoles",
                    "childAPIName": "AccountContactRole"
                }, {
                    "relationshipName": "ActivityHistories",
                    "childAPIName": "ActivityHistory"
                }, {
                    "relationshipName": "Assets",
                    "childAPIName": "Asset"
                }, {
                    "relationshipName": "AttachedContentDocuments",
                    "childAPIName": "AttachedContentDocument"
                }, {
                    "relationshipName": "Attachments",
                    "childAPIName": "Attachment"
                }, {
                    "relationshipName": "CampaignMembers",
                    "childAPIName": "CampaignMember"
                }, {"relationshipName": "Cases", "childAPIName": "Case"}, {
                    "relationshipName": "CaseContactRoles",
                    "childAPIName": "CaseContactRole"
                }, {
                    "relationshipName": "RecordAssociatedGroups",
                    "childAPIName": "CollaborationGroupRecord"
                }, {
                    "relationshipName": "CombinedAttachments",
                    "childAPIName": "CombinedAttachment"
                }, {
                    "relationshipName": "ContactCleanInfos",
                    "childAPIName": "ContactCleanInfo"
                }, {"relationshipName": "Feeds", "childAPIName": "ContactFeed"}, {
                    "relationshipName": "Histories",
                    "childAPIName": "ContactHistory"
                }, {
                    "relationshipName": "Shares",
                    "childAPIName": "ContactShare"
                }, {
                    "relationshipName": "ContentDocumentLinks",
                    "childAPIName": "ContentDocumentLink"
                }, {
                    "relationshipName": "ContractsSigned",
                    "childAPIName": "Contract"
                }, {
                    "relationshipName": "ContractContactRoles",
                    "childAPIName": "ContractContactRole"
                }, {
                    "relationshipName": "DeclinedEventRelations",
                    "childAPIName": "DeclinedEventRelation"
                }, {
                    "relationshipName": "DuplicateRecordItems",
                    "childAPIName": "DuplicateRecordItem"
                }, {
                    "relationshipName": "EmailMessageRelations",
                    "childAPIName": "EmailMessageRelation"
                }, {
                    "relationshipName": "EmailStatuses",
                    "childAPIName": "EmailStatus"
                }, {
                    "relationshipName": "FeedSubscriptionsForEntity",
                    "childAPIName": "EntitySubscription"
                }, {"relationshipName": "Events", "childAPIName": "Event"}, {
                    "relationshipName": "EventRelations",
                    "childAPIName": "EventRelation"
                }, {
                    "relationshipName": "MaintenancePlans",
                    "childAPIName": "MaintenancePlan"
                }, {"relationshipName": "Notes", "childAPIName": "Note"}, {
                    "relationshipName": "NotesAndAttachments",
                    "childAPIName": "NoteAndAttachment"
                }, {
                    "relationshipName": "OpenActivities",
                    "childAPIName": "OpenActivity"
                }, {
                    "relationshipName": "OpportunityContactRoles",
                    "childAPIName": "OpportunityContactRole"
                }, {
                    "relationshipName": "OutgoingEmailRelations",
                    "childAPIName": "OutgoingEmailRelation"
                }, {
                    "relationshipName": "ProcessInstances",
                    "childAPIName": "ProcessInstance"
                }, {
                    "relationshipName": "ProcessSteps",
                    "childAPIName": "ProcessInstanceHistory"
                }, {
                    "relationshipName": "ServiceAppointments",
                    "childAPIName": "ServiceAppointment"
                }, {"relationshipName": "Tasks", "childAPIName": "Task"}, {
                    "relationshipName": "TopicAssignments",
                    "childAPIName": "TopicAssignment"
                }, {
                    "relationshipName": "UndecidedEventRelations",
                    "childAPIName": "UndecidedEventRelation"
                }, {
                    "relationshipName": "RelatedObjects",
                    "childAPIName": "WorkFeedbackRequest"
                }, {"relationshipName": "WorkOrders", "childAPIName": "WorkOrder"}],
                "attributes": [{
                    "label": "Contact ID",
                    "value": "Id",
                    "type": "ID",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Deleted",
                    "value": "IsDeleted",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Master Record ID",
                    "value": "MasterRecordId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "MasterRecord",
                        "referenceFieldAPIName": "MasterRecordId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Account ID",
                    "value": "AccountId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Account",
                        "referenceFieldAPIName": "AccountId",
                        "parentLabel": "Account",
                        "parentAPIName": "Account"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Name",
                    "value": "LastName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "First Name",
                    "value": "FirstName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Salutation",
                    "value": "Salutation",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Full Name",
                    "value": "Name",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Street",
                    "value": "OtherStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other City",
                    "value": "OtherCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other State/Province",
                    "value": "OtherState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Zip/Postal Code",
                    "value": "OtherPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Country",
                    "value": "OtherCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Latitude",
                    "value": "OtherLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Longitude",
                    "value": "OtherLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Geocode Accuracy",
                    "value": "OtherGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Address",
                    "value": "OtherAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Street",
                    "value": "MailingStreet",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing City",
                    "value": "MailingCity",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing State/Province",
                    "value": "MailingState",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Zip/Postal Code",
                    "value": "MailingPostalCode",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Country",
                    "value": "MailingCountry",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Latitude",
                    "value": "MailingLatitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Longitude",
                    "value": "MailingLongitude",
                    "type": "DOUBLE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Geocode Accuracy",
                    "value": "MailingGeocodeAccuracy",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mailing Address",
                    "value": "MailingAddress",
                    "type": "ADDRESS",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Business Phone",
                    "value": "Phone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Business Fax",
                    "value": "Fax",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Mobile Phone",
                    "value": "MobilePhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Home Phone",
                    "value": "HomePhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Other Phone",
                    "value": "OtherPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Asst. Phone",
                    "value": "AssistantPhone",
                    "type": "PHONE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Reports To ID",
                    "value": "ReportsToId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "ReportsTo",
                        "referenceFieldAPIName": "ReportsToId",
                        "parentLabel": "Contact",
                        "parentAPIName": "Contact"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email",
                    "value": "Email",
                    "type": "EMAIL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Title",
                    "value": "Title",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Department",
                    "value": "Department",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Assistant's Name",
                    "value": "AssistantName",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Lead Source",
                    "value": "LeadSource",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Birthdate",
                    "value": "Birthdate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Contact Description",
                    "value": "Description",
                    "type": "TEXTAREA",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Owner ID",
                    "value": "OwnerId",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "Owner",
                        "referenceFieldAPIName": "OwnerId",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Opt Out",
                    "value": "HasOptedOutOfEmail",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Fax Opt Out",
                    "value": "HasOptedOutOfFax",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Do Not Call",
                    "value": "DoNotCall",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Created Date",
                    "value": "CreatedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": true,
                    "visible": true
                }, {
                    "label": "Created By ID",
                    "value": "CreatedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "CreatedBy",
                        "referenceFieldAPIName": "CreatedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified Date",
                    "value": "LastModifiedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Modified By ID",
                    "value": "LastModifiedById",
                    "type": "REFERENCE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": [{
                        "relationshipName": "LastModifiedBy",
                        "referenceFieldAPIName": "LastModifiedById",
                        "parentLabel": "User",
                        "parentAPIName": "User"
                    }],
                    "selected": false,
                    "visible": true
                }, {
                    "label": "System Modstamp",
                    "value": "SystemModstamp",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Activity",
                    "value": "LastActivityDate",
                    "type": "DATE",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Stay-in-Touch Request Date",
                    "value": "LastCURequestDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Stay-in-Touch Save Date",
                    "value": "LastCUUpdateDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Viewed Date",
                    "value": "LastViewedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Last Referenced Date",
                    "value": "LastReferencedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Bounced Reason",
                    "value": "EmailBouncedReason",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Email Bounced Date",
                    "value": "EmailBouncedDate",
                    "type": "DATETIME",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Is Email Bounced",
                    "value": "IsEmailBounced",
                    "type": "BOOLEAN",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Photo URL",
                    "value": "PhotoUrl",
                    "type": "URL",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Data.com Key",
                    "value": "Jigsaw",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Jigsaw Contact ID",
                    "value": "JigsawContactId",
                    "type": "STRING",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }, {
                    "label": "Clean Status",
                    "value": "CleanStatus",
                    "type": "PICKLIST",
                    "isCustom": false,
                    "isMDOrCascadeDelete": false,
                    "references": null,
                    "selected": false,
                    "visible": true
                }]
            }]
        }]
    };
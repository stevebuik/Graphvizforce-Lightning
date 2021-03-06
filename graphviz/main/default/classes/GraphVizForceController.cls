public without sharing class GraphVizForceController {

    @AuraEnabled
    public static String saveDiagram(String content, Id recordId){
        Graphviz_Diagram__c diagram = new Graphviz_Diagram__c(Content__c = content);
        if(recordId != null){
            diagram.Id = recordId;
        }
        upsert diagram;
        LightningUtility.ResultWrapper resultWrapper = new LightningUtility.ResultWrapper();
        resultWrapper.result = diagram;
        return JSON.serialize(resultWrapper);
    }

    @AuraEnabled
    public static String deleteDiagram(Id recordId){
        Graphviz_Diagram__c diagram = new Graphviz_Diagram__c(Id = recordId);
        delete diagram;
        LightningUtility.ResultWrapper resultWrapper = new LightningUtility.ResultWrapper();
        resultWrapper.result = true;
        return JSON.serialize(resultWrapper);
    }

    @AuraEnabled
    public static Map<String, String> getConfig() {
        Map<String, String> result = new Map<String, String>();
        for (GraphvizConfig__c config : [select Name__c, Value__c from GraphvizConfig__c]) {
            result.put(config.Name__c, config.Value__c);
        }
        return result;
    }

    @AuraEnabled
    public static List<Graphviz_Diagram__c> loadDiagrams(){
        return [SELECT Id, Content__c FROM Graphviz_Diagram__c WHERE OwnerId = :UserInfo.getUserId()];
    }

    @AuraEnabled
    public static String loadSchema(){
        String result = JSON.serialize(loadSchemaWrappers());
        return result;
    }

    @TestVisible
    private static List<ChildRelationshipWrapper> getChildRelationships(DescribeSObjectResult describe) {

        List<ChildRelationshipWrapper> result = new List<ChildRelationshipWrapper>();

        // start with child relationships described for top level objects
        List<ChildRelationship> childRelationships = describe.getChildRelationships();
        if (!childRelationships.isEmpty()) {
            for (ChildRelationship rel : childRelationships) {
                // only return relationships with names since they are used in diagram arrows
                // and SOQL joins and these features don't work without a name
                if (rel.getRelationshipName() != NULL) {
                    ChildRelationshipWrapper wrapper = new ChildRelationshipWrapper();

                    wrapper.childAPIName = rel.getChildSObject().getDescribe().getName();
                    wrapper.childFieldAPIName = rel.getField().getDescribe().getName();
                    wrapper.isCascadeDelete = rel.isCascadeDelete();
                    wrapper.relationshipName = rel.getRelationshipName();

                    result.add(wrapper);
                }
            }
        }

        return result;
    }

    public static List<ObjectWrapper> loadSchemaWrappers(){
        List<ObjectWrapper> objectWrappers = new List<ObjectWrapper>();
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        if(!gd.isEmpty()){
            for(Schema.SObjectType sObjType : gd.values()){

                // Describe SObject
                Schema.DescribeSObjectResult sObjResult = sObjType.getDescribe();

                // Create Object Wrapper
                ObjectWrapper objWrapper = new ObjectWrapper();
                objWrapper.label = sObjResult.getLabel();
                objWrapper.apiName = sObjResult.getName();
                objWrapper.isCustom = sObjResult.isCustom();
                objWrapper.childRelationships = getChildRelationships(sObjResult);

                // Describe Fields
                Map<String, Schema.SObjectField> fieldsMap = sObjResult.fields.getMap();
                List<Schema.SObjectField> fieldList = fieldsMap.values();
                if(!fieldList.isEmpty()){
                    objWrapper.fields = new List<FieldWrapper>();
                    for(Schema.SObjectField field : fieldList){
                        Schema.DescribeFieldResult fieldResult = field.getDescribe();
                        FieldWrapper fieldWrapper = new FieldWrapper();
                        fieldWrapper.label = fieldResult.getLabel();
                        fieldWrapper.apiName = fieldResult.getName();
                        fieldWrapper.type = fieldResult.getType().name();
                        fieldWrapper.isCustom = fieldResult.isCustom();
                        fieldWrapper.isMDOrCascadeDelete = fieldResult.isCascadeDelete();

                        // If the field is a reference field, get the list of reference field api names
                        List<Schema.sObjectType> parentSObjectTypes = fieldResult.getReferenceTo();
                        if(!parentSObjectTypes.isEmpty()){
                            fieldWrapper.referenceFields = new List<RelationshipWrapper>();
                            for(Schema.SObjectType parentSObjectType : parentSObjectTypes){
                                Schema.DescribeSObjectResult parentSObjectResult = parentSObjectType.getDescribe();
                                RelationshipWrapper rWrapper = new RelationshipWrapper();
                                rWrapper.parentLabel = parentSObjectResult.getLabel();
                                rWrapper.parentAPIName = parentSObjectResult.getName();
                                rWrapper.referenceFieldAPIName = fieldResult.getName();
                                rWrapper.relationshipName = fieldResult.getRelationshipName();
                                fieldWrapper.referenceFields.add(rWrapper);
                            }
                        }

                        objWrapper.fields.add(fieldWrapper);
                    }
                }
                objectWrappers.add(objWrapper);
            }
        }
        return objectWrappers;
    }

    public class ObjectWrapper{
        public String label;
        public String apiName;
        public Boolean isCustom;
        public List<FieldWrapper> fields;
        public List<ChildRelationshipWrapper> childRelationships;
    }

    public class FieldWrapper{
        public String label;
        public String apiName;
        public String type;
        public Boolean isCustom;
        public Boolean isMDOrCascadeDelete;
        public List<RelationshipWrapper> referenceFields;
    }

    public class ChildRelationshipWrapper {
        public String relationshipName;
        public String childAPIName;
        public String childFieldAPIName;
        public Boolean isCascadeDelete;
    }

    public class RelationshipWrapper{
        public String parentLabel;
        public String parentAPIName;
        public String referenceFieldAPIName;
        public String relationshipName;
    }
}
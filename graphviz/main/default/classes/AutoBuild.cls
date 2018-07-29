public with sharing class AutoBuild {

    public static final String STATUS_WORKING = 'working';
    public static final String STATUS_COMPLETE = 'complete';

    @AuraEnabled
    public static List<BuilderSourceType> getSourceTypes() {
        return getTypes();
    }

    @AuraEnabled
    public static List<BuilderSource> getSources(String sourceType) {
        try {
            return getBuilder(sourceType).getSources();
        } catch (UmlService.UmlServiceException se) {
            throw handleToolingAPIException(se);
        }
    }

    @AuraEnabled
    public static BuilderUpdate startSource(String sourceType, String source) {
        try {
            BuilderSource builderSource = (BuilderSource) JSON.deserialize(source, BuilderSource.class);
            return getBuilder(sourceType).startSource(builderSource);
        } catch (UmlService.UmlServiceException se) {
            throw handleToolingAPIException(se);
        }
    }

    @AuraEnabled
    public static BuilderUpdate pollSource(String sourceType, String source, String prevUpdate) {
        try {
            BuilderSource builderSource = (BuilderSource) JSON.deserialize(source, BuilderSource.class);
            BuilderUpdate builderUpdate = (BuilderUpdate) JSON.deserialize(prevUpdate, BuilderUpdate.class);
            return getBuilder(sourceType).pollSource(builderSource, builderUpdate);
        } catch (UmlService.UmlServiceException se) {
            throw handleToolingAPIException(se);
        }
    }

    private static AuraHandledException handleToolingAPIException(UmlService.UmlServiceException e) {
        String userMessage = e.getMessage();
        return new AuraHandledException(userMessage);
    }

    private static AutoBuilder getBuilder(String sourceType) {
        List<BuilderSourceType> types = getTypes();
        for (BuilderSourceType t : types) {
            if (t.sourceType == sourceType) {
                AutoBuilder builder = (AutoBuilder) System.Type.forName(t.apexClass).newInstance();
                return builder;
            }
        }
        throw new UnsupportedOperationException('No type matched: ' + sourceType);
    }

    private static List<BuilderSourceType> getTypes() {
        List<BuilderSourceType> results = new List<BuilderSourceType>();
        for (Graphviz_AutoBuild__mdt autoBuild : [
                SELECT Label, DeveloperName, Apex_Class__c, Lightning_Config_Component__c, Description__c
                FROM Graphviz_AutoBuild__mdt
        ]) {
            results.add(new BuilderSourceType(autoBuild));
        }
        return results;
    }

    public interface AutoBuilder {
        List<BuilderSource> getSources();
        BuilderUpdate startSource(BuilderSource source);
        BuilderUpdate pollSource(BuilderSource source, BuilderUpdate prevUpdate);
    }

    public Class BuilderUpdate {

        @AuraEnabled
        public String status;

        @AuraEnabled
        public String payload;

        @AuraEnabled
        public List<Map<String, String>> entitiesToAdd = new List<Map<String, String>>();

        @AuraEnabled
        public Map<String, List<Map<String, String>>> fieldsMap = new Map<String, List<Map<String, String>>>();

        public BuilderUpdate() {
        }
        public BuilderUpdate(String status, String payload) {
            this.status = status;
            this.payload = payload;
        }
    }

    // data returned to auto-builder impl classes when they need to compare results against the data model
    public Class DescribeData {
        public Map<String, String> objectLabelsByAPIName = new Map<String, String>();
        public Map<String, Map<String, String>> fieldTuplesByAPIName = new Map<String, Map<String, String>>();
    }

    public static DescribeData getDataModelDescribe() {
        DescribeData result = new DescribeData();

        for (Schema.SObjectType sObjType : Schema.getGlobalDescribe().values()) {
            DescribeSObjectResult describe = sObjType.getDescribe();
            // store object names/labels
            result.objectLabelsByAPIName.put(describe.name, describe.label);
            // store fields
            Map<String, Schema.SObjectField> fields = describe.fields.getMap();
            Map<String, String> fieldLabelsByAPIName = new Map<String, String>();
            for (String field : fields.keySet()) {
                fieldLabelsByAPIName.put(
                        fields.get(field).getDescribe().name,
                        fields.get(field).getDescribe().label);
            }
            result.fieldTuplesByAPIName.put(describe.name, fieldLabelsByAPIName);
        }
        return result;
    }

}
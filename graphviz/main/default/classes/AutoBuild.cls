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
    public static BuilderUpdate startSource(String sourceType, Id diagramId, String source) {
        try {
            BuilderSource builderSource = (BuilderSource) JSON.deserialize(source, BuilderSource.class);
            return getBuilder(sourceType).startSource(diagramId, builderSource);
        } catch (UmlService.UmlServiceException se) {
            throw handleToolingAPIException(se);
        }
    }

    @AuraEnabled
    public static BuilderUpdate pollSource(String sourceType, Id diagramId, String source, String prevUpdate) {
        try {
            BuilderSource builderSource = (BuilderSource) JSON.deserialize(source, BuilderSource.class);
            BuilderUpdate builderUpdate = (BuilderUpdate) JSON.deserialize(prevUpdate, BuilderUpdate.class);
            return getBuilder(sourceType).pollSource(diagramId, builderSource, builderUpdate);
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
        BuilderUpdate startSource(Id diagramId, BuilderSource source);
        BuilderUpdate pollSource(Id diagramId, BuilderSource source, BuilderUpdate prevUpdate);
    }

    public Class BuilderUpdate {
        @AuraEnabled
        public String status;
        @AuraEnabled
        public String payload;
        @AuraEnabled
        public String diagramJSON;
        public BuilderUpdate() {
        }
        public BuilderUpdate(String status, String payload, String diagramJSON) {
            this.status = status;
            this.payload = payload;
            this.diagramJSON = diagramJSON;
        }
    }

    public Class BuilderSourceType {
        @AuraEnabled
        public String sourceType;
        @AuraEnabled
        public String label;
        @AuraEnabled
        public String description;
        @AuraEnabled
        public String apexClass;
        @AuraEnabled
        public String configComponent;
        public BuilderSourceType(Graphviz_AutoBuild__mdt metaData) {
            this.sourceType = metaData.DeveloperName;
            this.label = metaData.Label;
            this.description = metaData.Description__c;
            this.apexClass = metaData.Apex_Class__c;
            this.configComponent = metaData.Lightning_Config_Component__c;
        }
        public BuilderSourceType(String sourceType, String label, String description, String apexClass, String config) {
            this.sourceType = sourceType;
            this.label = label;
            this.description = description;
            this.apexClass = apexClass;
            this.configComponent = config;
        }
    }

}
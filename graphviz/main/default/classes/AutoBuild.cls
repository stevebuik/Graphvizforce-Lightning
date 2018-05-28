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
                AutoBuilder builder = (AutoBuilder) System.Type.forName('AutoBuildApex').newInstance();
                return builder;
            }
        }
        throw new UnsupportedOperationException('No type matched: ' + sourceType);
    }

    private static List<BuilderSourceType> getTypes() {
        List<BuilderSourceType> results = new List<BuilderSourceType>();
        results.add(new BuilderSourceType('All Apex', 'Apex Classes', 'Finds all references to Objects in your Apex classes', null));
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
        public String configComponent;
        public BuilderSourceType(String sourceType, String label, String description, String config) {
            this.sourceType = sourceType;
            this.label = label;
            this.description = description;
            this.configComponent = config;
        }
    }

    /**
     * @group Diagram Persistence
     *
     * @description The top level entity stored as JSON for a diagram.
     */
    public class Diagram {
        public String label;
        public String value;
        public Boolean visible;
        public Id recordId;
        public List<DiagramGroup> groups;
    }

    public class DiagramGroup {
        public String label;
        public String value;
        public List<DiagramEntity> entities;
    }

    public class DiagramEntity {
        public String label;
        public String value;
        public Boolean isCustom;
        public Boolean visible;
        public List<DiagramAttribute> attributes;
        public DiagramEntity(GraphVizForceController.ObjectWrapper objectWrapper) {
            this.value = objectWrapper.apiName;
            this.label = objectWrapper.label;
            this.visible = true;
            this.isCustom = objectWrapper.isCustom;
            this.attributes = new List<DiagramAttribute>();
            for (GraphVizForceController.FieldWrapper fieldWrapper : objectWrapper.fields) {
                this.attributes.add(new AutoBuild.DiagramAttribute(fieldWrapper));
            }
        }
    }

    public class DiagramAttribute {
        public String label;
        public String value;
        public String type;
        public Boolean isCustom;
        public Boolean isMDOrCascadeDelete;
        public Boolean visible;
        public Boolean selected;
        public List<Map<String, String>> references;
        public DiagramAttribute(GraphVizForceController.FieldWrapper fieldWrapper) {
            this.label = fieldWrapper.label;
            this.value = fieldWrapper.apiName;
            this.type = fieldWrapper.type;
            this.isCustom = fieldWrapper.isCustom;
            this.isMDOrCascadeDelete = fieldWrapper.isMDOrCascadeDelete;
            this.visible = false;
            this.selected = false;
            this.references = new List<Map<String, String>>();
            if (fieldWrapper.referenceFields != NULL) {
                for (GraphVizForceController.RelationshipWrapper relationshipWrapper : fieldWrapper.referenceFields) {
                    Map<String, String> relationship = new Map<String, String>();
                    relationship.put('referenceFieldAPIName', relationshipWrapper.referenceFieldAPIName);
                    relationship.put('parentLabel', relationshipWrapper.parentLabel);
                    relationship.put('parentAPIName', relationshipWrapper.parentAPIName);
                    this.references.add(relationship);
                }
            }
        }
    }

}
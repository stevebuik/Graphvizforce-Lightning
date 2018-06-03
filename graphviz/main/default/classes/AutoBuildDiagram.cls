/**
 * The common methods for managing a diagram in Apex
 */
public class AutoBuildDiagram {

    private final Id diagramId;

    private final Diagram diagram;

    public final Map<String, DiagramEntity> diagramEntitiesByName = new Map<String, DiagramEntity>();

    public AutoBuildDiagram(Id diagramId) {
        this.diagramId = diagramId;

        String content = [SELECT Id,Content__c from Graphviz_Diagram__c WHERE Id = :diagramId][0].Content__c;
        this.diagram = (Diagram) JSON.deserialize(content, Diagram.class);

        // create a lookup for all the entities in the persisted JSON diagram
        for (DiagramEntity entity : this.diagram.groups.get(0).entities) {
            diagramEntitiesByName.put(entity.value, entity);
        }
    }

    /**
     * @return a map of data-model Object describes, in the shape that is also sent to the client for the configurator UI. Indexed by Object name.
     */
    public Map<String, GraphVizForceController.ObjectWrapper> getDescribeMap() {
        Map<String, GraphVizForceController.ObjectWrapper> entityDescribesByName = new Map<String, GraphVizForceController.ObjectWrapper>();
        for (GraphVizForceController.ObjectWrapper wrapper : GraphVizForceController.loadSchemaWrappers()) {
            entityDescribesByName.put(wrapper.apiName, wrapper);
        }
        return entityDescribesByName;
    }

    /** Add a new entity to the existing diagram
     */
    public void addEntity(DiagramEntity diagramEntity) {
        if (diagramEntitiesByName.containsKey(diagramEntity.value)) {
            throw new UnsupportedOperationException('entity already in diagram: ' + diagramEntity.value);
        }
        diagramEntitiesByName.put(diagramEntity.value, diagramEntity);
        diagram.groups.get(0).entities.add(diagramEntity);
    }

    /**
     * persist the diagram with any changes made
     */
    public void updateDiagram() {
        Graphviz_Diagram__c diagramRecord = new Graphviz_Diagram__c(
                Id = this.diagramId,
                Content__c = JSON.serialize(this.diagram));
        update diagramRecord;
    }

    public String asJSON() {
        return JSON.serialize(this.diagram);
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
        public List<DiagramChildRelationship> children;
        public DiagramEntity(GraphVizForceController.ObjectWrapper objectWrapper) {
            this.value = objectWrapper.apiName;
            this.label = objectWrapper.label;
            this.visible = true;
            this.isCustom = objectWrapper.isCustom;
            this.attributes = new List<DiagramAttribute>();
            for (GraphVizForceController.FieldWrapper fieldWrapper : objectWrapper.fields) {
                this.attributes.add(new DiagramAttribute(fieldWrapper));
            }
            this.children = new List<DiagramChildRelationship>();
            for (GraphVizForceController.ChildRelationshipWrapper childRelationship : objectWrapper.childRelationships) {
                this.children.add(new DiagramChildRelationship(childRelationship.relationshipName, childRelationship.childAPIName));
            }
        }
    }

    public class DiagramChildRelationship {
        public String relationshipName;
        public String childAPIName;
        public DiagramChildRelationship(String relationshipName, String childAPIName) {
            this.relationshipName = relationshipName;
            this.childAPIName = childAPIName;
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
                    relationship.put('relationshipName', relationshipWrapper.relationshipName);
                    this.references.add(relationship);
                }
            }
        }
    }

}
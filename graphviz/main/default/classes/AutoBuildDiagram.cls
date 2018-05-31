/**
 * The common methods for managing a diagram in Apex
 */
public class AutoBuildDiagram {

    private final Id diagramId;

    private final AutoBuild.Diagram diagram;

    public final Map<String, AutoBuild.DiagramEntity> diagramEntitiesByName = new Map<String, AutoBuild.DiagramEntity>();

    public AutoBuildDiagram(Id diagramId) {
        this.diagramId = diagramId;

        String content = [SELECT Id,Content__c from Graphviz_Diagram__c WHERE Id = :diagramId][0].Content__c;
        this.diagram = (AutoBuild.Diagram) JSON.deserialize(content, AutoBuild.Diagram.class);

        // create a lookup for all the entities in the persisted JSON diagram
        for (AutoBuild.DiagramEntity entity : this.diagram.groups.get(0).entities) {
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
    public void addEntity(AutoBuild.DiagramEntity diagramEntity) {
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

}
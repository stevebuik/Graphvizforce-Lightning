public without sharing class AutoBuildTrigger implements AutoBuild.AutoBuilder {

    public List<BuilderSource> getSources() {
        List<BuilderSource> results = new List<BuilderSource>();

        // need to use Tooling API since Apex doesn't expose ApexTrigger in SOQL
        ToolingAPI.QueryResult queryResult = new ToolingAPI().query('select Id, Name from ApexTrigger');
        addTriggers(results, queryResult.records);
        while (!queryResult.done) {
            queryResult = new ToolingAPI().queryMore(queryResult.nextRecordsUrl);
            addTriggers(results, queryResult.records);
        }

        return results;
    }

    private void addTriggers(List<BuilderSource> sources, List<ToolingAPI.SObject_x> triggers) {
        for (ToolingAPI.SObject_x aTrigger : triggers) {
            ToolingAPI.ApexTrigger t = (ToolingAPI.ApexTrigger) aTrigger;
            sources.add(new BuilderSource(t.name, t.id));
        }
    }

    private Class Payload {
        String requestId;
        String diagramId;
    }

    public AutoBuild.BuilderUpdate startSource(Id diagramId, BuilderSource source) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        // kick off the compile request
        ToolingApi.ContainerAsyncRequest request = UmlService.compileTrigger(source.id);

        Payload payload = new Payload();
        payload.requestId = request.id;
        payload.diagramId = diagramId;

        result.payload = JSON.serialize(payload);
        result.status = AutoBuild.STATUS_WORKING;
        return result;
    }

    public AutoBuild.BuilderUpdate pollSource(Id diagramId, BuilderSource source, AutoBuild.BuilderUpdate prevUpdate) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        Payload payload = (Payload) JSON.deserialize(prevUpdate.payload, Payload.class);
        ToolingApi.ContainerAsyncRequest request = UmlService.containerAsyncRequest(payload.requestId);
        result.status = request.state;
        if (request.state == 'Completed') {

            ToolingApi.SymbolTable symbolTable = UmlService.symbolTableTrigger(request.metadataContainerId, source.source);

            AutoBuildDiagram diagram = new AutoBuildDiagram(payload.diagramId);

            Map<String, GraphVizForceController.ObjectWrapper> entityDescribesByName = diagram.getDescribeMap();

            // for every entity found in the Tooling API Symbol Table....
            for (ToolingAPI.ExternalReference reference : symbolTable.externalReferences) {
                String objectName = reference.name;

                AutoBuildDiagram.DiagramEntity diagramEntity = diagram.diagramEntitiesByName.get(objectName);

                // ensure there is an entity in the persisted diagram JSON
                if (diagramEntity == NULL) {

                    GraphVizForceController.ObjectWrapper entityDescribe = entityDescribesByName.get(objectName);

                    // only add Data Model references to diagram i.e. ignore references to List.class etc
                    if (entityDescribe != NULL) {

                        diagramEntity = new AutoBuildDiagram.DiagramEntity(entityDescribe);
                        diagram.addEntity(diagramEntity);

                        // for all field references found in the trigger...
                        Set<String> fieldsFromTrigger = new Set<String>();
                        for (ToolingAPI.ExternalSymbol symbol : reference.variables) {
                            fieldsFromTrigger.add(symbol.name);
                        }
                        // make the fields visible in the persisted diagram JSON entity
                        for (AutoBuildDiagram.DiagramAttribute diagramAttribute : diagramEntity.attributes) {
                            if (fieldsFromTrigger.contains(diagramAttribute.value)) {
                                diagramAttribute.visible = true;
                                diagramAttribute.selected = true;
                            }
                        }
                    }
                }
            }

            diagram.updateDiagram();

            // return the updated diagram
            result.diagramJSON = diagram.asJSON();
            result.status = AutoBuild.STATUS_COMPLETE;
        } else {
            result.payload = prevUpdate.payload; // pass back to client for use in next poll/update request
            result.status = AutoBuild.STATUS_WORKING;
        }
        return result;
    }

}
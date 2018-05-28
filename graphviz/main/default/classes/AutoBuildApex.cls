public without sharing class AutoBuildApex implements AutoBuild.AutoBuilder {

    public List<BuilderSource> getSources() {
        List<BuilderSource> results = new List<BuilderSource>();
        for (List<ApexClass> classes : [
                SELECT Id, Name
                From ApexClass
                ORDER BY NAME
        ]) {
            for (ApexClass clazz : classes) {
                results.add(new BuilderSource(clazz.Name, clazz.Id));
            }
        }
        return results;
    }

    private Class Payload {
        String requestId;
        String diagramId;
    }

    public AutoBuild.BuilderUpdate startSource(Id diagramId, BuilderSource source) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        // kick off the compile request
        ToolingApi.ContainerAsyncRequest request = UmlService.compile(source.source);

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

            ToolingApi.SymbolTable symbolTable = UmlService.symbolTable(request.metadataContainerId, source.source);

            // TODO extract all code not specific to Symbol table to common class/method to make other builders easier
            Map<String, GraphVizForceController.ObjectWrapper> entityDescribesByName = new Map<String, GraphVizForceController.ObjectWrapper>();
            for (GraphVizForceController.ObjectWrapper wrapper : GraphVizForceController.loadSchemaWrappers()) {
                entityDescribesByName.put(wrapper.apiName, wrapper);
            }

            String content = [SELECT Id,Content__c from Graphviz_Diagram__c WHERE Id = :payload.diagramId][0].Content__c;

            AutoBuild.Diagram diagram = (AutoBuild.Diagram) JSON.deserialize(content, AutoBuild.Diagram.class);

            // create a lookup for all the entities in the persisted JSON diagram
            Map<String, AutoBuild.DiagramEntity> diagramEntitiesByName = new Map<String, AutoBuild.DiagramEntity>();
            for (AutoBuild.DiagramEntity entity : diagram.groups.get(0).entities) {
                diagramEntitiesByName.put(entity.value, entity);
            }

            // for every entity found in the Tooling API Symbol Table....
            for (ToolingAPI.ExternalReference reference : symbolTable.externalReferences) {
                String objectName = reference.name;

                // ensure there is an entity in the persisted diagram JSON
                AutoBuild.DiagramEntity diagramEntity = diagramEntitiesByName.get(objectName);
                if (diagramEntity == NULL) {
                    GraphVizForceController.ObjectWrapper entityDescribe = entityDescribesByName.get(objectName);

                    // only add Data Model references to diagram i.e. ignore references to List etc

                    if (entityDescribe != NULL) {
                        diagramEntity = new AutoBuild.DiagramEntity(entityDescribe);
                        diagramEntitiesByName.put(objectName, diagramEntity);
                        diagram.groups.get(0).entities.add(diagramEntity);

                        // for all field references found in the class...
                        Set<String> fieldsFromClass = new Set<String>();
                        for (ToolingAPI.ExternalSymbol symbol : reference.variables) {
                            fieldsFromClass.add(symbol.name);
                        }
                        // make the fields visible in the persisted diagram JSON entity
                        for (AutoBuild.DiagramAttribute diagramAttribute : diagramEntity.attributes) {
                            if (fieldsFromClass.contains(diagramAttribute.value)) {
                                diagramAttribute.visible = true;
                                diagramAttribute.selected = true;
                            }
                        }
                    }
                }
            }

            // persist the updated diagram
            Graphviz_Diagram__c diagramRecord = new Graphviz_Diagram__c(
                    Id = payload.diagramId,
                    Content__c = JSON.serialize(diagram));
            update diagramRecord;

            // return the updated diagram
            result.diagramJSON = JSON.serialize(diagram);
            result.status = AutoBuild.STATUS_COMPLETE;
        } else {
            result.payload = prevUpdate.payload; // pass back to client for use in next poll/update request
            result.status = AutoBuild.STATUS_WORKING;
        }
        return result;
    }

    /* use code below in execute anonymous during development

// simulate buttons getting all known auto build sources
String sourceType = AutoBuild.getSourceTypes().get(0).sourceType;
List<BuilderSource> sources = AutoBuild.getSources(sourceType);
System.debug(sources);

// emulate Lightning client creating a new diagram
Id diagramId = AutoBuildApexTests.createDiagram('Entities used in Apex classes');
System.debug(diagramId);

// initial call to start the async source working
// paste the diagram id and the class id into the snippet below
System.debug(AutoBuild.startSource(
        'All Apex',
        'a00N000000Jy1q2IAB',
        '{source: "AutoBuildApex", id: "01pN0000000bhSB"}'
        ));

// copy the payload into the update object (2nd arg) below

// subsequent poll waiting for completion
System.debug(AutoBuild.pollSource(
        'All Apex',
        'a00N000000Jy1q2IAB',
        new BuilderSource('AutoBuildApex', '01pN0000000bhSB'),
        new AutoBuild.BuilderUpdate('Queued', '{"requestId":"1drN00000058z2YIAQ","diagramId":"a00N000000Jy1q2IAB"}', null)));

     */

}
public without sharing class AutoBuildTrigger implements AutoBuild.AutoBuilder {

    public List<BuilderSource> getSources() {
        List<BuilderSource> results = new List<BuilderSource>();

        try {
            // need to use Tooling API since Apex doesn't expose ApexTrigger in SOQL
            ToolingAPI.QueryResult queryResult = new ToolingAPI().query('select Id, Name from ApexTrigger');
            if (queryResult.records != NULL && !queryResult.records.isEmpty()) {
                addTriggers(results, queryResult.records);
            }
            while (!queryResult.done) {
                queryResult = new ToolingAPI().queryMore(queryResult.nextRecordsUrl);
                if (queryResult.records != NULL && !queryResult.records.isEmpty()) {
                    addTriggers(results, queryResult.records);
                }
            }

            return results;
        } catch (ToolingApi.ToolingAPIAuthorizationException tapiae) {
            throw UmlService.makeException(tapiae);
        }
    }

    private void addTriggers(List<BuilderSource> sources, List<ToolingAPI.SObject_x> triggers) {
        for (ToolingAPI.SObject_x aTrigger : triggers) {
            ToolingAPI.ApexTrigger t = (ToolingAPI.ApexTrigger) aTrigger;
            sources.add(new BuilderSource(t.name, t.id));
        }
    }

    private Class Payload {
        String requestId;
    }

    public AutoBuild.BuilderUpdate startSource(BuilderSource source) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        // kick off the compile request
        ToolingApi.ContainerAsyncRequest request = UmlService.compileTrigger(source.id);

        Payload payload = new Payload();
        payload.requestId = request.id;

        result.payload = JSON.serialize(payload);
        result.status = AutoBuild.STATUS_WORKING;
        return result;
    }

    public AutoBuild.BuilderUpdate pollSource(BuilderSource source, AutoBuild.BuilderUpdate prevUpdate) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        Payload payload = (Payload) JSON.deserialize(prevUpdate.payload, Payload.class);
        ToolingApi.ContainerAsyncRequest request = UmlService.containerAsyncRequest(payload.requestId);
        result.status = request.state;
        if (request.state == 'Completed') {

            ToolingApi.SymbolTable symbolTable = UmlService.symbolTableTrigger(request.metadataContainerId, source.source);

            AutoBuild.DescribeData describes = AutoBuild.getDataModelDescribe();

            // now check every reference and filter only object/field refs. add them to the result
            for (ToolingAPI.ExternalReference reference : symbolTable.externalReferences) {

                Boolean isReferenceToSObject = describes.objectLabelsByAPIName.containsKey(reference.name);
                if (isReferenceToSObject) { // only object references are returned
                    Map<String, String> entity = new Map<String, String>();
                    entity.put('apiName', reference.name);
                    entity.put('label', describes.objectLabelsByAPIName.get(reference.name));
                    result.entitiesToAdd.add(entity);

                    List<Map<String, String>> fields = new List<Map<String, String>>();
                    for (ToolingAPI.ExternalSymbol symbol : reference.variables) {
                        fields.add(new Map<String, String>{
                                'apiName' => symbol.name,
                                'label' => describes.fieldTuplesByAPIName.get(reference.name).get(symbol.name)
                        });
                    }
                    result.fieldsMap.put(reference.name, fields);
                }
            }

            result.status = AutoBuild.STATUS_COMPLETE;
        } else {
            result.payload = prevUpdate.payload; // pass back to client for use in next poll/update request
            result.status = AutoBuild.STATUS_WORKING;
        }
        return result;
    }

}
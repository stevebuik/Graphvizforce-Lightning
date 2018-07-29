public without sharing class AutoBuildApex implements AutoBuild.AutoBuilder {

    // a set of class names that are not used as field/object sources in normal operation
    private final Set<String> excluded = new Set<String>{
            'AutoBuild', 'AutoBuildApex', 'AutoBuildApexTests', 'AutoBuildDiagram', 'AutoBuildTrigger',
            'AutoBuildTriggerTests', 'BuilderSource', 'BuilderSourceType', 'GraphVizForceController',
            'GraphvizForceControllerTest', 'LightningUtility', 'ToolingAPI', 'ToolingAPITest', 'ToolingAPIMocks', 'UmlService',
            'egServerSideActionController', 'egServerSideActionControllerTest'
    };

    public List<BuilderSource> getSources() {

        List<BuilderSource> results = new List<BuilderSource>();

        Map<String, String> config = GraphVizForceController.getConfig();
        System.debug('Config:' + config);

        if (config.get('development mode') == NULL) {
            for (List<ApexClass> classes : [
                    SELECT Id, Name
                    FROM ApexClass
                    WHERE Name <> :excluded
                    ORDER BY NAME
            ]) {
                for (ApexClass clazz : classes) {
                    results.add(new BuilderSource(clazz.Name, clazz.Id));
                }
            }
        } else {
            for (List<ApexClass> classes : [
                    SELECT Id, Name
                    FROM ApexClass
                    ORDER BY NAME
            ]) {
                for (ApexClass clazz : classes) {
                    results.add(new BuilderSource(clazz.Name, clazz.Id));
                }
            }
        }
        return results;
    }

    private Class Payload {
        String requestId;
    }

    public AutoBuild.BuilderUpdate startSource(BuilderSource source) {
        AutoBuild.BuilderUpdate result = new AutoBuild.BuilderUpdate();
        // kick off the compile request
        ToolingApi.ContainerAsyncRequest request = UmlService.compile(source.source);

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

        if (request == NULL) {
            System.debug('Empty async request');
            result.status = AutoBuild.STATUS_COMPLETE;
        } else {

            result.status = request.state;
            if (request.state == 'Completed') {

                System.debug('reading completed symbol table for class: ' + source.source);
                ToolingApi.SymbolTable symbolTable = UmlService.symbolTable(request.metadataContainerId, source.source);

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
        }

        return result;
    }

}
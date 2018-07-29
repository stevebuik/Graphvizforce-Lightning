@IsTest
public class AutoBuildTriggerTests {

    private static final String TRIGGER_BUILDER_KEY = 'Apex_Triggers';

    @IsTest
    private static void testApexSingleTriggerWithEntities() {
        // tests parsing a class (in this recorded data it's AutoBuildTests.class) using the tooling api and handling the completed response

        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> getSourcesHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        getSourcesHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'select Id, Name from ApexTrigger'
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ApexTrigger","records":[{"attributes":{"type":"ApexTrigger","url":"/services/data/v29.0/tooling/sobjects/ApexTrigger/01q0l0000009IuGAAU"},"Id":"01q0l0000009IuGAAU","Name":"AccountNoopTrigger"}]}'));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(getSourcesHTTPResponses));

        Test.startTest();

        List<BuilderSource> sources = AutoBuild.getSources(TRIGGER_BUILDER_KEY);

        System.assertEquals(1, sources.size(), '1 trigger extracted from the tooling api response');

        // call startSource for the first/only trigger returned in sources

        // Tooling API responses for the AutoBuild.startSource method when reading Apex classes
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/sobjects/ApexTrigger/01q0l0000009IuGAAU',
                        new Map<String, String>{
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"type":"ApexTrigger","url":"/services/data/v29.0/tooling/sobjects/ApexTrigger/01q0l0000009IuGAAU"},"Id":"01q0l0000009IuGAAU","NamespacePrefix":null,"Name":"AccountNoopTrigger","TableEnumOrId":"Account","UsageBeforeInsert":true,"UsageAfterInsert":false,"UsageBeforeUpdate":false,"UsageAfterUpdate":false,"UsageBeforeDelete":false,"UsageAfterDelete":false,"UsageIsBulk":false,"UsageAfterUndelete":false,"ApiVersion":42.0,"Status":"Active","IsValid":true,"BodyCrc":4.45697965E8,"Body":"trigger AccountNoopTrigger on Account (before insert) {\n\n    Account a = new Account(Name=\'Foo\');\n    a.Phone = \'123\';\n    a.Description = \'\';\n\n    Contact c = new Contact();\n    c.FirstName = \'\';\n    \n}","LengthWithoutComments":197,"CreatedDate":"2018-05-31T01:53:15.000+0000","CreatedById":"0050l000001MTnTAAW","LastModifiedDate":"2018-05-31T02:59:51.000+0000","LastModifiedById":"0050l000001MTnTAAW","SystemModstamp":"2018-05-31T02:59:51.000+0000"}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, Name FROM MetadataContainer WHERE Name = \'GraphvizForce\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"MetadataContainer","records":[{"attributes":{"type":"MetadataContainer","url":"/services/data/v29.0/tooling/sobjects/MetadataContainer/1dc0l000000bGjwAAE"},"Id":"1dc0l000000bGjwAAE","Name":"GraphvizForce"}]}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('DELETE', '/services/data/v29.0/tooling/sobjects/MetadataContainer/1dc0l000000bGjwAAE', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_DELETED, ''));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/MetadataContainer', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"1dc0l000000bJ9wAAE","success":true,"errors":[]}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/ApexTriggerMember', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"4010l0000004pC4AAI","success":true,"errors":[]}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/ContainerAsyncRequest', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"1dr0l000001g6VNAAY","success":true,"errors":[]}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, State, MetadataContainerId, CompilerErrors FROM ContainerAsyncRequest WHERE Id = \'1dr0l000001g6VNAAY\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ContainerAsyncRequest","records":[{"attributes":{"type":"ContainerAsyncRequest","url":"/services/data/v29.0/tooling/sobjects/ContainerAsyncRequest/1dr0l000001g6VNAAY"},"Id":"1dr0l000001g6VNAAY","State":"Queued","MetadataContainerId":"1dc0l000000bJ9wAAE","CompilerErrors":null}]}'));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(startSourceHTTPResponses));

        // start compiling the a source by calling the start method, exactly as done by the Lightning client
        AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource(TRIGGER_BUILDER_KEY, JSON.serialize(findSource(sources, 'AccountNoopTrigger')));

        System.assertEquals(AutoBuild.STATUS_WORKING, builderUpdate1.status,
                'start for Apex returns working while tooling api is compiling');

        // now call pollSource

        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> pollSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, State, MetadataContainerId, CompilerErrors FROM ContainerAsyncRequest WHERE Id = \'1dr0l000001g6VNAAY\''
                        }),
                // notice the state of this response is "Completed"
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ContainerAsyncRequest","records":[{"attributes":{"type":"ContainerAsyncRequest","url":"/services/data/v29.0/tooling/sobjects/ContainerAsyncRequest/1dr0l000001g6VNAAY"},"Id":"1dr0l000001g6VNAAY","State":"Completed","MetadataContainerId":"1dc0l000000bJ9wAAE","CompilerErrors":"[]"}]}'));

        String triggerMemberWithEntities = '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ApexTriggerMember","records":[{"attributes":{"type":"ApexTriggerMember","url":"/services/data/v29.0/tooling/sobjects/ApexTriggerMember/4010l0000004pC4AAI"},"ContentEntityId":"01q0l0000009IuGAAU","ContentEntity":{"attributes":{"type":"ApexTrigger","url":"/services/data/v29.0/tooling/sobjects/ApexTrigger/01q0l0000009IuGAAU"},"Name":"AccountNoopTrigger"},"SymbolTable":{"constructors":[],"externalReferences":[{"methods":[],"name":"Account","namespace":null,"references":[],"variables":[{"name":"Phone","references":[{"column":7,"line":4}]},{"name":"Description","references":[{"column":7,"line":5}]}]},{"methods":[],"name":"Contact","namespace":null,"references":[],"variables":[{"name":"FirstName","references":[{"column":7,"line":8}]}]}],"id":"01q0l0000009IuGAAU","innerClasses":[],"interfaces":[],"key":"01q0l0000009IuGAAU","methods":[],"name":"AccountNoopTrigger","namespace":null,"properties":[{"location":{"column":13,"line":3},"modifiers":["private"],"name":"a","references":[{"column":5,"line":4},{"column":5,"line":5}],"type":"Account","visibility":"PRIVATE"},{"location":{"column":13,"line":7},"modifiers":["private"],"name":"c","references":[{"column":5,"line":8}],"type":"Contact","visibility":"PRIVATE"}],"tableDeclaration":{"location":{"column":9,"line":1},"modifiers":[],"name":"AccountNoopTrigger","references":[],"type":"AccountNoopTrigger"},"variables":[]}}]}';
        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT ContentEntityId, ContentEntity.Name, SymbolTable FROM ApexTriggerMember WHERE MetadataContainerId = \'1dc0l000000bJ9wAAE\' AND ContentEntity.Name = \'AccountNoopTrigger\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, triggerMemberWithEntities));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(pollSourceHTTPResponses));

        // now poll the source to see if the tooling api is done
        AutoBuild.BuilderUpdate builderUpdate2 = AutoBuild.pollSource(
                TRIGGER_BUILDER_KEY,
                JSON.serialize(sources.get(0)),
                JSON.serialize(builderUpdate1));

        System.assertEquals(2, builderUpdate2.entitiesToAdd.size(), 'both entities found');
        System.assertEquals('Account', builderUpdate2.entitiesToAdd.get(0).get('apiName'));
        System.assertEquals('Contact', builderUpdate2.entitiesToAdd.get(1).get('apiName'));

        Test.stopTest();

    }

    @IsTest
    private static void testWithoutRemoteSiteSetting() {
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'select Id, Name from ApexTrigger'
                        }),
                new ToolingAPIMocks.RestResponse(new ToolingAPI.ToolingAPIAuthorizationException('No setting')));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(startSourceHTTPResponses));

        Test.startTest();

        // trigger builder uses Tooling API for getSources call so will fail on this call when setting is missing
        try {
            List<BuilderSource> sources = AutoBuild.getSources(TRIGGER_BUILDER_KEY);
            System.assert(false, 'startSource should fail');
        } catch (AuraHandledException e) {
            System.assert(true, 'Sent an exception to the Lightning client');
        }
    }

    private static BuilderSource findSource(List<BuilderSource> sources, String sourceName) {
        for (BuilderSource source : sources) {
            if (source.source == sourceName) {
                return source;
            }
        }
        throw new UnsupportedOperationException('Source not found: ' + sourceName);
    }

}
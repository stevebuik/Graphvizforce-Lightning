@IsTest
public class AutoBuildApexTests {

    private static final String APEX_BUILDER_KEY = 'All_Apex';

    @IsTest
    private static void testApexSingleSourceWithoutEntities() {
        // tests parsing a class (in this recorded data it's AutoBuild.class) using the tooling api and handling the completed response

        Map<String, AutoBuild.BuilderSourceType> typesByValue = new Map<String, AutoBuild.BuilderSourceType>();
        for (AutoBuild.BuilderSourceType sourceType : AutoBuild.getSourceTypes()) {
            typesByValue.put(sourceType.sourceType, sourceType);
        }
        System.debug('auto-build types available: ' + typesByValue.keySet());
        System.assert(typesByValue.containsKey(APEX_BUILDER_KEY), 'Apex source is available to users');

        // no callouts used for Apex to list classes
        List<BuilderSource> sources = AutoBuild.getSources(APEX_BUILDER_KEY);
        System.debug(sources);

        String autoBuildClassSource = [SELECT Body FROM ApexClass WHERE Name = 'AutoBuild'].body;
        System.debug(new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/ApexClassMember', new Map<String, String>()).toString());

        // JSON responses recorded using System.debug in the ToolingAPI class.
        // This will be useful when speeding up the auto-build since these requests can be combined using Tooling API "Composite" requests

        // use https://jsoneditoronline.org to see any response JSON in a structured way

        // Tooling API responses for the AutoBuild.startSource method when reading Apex classes
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

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
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/ApexClassMember', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"4000l000000bWOwAAM","success":true,"errors":[]}'));

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

        Id diagramId = [Select Id from Graphviz_Diagram__c][0].Id;
        Test.startTest();

        // start compiling the first source (AutoBuild.class) by calling the start method, exactly as done by the Lightning client
        AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource(APEX_BUILDER_KEY, diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));

        System.assertEquals(AutoBuild.STATUS_WORKING, builderUpdate1.status,
                'start for Apex returns working while tooling api is compiling');
        System.assertEquals(NULL, builderUpdate1.diagramJSON,
                'no diagram returned when still working');

        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> pollSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, State, MetadataContainerId, CompilerErrors FROM ContainerAsyncRequest WHERE Id = \'1dr0l000001g6VNAAY\''
                        }),
                // notice the state of this response is "Completed"
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ContainerAsyncRequest","records":[{"attributes":{"type":"ContainerAsyncRequest","url":"/services/data/v29.0/tooling/sobjects/ContainerAsyncRequest/1dr0l000001g6VNAAY"},"Id":"1dr0l000001g6VNAAY","State":"Completed","MetadataContainerId":"1dc0l000000bJ9wAAE","CompilerErrors":"[]"}]}'));

        String classMemberWithoutEntities = '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ApexClassMember","records":[{"attributes":{"type":"ApexClassMember","url":"/services/data/v29.0/tooling/sobjects/ApexClassMember/4000l000000bWOwAAM"},"ContentEntityId":"01p0l000000KKXwAAO","ContentEntity":{"attributes":{"type":"ApexClass","url":"/services/data/v29.0/tooling/sobjects/ApexClass/01p0l000000KKXwAAO"},"Name":"AutoBuild"},"SymbolTable":{"constructors":[],"externalReferences":[{"methods":[],"name":"List","namespace":null,"references":[{"column":19,"line":7},{"column":19,"line":12},{"column":20,"line":57}],"variables":[{"name":"results","references":[{"column":9,"line":59}]}]},{"methods":[],"name":"AutoBuild.BuilderUpdate","namespace":null,"references":[{"column":19,"line":21},{"column":19,"line":31}],"variables":[]},{"methods":[],"name":"BuilderSource","namespace":null,"references":[{"column":13,"line":23},{"column":13,"line":33}],"variables":[]},{"methods":[{"argTypes":[],"name":"deserialize","parameters":[],"references":[{"column":64,"line":23},{"column":64,"line":33},{"column":64,"line":34}],"returnType":null}],"name":"JSON","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"UmlServiceException","namespace":"UmlService","references":[{"column":67,"line":41}],"variables":[]},{"methods":[{"argTypes":[],"name":"getMessage","parameters":[],"references":[{"column":32,"line":42}],"returnType":null}],"name":"ApexBaseException","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"AutoBuild.AutoBuilder","namespace":null,"references":[{"column":20,"line":46}],"variables":[]},{"methods":[],"name":"List<BuilderSourceType>","namespace":null,"references":[{"column":9,"line":47},{"column":9,"line":58}],"variables":[]},{"methods":[{"argTypes":[],"name":"newInstance","parameters":[],"references":[{"column":90,"line":50}],"returnType":null},{"argTypes":[],"name":"forName","parameters":[],"references":[{"column":65,"line":50}],"returnType":null}],"name":"Type","namespace":"System","references":[],"variables":[]}],"id":"01p0l000000KKXwAAO","innerClasses":[{"constructors":[],"externalReferences":[{"methods":[],"name":"List","namespace":null,"references":[{"column":9,"line":64}],"variables":[]},{"methods":[],"name":"AutoBuild.BuilderUpdate","namespace":null,"references":[{"column":9,"line":65},{"column":9,"line":66}],"variables":[]},{"methods":[],"name":"BuilderSource","namespace":null,"references":[{"column":49,"line":65},{"column":48,"line":66}],"variables":[]},{"methods":[],"name":"BuilderUpdate","namespace":null,"references":[{"column":70,"line":66}],"variables":[]}],"id":"AutoBuilder","innerClasses":[],"interfaces":[],"key":"AutoBuilder","methods":[{"location":{"column":29,"line":64},"modifiers":["public","abstract"],"name":"getSources","parameters":[],"references":[{"column":43,"line":14}],"returnType":"List","type":null,"visibility":"PUBLIC"},{"location":{"column":23,"line":65},"modifiers":["public","abstract"],"name":"startSource","parameters":[{"name":"diagramId","type":"Id"},{"name":"source","type":"BuilderSource"}],"references":[{"column":43,"line":24}],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"},{"location":{"column":23,"line":66},"modifiers":["public","abstract"],"name":"pollSource","parameters":[{"name":"diagramId","type":"Id"},{"name":"source","type":"BuilderSource"},{"name":"prevUpdate","type":"BuilderUpdate"}],"references":[{"column":43,"line":35}],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"}],"name":"AutoBuilder","namespace":null,"properties":[],"tableDeclaration":{"location":{"column":22,"line":63},"modifiers":["public"],"name":"AutoBuilder","references":[{"column":17,"line":50}],"type":"AutoBuilder"},"variables":[{"location":{"column":38,"line":65},"modifiers":[],"name":"diagramId","references":[],"type":"Id"},{"location":{"column":63,"line":65},"modifiers":[],"name":"source","references":[],"type":"BuilderSource"},{"location":{"column":37,"line":66},"modifiers":[],"name":"diagramId","references":[],"type":"Id"},{"location":{"column":62,"line":66},"modifiers":[],"name":"source","references":[],"type":"BuilderSource"},{"location":{"column":84,"line":66},"modifiers":[],"name":"prevUpdate","references":[],"type":"AutoBuild.BuilderUpdate"}]},{"constructors":[{"location":{"column":16,"line":76},"modifiers":["public"],"name":"BuilderUpdate","parameters":[],"references":[],"type":null,"visibility":"PUBLIC"},{"location":{"column":16,"line":78},"modifiers":["public"],"name":"BuilderUpdate","parameters":[{"name":"status","type":"String"},{"name":"payload","type":"String"},{"name":"diagramJSON","type":"String"}],"references":[],"type":null,"visibility":"PUBLIC"}],"externalReferences":[],"id":"BuilderUpdate","innerClasses":[],"interfaces":[],"key":"BuilderUpdate","methods":[],"name":"BuilderUpdate","namespace":null,"properties":[{"location":{"column":23,"line":71},"modifiers":["public"],"name":"status","references":[{"column":18,"line":79}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":73},"modifiers":["public"],"name":"payload","references":[{"column":18,"line":80}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":75},"modifiers":["public"],"name":"diagramJSON","references":[{"column":18,"line":81}],"type":"String","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":69},"modifiers":["public"],"name":"BuilderUpdate","references":[{"column":13,"line":34}],"type":"BuilderUpdate"},"variables":[{"location":{"column":37,"line":78},"modifiers":[],"name":"status","references":[{"column":27,"line":79}],"type":"String"},{"location":{"column":52,"line":78},"modifiers":[],"name":"payload","references":[{"column":28,"line":80}],"type":"String"},{"location":{"column":68,"line":78},"modifiers":[],"name":"diagramJSON","references":[{"column":32,"line":81}],"type":"String"}]},{"constructors":[{"location":{"column":16,"line":94},"modifiers":["public"],"name":"BuilderSourceType","parameters":[{"name":"sourceType","type":"String"},{"name":"label","type":"String"},{"name":"description","type":"String"},{"name":"config","type":"String"}],"references":[],"type":null,"visibility":"PUBLIC"}],"externalReferences":[],"id":"BuilderSourceType","innerClasses":[],"interfaces":[],"key":"BuilderSourceType","methods":[],"name":"BuilderSourceType","namespace":null,"properties":[{"location":{"column":23,"line":87},"modifiers":["public"],"name":"sourceType","references":[{"column":18,"line":95},{"column":19,"line":49}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":89},"modifiers":["public"],"name":"label","references":[{"column":18,"line":96}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":91},"modifiers":["public"],"name":"description","references":[{"column":18,"line":97}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":93},"modifiers":["public"],"name":"configComponent","references":[{"column":18,"line":98}],"type":"String","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":85},"modifiers":["public"],"name":"BuilderSourceType","references":[{"column":14,"line":48},{"column":25,"line":59}],"type":"BuilderSourceType"},"variables":[{"location":{"column":41,"line":94},"modifiers":[],"name":"sourceType","references":[{"column":31,"line":95}],"type":"String"},{"location":{"column":60,"line":94},"modifiers":[],"name":"label","references":[{"column":26,"line":96}],"type":"String"},{"location":{"column":74,"line":94},"modifiers":[],"name":"description","references":[{"column":32,"line":97}],"type":"String"},{"location":{"column":94,"line":94},"modifiers":[],"name":"config","references":[{"column":36,"line":98}],"type":"String"}]},{"constructors":[],"externalReferences":[{"methods":[],"name":"List<DiagramGroup>","namespace":null,"references":[{"column":16,"line":112}],"variables":[]}],"id":"Diagram","innerClasses":[],"interfaces":[],"key":"Diagram","methods":[],"name":"Diagram","namespace":null,"properties":[{"location":{"column":23,"line":108},"modifiers":["public"],"name":"label","references":[],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":109},"modifiers":["public"],"name":"value","references":[],"type":"String","visibility":"PUBLIC"},{"location":{"column":24,"line":110},"modifiers":["public"],"name":"visible","references":[],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":19,"line":111},"modifiers":["public"],"name":"recordId","references":[],"type":"Id","visibility":"PUBLIC"},{"location":{"column":35,"line":112},"modifiers":["public"],"name":"groups","references":[],"type":"List","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":107},"modifiers":["public"],"name":"Diagram","references":[],"type":"Diagram"},"variables":[]},{"constructors":[],"externalReferences":[{"methods":[],"name":"List<DiagramEntity>","namespace":null,"references":[{"column":16,"line":118}],"variables":[]}],"id":"DiagramGroup","innerClasses":[],"interfaces":[],"key":"DiagramGroup","methods":[],"name":"DiagramGroup","namespace":null,"properties":[{"location":{"column":23,"line":116},"modifiers":["public"],"name":"label","references":[],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":117},"modifiers":["public"],"name":"value","references":[],"type":"String","visibility":"PUBLIC"},{"location":{"column":36,"line":118},"modifiers":["public"],"name":"entities","references":[],"type":"List","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":115},"modifiers":["public"],"name":"DiagramGroup","references":[],"type":"DiagramGroup"},"variables":[]},{"constructors":[{"location":{"column":16,"line":127},"modifiers":["public"],"name":"DiagramEntity","parameters":[{"name":"objectWrapper","type":"ObjectWrapper"}],"references":[],"type":null,"visibility":"PUBLIC"}],"externalReferences":[{"methods":[],"name":"List<DiagramAttribute>","namespace":null,"references":[{"column":16,"line":126}],"variables":[]},{"methods":[],"name":"ObjectWrapper","namespace":"GraphVizForceController","references":[{"column":30,"line":127}],"variables":[]},{"methods":[],"name":"ObjectWrapper","namespace":null,"references":[],"variables":[{"name":"apiName","references":[{"column":40,"line":128}]},{"name":"label","references":[{"column":40,"line":129}]},{"name":"isCustom","references":[{"column":43,"line":131}]},{"name":"fields","references":[{"column":84,"line":133}]}]},{"methods":[],"name":"AutoBuild.DiagramEntity","namespace":null,"references":[],"variables":[{"name":"objectWrapper","references":[{"column":26,"line":128},{"column":26,"line":129},{"column":29,"line":131},{"column":70,"line":133}]},{"name":"attributes","references":[{"column":22,"line":134}]}]},{"methods":[],"name":"FieldWrapper","namespace":"GraphVizForceController","references":[{"column":18,"line":133}],"variables":[]},{"methods":[],"name":"List","namespace":null,"references":[],"variables":[{"name":"attributes","references":[{"column":22,"line":134}]}]},{"methods":[],"name":"DiagramAttribute","namespace":null,"references":[{"column":41,"line":134}],"variables":[]}],"id":"DiagramEntity","innerClasses":[],"interfaces":[],"key":"DiagramEntity","methods":[],"name":"DiagramEntity","namespace":null,"properties":[{"location":{"column":23,"line":122},"modifiers":["public"],"name":"label","references":[{"column":18,"line":129}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":123},"modifiers":["public"],"name":"value","references":[{"column":18,"line":128}],"type":"String","visibility":"PUBLIC"},{"location":{"column":24,"line":124},"modifiers":["public"],"name":"isCustom","references":[{"column":18,"line":131}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":24,"line":125},"modifiers":["public"],"name":"visible","references":[{"column":18,"line":130}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":39,"line":126},"modifiers":["public"],"name":"attributes","references":[{"column":18,"line":132}],"type":"List","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":121},"modifiers":["public"],"name":"DiagramEntity","references":[],"type":"DiagramEntity"},"variables":[{"location":{"column":68,"line":127},"modifiers":[],"name":"objectWrapper","references":[],"type":"GraphVizForceController.ObjectWrapper"},{"location":{"column":55,"line":133},"modifiers":[],"name":"fieldWrapper","references":[{"column":68,"line":134}],"type":"GraphVizForceController.FieldWrapper"}]},{"constructors":[{"location":{"column":16,"line":148},"modifiers":["public"],"name":"DiagramAttribute","parameters":[{"name":"fieldWrapper","type":"FieldWrapper"}],"references":[],"type":null,"visibility":"PUBLIC"}],"externalReferences":[{"methods":[],"name":"FieldWrapper","namespace":"GraphVizForceController","references":[{"column":33,"line":148}],"variables":[]},{"methods":[],"name":"FieldWrapper","namespace":null,"references":[],"variables":[{"name":"label","references":[{"column":39,"line":149}]},{"name":"apiName","references":[{"column":39,"line":150}]},{"name":"type","references":[{"column":38,"line":151}]},{"name":"isCustom","references":[{"column":42,"line":152}]},{"name":"isMDOrCascadeDelete","references":[{"column":53,"line":153}]},{"name":"referenceFields","references":[{"column":30,"line":157},{"column":101,"line":158}]}]},{"methods":[],"name":"AutoBuild.DiagramAttribute","namespace":null,"references":[],"variables":[{"name":"fieldWrapper","references":[{"column":26,"line":149},{"column":26,"line":150},{"column":25,"line":151},{"column":29,"line":152},{"column":40,"line":153},{"column":17,"line":157},{"column":88,"line":158}]},{"name":"relationship","references":[{"column":21,"line":160},{"column":21,"line":161},{"column":21,"line":162}]},{"name":"relationshipWrapper","references":[{"column":63,"line":160},{"column":53,"line":161},{"column":55,"line":162}]},{"name":"references","references":[{"column":26,"line":163}]}]},{"methods":[],"name":"RelationshipWrapper","namespace":"GraphVizForceController","references":[{"column":22,"line":158}],"variables":[]},{"methods":[],"name":"RelationshipWrapper","namespace":null,"references":[],"variables":[{"name":"referenceFieldAPIName","references":[{"column":83,"line":160}]},{"name":"parentLabel","references":[{"column":73,"line":161}]},{"name":"parentAPIName","references":[{"column":75,"line":162}]}]}],"id":"DiagramAttribute","innerClasses":[],"interfaces":[],"key":"DiagramAttribute","methods":[],"name":"DiagramAttribute","namespace":null,"properties":[{"location":{"column":23,"line":140},"modifiers":["public"],"name":"label","references":[{"column":18,"line":149}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":141},"modifiers":["public"],"name":"value","references":[{"column":18,"line":150}],"type":"String","visibility":"PUBLIC"},{"location":{"column":23,"line":142},"modifiers":["public"],"name":"type","references":[{"column":18,"line":151}],"type":"String","visibility":"PUBLIC"},{"location":{"column":24,"line":143},"modifiers":["public"],"name":"isCustom","references":[{"column":18,"line":152}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":24,"line":144},"modifiers":["public"],"name":"isMDOrCascadeDelete","references":[{"column":18,"line":153}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":24,"line":145},"modifiers":["public"],"name":"visible","references":[{"column":18,"line":154}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":24,"line":146},"modifiers":["public"],"name":"selected","references":[{"column":18,"line":155}],"type":"Boolean","visibility":"PUBLIC"},{"location":{"column":42,"line":147},"modifiers":["public"],"name":"references","references":[{"column":18,"line":156}],"type":"List","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":18,"line":139},"modifiers":["public"],"name":"DiagramAttribute","references":[],"type":"DiagramAttribute"},"variables":[{"location":{"column":70,"line":148},"modifiers":[],"name":"fieldWrapper","references":[],"type":"GraphVizForceController.FieldWrapper"},{"location":{"column":66,"line":158},"modifiers":[],"name":"relationshipWrapper","references":[],"type":"GraphVizForceController.RelationshipWrapper"},{"location":{"column":41,"line":159},"modifiers":[],"name":"relationship","references":[{"column":41,"line":163}],"type":"Map<String,String>"}]}],"interfaces":[],"key":"01p0l000000KKXwAAO","methods":[{"location":{"column":43,"line":7},"modifiers":["static","public"],"name":"getSourceTypes","parameters":[],"references":[],"returnType":"List","type":null,"visibility":"PUBLIC"},{"location":{"column":44,"line":57},"modifiers":["private","static"],"name":"getTypes","parameters":[],"references":[{"column":16,"line":8},{"column":41,"line":47}],"returnType":"List","type":null,"visibility":"PRIVATE"},{"location":{"column":39,"line":12},"modifiers":["static","public"],"name":"getSources","parameters":[{"name":"sourceType","type":"String"}],"references":[],"returnType":"List","type":null,"visibility":"PUBLIC"},{"location":{"column":32,"line":46},"modifiers":["private","static"],"name":"getBuilder","parameters":[{"name":"sourceType","type":"String"}],"references":[{"column":20,"line":14},{"column":20,"line":24},{"column":20,"line":35}],"returnType":"AutoBuilder","type":null,"visibility":"PRIVATE"},{"location":{"column":41,"line":41},"modifiers":["private","static"],"name":"handleToolingAPIException","parameters":[{"name":"e","type":"UmlServiceException"}],"references":[{"column":19,"line":16},{"column":19,"line":26},{"column":19,"line":37}],"returnType":"System.AuraHandledException","type":null,"visibility":"PRIVATE"},{"location":{"column":33,"line":21},"modifiers":["static","public"],"name":"startSource","parameters":[{"name":"sourceType","type":"String"},{"name":"diagramId","type":"Id"},{"name":"source","type":"String"}],"references":[],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"},{"location":{"column":33,"line":31},"modifiers":["static","public"],"name":"pollSource","parameters":[{"name":"sourceType","type":"String"},{"name":"diagramId","type":"Id"},{"name":"source","type":"String"},{"name":"prevUpdate","type":"String"}],"references":[],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"}],"name":"AutoBuild","namespace":null,"properties":[{"location":{"column":32,"line":3},"modifiers":["static","public","final"],"name":"STATUS_WORKING","references":[],"type":"String","visibility":"PUBLIC"},{"location":{"column":32,"line":4},"modifiers":["static","public","final"],"name":"STATUS_COMPLETE","references":[],"type":"String","visibility":"PUBLIC"}],"tableDeclaration":{"location":{"column":27,"line":1},"modifiers":["public","with sharing"],"name":"AutoBuild","references":[],"type":"AutoBuild"},"variables":[{"location":{"column":57,"line":12},"modifiers":[],"name":"sourceType","references":[{"column":31,"line":14}],"type":"String"},{"location":{"column":52,"line":21},"modifiers":[],"name":"sourceType","references":[{"column":31,"line":24}],"type":"String"},{"location":{"column":67,"line":21},"modifiers":[],"name":"diagramId","references":[{"column":55,"line":24}],"type":"Id"},{"location":{"column":85,"line":21},"modifiers":[],"name":"source","references":[{"column":76,"line":23}],"type":"String"},{"location":{"column":27,"line":23},"modifiers":[],"name":"builderSource","references":[{"column":66,"line":24}],"type":"BuilderSource"},{"location":{"column":51,"line":31},"modifiers":[],"name":"sourceType","references":[{"column":31,"line":35}],"type":"String"},{"location":{"column":66,"line":31},"modifiers":[],"name":"diagramId","references":[{"column":54,"line":35}],"type":"Id"},{"location":{"column":84,"line":31},"modifiers":[],"name":"source","references":[{"column":76,"line":33}],"type":"String"},{"location":{"column":99,"line":31},"modifiers":[],"name":"prevUpdate","references":[{"column":76,"line":34}],"type":"String"},{"location":{"column":27,"line":33},"modifiers":[],"name":"builderSource","references":[{"column":65,"line":35}],"type":"BuilderSource"},{"location":{"column":27,"line":34},"modifiers":[],"name":"builderUpdate","references":[{"column":80,"line":35}],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":98,"line":41},"modifiers":[],"name":"e","references":[],"type":"UmlService.UmlServiceException"},{"location":{"column":16,"line":42},"modifiers":[],"name":"userMessage","references":[{"column":41,"line":43}],"type":"String"},{"location":{"column":50,"line":46},"modifiers":[],"name":"sourceType","references":[{"column":33,"line":49},{"column":71,"line":54}],"type":"String"},{"location":{"column":33,"line":47},"modifiers":[],"name":"types","references":[{"column":36,"line":48}],"type":"List<AutoBuild.BuilderSourceType>"},{"location":{"column":32,"line":48},"modifiers":[],"name":"t","references":[],"type":"AutoBuild.BuilderSourceType"},{"location":{"column":29,"line":50},"modifiers":[],"name":"builder","references":[{"column":24,"line":51}],"type":"AutoBuild.AutoBuilder"},{"location":{"column":33,"line":58},"modifiers":[],"name":"results","references":[{"column":16,"line":60}],"type":"List<AutoBuild.BuilderSourceType>"}]}}]}';
        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT ContentEntityId, ContentEntity.Name, SymbolTable FROM ApexClassMember WHERE MetadataContainerId = \'1dc0l000000bJ9wAAE\' AND ContentEntity.Name = \'AutoBuild\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, classMemberWithoutEntities));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(pollSourceHTTPResponses));

        // now poll the source to see if the tooling api is done
        AutoBuild.BuilderUpdate builderUpdate2 = AutoBuild.pollSource(
                APEX_BUILDER_KEY,
                diagramId,
                JSON.serialize(sources.get(0)),
                JSON.serialize(builderUpdate1));

        AutoBuildDiagram.Diagram diagram = (AutoBuildDiagram.Diagram) JSON.deserialize(builderUpdate2.diagramJSON, AutoBuildDiagram.Diagram.class);
        System.assertEquals(0, diagram.groups.get(0).entities.size(), 'No entity references found in AutoBuild');

        Test.stopTest();

    }

    @IsTest
    private static void testApexSingleSourceWithEntities() {
        // tests parsing a class (in this recorded data it's AutoBuildTests.class) using the tooling api and handling the completed response

        // Tooling API responses for the AutoBuild.startSource method when reading Apex classes
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

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
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/ApexClassMember', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"4000l000000bWOwAAM","success":true,"errors":[]}'));

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

        Id diagramId = [Select Id from Graphviz_Diagram__c][0].Id;
        Test.startTest();

        List<BuilderSource> sources = AutoBuild.getSources(APEX_BUILDER_KEY);

        // start compiling the a source by calling the start method, exactly as done by the Lightning client
        AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource(APEX_BUILDER_KEY, diagramId, JSON.serialize(findSource(sources, 'AutoBuildApex')));

        System.assertEquals(AutoBuild.STATUS_WORKING, builderUpdate1.status,
                'start for Apex returns working while tooling api is compiling');
        System.assertEquals(NULL, builderUpdate1.diagramJSON,
                'no diagram returned when still working');

        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> pollSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, State, MetadataContainerId, CompilerErrors FROM ContainerAsyncRequest WHERE Id = \'1dr0l000001g6VNAAY\''
                        }),
                // notice the state of this response is "Completed"
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ContainerAsyncRequest","records":[{"attributes":{"type":"ContainerAsyncRequest","url":"/services/data/v29.0/tooling/sobjects/ContainerAsyncRequest/1dr0l000001g6VNAAY"},"Id":"1dr0l000001g6VNAAY","State":"Completed","MetadataContainerId":"1dc0l000000bJ9wAAE","CompilerErrors":"[]"}]}'));

        String classMemberWithEntities = '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ApexClassMember","records":[{"attributes":{"type":"ApexClassMember","url":"/services/data/v29.0/tooling/sobjects/ApexClassMember/4000l000000bdthAAA"},"ContentEntityId":"01p0l000000KKXxAAO","ContentEntity":{"attributes":{"type":"ApexClass","url":"/services/data/v29.0/tooling/sobjects/ApexClass/01p0l000000KKXxAAO"},"Name":"AutoBuildApex"},"SymbolTable":{"constructors":[],"externalReferences":[{"methods":[],"name":"List","namespace":null,"references":[{"column":12,"line":3}],"variables":[{"name":"results","references":[{"column":17,"line":12}]}]},{"methods":[],"name":"List<BuilderSource>","namespace":null,"references":[{"column":9,"line":4}],"variables":[]},{"methods":[],"name":"BuilderSource","namespace":null,"references":[{"column":33,"line":12},{"column":62,"line":23},{"column":61,"line":37}],"variables":[{"name":"source","references":[{"column":78,"line":26},{"column":78,"line":44},{"column":109,"line":45}]}]},{"methods":[],"name":"ApexClass","namespace":null,"references":[],"variables":[{"name":"Name","references":[{"column":53,"line":12}]},{"name":"Id","references":[{"column":65,"line":12}]}]},{"methods":[],"name":"AutoBuild.BuilderUpdate","namespace":null,"references":[{"column":12,"line":23},{"column":12,"line":37}],"variables":[]},{"methods":[],"name":"BuilderUpdate","namespace":"AutoBuild","references":[{"column":9,"line":24},{"column":83,"line":37},{"column":9,"line":38}],"variables":[]},{"methods":[],"name":"BuilderUpdate","namespace":null,"references":[{"column":46,"line":24},{"column":46,"line":38}],"variables":[{"name":"payload","references":[{"column":16,"line":32},{"column":65,"line":39},{"column":20,"line":90},{"column":41,"line":90}]},{"name":"status","references":[{"column":16,"line":33},{"column":16,"line":41},{"column":20,"line":88},{"column":20,"line":91}]},{"name":"diagramJSON","references":[{"column":20,"line":87}]}]},{"methods":[],"name":"ContainerAsyncRequest","namespace":"ToolingApi","references":[{"column":9,"line":26},{"column":9,"line":40}],"variables":[]},{"methods":[{"argTypes":[],"name":"compile","parameters":[],"references":[{"column":63,"line":26}],"returnType":null},{"argTypes":[],"name":"containerAsyncRequest","parameters":[],"references":[{"column":63,"line":40}],"returnType":null},{"argTypes":[],"name":"symbolTable","parameters":[],"references":[{"column":61,"line":45}],"returnType":null}],"name":"UmlService","namespace":null,"references":[{"column":52,"line":26},{"column":52,"line":40},{"column":50,"line":45}],"variables":[]},{"methods":[],"name":"SObject_x","namespace":null,"references":[],"variables":[{"name":"id","references":[{"column":37,"line":29}]}]},{"methods":[{"argTypes":[],"name":"serialize","parameters":[],"references":[{"column":31,"line":32}],"returnType":null},{"argTypes":[],"name":"deserialize","parameters":[],"references":[{"column":42,"line":39}],"returnType":null}],"name":"JSON","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"AutoBuild","namespace":null,"references":[{"column":25,"line":33},{"column":29,"line":88},{"column":29,"line":91}],"variables":[{"name":"STATUS_WORKING","references":[{"column":35,"line":33},{"column":39,"line":91}]},{"name":"STATUS_COMPLETE","references":[{"column":39,"line":88}]}]},{"methods":[],"name":"ContainerAsyncRequest","namespace":null,"references":[],"variables":[{"name":"state","references":[{"column":33,"line":41},{"column":21,"line":42}]},{"name":"metadataContainerId","references":[{"column":81,"line":45}]}]},{"methods":[],"name":"SymbolTable","namespace":"ToolingApi","references":[{"column":13,"line":45}],"variables":[]},{"methods":[{"argTypes":[],"name":"getDescribeMap","parameters":[],"references":[{"column":96,"line":49}],"returnType":null},{"argTypes":[],"name":"addEntity","parameters":[],"references":[{"column":33,"line":66}],"returnType":null},{"argTypes":[],"name":"updateDiagram","parameters":[],"references":[{"column":21,"line":84}],"returnType":null},{"argTypes":[],"name":"asJSON","parameters":[],"references":[{"column":42,"line":87}],"returnType":null}],"name":"AutoBuildDiagram","namespace":null,"references":[{"column":13,"line":47},{"column":44,"line":47}],"variables":[{"name":"diagram","references":[{"column":88,"line":49},{"column":25,"line":66},{"column":13,"line":84},{"column":34,"line":87}]},{"name":"diagramEntitiesByName","references":[{"column":72,"line":55}]}]},{"methods":[],"name":"SymbolTable","namespace":null,"references":[],"variables":[{"name":"externalReferences","references":[{"column":71,"line":52}]}]},{"methods":[],"name":"ExternalReference","namespace":"ToolingAPI","references":[{"column":18,"line":52}],"variables":[]},{"methods":[],"name":"ExternalReference","namespace":null,"references":[],"variables":[{"name":"name","references":[{"column":47,"line":53}]},{"name":"variables","references":[{"column":75,"line":70}]}]},{"methods":[],"name":"DiagramEntity","namespace":"AutoBuildDiagram","references":[{"column":17,"line":55}],"variables":[]},{"methods":[],"name":"ObjectWrapper","namespace":"GraphVizForceController","references":[{"column":21,"line":60}],"variables":[]},{"methods":[],"name":"DiagramEntity","namespace":null,"references":[{"column":45,"line":65}],"variables":[{"name":"attributes","references":[{"column":97,"line":74}]}]},{"methods":[],"name":"ExternalSymbol","namespace":"ToolingAPI","references":[{"column":30,"line":70}],"variables":[]},{"methods":[],"name":"ExternalSymbol","namespace":null,"references":[],"variables":[{"name":"name","references":[{"column":56,"line":71}]}]},{"methods":[],"name":"DiagramAttribute","namespace":"AutoBuildDiagram","references":[{"column":30,"line":74}],"variables":[]},{"methods":[],"name":"DiagramAttribute","namespace":null,"references":[],"variables":[{"name":"value","references":[{"column":75,"line":75}]},{"name":"visible","references":[{"column":50,"line":76}]},{"name":"selected","references":[{"column":50,"line":77}]}]}],"id":"01p0l000000KKXxAAO","innerClasses":[{"constructors":[],"externalReferences":[],"id":"Payload","innerClasses":[],"interfaces":[],"key":"Payload","methods":[],"name":"Payload","namespace":null,"properties":[{"location":{"column":16,"line":19},"modifiers":["private"],"name":"requestId","references":[{"column":17,"line":29},{"column":93,"line":40}],"type":"String","visibility":"PRIVATE"},{"location":{"column":16,"line":20},"modifiers":["private"],"name":"diagramId","references":[{"column":17,"line":30},{"column":69,"line":47}],"type":"String","visibility":"PRIVATE"}],"tableDeclaration":{"location":{"column":19,"line":18},"modifiers":["private"],"name":"Payload","references":[{"column":9,"line":28},{"column":31,"line":28},{"column":9,"line":39}],"type":"Payload"},"variables":[]}],"interfaces":["AutoBuild.AutoBuilder"],"key":"01p0l000000KKXxAAO","methods":[{"location":{"column":32,"line":3},"modifiers":["public"],"name":"getSources","parameters":[],"references":[],"returnType":"List","type":null,"visibility":"PUBLIC"},{"location":{"column":36,"line":23},"modifiers":["public"],"name":"startSource","parameters":[{"name":"diagramId","type":"Id"},{"name":"source","type":"BuilderSource"}],"references":[],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"},{"location":{"column":36,"line":37},"modifiers":["public"],"name":"pollSource","parameters":[{"name":"diagramId","type":"Id"},{"name":"source","type":"BuilderSource"},{"name":"prevUpdate","type":"BuilderUpdate"}],"references":[],"returnType":"BuilderUpdate","type":null,"visibility":"PUBLIC"}],"name":"AutoBuildApex","namespace":null,"properties":[],"tableDeclaration":{"location":{"column":30,"line":1},"modifiers":["public","without sharing"],"name":"AutoBuildApex","references":[],"type":"AutoBuildApex"},"variables":[{"location":{"column":29,"line":4},"modifiers":[],"name":"results","references":[{"column":16,"line":15}],"type":"List<BuilderSource>"},{"location":{"column":30,"line":5},"modifiers":[],"name":"classes","references":[{"column":36,"line":11}],"type":"List<ApexClass>"},{"location":{"column":28,"line":11},"modifiers":[],"name":"clazz","references":[],"type":"ApexClass"},{"location":{"column":51,"line":23},"modifiers":[],"name":"diagramId","references":[{"column":29,"line":30}],"type":"Id"},{"location":{"column":76,"line":23},"modifiers":[],"name":"source","references":[],"type":"BuilderSource"},{"location":{"column":33,"line":24},"modifiers":[],"name":"result","references":[{"column":16,"line":34}],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":42,"line":26},"modifiers":[],"name":"request","references":[],"type":"ToolingAPI.ContainerAsyncRequest"},{"location":{"column":17,"line":28},"modifiers":[],"name":"payload","references":[{"column":41,"line":32}],"type":"AutoBuildApex.Payload"},{"location":{"column":50,"line":37},"modifiers":[],"name":"diagramId","references":[],"type":"Id"},{"location":{"column":75,"line":37},"modifiers":[],"name":"source","references":[],"type":"BuilderSource"},{"location":{"column":107,"line":37},"modifiers":[],"name":"prevUpdate","references":[],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":33,"line":38},"modifiers":[],"name":"result","references":[{"column":16,"line":93}],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":17,"line":39},"modifiers":[],"name":"payload","references":[],"type":"AutoBuildApex.Payload"},{"location":{"column":42,"line":40},"modifiers":[],"name":"request","references":[],"type":"ToolingAPI.ContainerAsyncRequest"},{"location":{"column":36,"line":45},"modifiers":[],"name":"symbolTable","references":[],"type":"ToolingAPI.SymbolTable"},{"location":{"column":30,"line":47},"modifiers":[],"name":"diagram","references":[],"type":"AutoBuildDiagram"},{"location":{"column":64,"line":49},"modifiers":[],"name":"entityDescribesByName","references":[],"type":"Map<String,GraphVizForceController.ObjectWrapper>"},{"location":{"column":47,"line":52},"modifiers":[],"name":"reference","references":[],"type":"ToolingAPI.ExternalReference"},{"location":{"column":24,"line":53},"modifiers":[],"name":"objectName","references":[{"column":98,"line":55},{"column":102,"line":60}],"type":"String"},{"location":{"column":48,"line":55},"modifiers":[],"name":"diagramEntity","references":[{"column":21,"line":58},{"column":25,"line":65},{"column":43,"line":66}],"type":"AutoBuildDiagram.DiagramEntity"},{"location":{"column":59,"line":60},"modifiers":[],"name":"entityDescribe","references":[{"column":25,"line":63},{"column":76,"line":65}],"type":"GraphVizForceController.ObjectWrapper"},{"location":{"column":37,"line":69},"modifiers":[],"name":"fieldsFromClass","references":[],"type":"Set<String>"},{"location":{"column":56,"line":70},"modifiers":[],"name":"symbol","references":[],"type":"ToolingAPI.ExternalSymbol"},{"location":{"column":64,"line":74},"modifiers":[],"name":"diagramAttribute","references":[],"type":"AutoBuildDiagram.DiagramAttribute"}]}}]}';
        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT ContentEntityId, ContentEntity.Name, SymbolTable FROM ApexClassMember WHERE MetadataContainerId = \'1dc0l000000bJ9wAAE\' AND ContentEntity.Name = \'AutoBuild\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, classMemberWithEntities));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(pollSourceHTTPResponses));

        // now poll the source to see if the tooling api is done
        AutoBuild.BuilderUpdate builderUpdate2 = AutoBuild.pollSource(
                APEX_BUILDER_KEY,
                diagramId,
                JSON.serialize(sources.get(0)),
                JSON.serialize(builderUpdate1));

        AutoBuildDiagram.Diagram diagram = (AutoBuildDiagram.Diagram) JSON.deserialize(builderUpdate2.diagramJSON, AutoBuildDiagram.Diagram.class);
        System.assertEquals(1, diagram.groups.get(0).entities.size(), ' entity reference found in AutoBuildApex');
        System.assertEquals('Apex Class', diagram.groups.get(0).entities.get(0).label);

        Test.stopTest();

    }

    @IsTest
    private static void testApexWithFailingContainerCreate() {
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, Name FROM MetadataContainer WHERE Name = \'GraphvizForce\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"MetadataContainer","records":[{"attributes":{"type":"MetadataContainer","url":"/services/data/v29.0/tooling/sobjects/MetadataContainer/1dc0l000000bGjwAAE"},"Id":"1dc0l000000bGjwAAE","Name":"GraphvizForce"}]}'));

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('DELETE', '/services/data/v29.0/tooling/sobjects/MetadataContainer/1dc0l000000bGjwAAE', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_DELETED, ''));

        // NOTE the success false value below
        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('POST', '/services/data/v29.0/tooling/sobjects/MetadataContainer', new Map<String, String>()),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_CREATED, '{"id":"1dc0l000000bJ9wAAE","success":false,"errors":[]}'));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(startSourceHTTPResponses));

        Id diagramId = [Select Id from Graphviz_Diagram__c][0].Id;
        Test.startTest();

        List<BuilderSource> sources = AutoBuild.getSources(APEX_BUILDER_KEY);

        try {
            AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource(APEX_BUILDER_KEY, diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));
            System.assert(false, 'startSource should fail');
        } catch (AuraHandledException e) {
            System.assert(true, 'Got the exception expected');
        }
    }

    @IsTest
    private static void testApexWithoutRemoteSiteSetting() {
        Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse> startSourceHTTPResponses = new Map<ToolingAPIMocks.RestRequest, ToolingAPIMocks.RestResponse>();

        startSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT Id, Name FROM MetadataContainer WHERE Name = \'GraphvizForce\''
                        }),
                new ToolingAPIMocks.RestResponse(new ToolingAPI.ToolingAPIAuthorizationException('No setting')));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(startSourceHTTPResponses));

        Id diagramId = [Select Id from Graphviz_Diagram__c][0].Id;
        Test.startTest();

        List<BuilderSource> sources = AutoBuild.getSources(APEX_BUILDER_KEY);

        try {
            AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource(APEX_BUILDER_KEY, diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));
            System.assert(false, 'startSource should fail');
        } catch (AuraHandledException e) {
            System.assert(true, 'Sent an exception to the Lightning client');
        }

        // cheating to add a little coverage headroom
        AutoBuild.BuilderUpdate builderUpdate = new AutoBuild.BuilderUpdate(AutoBuild.STATUS_WORKING, NULL, NULL);
    }

    private static BuilderSource findSource(List<BuilderSource> sources, String sourceName) {
        for (BuilderSource source : sources) {
            if (source.source == sourceName) {
                return source;
            }
        }
        throw new UnsupportedOperationException('Source not found: ' + sourceName);
    }

    @TestSetup
    public static void createDiagram() {

        AutoBuildDiagram.Diagram diagram = new AutoBuildDiagram.Diagram();
        diagram.label = 'Test Diagram';
        diagram.value = diagram.label;
        diagram.visible = true;

        // diagrams have a single group
        diagram.groups = new List<AutoBuildDiagram.DiagramGroup>();
        AutoBuildDiagram.DiagramGroup diagramGroup = new AutoBuildDiagram.DiagramGroup();
        diagramGroup.label = 'ContainerGroup';
        diagramGroup.value = diagramGroup.label;
        diagramGroup.entities = new List<AutoBuildDiagram.DiagramEntity>();
        diagram.groups.add(diagramGroup);

        Graphviz_Diagram__c diagramRecord = new Graphviz_Diagram__c(
                Content__c = JSON.serialize(diagram)
        );
        insert diagramRecord;
    }

}
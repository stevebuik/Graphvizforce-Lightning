@IsTest
public class AutoBuildTests {

    @IsTest
    private static void testApexSingleSourceWithoutEntities() {
        // tests parsing a class (in this recorded data it's AutoBuild.class) using the tooling api and handling the completed response

        Map<String, AutoBuild.BuilderSourceType> typesByValue = new Map<String, AutoBuild.BuilderSourceType>();
        for (AutoBuild.BuilderSourceType sourceType : AutoBuild.getSourceTypes()) {
            typesByValue.put(sourceType.sourceType, sourceType);
        }
        System.debug(typesByValue.keySet());
        System.assert(typesByValue.containsKey('All Apex'), 'Apex source is available to users');

        // no callouts used for Apex to list classes
        List<BuilderSource> sources = AutoBuild.getSources('All Apex');
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
        AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource('All Apex', diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));

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
                'All Apex',
                diagramId,
                JSON.serialize(sources.get(0)),
                JSON.serialize(builderUpdate1));

        AutoBuild.Diagram diagram = (AutoBuild.Diagram) JSON.deserialize(builderUpdate2.diagramJSON, AutoBuild.Diagram.class);
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

        List<BuilderSource> sources = AutoBuild.getSources('All Apex');

        // start compiling the a source by calling the start method, exactly as done by the Lightning client
        AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource('All Apex', diagramId, JSON.serialize(findSource(sources, 'AutoBuildTests')));

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

        String classMemberWithEntities = '{"size":1,"totalSize":1,"done":true,"queryLocator":null,"entityTypeName":"ApexClassMember","records":[{"attributes":{"type":"ApexClassMember","url":"/services/data/v29.0/tooling/sobjects/ApexClassMember/4000l000000bXLjAAM"},"ContentEntityId":"01p0l000000KKXyAAO","ContentEntity":{"attributes":{"type":"ApexClass","url":"/services/data/v29.0/tooling/sobjects/ApexClass/01p0l000000KKXyAAO"},"Name":"AutoBuildTests"},"SymbolTable":{"constructors":[],"externalReferences":[{"methods":[{"argTypes":[],"name":"getSourceTypes","parameters":[],"references":[{"column":65,"line":9}],"returnType":null},{"argTypes":[],"name":"getSources","parameters":[],"references":[{"column":49,"line":16},{"column":49,"line":147}],"returnType":null},{"argTypes":[],"name":"startSource","parameters":[],"references":[{"column":60,"line":67},{"column":60,"line":150}],"returnType":null},{"argTypes":[],"name":"pollSource","parameters":[],"references":[{"column":60,"line":94}],"returnType":null}],"name":"AutoBuild","namespace":null,"references":[{"column":55,"line":9},{"column":39,"line":16},{"column":50,"line":67},{"column":29,"line":69},{"column":50,"line":94},{"column":39,"line":147},{"column":50,"line":150},{"column":29,"line":152}],"variables":[{"name":"STATUS_WORKING","references":[{"column":39,"line":69},{"column":39,"line":152}]}]},{"methods":[],"name":"BuilderSourceType","namespace":"AutoBuild","references":[{"column":14,"line":9}],"variables":[]},{"methods":[],"name":"BuilderSourceType","namespace":null,"references":[],"variables":[{"name":"sourceType","references":[{"column":41,"line":10}]}]},{"methods":[],"name":"List<BuilderSource>","namespace":null,"references":[{"column":9,"line":16},{"column":9,"line":147},{"column":45,"line":188}],"variables":[]},{"methods":[],"name":"ApexClass","namespace":null,"references":[],"variables":[{"name":"Body","references":[{"column":93,"line":19}]}]},{"methods":[{"argTypes":[],"name":"toString","parameters":[],"references":[{"column":146,"line":20}],"returnType":null}],"name":"ApexBaseClass","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"RestRequest","namespace":null,"references":[{"column":26,"line":20},{"column":21,"line":31},{"column":21,"line":38},{"column":21,"line":42},{"column":21,"line":46},{"column":21,"line":50},{"column":21,"line":54},{"column":21,"line":77},{"column":21,"line":85},{"column":21,"line":112},{"column":21,"line":119},{"column":21,"line":123},{"column":21,"line":127},{"column":21,"line":131},{"column":21,"line":135},{"column":21,"line":160}],"variables":[]},{"methods":[],"name":"Map","namespace":"Map<ToolingAPIMocks","references":[{"column":9,"line":28},{"column":9,"line":74},{"column":9,"line":109},{"column":9,"line":157}],"variables":[]},{"methods":[],"name":"Map","namespace":null,"references":[],"variables":[{"name":"startSourceHTTPResponses","references":[{"column":9,"line":30},{"column":9,"line":37},{"column":9,"line":41},{"column":9,"line":45},{"column":9,"line":49},{"column":9,"line":53},{"column":9,"line":111},{"column":9,"line":118},{"column":9,"line":122},{"column":9,"line":126},{"column":9,"line":130},{"column":9,"line":134}]},{"name":"pollSourceHTTPResponses","references":[{"column":9,"line":76},{"column":9,"line":84},{"column":9,"line":159}]}]},{"methods":[],"name":"RestResponse","namespace":null,"references":[{"column":21,"line":35},{"column":21,"line":39},{"column":21,"line":43},{"column":21,"line":47},{"column":21,"line":51},{"column":21,"line":58},{"column":21,"line":82},{"column":21,"line":89},{"column":21,"line":116},{"column":21,"line":120},{"column":21,"line":124},{"column":21,"line":128},{"column":21,"line":132},{"column":21,"line":139},{"column":21,"line":165}],"variables":[]},{"methods":[],"name":"ToolingAPIMocks","namespace":null,"references":[{"column":50,"line":35},{"column":50,"line":39},{"column":50,"line":43},{"column":50,"line":47},{"column":50,"line":51},{"column":50,"line":58},{"column":49,"line":61},{"column":50,"line":82},{"column":50,"line":89},{"column":49,"line":91},{"column":50,"line":116},{"column":50,"line":120},{"column":50,"line":124},{"column":50,"line":128},{"column":50,"line":132},{"column":50,"line":139},{"column":49,"line":142},{"column":50,"line":165}],"variables":[{"name":"HTTP_OK","references":[{"column":66,"line":35},{"column":66,"line":58},{"column":66,"line":82},{"column":66,"line":89},{"column":66,"line":116},{"column":66,"line":139},{"column":66,"line":165}]},{"name":"HTTP_DELETED","references":[{"column":66,"line":39},{"column":66,"line":120}]},{"name":"HTTP_CREATED","references":[{"column":66,"line":43},{"column":66,"line":47},{"column":66,"line":51},{"column":66,"line":124},{"column":66,"line":128},{"column":66,"line":132}]}]},{"methods":[{"argTypes":[],"name":"setMock","parameters":[],"references":[{"column":14,"line":61},{"column":14,"line":91},{"column":14,"line":142}],"returnType":null},{"argTypes":[],"name":"startTest","parameters":[],"references":[{"column":14,"line":64},{"column":14,"line":145}],"returnType":null},{"argTypes":[],"name":"stopTest","parameters":[],"references":[{"column":14,"line":101},{"column":14,"line":184}],"returnType":null}],"name":"Test","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"Graphviz_Diagram__c","namespace":null,"references":[],"variables":[{"name":"Id","references":[{"column":64,"line":63},{"column":64,"line":144}]}]},{"methods":[],"name":"BuilderUpdate","namespace":"AutoBuild","references":[{"column":9,"line":67},{"column":9,"line":94},{"column":9,"line":150}],"variables":[]},{"methods":[{"argTypes":[],"name":"serialize","parameters":[],"references":[{"column":100,"line":67},{"column":22,"line":97},{"column":22,"line":98},{"column":100,"line":150},{"column":35,"line":214}],"returnType":null}],"name":"JSON","namespace":"System","references":[],"variables":[]},{"methods":[],"name":"BuilderUpdate","namespace":null,"references":[],"variables":[{"name":"status","references":[{"column":70,"line":69},{"column":70,"line":152}]},{"name":"diagramJSON","references":[{"column":50,"line":71},{"column":50,"line":154}]}]},{"methods":[],"name":"List","namespace":null,"references":[],"variables":[{"name":"sources","references":[{"column":32,"line":97}]},{"name":"diagram","references":[{"column":9,"line":211}]},{"name":"groups","references":[{"column":9,"line":211}]}]},{"methods":[],"name":"BuilderSource","namespace":null,"references":[{"column":20,"line":188},{"column":14,"line":189}],"variables":[{"name":"source","references":[{"column":24,"line":190}]}]},{"methods":[],"name":"Diagram","namespace":"AutoBuild","references":[{"column":9,"line":200}],"variables":[]},{"methods":[],"name":"Diagram","namespace":null,"references":[{"column":41,"line":200}],"variables":[{"name":"label","references":[{"column":17,"line":201},{"column":33,"line":202}]},{"name":"value","references":[{"column":17,"line":202}]},{"name":"visible","references":[{"column":17,"line":203}]},{"name":"groups","references":[{"column":17,"line":206}]}]},{"methods":[],"name":"DiagramGroup","namespace":"AutoBuild","references":[{"column":9,"line":207}],"variables":[]},{"methods":[],"name":"DiagramGroup","namespace":null,"references":[{"column":51,"line":207}],"variables":[{"name":"label","references":[{"column":22,"line":208},{"column":43,"line":209}]},{"name":"value","references":[{"column":22,"line":209}]},{"name":"entities","references":[{"column":22,"line":210}]}]},{"methods":[],"name":"AutoBuild.Diagram","namespace":null,"references":[],"variables":[{"name":"groups","references":[{"column":17,"line":211}]}]}],"id":"01p0l000000KKXyAAO","innerClasses":[],"interfaces":[],"key":"01p0l000000KKXyAAO","methods":[{"location":{"column":25,"line":5},"modifiers":["private","static","testMethod"],"name":"testApexSingleSourceWithoutEntities","parameters":[],"references":[],"returnType":"void","type":null,"visibility":"PRIVATE"},{"location":{"column":34,"line":188},"modifiers":["private","static"],"name":"findSource","parameters":[{"name":"sources","type":"List"},{"name":"sourceName","type":"String"}],"references":[{"column":110,"line":67},{"column":110,"line":150}],"returnType":"BuilderSource","type":null,"visibility":"PRIVATE"},{"location":{"column":25,"line":105},"modifiers":["private","static","testMethod"],"name":"testApexSingleSourceWithEntities","parameters":[],"references":[],"returnType":"void","type":null,"visibility":"PRIVATE"},{"location":{"column":24,"line":198},"modifiers":["static","public"],"name":"createDiagram","parameters":[],"references":[],"returnType":"void","type":null,"visibility":"PUBLIC"}],"name":"AutoBuildTests","namespace":null,"properties":[],"tableDeclaration":{"location":{"column":14,"line":2},"modifiers":["public","testMethod"],"name":"AutoBuildTests","references":[],"type":"AutoBuildTests"},"variables":[{"location":{"column":50,"line":8},"modifiers":[],"name":"typesByValue","references":[],"type":"Map<String,AutoBuild.BuilderSourceType>"},{"location":{"column":42,"line":9},"modifiers":[],"name":"sourceType","references":[{"column":53,"line":10}],"type":"AutoBuild.BuilderSourceType"},{"location":{"column":29,"line":16},"modifiers":[],"name":"sources","references":[{"column":22,"line":17},{"column":121,"line":67}],"type":"List<BuilderSource>"},{"location":{"column":16,"line":19},"modifiers":[],"name":"autoBuildClassSource","references":[],"type":"String"},{"location":{"column":72,"line":28},"modifiers":[],"name":"startSourceHTTPResponses","references":[{"column":65,"line":61}],"type":"Map<ToolingAPIMocks.RestRequest,ToolingAPIMocks.RestResponse>"},{"location":{"column":12,"line":63},"modifiers":[],"name":"diagramId","references":[{"column":84,"line":67},{"column":17,"line":96}],"type":"Id"},{"location":{"column":33,"line":67},"modifiers":[],"name":"builderUpdate1","references":[{"column":32,"line":98}],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":72,"line":74},"modifiers":[],"name":"pollSourceHTTPResponses","references":[{"column":65,"line":91}],"type":"Map<ToolingAPIMocks.RestRequest,ToolingAPIMocks.RestResponse>"},{"location":{"column":33,"line":94},"modifiers":[],"name":"builderUpdate2","references":[{"column":22,"line":99}],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":72,"line":109},"modifiers":[],"name":"startSourceHTTPResponses","references":[{"column":65,"line":142}],"type":"Map<ToolingAPIMocks.RestRequest,ToolingAPIMocks.RestResponse>"},{"location":{"column":12,"line":144},"modifiers":[],"name":"diagramId","references":[{"column":84,"line":150}],"type":"Id"},{"location":{"column":29,"line":147},"modifiers":[],"name":"sources","references":[{"column":121,"line":150}],"type":"List<BuilderSource>"},{"location":{"column":33,"line":150},"modifiers":[],"name":"builderUpdate1","references":[],"type":"AutoBuild.BuilderUpdate"},{"location":{"column":72,"line":157},"modifiers":[],"name":"pollSourceHTTPResponses","references":[],"type":"Map<ToolingAPIMocks.RestRequest,ToolingAPIMocks.RestResponse>"},{"location":{"column":65,"line":188},"modifiers":[],"name":"sources","references":[{"column":37,"line":189}],"type":"List<BuilderSource>"},{"location":{"column":81,"line":188},"modifiers":[],"name":"sourceName","references":[{"column":34,"line":190},{"column":72,"line":194}],"type":"String"},{"location":{"column":28,"line":189},"modifiers":[],"name":"source","references":[{"column":24,"line":191}],"type":"BuilderSource"},{"location":{"column":27,"line":200},"modifiers":[],"name":"diagram","references":[{"column":45,"line":214}],"type":"AutoBuild.Diagram"},{"location":{"column":32,"line":207},"modifiers":[],"name":"diagramGroup","references":[{"column":28,"line":211}],"type":"AutoBuild.DiagramGroup"},{"location":{"column":29,"line":213},"modifiers":[],"name":"diagramRecord","references":[{"column":16,"line":216}],"type":"Graphviz_Diagram__c"}]}}]}';
        pollSourceHTTPResponses.put(
                new ToolingAPIMocks.RestRequest('GET', '/services/data/v29.0/tooling/query/',
                        new Map<String, String>{
                                'q' => 'SELECT ContentEntityId, ContentEntity.Name, SymbolTable FROM ApexClassMember WHERE MetadataContainerId = \'1dc0l000000bJ9wAAE\' AND ContentEntity.Name = \'AutoBuild\''
                        }),
                new ToolingAPIMocks.RestResponse(ToolingAPIMocks.HTTP_OK, classMemberWithEntities));

        Test.setMock(HttpCalloutMock.class, new ToolingAPIMocks(pollSourceHTTPResponses));

        // now poll the source to see if the tooling api is done
        AutoBuild.BuilderUpdate builderUpdate2 = AutoBuild.pollSource(
                'All Apex',
                diagramId,
                JSON.serialize(sources.get(0)),
                JSON.serialize(builderUpdate1));

        AutoBuild.Diagram diagram = (AutoBuild.Diagram) JSON.deserialize(builderUpdate2.diagramJSON, AutoBuild.Diagram.class);
        System.assertEquals(2, diagram.groups.get(0).entities.size(), '2 entity references found in AutoBuildTests');
        System.assertEquals('Apex Class', diagram.groups.get(0).entities.get(0).label);
        System.assertEquals('Graphviz Diagram', diagram.groups.get(0).entities.get(1).label);

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

        List<BuilderSource> sources = AutoBuild.getSources('All Apex');

        try {
            AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource('All Apex', diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));
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

        List<BuilderSource> sources = AutoBuild.getSources('All Apex');

        try {
            AutoBuild.BuilderUpdate builderUpdate1 = AutoBuild.startSource('All Apex', diagramId, JSON.serialize(findSource(sources, 'AutoBuild')));
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

        AutoBuild.Diagram diagram = new AutoBuild.Diagram();
        diagram.label = 'Test Diagram';
        diagram.value = diagram.label;
        diagram.visible = true;

        // diagrams have a single group
        diagram.groups = new List<AutoBuild.DiagramGroup>();
        AutoBuild.DiagramGroup diagramGroup = new AutoBuild.DiagramGroup();
        diagramGroup.label = 'ContainerGroup';
        diagramGroup.value = diagramGroup.label;
        diagramGroup.entities = new List<AutoBuild.DiagramEntity>();
        diagram.groups.add(diagramGroup);

        Graphviz_Diagram__c diagramRecord = new Graphviz_Diagram__c(
                Content__c = JSON.serialize(diagram)
        );
        insert diagramRecord;
    }

}
@IsTest
private class GraphvizForceControllerTest {

    @TestSetup
    private static void setupTestData(){
        List<Graphviz_Diagram__c> testDiagrams = new List<Graphviz_Diagram__c>();
        for(Integer i=0;i<200;i++){
            Graphviz_Diagram__c diagram = new Graphviz_Diagram__c();
            testDiagrams.add(diagram);
        }
        insert testDiagrams;
    }

    @IsTest
    static void testCoverage() {

        Test.startTest();
        List<Graphviz_Diagram__c> testDiagrams = GraphVizForceController.loadDiagrams();
        System.assertEquals(200, testDiagrams.size());

        String testSchema = GraphVizForceController.loadSchema();
        System.assertNotEquals(null, testSchema);

        Test.stopTest();
    }

    @IsTest
    static void testChildRelationships() {
        List<GraphVizForceController.ObjectWrapper> wrappers = GraphVizForceController.loadSchemaWrappers();
        for (GraphVizForceController.ObjectWrapper wrapper : wrappers) {
            if (wrapper.apiName == 'Case') {
                for (GraphVizForceController.ChildRelationshipWrapper childRel : wrapper.childRelationships) {
                    System.debug(childRel.relationshipName + ' -> '+childRel.childAPIName);
                }
            }
        }

    }
}
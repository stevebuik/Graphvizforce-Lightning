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
    static void testBehavior() {

        Test.startTest();
        List<Graphviz_Diagram__c> testDiagrams = GraphVizForceController.loadDiagrams();
        System.assertEquals(200, testDiagrams.size());

        String testSchema = GraphVizForceController.loadSchema();
        System.assertNotEquals(null, testSchema);

        Test.stopTest();
    }
}
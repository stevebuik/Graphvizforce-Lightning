public class AutoBuildApexTests {


    public static ToolingAPI.SymbolTable getFakeSymbolTable() {
        ToolingAPI.SymbolTable symbolTable = new ToolingAPI.SymbolTable();
        symbolTable.externalReferences = new List<ToolingAPI.ExternalReference>();

        ToolingAPI.ExternalReference ref1 = new ToolingAPI.ExternalReference();
        ref1.name = 'Account';
        ref1.variables = new List<ToolingAPI.ExternalSymbol>();

        ToolingAPI.ExternalSymbol var1 = new ToolingAPI.ExternalSymbol();
        var1.name = 'Name';
        ToolingAPI.ExternalSymbol var2 = new ToolingAPI.ExternalSymbol();
        var2.name = 'Phone';

        ref1.variables.add(var1);
        ref1.variables.add(var2);

        symbolTable.externalReferences.add(ref1);

        ToolingAPI.ExternalReference ref2 = new ToolingAPI.ExternalReference();
        ref2.name = 'Opportunity';
        ref2.variables = new List<ToolingAPI.ExternalSymbol>();

        ToolingAPI.ExternalSymbol var3 = new ToolingAPI.ExternalSymbol();
        var3.name = 'Name';

        ref2.variables.add(var3);

        symbolTable.externalReferences.add(ref2);

        return symbolTable;
    }

    /**
     * @description Create a minimal diagram record, emulating the Lightning client diagram creation
     *
     * @param label the name of the new diagram
     *
     * @return the new diagram record Id
     */
    public static Id createDiagram(String label) {

        AutoBuild.Diagram diagram = new AutoBuild.Diagram();
        diagram.label = label;
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
        return diagramRecord.Id;
    }

}
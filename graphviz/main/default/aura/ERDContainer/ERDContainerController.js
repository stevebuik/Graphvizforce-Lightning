/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){
        // Disable user guide
        window.showUserGuide = false;
        helper.loadSchema(component, event, helper);
    },

    onDiagramMutate : function(component, event, helper){
        var entitiesToAdd = event.getParam('entitiesToAdd');
        var entitiesToRemove = event.getParam('entitiesToRemove');
        var fieldsMap = event.getParam('fieldsMap');
        helper.handleDiagramMutate(component, helper, entitiesToAdd, entitiesToRemove, fieldsMap);
    },

    /** List View Functions **/
    onSelectDiagram : function(component, event, helper){
        // Reset UI elements
        component.find('diagramConfigurator').find('objectPanel').set('v.searchTerm', '');
        component.find('diagramConfigurator').set('v.selectedObject', null);

        var diagram = event.getParam('scope');
        component.set('v.selectedDiagram', diagram);

        helper.handleSelectionMapUpdate(diagram);

        // Dispatch DiagramUpdatedEvent to subscribers
        $A.get("e.gvf2:DiagramUpdatedEvent").setParams({type:'SELECTION'}).fire();

        component.set('v.currentState', 'DETAIL');
    },

    onAddNewDiagram : function(component, event, helper){
        helper.handleAddDiagram(component, event, helper);
    },

    onRemoveDiagram : function(component, event, helper){
        var diagrams = component.get('v.diagrams');
        var diagramToRemove = event.getParam('scope');
        diagrams.forEach(function (diagram, index) {
            if(diagram.name === diagramToRemove.name){
                diagrams.splice(index, 1);
                component.set('v.diagrams', diagrams);
                return;
            }
        });

        // Delete diagram via apex controller
        helper.handleRemoveDiagram(component, diagramToRemove.id);
    },

    onBackToList : function(component, event, helper){
        component.set('v.currentState', 'LIST');
    },

    onCloneDiagram : function(component, event, helper) {
        helper.handleCloneDiagram(component, event, helper);
    },

    onTogglePreview: function (component, event, helper) {
        var isExpanded = event.getParam('scope');
        component.set('v.isShowDiagramConfigurator', !isExpanded);
    },
    onAutoBuildStart: function (component, event, helper) {
        var progress = component.find("autoBuildProgress");
        progress.set("v.diagramId", component.get("v.selectedDiagram").recordId);
        progress.set("v.sourceType", event.getParam("type"));
        progress.start();
    },
    onAutoBuildUpdate: function (component, event, helper) {
        component.set("v.isAutoBuildActive", true); // suppress the diagram save above
        component.set('v.selectedDiagram', event.getParams().diagram);
        component.set("v.isAutoBuildActive", false);
    },
})
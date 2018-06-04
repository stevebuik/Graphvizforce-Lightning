/**
 * Created by guan on 27/11/17.
 */
({
    doInit : function(component, event, helper){

        // Get cookies and setup user guide
        // var userGuideCompleted = localStorage.getItem('userGuideCompleted');
        // window.showUserGuide = !userGuideCompleted;
        // Disable user guide
        window.showUserGuide = false;
        helper.loadSchema(component, event, helper);

    },

    /** List View Functions **/
    onSearchDiagrams : function(component, event, helper) {
        GraphvizForce.DiagramUtils.onSearchDiagrams(component, event, helper);
    },

    gotoDiagramDetail : function(component, event, helper){
        GraphvizForce.DiagramUtils.gotoDiagramDetail(component, event, helper);
    },

    onAddNewDiagram : function(component, event, helper){
        helper.handleAddDiagram(component, event, helper);
    },

    onDiagramCreated : function(component, event, helper){
        GraphvizForce.DiagramUtils.onDiagramCreated(component, event, helper);
    },

    onRemoveDiagram : function(component, event, helper){
        GraphvizForce.DiagramUtils.onRemoveDiagram(component, event, helper);
    },

    onDragObjectToGroup : function(component, event, helper){
        GraphvizForce.DiagramUtils.onDragObjectToGroup(component, event, helper);
    },

    /**
     * @description:    Remove the object from target panel and add it back to source panel
     */
    onTargetPanelRemoveObject: function (component, event, helper) {
        GraphvizForce.DiagramUtils.onTargetPanelRemoveObject(component, event, helper);
    },

    onObjectAttributesUpdated : function(component, event, helper){
        GraphvizForce.DiagramUtils.onObjectAttributesUpdated(component, event, helper);
    },

    onBackToList : function(component, event, helper){
        component.set('v.currentState', 'LIST');
    },

    onObjectClicked : function(component, event, helper) {
        var obj = event.getParam('scope');
        component.find('diagramConfigurator').find('targetPanel').set('v.currentState', 'ATTRIBUTES');
        component.set('v.selectedObject', obj);
    },

    onAddObject : function(component, event, helper) {
        var objectToAdd = event.getParam('scope');
        var groupValue = 'ContainerGroup';
        helper.addObjectToGroup(component, helper, objectToAdd, groupValue);
    },

    onDiagramChanged: function (component, event, helper) {
        if (!component.get("v.isAutoBuildActive")) {
            helper.onSaveDiagram(component, event, helper);
        }
    },

    onCloneDiagram : function(component, event, helper) {
        helper.onCloneDiagram(component, event, helper);
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
        helper.initialiseObjects(component, event, helper);
    },
})
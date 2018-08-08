({
    /**
    * Update initialised variable to indicate required static resources are loaded and ready
    */
    doInit: function (component, event, helper) {
        component.set('v.initialised', true);
    },

    /**
    * Handler when user toggles the current state of view
    */
    onToggleState: function (component, event, helper) {
        var isExpanded = !component.get('v.isExpanded');
        component.set('v.isExpanded', isExpanded);
        component.getEvent('onTogglePreview').setParams({scope: isExpanded}).fire();
    },

    /**
    * Handler when user toggles self relationships
    */
    onToggleSelf: function (component, event, helper) {
        var diagram = component.get("v.diagram");
        var oldValue = diagram.settings.showSelfRelations;
        var newValue = $A.util.isUndefined(oldValue) ? true : !oldValue;
        diagram.settings.showSelfRelations = newValue;
        component.set("v.diagram", diagram);
        component.getEvent('onSettingsChange').setParams({showSelfRelations: newValue}).fire();
    },

    /**
     * App event DiagramUpdatedEvent handler: when diagram data is updated, re-render the graphviz diagram
     * Handler when user toggles user relationship fields
     */
    onToggleStdUser: function (component, event, helper) {
        var diagram = component.get("v.diagram");
        var oldValue = diagram.settings.showStandardUserRelations;
        if (helper.isUserObjectPresent(component)) {
            var newValue = $A.util.isUndefined(oldValue) ? true : !oldValue;
            diagram.settings.showStandardUserRelations = newValue;
            component.set("v.diagram", diagram);
            component.getEvent('onSettingsChange').setParams({showStandardUserRelations: newValue}).fire();
        } else {
            window.alert("User relationships require the User object in the diagram!")
        }
    },

    /**
     * Handler when user reset zoom level
     */
    onResetZoom : function(component, event, helper){
        component.find('diagramViewer').resetZoom();
    },

    /**
    * App event DiagramUpdatedEvent handler: when diagram data is updated, re-render the graphviz diagram
    */
    onDiagramUpdated: function (component, event, helper) {
        helper.render(component);
    },

    onSettingsChanged: function (component, event, helper) {
        if (event.getSource().getLocalId() != component.getLocalId()) { // avoid infinite loop
            var diagram = component.get("v.diagram");
            if (!$A.util.isEmpty(diagram)) {
                diagram.settings.obscureEntities = event.getParam('obscuredEntities');
                diagram.settings.from = event.getParam('from');
                helper.render(component);
            }
        }
    },

    /**
    * Set SVG content for user download after diagram is rendered
    */
    onDiagramRendered: function (component, event, helper) {
        component.set('v.svgContent', event.getParam('scope'));
    },

    /**
    * Handler when user press copy graphviz
    */
    handleCopyGraphviz: function (component, event, helper) {
        helper.copyContent(component, helper, 'graphvizContent');
    },

    /**
    * Handler when user press copy svg
    */
    handleCopySVG: function (component, event, helper) {
        helper.copyContent(component, helper, 'svgContent');
    },

    /**
    * Handler when user press download graphviz
    */
    handleDownloadGraphviz: function (component, event, helper) {
        var diagram = component.get('v.diagram');
        var content = component.get('v.graphvizContent');
        helper.saveToFile(diagram.label + '.gv', content);
    },

    /**
    * Handler when user press download SVG
    */
    handleDownloadSVG: function (component, event, helper) {
        var diagram = component.get('v.diagram');
        var content = component.get('v.svgContent');
        helper.saveToFile(diagram.label + '.svg', content);
    },
})
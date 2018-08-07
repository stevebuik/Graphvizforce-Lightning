({
    /**
    * Update initialised variable to indicate required static resources are loaded and ready
    */
    doInit: function (component, event, helper) {
        component.set('v.initialised', true);
    },

    /**
    * Handler when user toggle the current state of view
    */
    onToggleState: function (component, event, helper) {
        var isExpanded = !component.get('v.isExpanded');
        component.set('v.isExpanded', isExpanded);
        component.getEvent('onTogglePreview').setParams({scope: isExpanded}).fire();
    },

    /**
    * Handler when user toggle self relationship
    */
    onToggleSelf: function (component, event, helper) {
        component.set("v.showSelfRelations", !component.get("v.showSelfRelations"));
        helper.render(component);
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

    /**
    *
    */
    onFromChanged: function (component, event, helper) {
        component.set("v.obscuredEntities", event.getParam('obscuredEntities'));
        component.set("v.fromEntity", event.getParam('from'));
        // the mutate event below will be handled by this component, causing the render (onDiagramUpdated above)
        // but will also cause the diagram to be persisted by the ERDContainer
        component.getEvent('onDiagramMutate').setParams({
            entities: [],
            entitiesToRemove: [],
            fieldsMap: {},
            fieldsMode: 'MERGE',
            from: event.getParam('from')
        }).fire();
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
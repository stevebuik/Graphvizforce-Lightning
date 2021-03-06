({
    /**
     * App/Container initialisation entry point, fires first server call to fetch full schema
     */
    doInit: function (component, event, helper) {
        // Disable user guide
        window.showUserGuide = false;
        $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
        helper.loadSchema(component, event, helper);
        helper.loadDiagrams(component, event, helper);
    },

    /**
     * Handler when diagram is being mutated
     */
    onDiagramMutate: function (component, event, helper) {
        var entitiesToAdd = event.getParam('entitiesToAdd');
        var entitiesToRemove = event.getParam('entitiesToRemove');
        var fieldsMap = event.getParam('fieldsMap');
        var fieldsMode = event.getParam('fieldsMode');
        helper.handleDiagramMutate(component, helper, entitiesToAdd, entitiesToRemove, fieldsMap, fieldsMode);
    },

    onSettingsChange: function (component, event, helper) {
        var selectedDiagram = component.get('v.selectedDiagram');
        if (!$A.util.isEmpty(selectedDiagram)) { // protect against events firing during initial list/load time

            // TODO why is this required when other settings are persisted without code here
            var showUserRefs = event.getParam('showStandardUserRelations');
            if (!$A.util.isUndefined(showUserRefs)) {
                selectedDiagram.settings.showStandardUserRelationships = showUserRefs;
            }

            // update diagram data
            component.set('v.selectedDiagram', selectedDiagram);
            // update diagrams list data
            component.set('v.diagrams', helper.propagateDiagramList(component.get('v.diagrams'), selectedDiagram));

            // Persist the diagram to server
            helper.handlePersistDiagramData(component, selectedDiagram);

            // Dispatch DiagramUpdatedEvent to subscribers
            $A.get("e.gvf2:DiagramUpdatedEvent").setParams({type: 'MUTATION'}).fire();
        }
    },

    /**
     * Handler when user clicks on reload schema button
     */
    onReloadSchema: function (component, event, helper) {
        $A.util.toggleClass(component.find("mySpinner"), "slds-hide");
        helper.loadSchema(component, event, helper);
    },

    /** List View Functions **/
    /**
     * Handler when user changes the selection of current diagram
     */
    onSelectDiagram: function (component, event, helper) {
        // Reset UI elements
        component.find('diagramConfigurator').find('objectPanel').set('v.searchTerm', '');
        component.find('diagramConfigurator').set('v.selectedObject', null);

        var diagram = event.getParam('scope');
        component.set('v.selectedDiagram', diagram);
        component.set('v.selectionMap', helper.getUpdatedSelectionMap(diagram));

        // Dispatch DiagramUpdatedEvent to subscribers
        $A.get("e.gvf2:DiagramUpdatedEvent").setParams({type: 'SELECTION'}).fire();

        component.set('v.currentState', 'DETAIL');
    },

    /**
     * Handler when user adds a new diagram
     */
    onAddNewDiagram: function (component, event, helper) {
        helper.handleAddDiagram(component, event, helper);
        component.set('v.newDiagramName', '');
    },

    /**
     * Handler when user deletes a diagram
     */
    onRemoveDiagram: function (component, event, helper) {
        var diagrams = component.get('v.diagrams');
        var diagramToRemove = event.getParam('scope');
        diagrams.forEach(function (diagram, index) {
            if (diagram.name === diagramToRemove.name) {
                diagrams.splice(index, 1);
                component.set('v.diagrams', diagrams);
                return;
            }
        });

        // Delete diagram via apex controller
        helper.handleRemoveDiagram(component, diagramToRemove.id);
    },

    /**
     * Handler when user switch current state back to list mode
     */
    onBackToList: function (component, event, helper) {
        component.set('v.currentState', 'LIST');
    },

    /**
     * Handler when user clone a diagram
     */
    onCloneDiagram: function (component, event, helper) {
        helper.handleCloneDiagram(component, event, helper);
        component.set('v.cloneDiagramName', '');
    },

    /**
     * Handler when user toggles the preview mode
     */
    onTogglePreview: function (component, event, helper) {
        var isExpanded = event.getParam('scope');
        component.set('v.isShowDiagramConfigurator', !isExpanded);
    },

    /**
     * Handler when user starts auto build process
     */
    onAutoBuildStart: function (component, event, helper) {
        var progress = component.find("autoBuildProgress");
        progress.set("v.diagramId", component.get("v.selectedDiagram").recordId);
        progress.set("v.sourceType", event.getParam("type"));
        progress.start();
    }

})
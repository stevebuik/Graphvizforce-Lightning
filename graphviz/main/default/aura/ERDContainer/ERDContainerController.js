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

    onDiagramMutate : function(component, event, helper){
        console.log('@@@@ onDiagramMutate');
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
        //helper.initialiseObjects(diagram);
        //component.set('v.selectedDiagram', diagram);
        //helper.initialiseObjects(component, event, helper);
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
        Core.AuraUtils.execute(component, 'deleteDiagram', {'recordId':diagramToRemove.id}, function (returnValue){
        var result = JSON.parse(returnValue);
            if(result.serviceStatus.status != 'success'){
                window.alert('Error: Faield to delete diagram.');
            }
        });
    },

    onDragObjectToGroup : function(component, event, helper){
        var objects = component.get('v.objects');
        var selectedDiagram = component.get('v.selectedDiagram');
        var scope = event.getParam('scope');
        var objectToAdd = JSON.parse(scope.object);
        var groupValue = 'ContainerGroup';
        console.log('@@@@ onDragObjectToGroup');
        console.log(objectToAdd);
        console.log(groupValue);
        helper.addObjectToGroup(component, helper, objectToAdd, groupValue);
    },

    /**
     * @description:    Remove the object from target panel and add it back to source panel
     */
    onTargetPanelRemoveObject : function(component, event, helper){
        var obj = event.getParam('scope');
        var selectedDiagram = component.get('v.selectedDiagram');
        var objects = component.get('v.objects');
        var group = selectedDiagram.groups[0];

        var objectIndex = -1;
        var objectToRemove;
        group.entities.forEach(function (targetObject, objectIndex) {
            if(targetObject.value === obj.value){
                objectToRemove = targetObject;
                selectedDiagram.groups[0].entities.splice(objectIndex, 1);
                objects.push(objectToRemove);
                objects.sort(GraphvizForce.DiagramHelper.compare);
                component.set('v.selectedDiagram', selectedDiagram);
                component.set('v.objects', objects);
                return;
            }
        });
    },

    onObjectAttributesUpdated : function(component, event, helper){
        var attribute = event.getParam('scope');
        var selectedDiagram = component.get('v.selectedDiagram');
        var objects = component.get('v.objects');
        var selectedObject = component.get('v.selectedObject');

        // Find target object in groups and propagate attribute changes
        selectedDiagram.groups.forEach(function (group) {
            group.entities.forEach(function (targetObject) {
                if(targetObject.value === selectedObject.value){
                    targetObject.attributes.forEach(function (targetAttribute) {
                        if(targetAttribute.value === attribute.value){
                            targetAttribute.selected = attribute.selected;
                            component.set('v.selectedDiagram', selectedDiagram);
                            component.set('v.selectedObject', targetObject);
                            return;
                        }
                    });
                }
            });
        });

        // Find target object in objects and propagate attribute changes
        objects.forEach(function (targetObject) {
            if(targetObject.value === selectedObject.value){
                targetObject.attributes.forEach(function (targetAttribute) {
                    if(targetAttribute.value === attribute.value){
                        targetAttribute.selected = attribute.selected;
                        component.set('v.objects', objects);
                        component.set('v.selectedObject', targetObject);
                        return;
                    }
                });
            }
        });
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

    /*onDiagramChanged: function (component, event, helper) {
        helper.handleDiagramChange(component, event, helper);
        if (!component.get("v.isAutoBuildActive")) {
            helper.onSaveDiagram(component, event, helper);
        }
    },*/

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
        //DEPRECATED helper.initialiseObjects(component, event, helper);
    },
})
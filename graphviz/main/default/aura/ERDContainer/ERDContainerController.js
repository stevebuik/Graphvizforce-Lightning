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

        // Display user guide step 1
        //if(window.showUserGuide) component.find('diagramConfigurator').find('sourcePanel').find('objectPanel').set('v.showHelp1', true);

        /* Start Setup Mock Data */
        /*
        var objectNames = ['Account', 'Site', 'Task', 'Contract', 'ContractContactRole', 'Event', 'OpportunityCompetitor', 'OpportunityContactRole', 'OpportunityLineItem', 'PartnerRole', 'Pricebook', 'Contact', 'Lead', 'Case', 'User', 'Opportunity', 'Order', 'Product', 'Asset', 'Solution', 'AccountContactRole', 'Activity', 'Campaign', 'CampaignMember', 'CaseContactRole', 'ContentVersion'];
        var attributeArray = [{label:'Id', value:'Id', selected:true}, {label:'Name', value:'Name', selected:true}, {label:'Owner', value:'Owner', selected:true}, {label:'CreatedBy', value:'CreatedBy', selected:true}, {label:'Description', value:'Description', selected:false}, {label:'LastModifiedBy', value:'LastModifiedBy', selected:false}, {label:'Phone', value:'Phone', selected:false}, {label:'ShippingAddress', value:'ShippingAddress', selected:false}, {label:'Type', value:'Type', selected:false}, {label:'MobilePhone', value:'MobilePhone', selected:false}, {label:'Email', value:'Email', selected:false}, {label:'Website', value:'Website', selected:false}];
        for(var i=0;i<100;i++){
            attributeArray.push({label:'Z Attribute Name' + i, value:'ZAttributeValue' + i, selected:false});
        }
        for(var i=0;i<attributeArray.length;i++){
            attributeArray[i].visible = true;
        }
        attributeArray.sort(GraphvizForce.DiagramHelper.compare);

        var objects = [];
        var groupIndex = 0;
        for(var i=0;i<objectNames.length;i++){
            var objectName = objectNames[i];
            var groupName = 'Group'
            objects.push({label:objectName, value:objectName, visible:false, attributes:JSON.parse(JSON.stringify(attributeArray))});
        }

        for(var i=0;i<200;i++){
            objects.push({label:'Z Object Name' + i, value:'ZObjectValue' + i, visible:false, attributes:JSON.parse(JSON.stringify(attributeArray))});
        }

        objects.sort(GraphvizForce.DiagramHelper.compare);
        component.set('v.allObjects', objects);
        */
        /* END Setup Mock Data */

        /*
        var groups = [{label:'First Group', value:'First Group', entities:[]}];
        //var diagrams = [{label:'Sample Diagram', value:'Sample Diagram', visible:true, groups:groups}];
        var diagrams = [];
        component.set('v.diagrams', diagrams);
        */

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

    /* Deprecated functions
    // Diagram Group Implementation
    onTargetPanelRemoveObject : function(component, event, helper){
        var obj = event.getParam('scope');
        var selectedDiagram = component.get('v.selectedDiagram');
        var objects = component.get('v.objects');

        var groupIndex = -1;
        var objectIndex = -1;
        var objectToRemove;
        selectedDiagram.groups.forEach(function (group, groupIndex) {
            group.entities.forEach(function (targetObject, objectIndex) {
                if(targetObject.value === obj.value){
                    objectToRemove = targetObject;
                    return;
                }
            });
            if(groupIndex !== -1 && objectIndex !== -1){
                selectedDiagram.groups[groupIndex].entities.splice(objectIndex, 1);
                objects.push(objectToRemove);
                objects.sort(GraphvizForce.DiagramHelper.compare);
                component.set('v.selectedDiagram', selectedDiagram);
                component.set('v.objects', objects);
                return;
            }
        });
    },

    onAddObjectToGroupClicked : function(component, event, helper){
        component.set('v.showAddGroup', false);
        var objectToAdd = component.get('v.objectToAdd');
        var groupValue = event.getSource().get('v.value');
        helper.addObjectToGroup(component, helper, objectToAdd, groupValue);
    },

    onAddGroup : function(component, event, helper) {
        var selectedDiagram = component.get('v.selectedDiagram');
        var groupName = event.getParam('scope');
        var group = {label:groupName, value:groupName, entities:[]};
        selectedDiagram.groups.push(group);
        selectedDiagram.groups.sort(GraphvizForce.DiagramHelper.compare);
        component.set('v.selectedDiagram', selectedDiagram);
    },

    onRemoveGroup : function(component, event, helper) {
        var group = event.getParam('scope');
        var selectedDiagram = component.get('v.selectedDiagram');
        var objects = component.get('v.objects');
        selectedDiagram.groups.forEach(function (targetGroup, index) {
            if(targetGroup.value === group.value){
                targetGroup.entities.forEach(function (targetObject) {
                    objects.push(targetObject);
                });
                selectedDiagram.groups.splice(index, 1);
                objects.sort(GraphvizForce.DiagramHelper.compare);
                selectedDiagram.groups.sort(GraphvizForce.DiagramHelper.compare);
                component.set('v.objects', objects);
                component.set('v.selectedDiagram', selectedDiagram);
                return;
            }
        });
    },

    onEditGroupName : function(component, event, helper) {
        var scope = event.getParam('scope');
        var newGroupName = scope.newValue;
        var selectedDiagram = component.get('v.selectedDiagram');
        var updateIndex = selectedDiagram.groups.findIndex(function(x) { return x.value === scope.oldValue});

        var exists = false;
        selectedDiagram.groups.forEach(function (group){
            if(group.label === newGroupName){
                exists = true;
                return;
            }
        });

        if(exists){
            component.find('notifLib').showToast({
                "title": "Info",
                "message": 'This group name "'+ newGroupName +'" already exists.'
            });
        }
        else{
            selectedDiagram.groups[updateIndex].label = selectedDiagram.groups[updateIndex].value = scope.newValue;
            component.set('v.selectedDiagram', selectedDiagram);
        }
    },
    */
})
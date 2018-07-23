({
    // App event DiagramUpdatedEvent (type:Selection) handler
    onDiagramUpdated : function(component, event, helper){
        if(event.getParam('type') == 'SELECTION'){
            console.log('@@@@ set attributes null');
            component.set('v.attributes', null);
        }
    },

    onUpdateAttributes : function(component, event, helper){

        var object = component.get('v.object');
        if(object == null){
            component.set('v.attributes', null);
            return;
        }

        var fields = [];
        var attributes = [];
        var values = [];
        var fieldSelectionMap = GraphvizForce.selectionMap[object.apiName];
        GraphvizForce.allObjects.forEach(function(obj){
            if(obj.apiName === object.apiName){
                fields = obj.fields;
                return;
            }
        });

        fields.forEach(function(field){
            var isSelected = fieldSelectionMap != null && fieldSelectionMap[field.apiName];
            if(isSelected) values.push(field.apiName);
            attributes.push({label:field.label + ' [' + field.apiName + ']', value:field.apiName});
        });

        // Update attribute list and reset selection
        attributes.sort(GraphvizForce.DiagramHelper.compare);
        component.set('v.attributes', attributes);
        component.set('v.value', values);
    },

    /*
    TODO: When first field added / all fields removed, the object should be added / removed from the selection map. This will allow the attribute panel to be enabled all the time.
    */
    handleChange : function(component, event, helper){
        var value = component.get('v.value');
        var object = component.get('v.object');
        var fieldsMap = {};
        var fields = [];
        value.forEach(function(fieldAPIName){
            fields.push({apiName:fieldAPIName});
        });
        fieldsMap[object.apiName] = fields;
        component.getEvent('onDiagramMutate').setParams({fieldsMap:fieldsMap}).fire();
    },

    /*handleObjectChange : function(component, event, helper) {
        var object = component.get('v.object');
        var availableAttributes = [];
        var selectedAttributes = [];
        object.attributes.forEach(function(attribute){
            attribute.visible = true;
            if(attribute.selected){
                selectedAttributes.push(attribute);
            }
            else{
                availableAttributes.push(attribute);
            }
        });
		
        availableAttributes.sort(GraphvizForce.DiagramHelper.compare);
        selectedAttributes.sort(GraphvizForce.DiagramHelper.compare);
		        
		component.set('v.availableAttributes', availableAttributes);
		component.set('v.selectedAttributes', selectedAttributes);
        helper.handleFilterAvailable(component, event, helper);
        helper.handleFilterSelected(component, event, helper);
	},
    
	onAddClicked : function(component, event, helper) {
        var attribute = event.getParam('scope');
        attribute.selected = true;
        component.getEvent('onObjectAttributesUpdated').setParams({scope:attribute}).fire();
        if(window.showUserGuide) $A.get("e.gvf2:UserGuideEvent").setParams({scope:'step5'}).fire();
	},
    
    onRemoveClicked : function(component, event, helper) {
        var attribute = event.getParam('scope');
        attribute.selected = false;
        component.getEvent('onObjectAttributesUpdated').setParams({scope:attribute}).fire();
        if(window.showUserGuide) $A.get("e.gvf2:UserGuideEvent").setParams({scope:'step5'}).fire();
	},
    
    onSearchAvailable : function(component, event, helper) {
        helper.handleFilterAvailable(component, event, helper);
    },
    
    onSearchSelected : function(component, event, helper) {
        helper.handleFilterSelected(component, event, helper);
    },
    
    onAttributeClicked : function(component, event, helper) {
		event.stopPropagation();
    },

    handleUserGuideEvent : function(component, event, helper){
        var step = event.getParam('scope');
        component.set('v.showHelp4', step === 'step4' && window.showUserGuide);
    },*/
})
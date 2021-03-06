({
    /**
    * App event DiagramUpdatedEvent (type:Selection) handler: Clear attribute list when current diagram selection is changed
    */
    onDiagramUpdated : function(component, event, helper){
        if(event.getParam('type') == 'SELECTION'){
            component.set('v.attributes', null);
        }
    },

    /**
    * Populate attribute list when current object is changed
    */
    onUpdateAttributes : function(component, event, helper){

        var allObjects = component.get('v.allObjects');
        var selectionMap = component.get('v.selectionMap');
        var object = component.get('v.object');
        if(object == null){
            component.set('v.attributes', null);
            return;
        }

        var fields = [];
        var attributes = [];
        var values = [];
        var fieldSelectionMap = selectionMap[object.apiName];
        allObjects.forEach(function(obj){
            if(obj.apiName === object.apiName){
                fields = obj.fields;
                return;
            }
        });

        fields.forEach(function(field){
            var isSelected = fieldSelectionMap != null && fieldSelectionMap[field.apiName];
            if(isSelected) values.push(field.apiName);
            attributes.push({label:field.label, value:field.apiName});
        });

        // Update attribute list and reset selection
        attributes.sort(GraphvizForce.DiagramHelper.compare);
        component.set('v.attributes', attributes);
        component.set('v.value', values);
    },

    /**
    * Fire DiagramMutateEvent when user interact with the attribute list
    * TODO: When first field added / all fields removed, the object should be added / removed from the selection map. This will allow the attribute panel to be enabled all the time.
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
        component.getEvent('onDiagramMutate').setParams({fieldsMap:fieldsMap, fieldsMode:'OVERWRITE'}).fire();
    },
})
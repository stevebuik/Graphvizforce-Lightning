({
    /**
    * Calculates the filtered object list and update UI attribute
    */
    handleObjectListUpdate : function(component, event, helper){
        var allObjects = component.get('v.allObjects');
        var selectionMap = component.get('v.selectionMap');
        var filteredObjects = [];
        var currentState = component.get('v.currentState');
        var term = component.get('v.searchTerm');
        allObjects.forEach(function(object){
            var searchTermExist = term !== undefined && term !== '';
            var searchMatch = (searchTermExist && (object.label.toLowerCase().indexOf(term.toLowerCase()) !== -1 || object.apiName.toLowerCase().indexOf(term.toLowerCase()) !== -1));
            var isSelected = (selectionMap[object.apiName] != null);
            if((currentState == 'ALL' && (!searchTermExist || searchMatch)) || (currentState == 'SEARCH' && searchMatch) || (currentState == 'SELECTED' && isSelected && (!searchTermExist || searchMatch))){
                var uiObject = {label:object.label, apiName:object.apiName, selected:isSelected};
                filteredObjects.push(uiObject);
            }
        });
        filteredObjects.sort(GraphvizForce.DiagramHelper.compare);
        component.set('v.filteredObjects', filteredObjects);
    },
})
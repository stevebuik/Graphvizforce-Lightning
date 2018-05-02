({
    handleFilterAvailable : function(component, event, helper) {
        var attributes = component.get('v.availableAttributes');
        var term = component.get('v.availableSearchTerm');
        if(!$A.util.isEmpty(term)){
            term = term.toLowerCase();
            
            attributes.forEach(function(attr){
                attr.visible = (term === '' || attr.label.toLowerCase().indexOf(term) !== -1);
            });
            
            component.set('v.availableAttributes', attributes);
        }
    },
    
    handleFilterSelected : function(component, event, helper) {
        var attributes = component.get('v.selectedAttributes');
        var term = component.get('v.selectedSearchTerm')
        if(!$A.util.isEmpty(term)){
            term = term.toLowerCase();
            
            attributes.forEach(function(attr){
                attr.visible = (term === '' || attr.label.toLowerCase().indexOf(term) !== -1);
            });
            
            component.set('v.selectedAttributes', attributes);
        }
    }
})
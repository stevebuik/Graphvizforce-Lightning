window.GraphvizForce;
(function(GraphvizForce){

    var DiagramHelper = (function(){
        return {
            compare : function(a,b) {
                if (a.label < b.label)
                    return -1;
                if (a.label > b.label)
                    return 1;
                return 0;
            },

            compareName : function(a,b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            },

            // Validate the diagram for persistence
            isDiagramValidToPersist: function(diagram){
                var v = new pure.validator();
                var inputValidation = v.validate(diagram, pure.schemas.persisted);
                var isValid = inputValidation.errors.length == 0;
                if (!isValid) {
                    console.log(inputValidation.errors);
                }
                return isValid;
            },

            // Validate the diagram for viewer output
            isTranslatedValidToOutput: function(translated){
                var v = new pure.validator();
                var outputValidation = v.validate(translated, pure.schemas.view);
                var isValid = outputValidation.errors.length == 0;
                return isValid;
            },
        };
    })();
    GraphvizForce.DiagramHelper = DiagramHelper;
	
})(window.GraphvizForce || ( window.GraphvizForce = {} ));
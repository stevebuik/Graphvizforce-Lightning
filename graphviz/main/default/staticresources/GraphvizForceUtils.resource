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

            isDiagramValidToPersist: function(diagram){
                var v = new pure.validator();
                var inputValidation = v.validate(diagram, pure.schemas.persisted);
                return inputValidation.errors.length == 0;
            },

        };
    })();
    GraphvizForce.DiagramHelper = DiagramHelper;
	
})(window.GraphvizForce || ( window.GraphvizForce = {} ));
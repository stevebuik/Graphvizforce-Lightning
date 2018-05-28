window.Core;
(function(Core){

    var AuraUtils = (function(){
        return {
            execute: function(component, actionName, params, callback) {
                var action = component.get('c.' + actionName);
				if(params != null) action.setParams(params);
				action.setCallback(this, function(a) {
                    if (a.getState() === "SUCCESS"){
						var result = a.getReturnValue();
						callback(result);
                    }
                    else if (a.getState() === "ERROR"){
                    	var messages = [];
                        Core.AuraUtils.findErrorMessages(a.getError(), messages);
                        alert('Server error : ' + messages);
                    }

				});
				$A.enqueueAction(action);
            },
            findErrorMessages : function (obj, result){
                for (var prop in obj) {
                    var value = obj[prop];
                    if (typeof value === 'object') {
                        Core.AuraUtils.findErrorMessages(value, result);
                    }else {
                        if (prop === 'message')
                            result.push(value);
                    }
                }
            },
            showNotification: function(title, message) {
                var resultsToast = $A.get("e.force:showToast");
                if ($A.util.isUndefined(resultsToast)) {
                    console.log("Could not create showToast event!");
                } else {
                    resultsToast.setParams({
                        "title": title,
                        "message": message
                    });
                    resultsToast.fire();
                }
            }
        };
    })();
    Core.AuraUtils = AuraUtils;

})(window.Core || ( window.Core = {} ));
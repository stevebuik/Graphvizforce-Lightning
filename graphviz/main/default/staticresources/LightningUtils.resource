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
            },
            copyToClipboard(text) {
                // Copies a string to the clipboard. Must be called from within an
                // event handler such as click. May return false if it failed, but
                // this is not always possible. Browser support for Chrome 43+,
                // Firefox 42+, Safari 10+, Edge and IE 10+.
                // IE: The clipboard feature may be disabled by an administrator. By
                // default a prompt is shown the first time the clipboard is
                // used (per session).
                if (window.clipboardData && window.clipboardData.setData) {
                    // IE specific code path to prevent textarea being shown while dialog is visible.
                    return clipboardData.setData("Text", text);

                } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                    var textarea = document.createElement("textarea");
                    textarea.textContent = text;
                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
                    } catch (ex) {
                        console.warn("Copy to clipboard failed.", ex);
                        return false;
                    } finally {
                        document.body.removeChild(textarea);
                    }
                }
            }
        };
    })();
    Core.AuraUtils = AuraUtils;

})(window.Core || ( window.Core = {} ));
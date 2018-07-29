window.Core;
(function(Core){

    var SystemUtils = (function(){
        return {
            /*
            Returns a function, that, as long as it continues to be invoked, will not be triggered.
            The function will be called after it stops being called for N milliseconds.
            If 'immediate' is passed, trigger the function on the leading edge, instead of the trailing.
            Reference: https://davidwalsh.name/javascript-debounce-function
            */
            debounce: function(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },
        };
    })();
    Core.SystemUtils = SystemUtils;

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
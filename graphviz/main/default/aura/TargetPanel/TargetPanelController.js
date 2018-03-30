({
	onPillLabelClicked : function(component, event, helper) {
		component.getEvent('onObjectClicked').setParams(event.getParams()).fire();
        component.set('v.showHelp3', false);
        if(window.showUserGuide) $A.get("e.c:UserGuideEvent").setParams({scope:'step4'}).fire();
	},
    
    onBackToGroups : function(component, event, helper) {
        component.set('v.currentState', 'GROUPS');
        if(window.showUserGuide){
            $A.get("e.c:UserGuideEvent").setParams({scope:'step6'}).fire();
            window.showUserGuide = false;
            localStorage.setItem('userGuideCompleted', true);
        }

	},
    
    onRemoveObject : function(component, event, helper){
		component.getEvent('onRemoveObject').setParams(event.getParams()).fire();
    },
    
    onDragEnter : function(component, e, helper){
        if(e.target.nodeType === 1) {
			e.preventDefault();
			var dropTarget;
            if(e.target.classList.contains('dropTarget')){
                dropTarget = e.target;
            }
            else{
                dropTarget = helper.closest(e.target, '.dropTarget');
            }
            dropTarget.classList.add("drag-enter");
        }
    },
    
    onDragLeave : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            e.target.classList.remove("drag-enter");
        }
    },

    onDragOver : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            e.stopPropagation();
        }
    },
    
    onDrop : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            var dropTarget;
            if(e.target.classList.contains('dropTarget')){
                dropTarget = e.target;
            }
            else{
                dropTarget = helper.closest(e.target, '.dropTarget');
            }
            console.log('@@@@ onDrop dropTarget:', dropTarget);
			dropTarget.classList.remove("drag-enter");
			var value = e.dataTransfer.getData('value');
            component.getEvent('onDragObjectToGroup').setParams({scope:{object:value}}).fire();
        }
    },


    /*
    onDragEnter : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            var target = helper.closest(e.target, '.slds-box');
            target.classList.add("drag-enter");
        }
    },

    onDragLeave : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            e.target.classList.remove("drag-enter");
        }
    },

    onDrop : function(component, e, helper){
        if(e.target.nodeType === 1) {
            e.preventDefault();
            e.target.classList.remove("drag-enter");
            //var value = JSON.parse(e.dataTransfer.getData("value"));
            var value = e.dataTransfer.getData('value');
            var dropTarget = helper.closest(e.target, '.dropTarget');
            var group = dropTarget.getAttribute('data-group');
            component.getEvent('onDragObjectToGroup').setParams({scope:{group:group, object:value}}).fire();
        }
    },

    onAddGroup : function(component, event, helper){
        var newGroupName = component.get('v.newGroupName');
        var groups = component.get('v.groups');
        var exists = false;
        groups.forEach(function (group){
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
            component.getEvent('onAddGroup').setParams({scope:newGroupName}).fire();
        }
    },
    */

    onGroupsClicked : function(component, event, helper) {
        component.set('v.currentState', 'GROUPS');
    },

    onAttributesClicked : function(component, event, helper) {
        component.set('v.currentState', 'ATTRIBUTES');
    },

    handleUserGuideEvent : function(component, event, helper){
        var step = event.getParam('scope');
        component.set('v.showHelp3', step === 'step3' && window.showUserGuide);
        component.set('v.showHelp5', step === 'step5' && window.showUserGuide);
    },
})
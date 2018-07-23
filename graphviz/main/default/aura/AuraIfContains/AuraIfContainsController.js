/**
 * Created by guan on 15/7/18.
 */
({
    doInit : function(component, event, helper) {
        var keyword = component.get('v.keyword');
        var value = component.get('v.value');
        component.set('v.isShow', (keyword == null || (value != null && value.indexOf(keyword) > -1)));
    }
})
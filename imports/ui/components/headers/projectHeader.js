import { Tracker } from "meteor/tracker";

import "./projectHeader.html";

Template.projectHeader.onCreated(function(){

});

Template.projectHeader.helpers({
    projects:function(){
        return Projects.find({}, {sort:{created:1}});
    },
    allProjects:function(){
    	if(FlowRouter.getParam("projectId") == "all-projects")
    		return true;
    },
    page: function(){
    	return Session.get("activeRoute");
    },
    isActive: function(id){
        if(id == "all" && FlowRouter.getParam("projectId") == "all-projects"){
            return true;
        }else{
            if(FlowRouter.getParam("projectId") == id){
                return true;
            }
        }
    },
    pageGlobal:function(){
        return Session.get("pageGlobal");
    }
});
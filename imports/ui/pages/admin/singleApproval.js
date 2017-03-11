import "./singleApproval.html";

import "../../../api/tools/approvals/approvals.js";

Template.singleApproval.onCreated(function(){
    this.autorun(()=>{
        const projectId = FlowRouter.getParam("projectId"),
            toolId = FlowRouter.getParam("toolId"),
            approvalId = FlowRouter.getParam("approvalId");
        this.subscribe("singleProject", projectId);
        this.subscribe("singleTool", toolId);
        this.subscribe("singleApproval", approvalId);
        this.subscribe("projectUsers", projectId);
    });
});

Template.singleApproval.events({

});

Template.singleApproval.helpers({
    approval:function(){
        return Approvals.findOne(FlowRouter.getParam("approvalId"));
    },
    tool: function(){
        return Tools.findOne(FlowRouter.getParam("toolId"));
    },
    project: function(){
        return Projects.findOne(FlowRouter.getParam("projectId"));
    },
    getUserName: function(id){
        const user = Meteor.users.findOne(id);
        return user.username;
    }
});
import "./singleTask.html";

import "../../../api/tools/tasks/tasks.js";

Template.singleTask.onCreated(function(){
    this.autorun(()=>{
        const projectId = FlowRouter.getParam("projectId"),
            toolId = FlowRouter.getParam("toolId"),
            taskId = FlowRouter.getParam("taskId");
        this.subscribe("singleProject", projectId);
        this.subscribe("singleTool", toolId);
        this.subscribe("singleTask", taskId);
        this.subscribe("projectUsers", projectId);
    });
});

Template.singleTask.events({

});

Template.singleTask.helpers({
    task:function(){
        return Tasks.findOne(FlowRouter.getParam("taskId"));
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
    },
    answers: function(){
        const task = Tasks.findOne(FlowRouter.getParam("taskId"));
        if(task){
            let answers = [];
            _.each(task.answers, function(answer){
                answers.push(answer);
            });
            return answers;
        }
    },
    hasAnswers: function(){
        return false;
    },
    makeName: function(id){
        const user = Meteor.users.findOne(id);
        return user.username;
    },
    typeIs: function(type){
        const task = Tasks.findOne(FlowRouter.getParam("taskId"));
        if(task.type == type)
            return true;
    },
    getChoices: function(){
        return this.choices;
    }
});
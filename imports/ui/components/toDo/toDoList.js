import "./toDoList.html";

import { Tracker } from "meteor/tracker";

Template.toDoList.onCreated(function(){
    this.autorun(()=>{
        this.state = new ReactiveDict();
        this.state.setDefault({
            subsReady:false
        });

        let userId = Meteor.userId();
        this.subscribe('userProjects', userId, ()=>{
            let projects = Projects.find().fetch();
            let max = projects.length;
            let count = 0;
            _.each(projects, (project)=>{
                this.subscribe('projectTools', project._id);
                this.subscribe('projectTasks', project._id);
                this.subscribe('projectApprovals', project._id, ()=>{
                    count++;
                    if(count == max){
                        this.state.set("subsReady", true);
                        /*$( ".questions, .approvals" ).accordion({//Should be inside component
                            header: ".blockedHeader",
                            collapsible: true
                        });*/
                    }
                });
            });
        });

    });
});



Template.toDoList.onRendered(function(){

});

Template.toDoList.events({

});

Template.toDoList.helpers({
    projects: function(){
        var id = Meteor.userId();
        return Projects.find({users:id});
    },
    tasks: function(){
        var projectId = this._id;
        if(projectId)
            return Tasks.find({projectID:projectId, answer:{$exists: false}, "content.important":false});
    },
    importantTasks: function(){
        var projectId = this._id;
        if(projectId)
            return Tasks.find({projectID:projectId, answer:{$exists: false}, "content.important":true});
    },
    approval: function(){
        var projectId = this._id;
        if(projectId)
            return Approvals.find({projectID:projectId, answer:{$exists: false}, "content.important":false, users:Meteor.userId()});
    },
    importantApproval: function(){
        var projectId = this._id;
        if(projectId)
            return Approvals.find({projectID:projectId, answer:{$exists: false}, "content.important":true, users:Meteor.userId()});
    },
    countTask: function(){
        var projects = Projects.find().fetch(),
            nbTask = 0;
        _.each(projects, function(project){
            var projectID = project._id;
            nbTask = nbTask+Tasks.find({projectID:projectID, answer:{$exists: false}}).count();
        });
        return nbTask;
    },
    countApprob: function(){
        var projects = Projects.find().fetch(),
            nbApprob = 0;
        _.each(projects, function(project){
            var projectID = project._id;
            nbApprob = nbApprob+Approvals.find({projectID:projectID, answer:{$exists: false}, users:Meteor.userId()}).count();
        });
        return nbApprob;
    }
});
import { Tracker } from 'meteor/tracker';

import "./sidebar.html";


Template.sidebar.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false
    });
    this.autorun(()=>{
        this.subscribe("userProjects", Meteor.userId(), ()=>{
            let projects = Projects.find().fetch();
            _.each(projects, (project)=>{
                this.subscribe("projectTools", project._id);
                this.subscribe("projectTasks", project._id);
                this.subscribe("projectApprovals", project._id);
            });
        });
    });
});

Template.sidebar.events({

});

Template.sidebar.helpers({
    countTask: function(){
        var projects = Projects.find().fetch(),
            nbTask = 0;
        _.each(projects, function(project){
            var projectID = project._id;
            nbTask = nbTask+Tasks.find({projectID:projectID, answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count()+Tasks.find({projectID:projectID, answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).count();
        });
        return nbTask;
    },
    countApproval: function(){
        var projects = Projects.find().fetch(),
            nbApprob = 0;
        _.each(projects, function(project){
            var projectID = project._id;
            nbApprob = nbApprob+Approvals.find({projectID:projectID, answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count()+Approvals.find({projectID:projectID, answers:{$exists: false}, answeredBy:"All", users:Meteor.userId(), "answers.user":{$nin:[Meteor.userId()]} }).count();
        });
        return nbApprob;
    },
    isActiveRoute: function(name){
        if(Session.get("activeRoute") == name)
            return "active";
    },
    firstProject:function(){
        return Projects.findOne({}, {sort:{created:1}});
    }
});


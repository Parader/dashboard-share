import "./projectList.html";

Template.projectList.onCreated(function(){
    this.autorun(()=>{
        this.subscribe("userProjects", Meteor.userId());
    });
});

Template.projectList.helpers({
    projects: function(){
        return Projects.find();
    }
});
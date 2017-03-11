import "./tasks.html";

Template.tasks.onCreated(function(){
    this.autorun(()=>{
        Session.set("importantTasks", 0);
    });
});

Template.tasks.onRendered(function(){

});

Template.tasks.events({

});

Template.tasks.helpers({
	projects: function(){
        var id = Meteor.userId();
        return Projects.find({users:id});
    },
    tasks: function(){
        let tasks;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            tasks = Tasks.find({answers:{$exists: false}, answeredBy:"One of", "content.important":false, users:Meteor.userId()}).fetch();

            _.each(Tasks.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":false, users:Meteor.userId()}).fetch(), function(task){
                tasks.push(task);
            });

            return tasks;
        }else{
            tasks = Tasks.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", "content.important":false, users:Meteor.userId()}).fetch();

            _.each(Tasks.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":false, users:Meteor.userId()}).fetch(), function(task){
                tasks.push(task);
            });

            return tasks;
        }
    },
    importantTasks: function(){
        let importantTasks;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            importantTasks = Tasks.find({answers:{$exists: false}, answeredBy:"One of", "content.important":true, users:Meteor.userId()}).fetch();

            _.each(Tasks.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":true, users:Meteor.userId()}).fetch(), function(task){
                importantTasks.push(task);
            });

            return importantTasks;
        }else{
            importantTasks = Tasks.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", "content.important":true, users:Meteor.userId()}).fetch();

            _.each(Tasks.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":true, users:Meteor.userId()}).fetch(), function(task){
                importantTasks.push(task);
            });

            return importantTasks;
        }
    },
    index: function(index, important){
        if(important=="important"){
            Session.set("importantTasks", index+1);
            return index+1;
        }else{
            return index+1+Session.get("importantTasks");
        }

    },
    countTask: function(){
        let nbTask = 0;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            nbTask = Tasks.find({answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Tasks.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(task){
                nbTask++;
            });

            return nbTask;
        }else{
            nbTask = Tasks.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Tasks.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(task){
                nbTask++;
            });

            return nbTask;
        }
    },
    taskProject: function(projectId){
        const project = Projects.findOne(projectId);
        if(project)
        return project.title;
    },
    pageGlobal: function(){
        if(FlowRouter.getParam("projectId") == "all-projects")
            return true;
    },
    thereIsTask: function(){
        let nbTask = 0;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            nbTask = Tasks.find({answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Tasks.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(task){
                nbTask++;
            });

            if(nbTask>0)
                return true;
        }else{
            nbTask = Tasks.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Tasks.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(task){
                nbTask++;
            });

            if(nbTask>0)
                return true;
        }
    }
});
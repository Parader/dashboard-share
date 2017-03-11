import "./approvals.html";

Template.approvals.onCreated(function(){
    this.autorun(()=>{
        Session.set("importantApprovals", 0);
    });
});

Template.approvals.events({

});

Template.approvals.helpers({
    projects: function(){
        var id = Meteor.userId();
        return Projects.find({users:id});
    },
    approvals: function(){
        let approvals;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            approvals = Approvals.find({answers:{$exists: false}, answeredBy:"One of", "content.important":false, users:Meteor.userId()}).fetch();

            _.each(Approvals.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":false, users:Meteor.userId()}).fetch(), function(approval){
                approvals.push(approval);
            });

            return approvals;
        }else{
            approvals = Approvals.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", "content.important":false, users:Meteor.userId()}).fetch();

            _.each(Approvals.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":false, users:Meteor.userId()}).fetch(), function(approval){
                approvals.push(approval);
            });

            return approvals;
        }
    },
    importantApprovals: function(){
        let importantApprovals;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            importantApprovals = Approvals.find({answers:{$exists: false}, answeredBy:"One of", "content.important":true, users:Meteor.userId()}).fetch();

            _.each(Approvals.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":true, users:Meteor.userId()}).fetch(), function(approval){
                importantApprovals.push(approval);
            });

            return importantApprovals;
        }else{
            importantApprovals = Approvals.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", "content.important":true, users:Meteor.userId()}).fetch();

            _.each(Approvals.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, "content.important":true, users:Meteor.userId()}).fetch(), function(approval){
                importantApprovals.push(approval);
            });

            return importantApprovals;
        }
    },
    index: function(index, important){
        if(important=="important"){
            Session.set("importantApprovals", index+1);
            return index+1;
        }else{
            return index+1+Session.get("importantApprovals");
        }
    },
    countApproval: function(){
        let nbApproval = 0;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            nbApproval = Approvals.find({answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Approvals.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(approval){
                nbApproval++;
            });

            return nbApproval;
        }else{
            nbApproval = Approvals.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Approvals.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(approval){
                nbApproval++;
            });

            return nbApproval;
        }
    },
    approvalProject: function(projectId){
        const project = Projects.findOne(projectId);
        if(project)
        return project.title;
    },
    pageGlobal: function(){
        if(FlowRouter.getParam("projectId") == "all-projects")
            return true;
    },
    thereIsApproval: function(){
        let nbApproval = 0;
        if(FlowRouter.getParam("projectId") == "all-projects"){
            nbApproval = Approvals.find({answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Approvals.find({answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(approval){
                nbApproval++;
            });

            if(nbApproval>0)
                return true;
        }else{
            nbApproval = Approvals.find({projectID:FlowRouter.getParam("projectId"), answers:{$exists: false}, answeredBy:"One of", users:Meteor.userId()}).count();

            _.each(Approvals.find({projectID:FlowRouter.getParam("projectId"), answeredBy:"All", "answers.user":{$nin:[Meteor.userId()]}, users:Meteor.userId()}).fetch(), function(approval){
                nbApproval++;
            });

            if(nbApproval>0)
                return true;
        }
    }
});

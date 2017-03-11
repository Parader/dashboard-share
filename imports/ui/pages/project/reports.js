import "./reports.html";

Template.reports.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false
    });
    this.autorun(()=>{
        const projectId = FlowRouter.getParam('projectId');
        this.subscribe('projectReports', projectId, ()=>{
            this.state.set("subsReady", true);
        });
    });
});

Template.reports.events({
    'click': function(event,instance){
        console.log(instance.state.get("subsReady"));
    }
});

Template.reports.helpers({
    reports: function(){
        return Reports.find({}, {sort:{uploadedAt:-1}});
    },
    thereIsReport: function(){
        if(Reports.find().count()>0)
            return true;
    },
    pageLoaded: function(){
        return Template.instance().state.get("subsReady");
    }
});
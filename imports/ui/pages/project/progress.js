import "./progress.html";

Template.progress.onCreated(function(){
    this.autorun(()=>{
        this.state = new ReactiveDict();
        this.state.setDefault({
            subsReady:false
        });
        const projectId = FlowRouter.getParam('projectId'),
            userID = Meteor.userId();

        this.subscribe("projectTools", projectId, ()=>{
            const tools = Tools.find().fetch(),
                max = tools.length;
            let count = 0;
            _.each(tools, (tool)=>{
                this.subscribe('toolSteps', tool._id, ()=>{
                    count++;
                    if(count == max){
                        this.state.set("subsReady", true);
                    }
                });
            });
        });
    });
});

Template.progress.onRendered(function(){

});

Template.progress.events({
    'click .viewStriped': function(event, instance){
        //Session.set('viewStriped-'+this._id, !Session.get('viewStriped-'+this._id));
        instance.state.set("viewCompleted-"+this._id, !instance.state.get("viewCompleted-"+this._id));
    }
});

Template.progress.helpers({
    pageLoaded:function(){
        return Template.instance().state.get("subsReady");
    },
    project: function(){
        var pID = FlowRouter.getParam('projectId');
        return Projects.findOne(pID);
    },
    currentProject:function(){
        var pID = FlowRouter.getParam('projectId');
        return Projects.find(pID);
    },
    projects: function(){
        var pID = FlowRouter.getParam('projectId');
        return Projects.find({_id:{$ne:pID}});
    },
    tools: function(){
        var pID = FlowRouter.getParam('projectId');
        return Tools.find({projectID:pID});
    },
    steps: function(){
        var tID = this._id;
        if(tID){
            if(Template.instance().state.get("viewCompleted-"+tID))
                return Steps.find({toolID:tID}, {sort:{ord:1}});
            else
                return Steps.find({toolID:tID, status:{$ne:"Completed"}}, {sort:{ord:1}});
        }
    },
    anotedSteps: function(){
        const tID = this._id;
        return Steps.find({toolID:tID, note:{$exists: true}}, {sort:{ord:1}});
    },
    countPhases: function(){
        var tID = this._id;
        if(tID)
            return Steps.find({toolID:tID}).count();
    },
    countCompletedPhases: function(){
        var tID = this._id;
        if(tID)
            return Steps.find({toolID:tID, status:"Completed"}).count();
    },
    completedProgress: function(){
        var steps = Steps.find({toolID:this._id, status:"Completed"}).fetch(),
            completedProgress=0;
        _.each(steps, function(step){
            completedProgress+=parseInt(step.progressValue);
        });
        return completedProgress;
    },
    onlyOneTool: function(){
        var pID = FlowRouter.getParam('projectId');
        if(Tools.find({projectID:pID}).count()==1)
            return true;
        else
            return false;
    },
    getStatus: function(){
        if(this.status=="Completed")
            return "Done";
        else
            return this.status;
    },
    isDone: function(){
        if(this.status=="Completed")
            return true;
    },
    noStade: function(){
        if(!this.status)
            return true;
    },
    viewCompleted: function(){
        return Template.instance().state.get("viewCompleted-"+this._id);
    }
});
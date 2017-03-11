import "./approvalElement.html";

import { answerApproval } from '../../../api/tools/approvals/methods';

Template.approvalElement.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false
    });

    this.autorun(()=>{
        const projectId = FlowRouter.getParam("projectId");
        this.subscribe('projectTools', projectId, ()=>{
            this.state.set("subsReady", true);
        });

        Tracker.autorun(()=>{
            if(this.state.get("subsReady")){
                $(".imgLiquidFill").imgLiquid({
                    width:$(".approvalImageContainer").width(),
                    height:$(".approvalImageContainer").height(),
                    vertical:"center"
                });
            }
        });
    });
});

Template.approvalElement.events({
    'click .btnApprove': function(event, instance){
        instance.state.set("approve"+this._id, true);
        instance.state.set("refuse"+this._id, false);
    },
    'click .btnRefuse': function(event, instance){
        instance.state.set("approve"+this._id, false);
        instance.state.set("refuse"+this._id, true);
    },
    'submit .approbForm': function(event, instance){
        event.preventDefault();
        var aID = this._id,
            terms = $("#terms-"+aID).is(':checked'),
            comment = event.target.comment.value,
            approved = instance.state.get("approve"+this._id),
            refused = instance.state.get("refuse"+this._id),
            answered = instance.state.get("approve"+this._id)+instance.state.get("refuse"+this._id);
        if(terms && answered){
            var approbation = {
                id:aID,
                answer:{
                    answer:approved,
                    comment:comment,
                    user:Meteor.userId(),
                    terms:terms
                }
            };
            answerApproval.call(approbation, (err, result)=>{
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
        }else{
            //Error : You must answer and agree to the terms & conditions to proceed.
        }
        return false;
    },
    'change .termsChange': function(e){
        $(e.target).parent().toggleClass("active");
    }
});

Template.approvalElement.helpers({
    type:function(type){
        if(this.type == type)
            return true;
        else
            return false;
    },
    item:function(){
        return Approvals.findOne(this._id);
    },
    tool: function(){
        return Tools.findOne(this.toolID);
    },
    approve: function(){
        return Template.instance().state.get("approve"+this._id);
    },
    refuse: function(){
        return Template.instance().state.get("refuse"+this._id);
    }
});
import "./approval.html";

Template.approval.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        approve:false,
        decline:false
    });
});

Template.approval.onRendered(function(){
    $(".approval .intro .content .leftSide .imgContainer").imgLiquid();
});

Template.approval.events({
    'click .question .choices button': function(event, instance){
        if($(event.target).hasClass("positive")){
            instance.state.set("approve", true);
            instance.state.set("decline", false);
        }else{
            instance.state.set("approve", false);
            instance.state.set("decline", true);
        }
    }
});

Template.approval.helpers({
    isType: function(type){
        if(this.type == type)
            return true;
    },
    getIndex: function(){
        return this.index;
    },
    pending: function(){
        let m1 = moment(this.created),
            m2 = moment(new Date());
        const diff = moment.duration(m1.diff(m2)).humanize();
        return diff;
    },
    approve:function(){
        return Template.instance().state.get("approve");
    },
    decline:function(){
        return Template.instance().state.get("decline");
    }
});
import "./mainLayout.html";

Template.mainLayout.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false
    });
    this.autorun(()=>{
        const projectId = FlowRouter.getParam("projectId");
        this.subscribe('singleProject', projectId);
    });
});

Template.mainLayout.onRendered(function(){
    $(".button-collapse").sideNav({
        menuWidth:320
    });
});

Template.mainLayout.events({
    'click .colorbox': function(event){
        event.preventDefault();
        $.colorbox({
            href:$(event.target).data("src"),
            photo:true,
            fixed:true,
            maxWidth:"100%",
            maxHeight:"100%"
        });
        return false;
    }
});
import "./login.html";

Template.login.events({
    'click a': function(event, instance){
        event.preventDefault();
        const link = event.target.getAttribute("data-page");
        $(".loginContainer").addClass("fadeAppear");
        setTimeout(function(){
            FlowRouter.go(link);
        },200);
        return false
    }
});
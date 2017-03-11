import "./emptyLayout.html";

/*Template.emptyLayout.onRendered(function() {
    $(".fadeAppear").removeClass("fadeAppear");
});*/
/*Template.emptyLayout.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
        loginError: false
    });
});

Template.emptyLayout.events({
    'submit .loginForm': function(event, instance){
        event.preventDefault();
        var email = event.target.email.value;
        var passw = event.target.passw.value;
        if(email && passw){
            Meteor.loginWithPassword(email, passw, function(err){
                if(err){
                    instance.state.set("loginError", true);
                }else{
                    instance.state.set("loginError", false);
                }
            });
        }else{
            instance.state.set("loginError", true);
        }
        return false;
    },
    'click .lostPassword': function(event, instance){
        instance.state.set("loginError", true);
    }
});

Template.emptyLayout.helpers({
    hasLoginError(){
        const instance = Template.instance();
        if(instance.state.get("loginError")){
            //TweenLite.to(document.getElementsByClassName('fadeAppear'), 0.2, {autoAlpha:1, ease:Power0.easeNone});
            return true;
        }else{
            return false;
        }
    }
});*/
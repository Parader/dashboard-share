import "./login.html";

Template.loginForm.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
        error: false
    });

    this.showError = ()=>{
        $(".messageContainer").addClass("fadeFx");
        setTimeout(()=>{
            this.state.set("error", true);
            $(".messageContainer").removeClass("fadeFx");
        },200);
    }

    this.hideError = ()=>{
        $(".messageContainer").addClass("fadeFx");
        setTimeout(()=>{
            this.state.set("error", false);
            $(".messageContainer").removeClass("fadeFx");
        },200);
    }
});

Template.loginForm.onRendered(function(){
    $(".fadeAppear").removeClass("fadeAppear");
});

Template.loginForm.events({
    'submit form': function(event, instance){
        event.preventDefault();
        var email = event.target.email.value;
        var passw = event.target.passw.value;
        if(email && passw){
            Meteor.loginWithPassword(email, passw, function(err){
                if(err){
                    instance.showError();
                }else{
                    instance.hideError();
                }
            });
        }else{
            instance.showError();
        }
        return false;
    }
});

Template.loginForm.helpers({
    hasError(){
        const instance = Template.instance();
        if(instance.state.get("error")){
            return true;
        }else{
            return false;
        }
    }
});
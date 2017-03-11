import './forgot.html';
import { retrievePassword } from '../../../api/users/methods';

Template.forgotForm.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
        error: false,
        success: false
    });

    this.showError = ()=>{
        $(".messageContainer").addClass("fadeFx");
        setTimeout(()=>{
            this.state.set("error", true);
            this.state.set("success", false);
            $(".messageContainer").removeClass("fadeFx");
        },200);
    };

    this.showSuccess = ()=>{
         $(".messageContainer").addClass("fadeFx");
        setTimeout(()=>{
            this.state.set("error", false);
            this.state.set("success", true);
            $(".messageContainer").removeClass("fadeFx");
        },200);
    };

});

Template.forgotForm.onRendered(function(){
    $(".fadeAppear").removeClass("fadeAppear");
});

Template.forgotForm.events({
    'submit .forgotForm': function(event, instance){
        event.preventDefault();
        var email = event.target.email.value;
        if(email){
            retrievePassword.call(email, function(err,result){
                if(err){
                    console.log(err);
                    instance.showError();
                }else{
                    if(result){
                        event.target.email.value = "";
                        instance.showSuccess();
                    }else{
                        instance.showError();
                    }
                }
            });
        }else{
            instance.showError();
        }
        return false;
    }
});

Template.forgotForm.helpers({
    hasError(){
        const instance = Template.instance();
        if(instance.state.get("error")){
            return true;
        }else{
            return false;
        }
    },
    success(){
        const instance = Template.instance();
        if(instance.state.get("success")){
            return true;
        }else{
            return false;
        }
    }
});
import "./manageUsers.html";
import { newUser, deleteUser } from '../../../api/users/methods';
import { clearHistory } from '../../../api/users/methods';

Template.manageUsers.onCreated(function(){
    this.autorun(()=>{
        this.subscribe("allUsers");
    });
    this.state = new ReactiveDict();
    this.state.setDefault({
        add: false,
        error: false
    });
});

Template.manageUsers.events({
    'submit .addUser': function(event, instance){
        event.preventDefault();
        var email = event.target.email.value;
        var passw = event.target.passw.value;
        if(!email || !passw)
            $(".errorMessage.usersManagement").text("* All fields are required");
        else{
            newUser.call({email:email, passw:passw}, (err,obj)=>{
                if(err){
                    $(".errorMessage.usersManagement").text("* User email already used.");
                }else{
                    event.target.email.value = '';
                    event.target.passw.value = '';
                    $(".errorMessage.usersManagement").text("");
                    instance.state.set("add", false);
                    clearHistory.call(obj, (err, result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            //success
                            //console.log(result);
                        }
                    });
                }
            });
        }
        return false;
    },
    'click .deleteUser': function(event){
        var id = this._id;
        var sure = confirm('Are you sure?');
        if(sure)
            deleteUser.call(id);
    },
    'click .add': function(e, instance){
        instance.state.set("add", true);
    },
    'click .cancelAdd': function(e, instance){
        e.preventDefault();
        instance.state.set("add", false);
    }
});

Template.manageUsers.helpers({
    user: function(){
        return Meteor.users.find({}, {sort:{createdAt:-1}});
    },
    stateAdd: function(){
        return Template.instance().state.get("add");
    }
});
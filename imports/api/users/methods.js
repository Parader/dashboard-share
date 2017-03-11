import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const newUser = new ValidatedMethod({
    name:"users.newUser",
    mixins:[LoggedInMixin],
    checkRoles: {
        roles: ['admin'],
        rolesError: {
            error: 'not-allowed'
        }
    },
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate({email,passw}){
        check(email, String);
        check(passw, String);
    },
    run({email, passw}){
        var userId = Accounts.createUser({
            email: email,
            username: email,
            password: passw
        });
        if(Meteor.isServer)
            Roles.addUsersToRoles( userId, ['user'] );
        return userId;
    }
});

export const deleteUser = new ValidatedMethod({
    name:"users.delete",
    mixins:[LoggedInMixin],
    checkRoles: {
        roles: ['admin'],
        rolesError: {
            error: 'not-allowed'
        }
    },
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate(userId){
        check(userId, String);
    },
    run(userId){
        Meteor.users.remove(userId);
    }
});

export const retrievePassword = new ValidatedMethod({
    name:"users.retrievePassword",
    validate(email){
        check(email, String);
    },
    run(email){
        if(Meteor.users.findOne({username:email})){
            return true;
        }else{
            return false;
        }
    }
});

export const clearHistory = new ValidatedMethod({
    name:"users.clearHistory",
    validate(userId){
        check(userId, String);
    },
    run(userId){
        const date = new Date();
        Meteor.users.update(userId, {
            $set:{
                "profile.transferHistory":date
            }
        });
        return Meteor.users.update({_id:userId, "profile.depositFiles.date":{$lte:date} }, {
            $unset:{
                "profile.depositFiles":[{}]
            }
        });
    }
});

export const updateUserDepositHistory = new ValidatedMethod({
    name:"users.updateHistory",
    validate({userId, file}){
        check(userId, String);
        check(file, {
            name:String,
            size:Number
        });
    },
    run({userId, file}){
        return Meteor.users.update(userId, {
            $push:{
                "profile.depositFiles":{
                    name:file.name,
                    size:file.size,
                    date:new Date()
                }
            }
        });
    }
});

//Legacy methods (kept for example)

/*Meteor.methods({
    createUsers: function(email, passw){
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
          throw new Meteor.Error(403, "not-authorized");
        }
        var userId = Accounts.createUser({
            email: email,
            username: email,
            password: passw
        });

        Roles.addUsersToRoles( userId, ['user'] );
    },
    deleteUsers: function(id){
        var loggedInUser = Meteor.user();
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
          throw new Meteor.Error(403, "not-authorized");
        }
        Meteor.users.remove(id);
    },
    makeAdmin: function(){
        Roles.addUsersToRoles( Meteor.userId(), ['admin'] );
    },
    sendPassword: function(email){
        if(Meteor.users.findOne({username:email})){
            return true;
        }else{
            return false;
        }
    }
});*/

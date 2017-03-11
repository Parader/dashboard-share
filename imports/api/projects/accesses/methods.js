import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createAccess = new ValidatedMethod({
    name:"access.create",
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
    validate(access){
        check(access, {
            name:String,
            username:String,
            password:String,
            projectID:String
        });
    },
    run(access){
        Access.insert(access);
    }
});


export const deleteAccess = new ValidatedMethod({
    name:"access.delete",
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
    validate(accessId){
        check(accessId, String);
    },
    run(accessId){
        Access.remove(accessId);
    }
});





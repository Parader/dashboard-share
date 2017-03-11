import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createStep = new ValidatedMethod({
    name:"steps.create",
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
    validate({title, toolId, progress}){
        check(title, String);
        check(toolId, String);
        check(progress, String);
    },
    run({title, toolId, progress}){
        var stadeCount = Steps.find().count(),
            order      = stadeCount + 1;

        Steps.insert({
            title: title,
            toolID: toolId,
            progressValue: progress,
            ord:order
        });
    }
});

export const updateStep = new ValidatedMethod({
    name:"steps.update",
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
    validate(step){
        check(step, {
            _id:String,
            title:String,
            progress:String,
            status:String,
            note:String
        });
    },
    run({_id, title, progress, status, note}){
        Steps.update(_id, {
            $set:{
                title:title,
                progressValue:progress,
                status:status,
                note:note
            }
        });
    }
});

export const deleteStep = new ValidatedMethod({
    name:"steps.delete",
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
    validate(stepId){
        check(stepId, String);
    },
    run(stepId){
        Steps.remove(stepId);
    }
});




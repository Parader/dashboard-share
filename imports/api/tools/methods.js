import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createTool = new ValidatedMethod({
    name:"tools.create",
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
    validate({projectId, title, desc}){
        check(projectId, String);
        check(title, String);
        check(desc, String);
    },
    run({projectId, title, desc}){
        Tools.insert({
            title: title,
            description: desc,
            projectID: projectId
        });
    }
});

export const updateTool = new ValidatedMethod({
    name:"tools.update",
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
    validate({toolId, desc}){
        check(desc, String);
        check(toolId, String);
    },
    run({toolId, desc}){
        Tools.update(toolId, {
            $set:{
                description:desc
            }
        });
    }
});

export const deleteTool = new ValidatedMethod({
    name:"tools.delete",
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
    validate(toolId){
        check(toolId, String);
    },
    run(toolId){
        //Steps.remove({toolID:tID});
        //Tasks.remove({toolID:tID});
        //Approbations.remove({toolID:tID});
        //Uploads.remove({toolID:tID});
        Tools.remove(toolId);
    }
});




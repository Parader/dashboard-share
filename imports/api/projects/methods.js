import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createProject = new ValidatedMethod({
    name:"projects.create",
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
    validate({title, desc, users}){
        check(title, String);
        check(desc, String);
        check(users, [String]);
    },
    run({title, desc, users}){
        var status = "In progress";
        Projects.insert({
            title: title,
            description: desc,
            status: status,
            users: users
        });
    }
});

export const deleteProject = new ValidatedMethod({
    name:"projects.delete",
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
    validate(projectId){
        check(projectId, String);
    },
    run(projectId){
        Projects.remove(projectId);
    }
});

export const updateProject = new ValidatedMethod({
    name:"projects.updateStatus",
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
    validate({projectId, status, desc}){
        check(projectId, String);
        check(status, String);
        check(desc, String);
    },
    run({projectId, status, desc}){
        Projects.update(projectId, {
            $set:{
                status:status,
                description:desc
            }
        });
    }
});

export const removeProjectUser = new ValidatedMethod({
    name:"projects.removeUser",
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
    validate({projectId, userId}){
        check(projectId, String);
        check(userId, String);
    },
    run({projectId, userId}){
        Projects.update(projectId, {
            $pull:{
                users: userId
            }
        });
    }
});

export const addProjectUser = new ValidatedMethod({
    name:"projects.addUser",
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
    validate({projectId, validUsers}){
        check(projectId, String);
        check(validUsers, [String]);
    },
    run({projectId, validUsers}){
        _.each(validUsers, function(userId){
            Projects.update(projectId, {
                $push:{
                    users:userId
                }
            });
        });
    }
});



/*Meteor.methods({
    removeUpload: function(uID){
        check(uID, String);
        Uploads.remove(uID);
    },
    fileStored: function(uploadedAt, title, user){
        Uploads.update({uploadedAt:uploadedAt, title:title, userID:user},{
            $set:{
                stored:true
            }
        });
    }
});*/
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createUpload = new ValidatedMethod({
    name:"uploads.create",
    mixins:[LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate({uploadId, title, projectId, relId, toolId}){
        check(uploadId, String);
        check(title, String);
        check(projectId, String);
    },
    run({uploadId, title, type, projectId, relId, toolId}){
        Uploads.insert({
            _id: uploadId,
            title: title,
            type:type,
            userID:Meteor.userId(),
            projectID: projectId,
            relID:relId,
            toolID:toolId
        });
    }
});

export const deleteUpload = new ValidatedMethod({
    name:"uploads.delete",
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
    validate(uploadId){
        check(uploadId, String);
    },
    run(uploadId){
        //Steps.remove({toolID:tID});
        //Tasks.remove({toolID:tID});
        //Approbations.remove({toolID:tID});
        //Uploads.remove({toolID:tID});
        Uploads.remove(uploadId);
    }
});




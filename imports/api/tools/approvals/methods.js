import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createApproval = new ValidatedMethod({
    name:"approvals.create",
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
    validate(approval){
        check(approval, {
            type:String,
            answeredBy:String,
            users:[String],
            content:{
                title:String,
                description:String,
                important:Boolean,
                file:{
                    _id:String,
                    fileUrl:String,
                    key:String
                }
            },
            toolID:String,
            projectID:String
        });
    },
    run(approval){
        Approvals.insert(approval);
    }
});

export const answerApproval = new ValidatedMethod({
    name:"approvals.answer",
    mixins:[LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate(answer){
        check(answer, {
            id:String,
            answer:{
                answer:Boolean,
                comment:String,
                user:String,
                terms:Boolean
            }
        });
    },
    run(answer){
        Approvals.update(answer.id, {
            $push:{
                answers:{
                    answer:answer.answer.answer,
                    comment:answer.answer.comment,
                    user:answer.answer.user,
                    terms:answer.answer.terms
                }
            }
        });
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'deleteApproval':function(id){
            check(id, String);
            const approval = Approvals.findOne(id);
            AWS.config.update({
               accessKeyId: Meteor.settings.private.AWSAccessKeyId,
               secretAccessKey: Meteor.settings.private.AWSSecretAccessKey
            });

            var s3 = new AWS.S3();

            var deleteObject = Meteor.wrapAsync(
                s3.deleteObject({Bucket:"talk-dashboard", Key:approval.content.file.key}, function(error, data) {
                    if(error) {
                        console.log(error);
                    } else {
                        //console.log("success");
                    }
                })
            );

            Approvals.remove(id);
        }
    });
}




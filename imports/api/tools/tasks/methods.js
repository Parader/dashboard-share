import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createTask = new ValidatedMethod({
    name:"tasks.create",
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
    validate(task){
        check(task, {
            type:String,
            answeredBy:String,
            users:[String],
            content:{
                text:String,
                important:Boolean,
                image:Match.Maybe({
                    _id:String,
                    fileUrl:String,
                    key:String
                }),
                choices:Match.Maybe([{
                    choice:String,
                    image:Match.Maybe({
                        _id:String,
                        fileUrl:String,
                        key:String
                    }),
                    index:Number
                }])
            },
            toolID:String,
            projectID:String
        });
    },
    run(task){
        Tasks.insert(task);
    }
});

export const answerTask = new ValidatedMethod({
    name:"tasks.answer",
    mixins:[LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate({taskId, answer}){
        check(taskId, String);
        check(answer, Object);
    },
    run({taskId, answer}){
        answer.user = Meteor.userId();
        answer.date = new Date();
        return Tasks.update(taskId, {
            $push:{
                answers:answer
            }
        });
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'deleteTask':function(id){
            check(id, String);
            const task = Tasks.findOne(id);
            AWS.config.update({
               accessKeyId: Meteor.settings.private.AWSAccessKeyId,
               secretAccessKey: Meteor.settings.private.AWSSecretAccessKey
            });

            var s3 = new AWS.S3();

            if(task.content.image){
                var deleteObject = Meteor.wrapAsync(
                    s3.deleteObject({Bucket:"talk-dashboard", Key:task.content.image.key}, function(error, data) {
                        if(error) {
                            console.log(error);
                        } else {
                            //console.log("success");
                        }
                    })
                );
            }

            if(task.content.choices){
                task.content.choices.forEach(function(choice){
                    if(choice.image){
                        var deleteObject = Meteor.wrapAsync(
                            s3.deleteObject({Bucket:"talk-dashboard", Key:choice.image.key}, function(error, data) {
                                if(error) {
                                    console.log(error);
                                } else {
                                    //console.log("success");
                                }
                            })
                        );
                    }
                });
            }

            if(task.answers){
                task.answers.forEach(function(answer){
                    if(answer.uploads){
                        answer.uploads.forEach(function(upload){
                            var deleteObject = Meteor.wrapAsync(
                                s3.deleteObject({Bucket:"talk-dashboard", Key:upload.key}, function(error, data) {
                                    if(error) {
                                        console.log(error);
                                    } else {
                                        //console.log("success");
                                    }
                                })
                            );
                        });
                    }
                });
            }

            Tasks.remove(id);

        }
    });
}




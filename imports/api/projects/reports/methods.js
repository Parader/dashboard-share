import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createReport = new ValidatedMethod({
    name:"reports.create",
    mixins:[LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate({id, title, projectId, fileUrl, size}){
        check(id, String);
        check(title, String);
        check(projectId, String);
        check(fileUrl, String);
        check(size, Number);
    },
    run({id, title, projectId, fileUrl, key, size}){
        const project = Projects.findOne(projectId);
        Reports.insert({
            _id: id,
            title: title,
            projectID: projectId,
            fileUrl:fileUrl,
            key:project.title+"/"+id,
            size:size
        });
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'deleteReport':function({id, key}){
            check(id, String);
            check(key, String);
            AWS.config.update({
               accessKeyId: Meteor.settings.private.AWSAccessKeyId,
               secretAccessKey: Meteor.settings.private.AWSSecretAccessKey
            });

            var s3 = new AWS.S3();
               var params = {
               Bucket: "talk-dashboard",
               Key: key
            };

            var deleteObject = Meteor.wrapAsync(
               s3.deleteObject(params, function(error, data) {
                  if(error) {
                     console.log(error);
                  } else {
                     //console.log(data); success
                  }
               })
            );
            Reports.remove(id);

        }
    });
}






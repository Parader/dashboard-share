import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const createDeposit = new ValidatedMethod({
    name:"deposit.create",
    mixins:[LoggedInMixin],
    checkLoggedInError: {
        error: 'notLogged'
    },
    validate(deposit){
        check(deposit, {
            id:String,
            name:String,
            size: Number,
            type: String,
            user:String,
            projectId:String,
            fileUrl:String,
            key:String
        });
    },
    run(elm){
        Deposit.insert({
            _id: elm.id,
            name: elm.name,
            size: elm.size,
            type: elm.type,
            user: elm.user,
            projectID: elm.projectId,
            fileUrl:elm.fileUrl,
            key:elm.key
        });
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'deleteDeposit':function({id, key}){
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
                     console.log("success");
                  }
               })
            );
            Deposit.remove(id);

        }
    });
}






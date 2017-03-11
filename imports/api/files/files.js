/*Uploads = new Mongo.Collection("uploads");

uploadSchema = new SimpleSchema({
    title:{
        type: String
    },
    type:{
        type: String
    },
    userID:{
        type: String
    },
    projectID:{
        type: String,
        optional: true
    },
    toolID:{
        type: String,
        optional: true
    },
    relID:{
        type: String,
        optional: true
    },
    created:{
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
        optional: true
    }
});

Uploads.attachSchema(uploadSchema);*/

Slingshot.fileRestrictions("uploads", {
  allowedFileTypes: /.*/i/*[
    "video/avi", "video/msvideo", "video/x-msvideo", "video/mpeg", "audio/mpeg", "audio/x-mpeg", "video/x-mpeg", "video/quicktime", "video/mp4",
    "image/bmp", "image/x-icon", "image/jpeg", "image/pjpeg", "image/png",
    "text/plain", "text/css", "text/html", "application/plain", "application/msword", "application/postscript", "application/excel", "application/x-excel", "application/x-msexcel", "text/csv",
    "audio/midi", "application/x-midi", "audio/x-midi", "audio/mpeg3", "audio/x-mpeg-3", "audio/wav", "audio/x-wav",
    "application/octet-stream", "application/pdf", "application/zip", "multipart/x-zip", "application/x-zip-compressed", "application/x-compressed", "RAR"
  ]*/,
  maxSize: null//10 * 1024 * 1024 // 10 MB (use null for unlimited).
});

if(Meteor.isServer){
    Slingshot.createDirective("uploads", Slingshot.S3Storage, {
      bucket: "talk-dashboard",
      AWSAccessKeyId:Meteor.settings.private.AWSAccessKeyId,
      AWSSecretAccessKey:Meteor.settings.private.AWSSecretAccessKey,
      acl: "public-read",

      authorize: function () {
        //Deny uploads if user is not logged in.
        if (!this.userId) {
          var message = "Please login before posting files";
          throw new Meteor.Error("Login Required", message);
        }

        return true;
      },

      key: function (file, metaContext) {
        //Store file into a directory by the user's username.
        var project = Projects.findOne({_id:metaContext.projectId});
        //return user.username + "/" + file.name;
        return project.title + "/" + metaContext.id;
      }
    });
}


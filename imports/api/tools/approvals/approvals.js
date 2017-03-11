Approvals = new Mongo.Collection('approval');

ApprovalSchema = new SimpleSchema({
    type:{
        type:String,
        allowedValues:["Image", "Text", "Video"]
    },
    created:{
        type:Date,
        autoValue:function(){
            if(this.isInsert)
                return new Date();
        }
    },
    projectID:{
        type:String
    },
    toolID:{
        type:String
    },
    answeredBy:{
        type:String,
        allowedValues:["One of", "All"]
    },
    users:{
        type:[String],
        optional:true
    },
    adminViewed:{
        type:Boolean,
        optional:true
    },
    content:{
        type:Object
    },
    "content.title":{
        type:String
    },
    "content.description":{
        type:String,
        optional:true
    },
    "content.important":{
        type:Boolean,
        optional:true
    },
    "content.file":{
        type:Object
    },
    "content.file._id":{
        type:String
    },
    "content.file.fileUrl":{
        type:String
    },
    "content.file.key":{
        type:String
    },
    answers:{
        type:[Object],
        optional:true
    },
    "answers.$.answer":{
        type:Boolean
    },
    "answers.$.comment":{
        type:String,
        optional:true
    },
    "answers.$.date":{
        type:Date,
        autoValue:function(){
            if(this.isUpdate)
                return new Date();
        },
        optional:true
    },
    "answers.$.user":{
        type:String
    },
    "answers.$.terms":{
        type:Boolean
    }
});

Approvals.attachSchema(ApprovalSchema);

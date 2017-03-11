Tasks = new Mongo.Collection('tasks');

Task = new SimpleSchema({
    type:{// type of answer
        type: String,
        allowedValues: ['Text', 'Choice', 'Upload', 'Selection', 'none']
    },
    created:{
        type: Date,
        autoValue: function(){
            if(this.isInsert)
                return new Date();
        }
    },
    toolID:{
        type:String
    },
    projectID:{
        type:String
    },
    adminViewed:{
        type:Boolean,
        optional:true
    },
    answeredBy:{
        type:String,
        allowedValues: ["One of", "All"]
    },
    users:{
        type: [String],
        optional:true
    },
    content:{
        type:Object
    },
    "content.text":{
        type:String,
        optional:true
    },
    "content.important":{
        type:Boolean
    },
    "content.image":{
        type:Object,
        optional:true
    },
    "content.image._id":{
        type:String
    },
    "content.image.fileUrl":{
        type:String
    },
    "content.image.key":{
        type:String
    },
    "content.choices":{
        type:[Object],
        optional:true
    },
    "content.choices.$.choice":{
        type:String,
        optional:true
    },
    "content.choices.$.index":{
        type:Number
    },
    "content.choices.$.image":{
        type:Object,
        optional:true
    },
    "content.choices.$.image._id":{
        type:String
    },
    "content.choices.$.image.fileUrl":{
        type:String
    },
    "content.choices.$.image.key":{
        type:String
    },
    answers:{
        type:[Object],
        optional:true
    },
    "answers.$.text":{
        type:String,
        optional:true
    },
    "answers.$.choices":{
        type:[String],
        optional:true
    },
    "answers.$.uploads":{
        type:[Object],
        optional:true
    },
    "answers.$.uploads.$._id":{
        type:String
    },
    "answers.$.uploads.$.fileUrl":{
        type:String
    },
    "answers.$.uploads.$.key":{
        type:String
    },
    "answers.$.uploads.$.name":{
        type:String
    },
    "answers.$.uploads.$.size":{
        type:Number
    },
    "answers.$.uploads.$.type":{
        type:String
    },
    "answers.$.date":{
        type:Date
    },
    "answers.$.user":{
        type:String
    },
    "answers.$.terms":{
        type:String
    }
});

Tasks.attachSchema(Task);




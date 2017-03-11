Tools = new Mongo.Collection('tools');

toolSchema = new SimpleSchema({
    title:{
        type: String,
        optional:true
    },
    description:{
        type: String,
        optional: true
    },
    projectID:{
        type: String
    },
    created:{
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
        optional: true
    },
    updated:{
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true
    }
});

Tools.attachSchema(toolSchema);
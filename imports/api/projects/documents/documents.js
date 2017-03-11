Documents = new Mongo.Collection("documents");

documentsSchema = new SimpleSchema({
    title:{
        type: String
    },
    projectID:{
        type: String,
        optional: true
    },
    fileUrl:{
        type: String
    },
    key:{
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
    size:{
        type:Number
    }
});

Documents.attachSchema(documentsSchema);
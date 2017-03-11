Reports = new Mongo.Collection("reports");

reportsSchema = new SimpleSchema({
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

Reports.attachSchema(reportsSchema);
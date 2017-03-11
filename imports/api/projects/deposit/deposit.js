Deposit = new Mongo.Collection("deposit");

depositSchema = new SimpleSchema({
    name:{
        type: String
    },
    type:{
        type:String
    },
    size:{
        type:Number
    },
    user:{
        type: String
    },
    projectID:{
        type: String
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
    }
});

Deposit.attachSchema(depositSchema);
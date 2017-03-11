Access = new Mongo.Collection("access");

accessSchema = new SimpleSchema({
    name:{
        type: String,
        optional:true
    },
    username:{
        type: String,
        optional:true
    },
    password:{
        type: String,
        optional:true
    },
    projectID:{
        type: String,
        optional: true
    },
    created:{
        type:Date,
        autoValue: function(){
            if(this.isInsert)
                return new Date();
        }
    }
});

Access.attachSchema(accessSchema);



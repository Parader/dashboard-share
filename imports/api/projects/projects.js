Projects = new Mongo.Collection('projects');

projectSchema = new SimpleSchema({
    title:{
        type: String
    },
    description:{
        type: String,
        optional: true
    },
    status:{
        type: String,
        optional: true
    },
    created:{
        type: Date,
        autoValue: function(){
            if(this.isInsert){
                return new Date();
            }
        }
    },
    updated:{
        type: Date,
        optional: true
    },
    users:{
        type: [String],
        optional:true
    }
});

Projects.attachSchema(projectSchema);

Steps = new Mongo.Collection('steps');

stepSchema = new SimpleSchema({
    title:{
        type: String
    },
    status:{
        type: String,
        allowedValues: ['On hold', 'Waiting', 'In progress', 'Completed'],
        optional:true
    },
    toolID:{
        type: String
    },
    ord:{
        type:Number,
        optional:true
    },
    progressValue:{
        type:String,
        optional:true
    },
    note:{
        type:String,
        optional:true
    }
});

Steps.attachSchema(stepSchema);

Sortable.collections = ['steps'];
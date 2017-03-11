Meteor.publish('toolTasks', function(toolId){
    return Tasks.find({toolID:toolId});
});

Meteor.publish('singleTask', function(taskId){
    return Tasks.find(taskId);
});

//Tasks for a given project
Meteor.publish('projectTasks', function(pID){
    check(pID, String);
    return Tasks.find({projectID:pID}, {order:{important:-1}});
});
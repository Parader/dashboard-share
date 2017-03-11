Meteor.publish('projectTools', function(projectId){
    check(projectId, String);
    return Tools.find({projectID:projectId});
});

Meteor.publish('singleTool', function(toolId){
    check(toolId, String);
    return Tools.find(toolId);
});
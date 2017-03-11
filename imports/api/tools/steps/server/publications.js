Meteor.publish('toolSteps', function(toolId){
    check(toolId, String);
    return Steps.find({toolID:toolId});
});

Steps.allow({
    insert: function(userId, doc){
        return Roles.userIsInRole(userId, ['admin']);//if user admin
    },
    remove: function(userId, doc){
        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc){
        return Roles.userIsInRole(userId, ['admin']);
    }
});
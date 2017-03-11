Meteor.publish('projectAccesses', function(projectId){
    if (!this.userId)//if not connected
        return this.ready();

    return Access.find({projectID:projectId});
});
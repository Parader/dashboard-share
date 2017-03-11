Meteor.publish("projectDocuments",  function(projectId){
    if (!this.userId)//if not connected
        return this.ready();

    return Documents.find({projectID:projectId});
});
Meteor.publish("projectReports",  function(projectId){
    if (!this.userId)//if not connected
        return this.ready();

    return Reports.find({projectID:projectId});
});
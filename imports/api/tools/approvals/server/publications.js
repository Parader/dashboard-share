Meteor.publish("toolApprovals", function(toolId){
    return Approvals.find({toolID:toolId});
});

Meteor.publish("singleApproval", function(approvalId){
    return Approvals.find(approvalId);
});

//Approval for a given project
Meteor.publish('projectApprovals', function(pID){
    check(pID, String);
    return Approvals.find({projectID:pID});
});
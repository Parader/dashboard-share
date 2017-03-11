Meteor.publish("userDeposit",  function(userId){
    if (!this.userId)//if not connected
        return this.ready();

    return Deposit.find({user:userId});
});

Meteor.publish("projectDeposit",  function(projectId){
    if (!this.userId)//if not connected
        return this.ready();

    return Deposit.find({projectID:projectId});
});
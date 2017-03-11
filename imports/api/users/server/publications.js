Meteor.publish('allUsers', function(){
    if (!this.userId || !Roles.userIsInRole(this.userId, ["admin"]))//if not connected/admin
        return this.ready();

    return Meteor.users.find();
});


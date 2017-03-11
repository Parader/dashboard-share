Meteor.publish('allProjects', function(){
    if (!this.userId || !Roles.userIsInRole(this.userId, ["admin"]))//if not connected/admin
        return this.ready();

    return Projects.find();
});

Meteor.publish('singleProject', function(id){
    if (!this.userId)//if not connected
        return this.ready();

    return Projects.find({_id:id});
});

Meteor.publish('projectUsers', function(id){
    check(id, String);
    var project = Projects.findOne({_id:id});
    var usersID = project.users;
    return Meteor.users.find({_id: {$in:usersID} });
});

Meteor.publish('userProjects', function(userId){
    return Projects.find({users:userId});
});
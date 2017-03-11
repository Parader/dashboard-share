//All uploads
Meteor.publish('allUploads', function(){
    return Uploads.find();
});

/*//Project uploads
Meteor.publish('projectUploads', function(pID){
    return Uploads.find({projectID:pID});
});

//Project reports
Meteor.publish('projectReports', function(pID){
    return Uploads.find({projectID:pID, report:true});
});

//Task uploads
Meteor.publish('taskUploads', function(tID){
    return Uploads.find({taskID:tID});
});

//Approval uploads
Meteor.publish('approvalUploads', function(aID){
    return Uploads.find({approbID:aID});
});

// Allow rules
Uploads.allow({
  insert: function(userId) { return !!userId; },
  update: function(userId) { return !!userId; },
  remove: function(userId) { return Roles.userIsInRole(userId, ['admin']); },
  download: function() { return true; }
});*/
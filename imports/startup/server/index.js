import "../../api/api.js";
if(!Meteor.users.find().count()){
    console.log("Creating admin");
    var userId = Accounts.createUser({
        email: "adminadmin.com",
        username: "admin",
        password: "admin"
    });
    Roles.addUsersToRoles( userId, ['admin'] );
}
Meteor.publish(null, function (){
  return Meteor.roles.find({})
})
import "./logout.html";

Template.logout.events({
    'click a'(){
        Meteor.logout();
    }
});
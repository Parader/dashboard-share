import "./emptyHeader.html";

Template.emptyHeader.helpers({
    loggedIn:function(){
        if(Meteor.userId())
            return true;
        else
            return false;
    }
});
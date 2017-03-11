import "./uploading.html";

Template.uploading.helpers({
    upload_images: function(){
        return Session.get('upload_images');
    }
});
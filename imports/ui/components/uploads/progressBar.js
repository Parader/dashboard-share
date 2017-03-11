import "./progressBar.html";

Template.progressBar.helpers({
    progress: function () {
      return Session.get('uploadProgress');
    }
});
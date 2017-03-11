import "./deposit.html";

import '../../../api/projects/projects.js';
import '../../../api/projects/deposit/deposit.js';

import { createDeposit } from '../../../api/projects/deposit/methods';

import { clearHistory, updateUserDepositHistory } from '../../../api/users/methods';

Template.deposit.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false,
        depotState:"initial",
        currentFiles:[],
        dropping:false
    });

    this.autorun(()=>{
        this.subscribe("userDeposit", Meteor.userId(), ()=>{
            this.state.set("subsReady", true);
        });
    });
});

Template.deposit.onRendered(function(){
    TweenLite.to($(".fileInput"), 0.3, {autoAlpha:1});
});

Template.deposit.events({
    'dragover .dropArea': function(event, instance){
        instance.state.set("dropping", true);
    },
    'dragleave .dropArea': function(event, instance){
        instance.state.set("dropping", false);
    },
    'change #fileInput': function(event, instance){
        $("#downloadBar").val(0);

        let files = $('#fileInput').get(0).files,
            currentFiles = [],
            projectID = FlowRouter.getParam('projectId'),
            user = Meteor.user();

        Session.set('uploadProgress', 0);
        Session.set('upload_images', []);

        if (files.length>0){//There is Files
            instance.state.set("depotState", 'download');
            let total_files = files.length;
            let uploads = _.map(files, function (file) {
                let metaContext = {
                    id: Random.id(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    projectId:FlowRouter.getParam("projectId"),
                    user:Meteor.userId()
                };

                let uploader = new Slingshot.Upload("uploads", metaContext);
                uploader.send(file,  (error, downloadUrl)=> {
                    if(error){
                        sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                    }else{
                        const project = Projects.findOne(metaContext.projectId);
                        metaContext.fileUrl = downloadUrl;
                        metaContext.key = project.title+"/"+metaContext.id;
                        createDeposit.call(metaContext, (err, result)=>{
                            if(err){
                                sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                            }else{
                                sAlert.success({sAlertTitle: 'Great', message: "Your file(s) will be transfered to us. Don't leave until the download reach 100%", type:""}, {});
                            }
                        });
                    }
                });
                return uploader;
            });

            var uploadTracker = Tracker.autorun(function (computation) {
                var image_array = [];
                var overall_progress = 0;
                _.each(uploads, function(a_uploader){
                    var prog = a_uploader.progress();
                    if (!isNaN(prog))
                        prog = Math.round(prog*100);
                    else
                        prog=0;
                    var image_details = {
                        url: a_uploader.url(),
                        progress: prog
                    };
                    image_array.push(image_details);
                    overall_progress = overall_progress+prog;
                });
                overall_progress = overall_progress/total_files;
                Session.set('upload_images', image_array);
                if (!isNaN(overall_progress)){
                  Session.set('uploadProgress', Math.round(overall_progress));
                }
                if(overall_progress==100){
                    computation.stop();
                    instance.state.set("depotState", "done");
                    setTimeout(()=>{
                        TweenLite.to($(".progressBarContainer"), 0.3, {autoAlpha:0, onComplete:()=>{
                            instance.state.set("depotState", "over");
                            setTimeout(function(){
                                TweenLite.to($(".fileInput"), 0.3, {autoAlpha:1});
                            }, 300);
                        }});
                    },2000);
                }
                return;
            });
        }else{//There is no file
            sAlert.error({sAlertTitle: 'Error', message: "Please verify that you've selected at least one file.", type:""}, {});
        }
    },
    'dropped .dropArea': function(event, instance){
        $("#downloadBar").val(0);
        instance.state.set("dropping", false);
        let files = event.originalEvent.dataTransfer.files,
            currentFiles = [],
            projectID = FlowRouter.getParam('projectId'),
            user = Meteor.user();

        Session.set('uploadProgress', 0);
        Session.set('upload_images', []);

        if (files.length>0){//There is Files
            instance.state.set("depotState", 'download');
            let total_files = files.length;
            let uploads = _.map(files, function (file) {
                let metaContext = {
                    id: Random.id(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    projectId:FlowRouter.getParam("projectId"),
                    user:Meteor.userId()
                };

                let uploader = new Slingshot.Upload("uploads", metaContext);
                uploader.send(file,  (error, downloadUrl)=> {
                    if(error){
                        sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                    }else{
                        const project = Projects.findOne(metaContext.projectId);
                        metaContext.fileUrl = downloadUrl;
                        metaContext.key = project.title+"/"+metaContext.id;
                        createDeposit.call(metaContext, (err, result)=>{
                            if(err){
                                sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                            }else{
                                sAlert.success({sAlertTitle: 'Great', message: "Your file(s) will be transfered to us. Don't leave until the download reach 100%", type:""}, {});
                            }
                        });
                        updateUserDepositHistory.call({userId:metaContext.user, file:{name:metaContext.name, size:metaContext.size}});
                    }
                });
                return uploader;
            });

            var uploadTracker = Tracker.autorun(function (computation) {
                var image_array = [];
                var overall_progress = 0;
                _.each(uploads, function(a_uploader){
                    var prog = a_uploader.progress();
                    if (!isNaN(prog))
                        prog = Math.round(prog*100);
                    else
                        prog=0;
                    var image_details = {
                        url: a_uploader.url(),
                        progress: prog
                    };
                    image_array.push(image_details);
                    overall_progress = overall_progress+prog;
                });
                overall_progress = overall_progress/total_files;
                Session.set('upload_images', image_array);
                if (!isNaN(overall_progress)){
                  Session.set('uploadProgress', Math.round(overall_progress));
                }
                if(overall_progress==100){
                    computation.stop();
                    instance.state.set("depotState", "done");
                    setTimeout(()=>{
                        TweenLite.to($(".progressBarContainer"), 0.3, {autoAlpha:0, onComplete:()=>{
                            instance.state.set("depotState", "over");
                            setTimeout(function(){
                                TweenLite.to($(".fileInput"), 0.3, {autoAlpha:1});
                            }, 300);
                        }});
                    },2000);
                }
                return;
            });
        }else{//There is File(s)
            sAlert.error({sAlertTitle: 'Error', message: "Please verify that you've selected at least one file.", type:""}, {});
        }
    },
    'click .clearHistory': function(){
        clearHistory.call(Meteor.userId(), (err, result)=>{
            if(err){
                sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
            }else{
                sAlert.success({sAlertTitle: 'Voilà', message: "Your history has been cleaned.", type:""}, {});
            }
        });
    }
});

Template.deposit.helpers({
    state: function(state1, state2){
        if(state1 == Template.instance().state.get("depotState") || state2 == Template.instance().state.get("depotState"))
            return true;
    },
    dropping: function(){
        return Template.instance().state.get("dropping");
    },
    currentFiles: function(){
        return Template.instance().state.get("currentFiles");
    },
    userDeposit: function(){
        const user = Meteor.users.findOne(Meteor.userId());
        if(user.profile.depositFiles){
            deposits = user.profile.depositFiles.reverse();
            let finalDeposit = [];
            _.each(deposits, function(file){
                if(file.date>user.profile.transferHistory)
                    finalDeposit.push(file);
            });
            return finalDeposit;
        }
    },
    makeSize: function(size){
        var sizeMb = size/1024;
        sizeMb = sizeMb/1024;
        sizeMb = sizeMb.toFixed(2);
        return sizeMb;
    },
    project:function(){
        const project = Projects.findOne(FlowRouter.getParam("projectId"));
        if(project)
            return project.title;
    }
});

/*Template.userProjectDeposit.onCreated(function(){
    var self = this;
    self.autorun(function(){
        var projectID = FlowRouter.getParam('projectId');
        self.subscribe('singleProject', projectID);
        self.subscribe('projectUploads', projectID);
        self.subscribe('userDepositHistory', Meteor.userId());
        Session.set('noState', true);
        Session.set('doneState', false);
        Session.set('downloadState', false);
        Session.set('errorState', false);
        Session.set('currentFiles', []);
    });
});

Template.userProjectDeposit.events({
    'change #fichiers': function(e){
        $(".downloadBar").val(0);
        $(".progressBarContainer").removeClass('reUpload');
        var currentFiles = [];
        Session.set('noState', false);
        Session.set('downloadState', true);
        var files = e,
            projectID = FlowRouter.getParam('projectId'),
            user = Meteor.user();
        FS.Utility.eachFile(files, function(file){
            var newFile = new FS.File(file);
            newFile.userID = user._id;
            newFile.projectID = projectID;
            newFile.depot = true;
            newFile.title = newFile.original.name;
            Uploads.insert(newFile, function(err, fileObj){
                if (err){
                    //console.log("Upload failed : "+err);
                    Session.set('errorState', true);
                }else{
                    $(".fileInput #fichiers").val('');
                    currentFiles.push({name:fileObj.title, id:fileObj._id, size:fileObj.original.size});
                    Session.set('currentFiles', currentFiles);
                    Meteor.call('addDepositHistory', fileObj.userID,fileObj.original.size,fileObj.title );
                }
            });
        });
    },
    'dropped #dropzone': function(e){
        $(".downloadBar").val(0);
        $(".progressBarContainer").removeClass('reUpload');
        var currentFiles = [];
        Session.set('noState', false);
        Session.set('downloadState', true);
        Session.set('dropping', false);
        var files = e,
            projectID = FlowRouter.getParam('projectId'),
            user = Meteor.user();
        FS.Utility.eachFile(files, function(file){
            var newFile = new FS.File(file);
            newFile.userID = user._id;
            newFile.projectID = projectID;
            newFile.depot = true;
            newFile.title = newFile.original.name;
            Uploads.insert(newFile, function(err, fileObj){
                if (err){
                    //console.log("Upload failed : "+err);
                    Session.set('errorState', false);
                }else{
                    $(".fileInput #fichiers").val('');
                    currentFiles.push({name:fileObj.title, id:fileObj._id, size:fileObj.original.size});
                    Session.set('currentFiles', currentFiles);
                    Meteor.call('addDepositHistory', fileObj.userID,fileObj.original.size,fileObj.title );
                }
            });
        });
    },
    'dragover #dropzone': function(){
        Session.set('dropping', true);
    },
    'dragleave #dropzone': function(){
        Session.set('dropping', false);
    },
    'change .downloadBar': function(e){
        Session.set('downloadValue', e.target.value);
    }
});

Template.userProjectDeposit.helpers({
    projectFile: function(){
        var projectID = FlowRouter.getParam('projectId'),
            userID = Meteor.userId();
        //return Uploads.find({projectID:projectID, depot:true, userID:userID}, {sort:{uploadedAt:-1}});
        return DepositHistory.find({user:userID}, {sort:{date:-1}});
    },
    makeSize: function(size){
        var sizeMb = size/1024;
        sizeMb = sizeMb/1024;
        sizeMb = sizeMb.toFixed(2);
        return sizeMb;
    },
    dropping: function(){
        return Session.get('dropping');
    },
    noState: function(){
        return Session.get('noState');
    },
    isDownloading: function(){
        return Session.get('downloadState');
    },
    isNotDownloading: function(){
        return !Session.get('downloadState');
    },
    progressValue: function(){
        var currentFiles = Session.get('currentFiles'),
            count = currentFiles.length+1;
        _.each(currentFiles, function(currentFile){
            var uploadID = currentFile.id,
                upload = Uploads.findOne({_id:uploadID});
            if(upload.stored)
                count--;
        });
        var num = 100/count;
        num = Math.round(num * 100) / 100;
        if(num == 100){
            Session.set('downloadState', false);
            hideBar();
        }
        return num;
    },
    isStored: function(){
        var uploadID = this.id;
        var upload = Uploads.findOne({_id:uploadID});
        if(upload)
            return upload.stored;
    },
    currentFiles: function(){
        return Session.get('currentFiles');
    },
    noError: function(){
        return !Session.get('errorState');
    }
});

function hideBar(){
    setTimeout(function(){
        $(".progressBarContainer").addClass('reUpload');
    },3000);
}*/
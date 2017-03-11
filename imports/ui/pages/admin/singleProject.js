import "./singleProject.html";

import "../../../api/projects/projects.js";
import "../../../api/tools/tools.js";
import "../../../api/projects/accesses/access.js";
import "../../../api/projects/documents/documents.js";
import "../../../api/projects/reports/reports.js";

import { updateProject, removeProjectUser, addProjectUser } from '../../../api/projects/methods';
import { createTool, deleteTool } from '../../../api/tools/methods';
import { createAccess, deleteAccess } from '../../../api/projects/accesses/methods';
import { createDocument } from '../../../api/projects/documents/methods';
import { createReport } from '../../../api/projects/reports/methods';

Template.singleProject.onCreated(function(){
    this.autorun(()=>{
        var projectId = FlowRouter.getParam('projectId');
        this.subscribe("singleProject", projectId);
        this.subscribe("projectTools", projectId);
        this.subscribe("projectAccesses", projectId);
        this.subscribe("projectDocuments", projectId);
        this.subscribe("projectReports", projectId);
        this.subscribe("projectDeposit", projectId);
        this.subscribe("allUsers");
    });
    this.state = new ReactiveDict();
    this.state.setDefault({
        editProject: false,
        addUser: false,
        addTool: false,
        addAccess: false
    });
    Session.setDefault('uploadProgress', 0);
    Session.setDefault('upload_images', []);
});

Template.singleProject.events({
    'click .changeState': function(event, instance){
        const state = $(event.target).parent().data("state");
        instance.state.set(state, !instance.state.get(state));
    },
    'click .saveProject': function(event, instance){
        var status = $("#projectStatus").val();
        var desc = $(".projectNewDesc").val();
        var projectId = FlowRouter.getParam('projectId');
        updateProject.call({projectId:projectId, status:status, desc:desc}, function(err,result){
            if(err){
                console.log(err);
            }else{
                instance.state.set("editProject", false);
            }
        });
    },
    'click .removeUser': function(event){
        var userId = this._id;
        var projectId = FlowRouter.getParam('projectId');
        removeProjectUser.call({projectId:projectId, userId:userId}, function(err,result){
            if(err){
                console.log(err);
            }else{
                //Success
            }
        });
    },
    'submit .addProjectUser': function(event, instance){
        event.preventDefault();
        var users = [];
        $(".multiple-select-dropdown li.active").each(function(){
            var nb = $(this).index()+1;
            users.push($("#users option:nth-child("+nb+")").val());
        });
        var projectId = FlowRouter.getParam('projectId');
        var validUsers=[];
        _.each(users, function(userID){
            if(Projects.findOne({users: userID}) ){
                console.log(userID+" Exist");
            }else{
                validUsers.push(userID);
            }
        });
        if(validUsers==[]){

        }else{
            addProjectUser.call({projectId:projectId, validUsers:validUsers}, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    $("#users").val("");
                    $('select').material_select();
                    instance.state.set("addUser", false);
                }
            });
        }
        return false;
    },
    'submit .createTool': function(event, instance){
        event.preventDefault();
        var title = event.target.title.value;
        var desc = event.target.description.value;
        var projectId = FlowRouter.getParam('projectId');
        if(!title || !desc || !projectId)
            $(".errorMessage.tool").text("* All fields are required");
        else{
            createTool.call({projectId:projectId, title:title, desc:desc}, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    //success
                    event.target.description.value = "";
                    event.target.title.value = "";
                    $(".errorMessage").text("");
                    instance.state.set("addTool", false);
                }
            });
        }
        return false;
    },
    'click .deleteTool': function(){
        var toolId = this._id;
        deleteTool.call(toolId);
    },
    'submit .createAccess': function(e, instance){
        e.preventDefault();
        var access = {
            name:event.target.name.value,
            username:event.target.username.value,
            password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(event.target.password.value)),
            projectID: FlowRouter.getParam('projectId')
        };
        if(!access.name || !access.username || !access.password)
            $(".errorMessage.access").text("* All fields are required");
        else{
            createAccess.call(access, function(err,obj){
                if(err)
                    console.log(err);
                else{
                    $(".errorMessage.access").text("");
                    e.target.name.value = "";
                    e.target.username.value = "";
                    e.target.password.value = "";
                    instance.state.set("addAccess", false);
                }
            });

        }
        return false;
    },
    'click .deleteAccess': function(){
        var sure = confirm("Are you sure?");
        if(sure === true)
            deleteAccess.call(this._id);
    },
    'click .deleteDeposit': function(){
        const deposit = Deposit.findOne(this._id);
        var sure = confirm("Are you sure?");
        if(sure === true)
            Meteor.call("deleteDeposit", {id:deposit._id, key:deposit.key}, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
    },
    'click .togglePassw': function(event, instance){
        instance.state.set(this._id, !instance.state.get(this._id));
    },
    'submit .addDoc': function(event, instance){
        event.preventDefault();
        const title = event.target.docTitle.value;
        //Session var for holding overall progress
        Session.set('uploadProgress', 0);
        //Session var for holding objects containing url and progress
        //for each image we upload
        Session.set('upload_images', []);

        //var files = event.target.files;
        var files = file = $('#docFile').get(0).files;

        //Check that there is a file or more to be processed
        if (files.length>0){

            var total_files = files.length;

            var uploads = _.map(files, function (file) {
                var metaContext = {id: Random.id(), title:title, projectId:FlowRouter.getParam("projectId"), size: file.size};
                var uploader = new Slingshot.Upload("uploads", metaContext);
                uploader.send(file, function (error, downloadUrl) {
                    //Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
                    //Do some stuff, upload a reference to Mongodb collection etc
                    //console.log('uploaded file available here: '+downloadUrl);
                    //metaContext.key =  _.findWhere(uploader.instructions.postData, {name: "key"}).value;
                    metaContext.fileUrl = downloadUrl;
                    createDocument.call(metaContext, (err, result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log("success");
                        }
                    });
                });
                return uploader;
            });

            //Create a tracker to iterate our array of uploaders and
            //return information to store in our Session variable
            var uploadTracker = Tracker.autorun(function (computation) {

                //Rest our variables here
                var image_array = [];
                var overall_progress = 0;

                //iterate with underscore over our uploaders and push details to array
                _.each(uploads, function(a_uploader){
                    var prog = a_uploader.progress();
                    if (!isNaN(prog))
                        prog = Math.round(prog*100);
                    else
                        prog=0;
                    console.log(prog);
                    var image_details = {
                        url: a_uploader.url(),
                        progress: prog
                    };
                    image_array.push(image_details);
                    //Update the overall progress
                    overall_progress = overall_progress+prog;
                    console.log(overall_progress );
                });

                overall_progress = overall_progress/total_files;

                //Set our Session var array of image details
                Session.set('upload_images', image_array);

                if (!isNaN(overall_progress)){
                  Session.set('uploadProgress', Math.round(overall_progress));
                }
                if(overall_progress==100){
                    computation.stop();
                    instance.state.set("addDoc", false);
                }
                return;
            });

        }
        return false;
    },
    'click .deleteDoc': function(event, instance){
        if(confirm("Are you sure?")){
            Meteor.call("deleteDocument", {id:this._id, key:this.key}, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
        }
    },
    'submit .addReport': function(event, instance){
        event.preventDefault();
        const title = event.target.reportTitle.value;
        //Session var for holding overall progress
        Session.set('uploadProgress', 0);
        //Session var for holding objects containing url and progress
        //for each image we upload
        Session.set('upload_images', []);

        //var files = event.target.files;
        var files = file = $('#reportFile').get(0).files;

        //Check that there is a file or more to be processed
        if (files.length>0){

            var total_files = files.length;

            var uploads = _.map(files, function (file) {
                var metaContext = {id: Random.id(), title:title, projectId:FlowRouter.getParam("projectId"), size: file.size};
                var uploader = new Slingshot.Upload("uploads", metaContext);
                uploader.send(file, (error, downloadUrl)=> {
                    metaContext.fileUrl = downloadUrl;
                    createReport.call(metaContext, function(err, result){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log("success");
                        }
                    });
                });
                return uploader;
            });

            //Create a tracker to iterate our array of uploaders and
            //return information to store in our Session variable
            var uploadTracker = Tracker.autorun(function (computation) {

                //Rest our variables here
                var image_array = [];
                var overall_progress = 0;

                //iterate with underscore over our uploaders and push details to array
                _.each(uploads, function(a_uploader){
                    var prog = a_uploader.progress();
                    if (!isNaN(prog))
                        prog = Math.round(prog*100);
                    else
                        prog=0;
                    console.log(prog);
                    var image_details = {
                        url: a_uploader.url(),
                        progress: prog
                    };
                    image_array.push(image_details);
                    //Update the overall progress
                    overall_progress = overall_progress+prog;
                    console.log(overall_progress );
                });

                overall_progress = overall_progress/total_files;

                //Set our Session var array of image details
                Session.set('upload_images', image_array);

                if (!isNaN(overall_progress)){
                  Session.set('uploadProgress', Math.round(overall_progress));
                }
                if(overall_progress==100){
                    computation.stop();
                    instance.state.set("addReport", false);
                }
                return;
            });

        }
        return false;
    },
    'click .deleteReport': function(event, instance){
        var sure = confirm("Are you sure?");
        if(sure === true)
            Meteor.call("deleteReport", {id:this._id, key:this.key}, function(err, result){
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
    }

});

Template.singleProject.helpers({
    project: function(){
        var projectId = FlowRouter.getParam('projectId');
        return Projects.findOne({_id:projectId});
    },
    projectUsers: function(project){
        if(project){
            var usersID = project.users;
            if(usersID)
                return Meteor.users.find({_id: {$in:usersID} });
        }
    },
    projectDeposit:function(){
        return Deposit.find({projectID:FlowRouter.getParam("projectId")}, {sort:{created:-1}});
    },
    users: function(){
        return Meteor.users.find();
    },
    tools: function(){
        return Tools.find({}, {sort:{created:-1}});
    },
    access: function(){
        return Access.find();
    },
    state:function(state){
        return Template.instance().state.get(state);
    },
    makePassw: function(pass){
        var parsedWordArray = CryptoJS.enc.Base64.parse(pass);
        return parsedWordArray.toString(CryptoJS.enc.Utf8);
    },
    passwordVisible: function(){
        return Template.instance().state.get(this._id);
    },
    docs: function(){
        return Documents.find();
    },
    reports: function(){
        return Reports.find();
    },
    makeSize: function(size){
        var sizeMb = size/1024;
        sizeMb = sizeMb/1024;
        sizeMb = sizeMb.toFixed(2);
        return sizeMb;
    }
});
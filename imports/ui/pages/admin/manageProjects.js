import "./manageProjects.html";

import "../../../api/projects/projects.js";
import { createProject, deleteProject } from '../../../api/projects/methods';

Template.manageProjects.onCreated(function(){
    this.autorun(()=>{
        this.subscribe('allProjects');
        this.subscribe('allUsers');
    });
    this.state = new ReactiveDict();
    this.state.setDefault({
        add: false,
        error: false
    });
});

Template.manageProjects.events({
    'click .add':function(event, instance){
        instance.state.set("add", true);
    },
    'submit .addProject': function(event, instance){
        event.preventDefault();
        var title = event.target.title.value;
        var desc = event.target.desc.value;
        var users = [];
        $(".multiple-select-dropdown li.active").each(function(){
            var nb = $(this).index()+1;
            users.push($("#users option:nth-child("+nb+")").val());
        });
        if(!title || !desc || !users)
            $(".errorMessage").text("* All fields are required");
        else{
            createProject.call({title:title, desc:desc, users:users}, function(err, obj){
                if(err){
                    $(".errorMessage").text("Server side error");
                }else{
                    $("#users").val("");
                    $('select').material_select();
                    event.target.title.value="";
                    event.target.desc.value="";
                    $(".errorMessage").text("");
                    instance.state.set("add", false);
                }
            });
        }
        return false;
    },
    'click .deleteProject': function(event){
        var sure = confirm('Sure?');
        if(sure){
            deleteProject.call(this._id, function(err,obj){
                if(err)
                    console.log(err);
                else
                    console.log(obj);
            });
        }
    },
    'click .cancelAdd': function(e, instance){
        instance.state.set("add", false);
    }
});

Template.manageProjects.helpers({
    projects:function(){
        return Projects.find({}, {sort:{created:-1}});
    },
    projectUsers:function(){
        var pid = this._id;
        var project = Projects.findOne({_id:pid});
        var usersId = project.users;
        var ids = usersId.map(function(p){return p.id;});
        return Meteor.users.find({_id:ids});
    },
    users: function(){
        return Meteor.users.find();
    },
    stateAdd: function(){
        return Template.instance().state.get("add");
    }
});




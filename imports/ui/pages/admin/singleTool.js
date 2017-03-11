import "./singleTool.html";

import "../../../api/tools/steps/steps.js";
import "../../../api/tools/tasks/tasks.js";
import "../../../api/tools/approvals/approvals.js";

import { updateTool } from '../../../api/tools/methods';
import { createStep, updateStep, deleteStep } from '../../../api/tools/steps/methods';
import { createTask } from '../../../api/tools/tasks/methods';
import { createApproval } from '../../../api/tools/approvals/methods';

Template.singleTool.onCreated(function(){
    this.autorun(()=>{
        const toolId = FlowRouter.getParam("toolId"),
            projectId = FlowRouter.getParam("projectId");
        this.subscribe("singleProject", projectId);
        this.subscribe("singleTool", toolId);
        this.subscribe("toolSteps", toolId);
        this.subscribe("toolTasks", toolId);
        this.subscribe("projectUsers", projectId);
        this.subscribe("toolApprovals", toolId);
    });
    this.state = new ReactiveDict();
    this.state.setDefault({
        editTool: false,
        choices:0
    });
});

Template.singleTool.onRendered(function(){
    $('input[type="rangeslide"]').ionRangeSlider({
        min:1,
        max:100,
        step:1,
        from:1,
        postfix:"%"
    });

});

Template.singleTool.events({
    'click .changeState': function(event, instance){
        event.preventDefault();
        if($(event.target).parent().hasClass("cancelAddTask"))
            instance.state.set("choices", 0);
        const state = $(event.target).parent().data("state");
        instance.state.set(state, !instance.state.get(state));
        setTimeout(function(){
            $('input[type="rangeslide"]').ionRangeSlider({
                min:1,
                max:100,
                step:1,
                from:1,
                postfix:"%"
            });
            $("select").material_select();
        },0);
    },
    'click .saveTool': function(event, instance){
        const desc = $(".toolNewDesc").val();
        updateTool.call({toolId:FlowRouter.getParam("toolId"), desc:desc}, function(err){
            if(err){

            }else{
                instance.state.set("editTool", false);
            }
        });
    },
    'submit .addStep': function(event, instance){
        event.preventDefault();
        var toolId = FlowRouter.getParam("toolId");
        var step = {
            title:event.target.title.value,
            toolId: toolId,
            progress: event.target.progress.value
        };
        if(!step.title){
            //ERROR $(".errorMessage.step").text("* Title is required");
        }else{
            createStep.call(step, (error) => {
                if(error)
                    console.log(error);
                else{
                    instance.state.set("addStep", false);
                }
            });
        }
        return false;
    },
    'submit .editStep': function(event, instance){
        event.preventDefault();
        const step = {
            _id:this._id,
            title:event.target.title.value,
            progress:event.target.progress.value,
            status:$(event.target.status).val(),
            note:event.target.note.value
        };
        updateStep.call(step, (err)=>{
            if(err){
                console.log(err);
            }else{
                instance.state.set(this._id, false);
            }
        });
        return false;
    },
    'click .deleteStep': function(event, instance){
        if(confirm("Are you sure?")){
            deleteStep.call(this._id, function(err){
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
        }
    },
    'click .appendChoice': function(event, instance){
        event.preventDefault();
        instance.state.set("choices", instance.state.get("choices") + 1);
    },
    'click .removeChoice': function(event, instance){
        event.preventDefault();
        if(instance.state.get("choices")>0)
            instance.state.set("choices", instance.state.get("choices") - 1);
    },
    'submit .addTask': function(event, instance){
        event.preventDefault();
        var users = [];
        $(".usersTask .multiple-select-dropdown li.active").each(function(){
            var nb = $(this).index()+1;
            users.push($("#users option:nth-child("+nb+")").val());
        });
        const task = {
            type:$(event.target.type).val(),
            toolID:FlowRouter.getParam("toolId"),
            projectID:FlowRouter.getParam("projectId"),
            answeredBy:$('input[name="answerFrom"]:checked').val(),
            users:users,
            content:{
                text:event.target.text.value,
                important:$(event.target.important).prop('checked')
            }
        }

        const image = file = $('#taskImage').get(0).files;
        const choices = $(".choiceIndex");

        if(task.content.text){
            let imageUploaded = true;
            if (image.length>0){//There is Image
                imageUploaded = false;
                //There is image
                var uploads = _.map(image, function (file) {
                    var metaContext = {id: Random.id(), projectId:FlowRouter.getParam("projectId")};
                    var uploader = new Slingshot.Upload("uploads", metaContext);
                    uploader.send(file,  (error, downloadUrl)=> {
                        const project = Projects.findOne(metaContext.projectId);
                        task.content.image = {
                            _id:metaContext.id,
                            fileUrl:downloadUrl,
                            key:project.title+"/"+metaContext.id
                        }
                        imageUploaded = true;
                        if(!choices.length>0){
                            createTask.call(task, function(err){
                                if(err){
                                    console.log(err);
                                }else{
                                    //Success
                                    instance.state.set("addTask", false);
                                }
                            });
                        }else{
                            if(choiceImageUploaded){
                                createTask.call(task, function(err){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        //Success
                                        instance.state.set("addTask", false);
                                        instance.state.set("choices", 0);
                                    }
                                });
                            }
                        }
                    });
                    return uploader;
                });
            }//There is Image

            if(choices.length>0){//There is choices
                const choiceQuantity = choices.length;
                let choicesData = [];
                let count = 0;
                for(let i = 0; i < choiceQuantity; i++){
                    choicesData[i] = {
                        choice:$("#choice"+i).val(),
                        index:i + 1
                    }
                    const choiceImage = file = $('#choiceImage'+i).get(0).files;

                    if (choiceImage.length>0){//There is image in choice
                        choiceImageUploaded=false;
                        var uploads = _.map(choiceImage, function (file) {
                            var metaContext = {id: Random.id(), projectId:FlowRouter.getParam("projectId")};
                            var uploader = new Slingshot.Upload("uploads", metaContext);
                            uploader.send(file, (error, downloadUrl)=> {
                                const project = Projects.findOne(metaContext.projectId);
                                choicesData[i].image = {
                                    _id:metaContext.id,
                                    fileUrl:downloadUrl,
                                    key:project.title+"/"+metaContext.id
                                }
                                count++;
                                if(count == choiceQuantity){
                                    if(image.length>0 && imageUploaded == true){
                                        task.content.choices = choicesData;
                                        createTask.call(task, function(err){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                //Success
                                                instance.state.set("addTask", false);
                                                instance.state.set("choices", 0);
                                            }
                                        });
                                    }else{
                                        task.content.choices = choicesData;
                                        choiceImageUploaded=true;
                                        if(!image.length>0){
                                            createTask.call(task, function(err){
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    //Success
                                                    instance.state.set("addTask", false);
                                                    instance.state.set("choices", 0);
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                            return uploader;
                        });
                    }else{//If there is choice but no images
                        count++;
                        if(count == choiceQuantity){
                            if(image.length>0 && imageUploaded == true){
                                task.content.choices = choicesData;
                                createTask.call(task, function(err){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        //Success
                                        instance.state.set("addTask", false);
                                        instance.state.set("choices", 0);
                                    }
                                });
                            }else{
                                task.content.choices = choicesData;
                                choiceImageUploaded=true;
                                if(!image.length>0){
                                    createTask.call(task, function(err){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            //Success
                                            instance.state.set("addTask", false);
                                            instance.state.set("choices", 0);
                                        }
                                    });
                                }
                            }
                        }
                    }


                }
            }//There is choices

            if(!choices.length>0 && !image.length>0){ //No choices, no images
                createTask.call(task, function(err){
                    if(err){
                        console.log(err);
                    }else{
                        //Success
                        instance.state.set("addTask", false);
                    }
                });
            }

        }else{//Empty Text field
            console.log("Need a text");
        }

        return false;
    },
    'click .deleteTask': function(event, instance){
        if(confirm("Are you sure?")){
            Meteor.call("deleteTask", this._id, function(err){
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
        }
    },
    'submit .addApproval': function(event, instance){
        event.preventDefault();
        var users = [];
        $(".usersApproval .multiple-select-dropdown li.active").each(function(){
            var nb = $(this).index()+1;
            users.push($("#usersApproval option:nth-child("+nb+")").val());
        });
        const approval = {
            type:$(event.target.type).val(),
            toolID:FlowRouter.getParam("toolId"),
            projectID:FlowRouter.getParam("projectId"),
            answeredBy:$('input[name="answerFromApproval"]:checked').val(),
            users:users,
            content:{
                title:event.target.title.value,
                description:event.target.desc.value,
                important:$(event.target.important).prop('checked')
            }
        }

        const approvalFile = file = $('#approvalFile').get(0).files;
        const choices = $(".choiceIndex");

        if(approval.content.title){
            if (approvalFile.length>0){//There is Image
                //There is image
                var uploads = _.map(approvalFile, function (file) {
                    var metaContext = {id: Random.id(), projectId:FlowRouter.getParam("projectId")};
                    var uploader = new Slingshot.Upload("uploads", metaContext);
                    uploader.send(file,  (error, downloadUrl)=> {
                        const project = Projects.findOne(metaContext.projectId);
                        approval.content.file = {
                            _id:metaContext.id,
                            fileUrl:downloadUrl,
                            key:project.title+"/"+metaContext.id
                        }
                        createApproval.call(approval, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                //Success
                                instance.state.set("addApproval", false);
                            }
                        });
                    });
                    return uploader;
                });
            }else{//empty file
                console.log("no file");
            }

        }else{//Empty Text field
            console.log("Need a text");
        }

        return false;
    },
    'click .deleteApproval': function(event, instance){
        if(confirm("Are you sure?")){
            Meteor.call("deleteApproval", this._id, function(err){
                if(err){
                    console.log(err);
                }else{
                    //success
                }
            });
        }
    }
});

Template.singleTool.helpers({
    tool:function(){
        const toolId = FlowRouter.getParam("toolId");
        return Tools.findOne(toolId);
    },
    project: function(){
        return Projects.findOne(FlowRouter.getParam("projectId"));
    },
    state:function(state){
        return Template.instance().state.get(state);
    },
    completedProgress: function(){
        var phases = Steps.find({status:"Completed"}).fetch(),
            completedProgress=0;
        _.each(phases, function(phase){
            completedProgress+=parseInt(phase.progressValue);
        });
        return completedProgress;
    },
    totalProgress: function(){
        var phases = Steps.find().fetch(),
            progress=0;
        _.each(phases, function(phase){
            progress+=parseInt(phase.progressValue);
        });
        return progress;
    },
    steps: function(){
        return Steps.find({}, {sort:{ord:1}});
    },
    choices: function(){
        let choiceArray = [];
        for(i=0;i<Template.instance().state.get("choices");i++){
            choiceArray.push(i);
        }
        return choiceArray;
    },
    task:function(){
        return Tasks.find();
    },
    users: function(){
        return Meteor.users.find();
    },
    approval:function(){
        return Approvals.find();
    },
    isAnswered: function(){
        if(this.answers)
            return true;
        else
            return "false";
    }
});
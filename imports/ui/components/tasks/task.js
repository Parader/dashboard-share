import "./task.html";

import { answerTask } from '../../../api/tools/tasks/methods';

Template.task.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        download:false,//For uploading files
        sending:false//For future transition
    });
});

Template.task.onRendered(function(){
    $(".question .fileContainer, .question .imgContainer").imgLiquid();
});

Template.task.events({
    'submit .answerForm': function(event, instance){
        event.preventDefault();
        const type = $(event.target).data("type");
        const taskId = this._id;
        let answer = {};
        answer.choices = [];
        answer.terms = $(event.target.terms).prop('checked');
        if(answer.terms){
            if(type == "Text"){
                if(event.target.answer.value){//Verify empty answer
                    answer.text = event.target.answer.value;
                    answerTask.call({taskId:taskId, answer:answer}, (err, result)=>{
                        if(err){
                            sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                        }else{
                            sAlert.success({sAlertTitle: 'Great', message: 'Your answer has been sent.', type:""}, {});
                        }
                    });
                }else{
                    sAlert.error({sAlertTitle: 'Error', message: 'Verify that your answer is complete', type:""}, {});
                }
            }else if(type == "Choice"){
                if($("input[name='option-"+taskId+"']:checked").data("index")){//Verify empty answer
                    answer.choices.push($("input[name='option-"+taskId+"']:checked").data("index"));
                    answerTask.call({taskId:taskId, answer:answer}, (err, result)=>{
                        if(err){
                            sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                        }else{
                            sAlert.success({sAlertTitle: 'Great', message: 'Your answer has been sent.', type:""}, {});
                        }
                    });
                }else{
                    sAlert.error({sAlertTitle: 'Error', message: 'Verify that your answer is complete', type:""}, {});
                }
            }else if(type == "Selection"){
                checkboxArray = [];
                if ( $(".choiceList input.inputChange:checked").length ) {//Verify empty answer
                    $(".choiceList input.inputChange:checked").each(function(){
                        checkboxArray.push($(this).data("index"));
                    });
                    answer.choices = checkboxArray;
                    answerTask.call({taskId:taskId, answer:answer}, (err, result)=>{
                        if(err){
                            sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                        }else{
                            sAlert.success({sAlertTitle: 'Great', message: 'Your answer has been sent.', type:""}, {});
                        }
                    });
                }else{//Empty answer
                    sAlert.error({sAlertTitle: 'Error', message: "Please verify that you've selected an answer.", type:""}, {});
                }
            }else if(type == "Upload"){
                answer.uploads = [];
                let files = $('#upload-'+taskId).get(0).files,
                    currentFiles = [],
                    projectID = $(event.target).data("project"),
                    user = Meteor.user();

                Session.set('uploadProgress', 0);
                Session.set('upload_images', []);
                let i = 0;
                if (files.length>0){//Verify empty answer
                    instance.state.set("download", true);
                    let total_files = files.length;
                    let uploads = _.map(files, function (file) {
                        let metaContext = {
                            id: Random.id(),
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            projectId:projectID,
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

                                answer.uploads.push({
                                    _id:metaContext.id,
                                    fileUrl:metaContext.fileUrl,
                                    key:metaContext.key,
                                    name:metaContext.name,
                                    size:metaContext.size,
                                    type:metaContext.type
                                });
                                i++;
                                if(i == files.length){
                                    answerTask.call({taskId:taskId, answer:answer}, (err, result)=>{
                                        if(err){
                                            sAlert.error({sAlertTitle: 'Error', message: "Internal server error, please try again or contact us.", type:""}, {});
                                        }else{
                                            sAlert.success({sAlertTitle: 'Great', message: 'Your answer is being sent.', type:""}, {});
                                        }
                                    });
                                }
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
                            instance.state.set("download", false);
                        }
                        return;
                    });
                }else{//There is no file
                    sAlert.error({sAlertTitle: 'Error', message: "Please verify that you've selected at least one file.", type:""}, {});
                }
                //end upload
            }else if(type == "None"){

            }
        }else{
            sAlert.error({sAlertTitle: 'Error', message: 'Please accept the terms & conditions', type:""}, {});
        }
    }
});

Template.task.helpers({
    hasImage: function(){
        if(this.content.image)
            return true;
    },
    pending: function(){
        let m1 = moment(this.created),
            m2 = moment(new Date());
        const diff = moment.duration(m1.diff(m2)).humanize();
        return diff;
    },
    isType: function(type){
        if(this.type == type)
            return true;
    },
    choiceHasImg: function(){
        if(this.image)
            return true;
    },
    getIndex: function(){
        return this.index;
    },
    isDownloading: function(){
        return Template.instance().state.get("download");
    }
});
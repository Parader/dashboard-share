import "./documentation.html";


Template.documentation.onCreated(function(){
    this.state = new ReactiveDict();
    this.state.setDefault({
        subsReady:false
    });

    this.autorun(()=>{
        const projectId = FlowRouter.getParam("projectId");
        this.subscribe("projectAccesses", projectId);
        this.subscribe("projectDocuments", projectId);
        this.subscribe("projectReports", projectId);
    });
});

Template.documentation.events({
    'click .viewPass': function(event, instance){
        instance.state.set('seePass-'+this._id, true);
    },
    'click .hidePass': function(event, instance){
        instance.state.set('seePass-'+this._id, false);
    }
});

Template.documentation.helpers({
    documents: function(){
        return Documents.find();
    },
    reports: function(){
        return Reports.find();
    },
    access: function(){
        return Access.find();
    },
    seePassword: function(){
        return Template.instance().state.get("seePass-"+this._id);
    },
    makePassw: function(pass){
        var parsedWordArray = CryptoJS.enc.Base64.parse(pass);
        return parsedWordArray.toString(CryptoJS.enc.Utf8);
    },
    thereIsDocs: function(){
        if(Documents.find().count()>0)
            return true;
        /*if(Access.find().count()>0)
            return true;*/
    },
    thereIsReports: function(){
        if(Reports.find().count()>0)
            return true;
        /*if(Access.find().count()>0)
            return true;*/
    },
    makeSize: function(size){
        var sizeMb = size/1024;
        sizeMb = sizeMb/1024;
        sizeMb = sizeMb.toFixed(2);
        return sizeMb;
    }
});
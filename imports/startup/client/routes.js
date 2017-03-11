import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker';

//Layouts
import "../../ui/layouts/emptyLayout.js";
import "../../ui/layouts/adminLayout.js";
import "../../ui/layouts/mainLayout.js";
//Pages
import "../../ui/pages/login.js";
import "../../ui/pages/home.js";
import "../../ui/pages/admin/manageUsers.js";
import "../../ui/pages/admin/manageProjects.js";
import "../../ui/pages/admin/singleProject.js";
import "../../ui/pages/admin/singleTool.js";
import "../../ui/pages/admin/singleTask.js";
import "../../ui/pages/admin/singleApproval.js";
//import "../../ui/pages/project/progress.js";
import "../../ui/pages/project/reports.js";
import "../../ui/pages/project/approvals.js";
import "../../ui/pages/project/deposit.js";
import "../../ui/pages/project/documentation.js";
import "../../ui/pages/project/tasks.js";
//Components
import "../../ui/components/misc/arrowRight.html";
import "../../ui/components/misc/logo.html";
import "../../ui/components/loging/logout.js";
import "../../ui/components/loging/login.js";
import "../../ui/components/loging/forgot.js";
import "../../ui/components/headers/sidebar.js";
import "../../ui/components/headers/adminHeader.html";
import "../../ui/components/headers/projectHeader.js";
import "../../ui/components/users/usersList.js";
import "../../ui/components/uploads/progressBar.js";
import "../../ui/components/uploads/uploading.js";
import "../../ui/components/uploads/upload.js";
import "../../ui/components/projects/projectList.js";
import "../../ui/components/toDo/toDoList.js";
import "../../ui/components/approvals/approvalElement.js";
import "../../ui/components/tasks/task.js";
import "../../ui/components/approvals/approval.js";
import "../../ui/components/misc/taskIcon.html";
import "../../ui/components/misc/approvalIcon.html";
import "../../ui/components/misc/depositIcon.html";
import "../../ui/components/misc/docIcon.html";
import "../../ui/components/misc/journalIcon.html";
import "../../ui/components/misc/downloadIcon.html";
import "../../ui/components/alerts/sAlertCustom.js";


//INITIALIZE FLOW ROUTER (WAIT FOR ROLES)
FlowRouter.wait();
Tracker.autorun(()=>{
    if(Roles.subscription.ready() && !FlowRouter._initialized){
        FlowRouter.initialize();
        Accounts.onLogin(function() {
            if(FlowRouter.current().route.name=="login"){
                FlowRouter.go("home");
            }
        });

        Accounts.onLogout(function() {
            FlowRouter.go("login");
        });
    }
});

/* ROUTES */
let privateRoutes = FlowRouter.group({
    name:"loggedIn",
    triggersEnter: [function(){
        const userId = Meteor.userId();
        if(!userId)
            FlowRouter.go("/login");
        else if(Roles.userIsInRole(userId, ["admin"]))
            FlowRouter.go("admin-home");
        Session.set("activeRoute", FlowRouter.current().route.name);
    }]
});

let adminRoutes = FlowRouter.group({
    name:"adminRoutes",
    prefix:"/admin",
    triggersEnter: [function(){
        const userId = Meteor.userId();
        if(!userId)
            FlowRouter.go("/login");
        else if(!Roles.userIsInRole(userId, ["admin"]))
            FlowRouter.go("home");
    }]
});

//Not logged in
FlowRouter.route("/login", {
    name:"login",
    action: function(params, queryParams){
        const classes = {wrapper:"loginPage"};
        BlazeLayout.render('emptyLayout', {page:"login", content:"loginForm", data:classes});
    }
});

FlowRouter.route("/forgot-password", {
    name:"forgot-password",
    action: function(params, queryParams){
        const classes = {wrapper:"loginPage"};
        BlazeLayout.render('emptyLayout', {header:"emptyHeader", page:"login", content:"forgotForm", data:classes});
    }
});

//Logged In
privateRoutes.route("/", {
    name:"home",
    action: function(params, queryParams){
        const classes = {wrapper:"client"};
        BlazeLayout.render('mainLayout', {page:"home", data:classes});
    }
});

privateRoutes.route("/tasks/:projectId", {
    name:"tasks",
    action: function(params, queryParams){
        const classes = {wrapper:"client", page:"tasks"};
        Session.set("pageGlobal", true);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"tasks", data:classes});
    }
});

privateRoutes.route("/approvals/:projectId", {
    name:"approvals",
    action: function(params, queryParams){
        const classes = {wrapper:"client", page:"approvals"};
        Session.set("pageGlobal", true);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"approvals", data:classes});
    }
});

/*privateRoutes.route("/progress", {
    name:"progress",
    action: function(params, queryParams){
        const classes = {wrapper:"client"};
        Session.set("pageGlobal", false);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"home", data:classes});
    }
});*/

privateRoutes.route("/documentation/:projectId", {
    name:"documentation",
    action: function(params, queryParams){
        const classes = {wrapper:"client", page:"documentation"};
        Session.set("pageGlobal", false);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"documentation", data:classes});
    }
});

privateRoutes.route("/journal", {
    name:"journal",
    action: function(params, queryParams){
        const classes = {wrapper:"client"};
        Session.set("pageGlobal", false);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"home", data:classes});
    }
});

privateRoutes.route("/deposit-box/:projectId", {
    name:"deposit-box",
    action: function(params, queryParams){
        const classes = {wrapper:"client"};
        Session.set("pageGlobal", false);
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"deposit", data:classes});
    }
});

privateRoutes.route("/settings", {
    name:"settings",
    action: function(params, queryParams){
        const classes = {wrapper:"client"};
        BlazeLayout.render('mainLayout', {header:"projectHeader", page:"home", data:classes});
    }
});

//Logged as admin
adminRoutes.route("/", {
    name:"admin-home",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"home"});
    }
});

adminRoutes.route("/manage-users", {
    name:"admin-users",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"manageUsers"});
    }
});

adminRoutes.route("/manage-projects", {
    name:"admin-projects",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"manageProjects"});
    }
});

adminRoutes.route("/project/:projectId", {
    name:"admin-project",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"singleProject", project:params.projectId});
    }
});

adminRoutes.route("/project/:projectId/tool/:toolId", {
    name:"admin-tool",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"singleTool", tool:params.toolId});
    }
});

adminRoutes.route("/project/:projectId/tool/:toolId/task/:taskId", {
    name:"admin-task",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"singleTask"});
    }
});

adminRoutes.route("/project/:projectId/tool/:toolId/approval/:approvalId", {
    name:"admin-approval",
    action: function(params, queryParams){
        BlazeLayout.render('adminLayout', {page:"singleApproval"});
    }
});

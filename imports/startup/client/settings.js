//Global helper
Handlebars.registerHelper('makeDate', function(date){
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
});
Handlebars.registerHelper('makeSmallDate', function(date){
    return moment(date).format("DD-MM-YYYY, h:mm:ss a");
});
Handlebars.registerHelper('makeSimpleDate', function(date){
    return moment(date).format("DD-MM-YYYY");
});

Meteor.startup(function(){
    sAlert.config({
        effect: 'stackslide',
        position: 'bottom-right',
        timeout: 4000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        stack: {
            spacing: 11, // in px
            limit: 1 // when one alert appears all previous ones are cleared
        },
        offset: 11, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        onClose: _.noop
    });
});


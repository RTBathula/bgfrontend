var __isDevelopment = false;

if(window.location.host.indexOf('localhost') > -1){
    __isDevelopment = true;
}

var app = angular.module('bullgrunt',
    ['ui.router', 
    'ui.bootstrap',
    'kendo.directives',
    'monospaced.elastic', 
    'ngImgCrop',
    'google.places',
    'uiGmapgoogle-maps',
    'ui.checkbox',
    'lrInfiniteScroll'
]);

//CloudBoost.io init
CB.CloudApp.init('bull99', 'af8Ow0iegVFfWt35ENVLog==');

//Default Statis Values
var def_JobTypeId="LokR19AC";//Full Time
var def_InterviewTypeId="PijOcjdk";//Online
var def_IndustryId="rCy2eV91";//Information Technology

var serverURL = null; 
if(__isDevelopment){
    serverURL="http://localhost:1444";   
}else{
    //serverURL = "https://service.cloudboost.io";    
}

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})



app.config(
function ($urlRouterProvider, $stateProvider, $httpProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('joblist',
    {
        url: '/',
        templateUrl: 'app/views/joblist/joblist.html',
        controller: 'jobListController'
    });

    $stateProvider.state('jobdetails',
    {
        url: '/details/:jobId',
        templateUrl: 'app/views/jobdetails.html',
        controller: 'jobDetailsController'
    });

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);   

    //cors.
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

});





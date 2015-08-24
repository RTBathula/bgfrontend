app.config(
function ($urlRouterProvider, $stateProvider, $httpProvider, $locationProvider) {
    //DataEntry Operator
    $stateProvider.state('dataOperatorView',
    {
        url:'/data/view',
        templateUrl: 'app/views/dataOperator/data-entry-view.html',
        controller: 'dataEntryViewController'            
    });

    $stateProvider.state('dataOperatorUpsert',
    {
        url:'/data/upsert/:jobId',
        templateUrl: 'app/views/dataOperator/data-entry-upsert.html',
        controller: 'dataEntryUpsertController'             
    });   
    //End of DataEntry Operator

    /*******************************************************************/
    
    //Call Operator
    $stateProvider.state('callOperatorSearch',
    {
        url: '/call/search',
        templateUrl: 'app/views/callOperators/call-search.html',
        controller: 'callSearchController'                      
    });

    $stateProvider.state('callOperatorViewSearch',
    {
        url: '/call/searchresults',
        templateUrl: 'app/views/callOperators/call-search-results.html',
        controller: 'callSearchResultsController'           
    });

    $stateProvider.state('callOperatorViewSentSMS',
    {
        url: '/call/msgsent',
        templateUrl: 'app/views/callOperators/call-sent-msgs.html'           
    });
    //End of Call Operator

});



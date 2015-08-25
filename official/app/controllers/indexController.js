app.controller('indexController',
function ($scope,$rootScope,$location,$state) {

$scope.logOut=function(){
	$.removeCookie('officialUser', { path: '/' });
	window.location.href=domain+"/official/accounts"; 
};

$scope.$watch(function(scope) {
 return $location.path();

},function(newPath,oldPath) {

    if(!$.cookie('officialUser') || $.cookie('officialUser')=="null" || $.cookie('officialUser')=="undefined"){          
     	window.location.href=domain+"/official/accounts";
    }else if($.cookie('officialUser')){
		var obj=JSON.parse($.cookie('officialUser'));
		$rootScope.officialUser=CB.fromJSON(obj.document);

		var isDataEntry=$rootScope.officialUser.get("isDataEntry");
		var isCallOperator=$rootScope.officialUser.get("isCallOperator");

		var strArray=newPath.split("/");
		if(isDataEntry && strArray[1]=="call"){
			window.location.href=domain+"/official/#/data/view";
			//$state.transitionTo('dataOperatorView');
			//$state.go('dataOperatorView');
			//$scope.$digest() 
			 
		}else if(isCallOperator && strArray[1]=="data"){
			window.location.href=domain+"/official/#/call/search"; 
			//$state.transitionTo('callOperatorSearch');
			//$state.transitionTo('callOperatorSearch');
			//$scope.$digest()
		} 
	}   

});

});

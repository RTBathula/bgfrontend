app.controller('indexController',
function ($scope,$rootScope,$location) {

$scope.logOut=function(){
	$.removeCookie('officialUser', { path: '/' });
	window.location.href="http://localhost:1440/official/accounts"; 
};

$scope.$watch(function(scope) {
 return $location.path();

},function(newPath,oldPath) {

    if(!$.cookie('officialUser') || $.cookie('officialUser')=="null" || $.cookie('officialUser')=="undefined"){          
     	window.location.href="http://localhost:1440/official/accounts";
    }else if($.cookie('officialUser')){
		var obj=JSON.parse($.cookie('officialUser'));
		$rootScope.officialUser=CB.fromJSON(obj.document);
	}   

});

});

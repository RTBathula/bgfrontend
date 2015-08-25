app.controller('loginController',
function ($scope,userServices) {

	$scope.LoginForm={
		email:null,
		password:null
	};

	$scope.init=function(){

	};

	$scope.login=function(valid){
		$scope.loginError=null;
		if(valid){
			userServices.login($scope.LoginForm.email,$scope.LoginForm.password)
			.then(function(obj){
				if(obj){
					if(obj.get("isDataEntry")){
						setEndUserCookie(obj);
						window.location.href=domain+"/official/data/view"; 
					}
					if(obj.get("isCallOperator")){
						setEndUserCookie(obj);
						window.location.href=domain+"/official/call/search"; 					
					}
					if(obj.get("isAdmin")){
						setEndUserCookie(obj);
					}
				}else{
					$scope.loginError="No User with this account";  
				}				
	                                               
	        },function(error){ 
	        	$scope.loginError=error;               
	        });
		}
	};

	function setEndUserCookie(userObj){
        var userStr=JSON.stringify(userObj);
        $.cookie('officialUser', userStr, { path: '/' });
    }
    function getEndUserCookie(){
        return $.cookie('officialUser');
    }

});

app.factory('userModel', ['$q',function ($q) {

    var global = {};

    global.user = function(){
        var user={			
			name:null,
			email:null,
			phone:null,		
			password:null,
			isDataEntry:false,
			isCallOperator:false,
			isAdmin:false,
			isEmployer:true,
			isJobSeeker:false,
			authOTP:{
				randStringforOTP:null,
				otpGenerated:null,
			}
			
		};
		return user;
    }; 

    return global;

}]);

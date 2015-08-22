app.factory('userServices', function ($http,$rootScope, $q) {

    var global = {};

    global.findUserByPhone = function(phoneNumber){  
        var q = $q.defer(); 
       
        var query = new CB.CloudQuery("User");
        query.equalTo('phone', phoneNumber);
         
        query.findOne({success: function(object){ 
          q.resolve(object); 
        },error: function(err) {
          q.reject(error);
        }
        });

        return  q.promise;
    };

    global.sendOTP = function(userModel){  
        var q = $q.defer();
 
        $http.post(serverURL+'/otp/send/add',{user:userModel}).
          success(function(data, status, headers, config) {
            q.resolve(data);
          }).
          error(function(data, status, headers, config) {
            q.reject(status);               
          });

        return  q.promise;
    };

    global.verifyOTP = function(phoneNumber,otpCode){  
        var q = $q.defer();
 
        $http.post(serverURL+'/otp/verify/add',{phoneNumber:phoneNumber,otpCode:otpCode}).
          success(function(data, status, headers, config) {
            q.resolve(data);
          }).
          error(function(data, status, headers, config) {
            q.reject(status);               
          });

        return  q.promise;
    };

    global.modifySendOTP = function(phone,jobId,work){  
        var q = $q.defer();
 
        $http.post(serverURL+'/otp/send/modify',{phoneNumber:phone,jobId:jobId,work:work}).
          success(function(data, status, headers, config) {
            q.resolve(data);
          }).
          error(function(data, status, headers, config) {
            q.reject(status);               
          });

        return  q.promise;
    };

    global.SMSJobs = function(phone,jobsArray){  
        var q = $q.defer();

        var reqObj={
          phone:phone,
          jobsArray:jobsArray
        };

        $http.post(serverURL+'/sms/jobs',reqObj).
          success(function(data, status, headers, config) {
            q.resolve(data);
          }).
          error(function(data, status, headers, config) {
            q.reject(status);               
          });

        return  q.promise;
    };

    return global;

});



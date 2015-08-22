app.factory('userServices', function ($http,$rootScope, $q) {

    var global = {};

    global.login = function(email,password){  
        var q = $q.defer(); 
       
        var query = new CB.CloudQuery("BullUser");
        query.equalTo('email', email);
        query.equalTo('password', password);
         
        query.findOne({success: function(object){ 
          q.resolve(object); 
        },error: function(error) {
          q.reject(error);
        }
        });

        return  q.promise;
    };
    
    return global;

});



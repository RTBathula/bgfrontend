app.factory('companyServices', function ($http,$rootScope, $q) {

    var global = {};

    global.saveCompany = function(companyModel){  
        var q = $q.defer(); 
       
        var obj = new CB.CloudObject('Company');               

        obj.set("_user", companyModel._user);
        obj.set("name", companyModel.name);
        obj.set("about", companyModel.about);
        obj.set("url", companyModel.url);
        obj.set("_industry", companyModel._industry);
        obj.set("logo", companyModel.logo);

        obj.save({
        success: function(obj) {
          q.resolve(obj); 
        },
        error: function(err) {
          q.reject(err); 
        }
        }); 
      
        return  q.promise;
    }; 

    global.upsertCompany = function(compObj,companyModel){  
        var q = $q.defer();        
        if(!compObj){
            var compObj = new CB.CloudObject('Company');  
        }
        compObj.set("_user", companyModel._user);
        compObj.set("name", companyModel.name);
        compObj.set("about", companyModel.about);
        compObj.set("url", companyModel.url);
        compObj.set("_industry", companyModel._industry);
        compObj.set("logo", companyModel.logo);

        compObj.save({
        success: function(obj) {
          q.resolve(obj); 
        },
        error: function(err) {
          q.reject(err); 
        }
        }); 
      
        return  q.promise;
    };

    global.getCompanyById = function(companyId){  
        var q = $q.defer(); 

        var query = new CB.CloudQuery("Company");

        query.findById(companyId, {
            success: function(obj){
                q.resolve(obj); 
            },
            error: function(err) {
                q.reject(err); 
            }
        }); 
      
        return  q.promise;
    };

    global.deleteCompanyByObj = function(deletableCompanyObj){  
        var q = $q.defer();        
          
        deletableCompanyObj.delete({
         success: function(obj) {
            //success
            q.resolve(obj); 
         },error: function(err) {
            //Error
            q.reject(err); 
         }
        });
       
        return  q.promise;
    };  
  

    return global;

});

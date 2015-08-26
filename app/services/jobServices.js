app.factory('jobServices', function ($http,$rootScope, $q,companyServices) {

    var global = {};

    global.getJobDetails = function(jobId){  
        var q = $q.defer(); 
       
        var query = new CB.CloudQuery("Job");           
        query.include('_company'); 
        query.include('_jobType');
        query.include('_interviewType'); 

        query.findById(jobId, {
        success: function(obj){
          q.resolve(obj); 
        },
        error: function(err) {
          q.reject(err);
        }
        }); 
      
        return  q.promise;
    };

    global.getJobList = function(locationObj,
        dateObj,
        gradYear,
        academicGrade,
        degreeName,
        interviewTypeObj,
        skillsList,
        sectorTypeObj,
        designation,
        experience,
        company){  

        var q = $q.defer(); 
       
        var cs = new CB.CloudSearch("Job");
        cs.searchFilter = new CB.SearchFilter();
        //cs.searchQuery = new CB.SearchQuery();

        //cs.orderByDesc('updatedAt');
        //cs.searchFilter.include('_company');

        //var query = new CB.CloudQuery("Job");  
        //query.orderByDesc('updatedAt'); 
        //query.include('_company');

        //Filters
        if(locationObj){
          var loc = new CB.CloudGeoPoint(locationObj.geometry.location.G,locationObj.geometry.location.K); 
          //query.near("companyLocationGeopoint", loc, 100000); 
        } 
        if(dateObj){
         //cs.searchFilter.equalTo('dateTime', dateObj); 
        }
        if(gradYear){        
         //cs.searchQuery.searchOn('description', gradYear.value);
        }
        if(academicGrade){        
         //cs.searchQuery.searchOn('description', academicGrade.range);
        }
        if(degreeName){        
         //cs.searchQuery.searchOn('description', degreeName.name);
        } 
        if(interviewTypeObj){
            var interviewTypeCBObj = new CB.CloudObject('InterviewType',interviewTypeObj.get("id"));
           // cs.searchFilter.equalTo('_interviewType', interviewTypeCBObj);
        }
        if(skillsList && skillsList.length>0){
            for(var i=0;i<skillsList.length;++i){
                if(skillsList[i].checked){
                    //cs.searchQuery.searchOn('description', skillsList[i].name);
                }
            }
        }
        if(sectorTypeObj){
          var sectorTypeCBObj = new CB.CloudObject('JobType',sectorTypeObj.get("id"));
          //cs.searchFilter.equalTo('_jobType', sectorTypeCBObj);
        } 
        if(designation){        
         //cs.searchQuery.searchOn('title', designation.name);
        } 
        if(experience){        
         //cs.searchFilter.equalTo('experience', experience.range);
        } 
        if(company){        
         //cs.searchFilter.equalTo('experience', experience.range);
        }    
        //End Filters              

        cs.search({success: function(list) {           
          q.resolve(list); 
        },error: function(err) {
          q.reject(err); 
        }
        }); 
      
        return  q.promise;
    }; 

    global.saveJob = function(jobModel){  
        var q = $q.defer(); 
       
        var obj = new CB.CloudObject('Job');
        //var userObj = new CB.CloudObject('BullUser',jobModel._user);
        //var companyObj = new CB.CloudObject('Company',jobModel._company);

        obj.set("_user", jobModel._user);
        obj.set("_company", jobModel._company);
        obj.set("title", jobModel.title);
        obj.set("description", jobModel.description);
        obj.set("dateTime", jobModel.dateTime);
        obj.set("applyLink", jobModel.applyLink);
        obj.set("resumeTo", jobModel.resumeTo);
        obj.set("phone", jobModel.phone);
        obj.set("_interviewType", jobModel._interviewType);
        obj.set("experience", jobModel.experience);
        obj.set("_jobType", jobModel._jobType);
        obj.set("companyLocationGeopoint", jobModel.companyLocationGeopoint);
        obj.set("companyLocationDetails", jobModel.companyLocationDetails);
        obj.set("walkInLocationGeopoint", jobModel.walkInLocationGeopoint);        
        obj.set("walkInLocationDetails", jobModel.walkInLocationDetails);        

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

    global.updateJob = function(jobObj,jobModel){  
        var q = $q.defer(); 
     
        jobObj.set("title", jobModel.title);
        jobObj.set("description", jobModel.description);
        jobObj.set("dateTime", jobModel.dateTime);
        jobObj.set("applyLink", jobModel.applyLink);
        jobObj.set("resumeTo", jobModel.resumeTo);
        jobObj.set("phone", jobModel.phone);
        jobObj.set("_interviewType", jobModel._interviewType);
        jobObj.set("experience", jobModel.experience);
        jobObj.set("_jobType", jobModel._jobType);
        jobObj.set("companyLocationGeopoint", jobModel.companyLocationGeopoint);
        jobObj.set("companyLocationDetails", jobModel.companyLocationDetails);
        jobObj.set("walkInLocationGeopoint", jobModel.walkInLocationGeopoint);        
        jobObj.set("walkInLocationDetails", jobModel.walkInLocationDetails);        

        jobObj.save({
        success: function(obj) {
          q.resolve(obj); 
        },
        error: function(err) {
          q.reject(err); 
        }
        }); 
      
        return  q.promise;
    }; 


    global.deleteJobByObj = function(deletableJobObj){  
        var q = $q.defer(); 
       
        deletableJobObj.delete({
         success: function(obj) {
            //delete related company
            companyServices.deleteCompanyByObj(deletableJobObj.get("_company"))
            .then(function(compObj){          
              q.resolve(obj);                      
            },function(error){    
              q.reject(err);                              
            });
             
         },error: function(err) {
            //Error
            q.reject(err); 
         }
        }); 
      
        return  q.promise;
    };  

    return global;

});

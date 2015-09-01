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
        //cs.searchFilter = new CB.SearchFilter();
        var searchFilter = new CB.SearchFilter();
        cs.searchQuery = new CB.SearchQuery();

        cs.orderByDesc('updatedAt');
       // cs.searchFilter.include('_company');

        //var query = new CB.CloudQuery("Job");  
        //query.orderByDesc('updatedAt'); 
        //query.include('_company');

        //Filters
        if(locationObj){
          var loc = new CB.CloudGeoPoint(locationObj.geometry.location.G,locationObj.geometry.location.K); 
          //query.near("companyLocationGeopoint", loc, 100000); 
        } 
        if(dateObj){
            var searchFilter1 = new CB.SearchFilter();
            searchFilter1.equalTo('dateTime', dateObj); 
            searchFilter.or(searchFilter1);
        }
        if(gradYear){  
            var obj1 = new CB.SearchQuery();            
            obj1.searchOn('description', gradYear.value);
            cs.searchQuery.or(obj1);
        }
        if(academicGrade){     
            var obj2 = new CB.SearchQuery();   
            obj2.searchOn('description', academicGrade.range.from);
            cs.searchQuery.or(obj2);

            var academicObj2 = new CB.SearchQuery();   
            academicObj2.searchOn('description', academicGrade.range.to);
            cs.searchQuery.or(academicObj2);
        }
        if(degreeName){      
            var obj3 = new CB.SearchQuery();     
            obj3.searchOn('description', degreeName.name);
            cs.searchQuery.or(obj3);
        } 
        if(interviewTypeObj){
            var searchFilter2 = new CB.SearchFilter();
            //var interviewTypeCBObj = new CB.CloudObject('InterviewType',interviewTypeObj.get("id"));
            searchFilter2.equalTo('_interviewType', interviewTypeObj);
            searchFilter.or(searchFilter2);
        }
        if(skillsList && skillsList.length>0){
            for(var i=0;i<skillsList.length;++i){
                if(skillsList[i].checked){
                    var skillObj = new CB.SearchQuery();   
                    skillObj.searchOn('description', skillsList[i].name);
                    cs.searchQuery.or(skillObj);
                }
            }
        }
        if(sectorTypeObj){
            var searchFilter3 = new CB.SearchFilter();
            //var sectorTypeCBObj = new CB.CloudObject('JobType',sectorTypeObj.get("id"));
            searchFilter3.equalTo('_jobType', sectorTypeObj);
            searchFilter.or(searchFilter3);
        } 
        if(designation){             
            var titleObj = new CB.SearchQuery();    
            titleObj.searchOn('title', designation.name);
            cs.searchQuery.or(titleObj);
        } 
        if(experience){  
            var searchFilter5 = new CB.SearchFilter();       
            searchFilter5.equalTo('experience', experience.range.from);
            searchFilter.or(searchFilter5);

            var searchFilter6 = new CB.SearchFilter();       
            searchFilter6.equalTo('experience', experience.range.to);
            searchFilter.or(searchFilter6);
        } 
        if(company){        
         //cs.searchFilter.equalTo('experience', experience.range);
        }    
        //End Filters              

        cs.searchFilter = searchFilter;
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

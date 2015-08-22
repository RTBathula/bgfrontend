app.controller('dataEntryUpsertController',
function ($scope,
    $q,
    userModel,
    companyModel,
    jobModel,
    jobTypeServices,
    interviewTypeServices,
    companyIndustryServices,
    jobServices,
    $stateParams,
    validationServices,
    $timeout,
    companyServices,
    $rootScope) { 

    $scope.jobId=null;
    $scope.companyLogo = '';    
    $scope.croppedCompanyLogo = '';

    $scope.autocompleteOptions = {       
        types: ['(cities)']
    };

    $scope.init=function(){
        //User,Company,Job model templates
        $scope.userModel=userModel.user();   
        $scope.companyModel=companyModel.company();      
        $scope.jobModel=jobModel.job();

        //Getting static values
        getJobTypeList();
        getInterviewTypeList();
        getCompanyIndustryList();


        $scope.jobId = $stateParams.jobId;
        if($scope.jobId){
            getJobDetails($scope.jobId);   
        }          
    };

    $scope.upsertJob=function(valid){
        if(valid){
           //Setting 
            if($scope.jobModel.experience){
               $scope.jobModel.experience=parseInt($scope.jobModel.experience); 
            }

            if($scope.companyLocation){
                if(typeof $scope.companyLocation!="string"){
                    var comloc = new CB.CloudGeoPoint($scope.companyLocation.geometry.location.G,$scope.companyLocation.geometry.location.K);
                    var comLocationJson={
                        placeId:$scope.companyLocation.place_id,            
                        address:$scope.companyLocation.formatted_address,
                        url:$scope.companyLocation.url
                    };

                    $scope.jobModel.companyLocationGeopoint=comloc;
                    $scope.jobModel.companyLocationDetails=comLocationJson;
                }else{
                    $scope.jobModel.companyLocationGeopoint=$scope.editableJobObj.get("companyLocationGeopoint");
                    $scope.jobModel.companyLocationDetails=$scope.editableJobObj.get("companyLocationDetails");
                } 
               
            }
            if($scope.walkInLocation){
                if(typeof $scope.walkInLocation!="string"){
                    var wloc = new CB.CloudGeoPoint($scope.walkInLocation.geometry.location.G,$scope.walkInLocation.geometry.location.K);
                    var walkInLocationJson={
                        placeId:$scope.walkInLocation.place_id,               
                        address:$scope.walkInLocation.formatted_address,
                        url:$scope.walkInLocation.url
                    };
                    $scope.jobModel.walkInLocationGeopoint=wloc;
                    $scope.jobModel.walkInLocationDetails=walkInLocationJson;
                }else{
                    $scope.jobModel.walkInLocationGeopoint=$scope.editableJobObj.get("walkInLocationGeopoint");
                    $scope.jobModel.walkInLocationDetails=$scope.editableJobObj.get("walkInLocationDetails");
                }
            }

            //Validate and passing
            var companyErr=validationServices.validateFields("company",$scope.companyModel);        
            if(companyErr){
                warningNotification(companyErr);
            }else{
                var jobErr=validationServices.validateFields("job",$scope.jobModel);
                if(jobErr){
                 warningNotification(jobErr);
                }else{
                   prepareCompanyAndUpsert();                                            
                }
            }  
        }              
    };

    function prepareCompanyAndUpsert(){
        //Setting Company JSON   
        $scope.companyModel._user=$rootScope.officialUser;    
        $scope.companyModel._industry=getIndustryObject($scope.companyModel._industry); 
        if($scope.editableJobObj && $scope.editableJobObj.get("_company")){
            var companyObj=$scope.editableJobObj.get("_company");
        }else{
            var companyObj=null;
        }

        if($scope.companyLogoObj){
            getCBFile($scope.companyLogoObj)
            .then(function(cloudBoostFile){

                $scope.companyModel.logo=cloudBoostFile;
                companyServices.upsertCompany(companyObj,$scope.companyModel)
                .then(function(companyObj){
                    prepareJobAndUpsert(companyObj);
                }, function(err){
                    errorNotification("Error in creating company..try again");  
                });

            }, function(err){ 
                errorNotification("Error in selecting Logo..try again"); 
            });
        }else{
            companyServices.upsertCompany(companyObj,$scope.companyModel)
            .then(function(companyObj){
                prepareJobAndUpsert(companyObj);
            }, function(err){
                errorNotification("Error in creating company..try again");  
            });
        }
    }
    function prepareJobAndUpsert(compObj){    

        //Setting Job JSON  
        $scope.jobModel._user=$rootScope.officialUser;
        $scope.jobModel._company=compObj;
        if($scope.editableJobObj){
            var jobObj=$scope.editableJobObj;
        }else{
            var jobObj=null;
        }

        if($scope.jobModel.dateTime){
            $scope.jobModel.dateTime=new Date($scope.jobModel.dateTime);
        }        
        $scope.jobModel._jobType=getJobTypeObject($scope.jobModel._jobType);
        $scope.jobModel._interviewType=getInterviewTypeObject($scope.jobModel._interviewType);        

        jobServices.upsertJob(jobObj,$scope.jobModel) 
        .then(function(jobObj){            
            successNotification("Successfully posted your job");
            window.location.href="http://localhost:1440/official/#/data/view";
        }, function(err){ 
            errorNotification("We couldn't post your job now..try again");
        });         
    }   

    //Private functions
    function getJobDetails(){
        jobServices.getJobDetails($scope.jobId)
        .then(function(jobDet){
            if(jobDet){                
                loadEditJob(jobDet);               
            }
                                       
        },function(error){                
        }); 
    }

    function loadEditJob(jobDet){
        //hold
        $scope.editableJobObj=jobDet;

        //Assinging Company,Job model 
        $scope.companyModel.name=jobDet.get("_company").get("name");

        if(jobDet.get("_company") && jobDet.get("_company").get("about")){
            $scope.companyModel.about=jobDet.get("_company").get("about");
        }
        
        if(jobDet.get("_company").get("url")!="http://"){
           $scope.companyModel.url=jobDet.get("_company").get("url"); 
        }else{
           $scope.companyModel.url="http://";
        }
        
        $scope.companyModel._industry=jobDet.get("_industry");

        if(jobDet.get("_company").get("logo") && jobDet.get("_company").get("logo").url){
           // $scope.companyModel.logo=jobDet.get("_company").get("logo");
            $scope.croppedCompanyLogo=jobDet.get("_company").get("logo").url;
            $scope.imageDisplay=true;
            //$scope.companyLogoUrl=jobDet.get("_company").get("logo").url;                                  
        }        

        $scope.jobModel.title=jobDet.get("title");
        $scope.jobModel.description=jobDet.get("description");
        $scope.jobModel.dateTime=jobDet.get("dateTime");
        $scope.jobModel.applyLink=jobDet.get("applyLink");
        $scope.jobModel.resumeTo=jobDet.get("resumeTo");
        $scope.jobModel.phone=jobDet.get("phone");
        $scope.jobModel._interviewType=jobDet.get("_interviewType");
        $scope.jobModel.experience=jobDet.get("experience");
        $scope.jobModel._jobType=jobDet.get("_jobType");

        if(jobDet.get("companyLocationDetails") && jobDet.get("companyLocationDetails").address){
          $scope.companyLocation=jobDet.get("companyLocationDetails").address;
        }
        if(jobDet.get("walkInLocationDetails") && jobDet.get("walkInLocationDetails").address){
          $scope.walkInLocation=jobDet.get("walkInLocationDetails").address;
        }         

    }
   
     //Return relative JobType object
    function getJobTypeObject(stringifiedObj){
        var res=null;
        if(!stringifiedObj){  

            if($scope.jobTypeList.length>0){
                res = _.find($scope.jobTypeList, function(eachObj){ 
                    if(eachObj.get("id")==def_JobTypeId){
                        return eachObj;
                    }
                });           
            }
        }else if(typeof stringifiedObj=="string"){
            var objectified=JSON.parse(stringifiedObj);

            if($scope.jobTypeList.length>0){
                res = _.find($scope.jobTypeList, function(eachObj){ 
                    if(eachObj.get("id")==objectified.document._id){
                        return eachObj;
                    }
                });           
            }

        }else if(typeof stringifiedObj=="object"){
            res=stringifiedObj;
        }
       
        return res;
    }
    //Return relative InterviewType object
    function getInterviewTypeObject(stringifiedObj){
        var res=null;
        if(!stringifiedObj){
           
            if($scope.interviewTypeList.length>0){
                res = _.find($scope.interviewTypeList, function(eachObj){ 
                    if(eachObj.get("id")==def_InterviewTypeId){
                        return eachObj;
                    }
                });           
            }
        }else if(typeof stringifiedObj=="string"){
            var objectified=JSON.parse(stringifiedObj);

            if($scope.interviewTypeList.length>0){
                res = _.find($scope.interviewTypeList, function(eachObj){ 
                    if(eachObj.get("id")==objectified.document._id){
                        return eachObj;
                    }
                });           
            }
        }else if(typeof stringifiedObj=="object"){
            res=stringifiedObj;
        }
       
        return res;
    }    

    //Return relative Industry object
    function getIndustryObject(stringifiedObj){
        var res=null;
        if(!stringifiedObj){
           
            if($scope.companyIndustryList.length>0){
                res = _.find($scope.companyIndustryList, function(eachObj){ 
                    if(eachObj.get("id")==def_IndustryId){
                        return eachObj;
                    }
                });           
            }
        }else if(typeof stringifiedObj=="string"){
            var objectified=JSON.parse(stringifiedObj);

            if($scope.companyIndustryList.length>0){
                res = _.find($scope.companyIndustryList, function(eachObj){ 
                    if(eachObj.get("id")==objectified.document._id){
                        return eachObj;
                    }
                });           
            }
        }else if(typeof stringifiedObj=="object"){
            res=stringifiedObj;
        }
       
        return res;
    } 

    $('#upsert-logo').on('change', handleFileSelect);
    function handleFileSelect(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {             
                $scope.companyLogo = evt.target.result; 
                $scope.imageDisplay=true;                              
            });
        };
        reader.readAsDataURL(file);      
        $scope.companyLogoObj=file;       
    }; 

    $scope.clearCompanyLogo = function () {                 
        $scope.companyLogo = '';
        $scope.croppedCompanyLogo = '';
        $scope.imageDisplay=false;            
    };

    $scope.cancelUploadingNew=function(){
        $scope.croppedCompanyLogo=$scope.editableJobObj.get("_company").get("logo").url;
        $scope.imageDisplay=true;
    };
    //Get CBFile
    function getCBFile(fileObj){

        var q=$q.defer();

        var file = new CB.CloudFile(fileObj);
        file.save({
        success: function(newFile) {
          //got the file object successfully with the url to the file
          q.resolve(newFile); 
        },
        error: function(err) {
         //error in uploading file
          q.reject(err); 
        }
        });                

        return  q.promise;
    }

    //Getting static values
    function getJobTypeList(){
        jobTypeServices.getJobTypeList()
        .then(function(list){
           $scope.jobTypeList=list;                                     
        },function(error){                
        });  

    }
    function getInterviewTypeList(){
        interviewTypeServices.getInterviewTypeList()
        .then(function(list){
           $scope.interviewTypeList=list;                             
        },function(error){                
        });  
    }
    function getCompanyIndustryList(){
        companyIndustryServices.getCompanyIndustryList()
        .then(function(list){
           $scope.companyIndustryList=list;                             
        },function(error){                
        });  
    } 

    function errorNotification(errorMsg){
        $.amaran({
          'theme'     :'colorful',
          'content'   :{
             bgcolor:'#EE364E',
             color:'#fff',
             message:errorMsg,
          },
          'position'  :'bottom left',
          'outEffect' :'slideBottom'
        });
    }
    function warningNotification(warningMsg){
        $.amaran({
          'theme'     :'colorful',
          'content'   :{
             bgcolor:'#EDBE34',
             color:'#fff',
             message:warningMsg,
          },
          'position'  :'bottom left',
          'outEffect' :'slideBottom'
        });
    }

    function successNotification(successMsg){
        $.amaran({
          'theme'     :'colorful',
          'content'   :{
             bgcolor:'#0D2ABC',
             color:'#fff',
             message:successMsg,
          },
          'position'  :'bottom left',
          'outEffect' :'slideBottom'
        });
    }
});

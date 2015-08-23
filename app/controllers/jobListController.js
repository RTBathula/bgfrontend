app.controller('jobListController',
function ($scope,
    $q, 
    $document, 
    $timeout,
    locationServices,
    userModel,
    companyModel,
    jobModel,
    validationServices,
    jobTypeServices,
    interviewTypeServices,
    companyIndustryServices,
    userServices,
    companyServices,
    jobServices,
    staticDataServices){

    $scope.companyLogo = '';    
    $scope.croppedCompanyLogo = '';
    $scope.modifyJobOptions=[];
    $scope.isOTPSent=false;   
   
    $scope.autocompleteOptions = {       
        types: ['(cities)']
    }; 

    $scope.init = function () {
        $scope.openFullForm = false;
        $scope.showFiltersMenu=true;

        //User,Company,Job model templates
        $scope.userModel=userModel.user();   
        $scope.companyModel=companyModel.company();      
        $scope.jobModel=jobModel.job();

        //Getting static values
        getJobTypeList();
        getInterviewTypeList();
        getCompanyIndustryList();

        //Getting JobList
        getJobList();
        loadAllStaticFilterData();
    };    

    $scope.initPostJob=function(){
        //Setting 
        if($scope.jobModel.experience){
           $scope.jobModel.experience=parseInt($scope.jobModel.experience); 
        }

        if($scope.companyLocation){
            var comloc = new CB.CloudGeoPoint($scope.companyLocation.geometry.location.G,$scope.companyLocation.geometry.location.K);
            var comLocationJson={
                placeId:$scope.companyLocation.place_id,            
                address:$scope.companyLocation.formatted_address,
                url:$scope.companyLocation.url
            };

            $scope.jobModel.companyLocationGeopoint=comloc;
            $scope.jobModel.companyLocationDetails=comLocationJson;
        }
        if($scope.walkInLocation){
            var wloc = new CB.CloudGeoPoint($scope.walkInLocation.geometry.location.G,$scope.walkInLocation.geometry.location.K);
            var walkInLocationJson={
                placeId:$scope.walkInLocation.place_id,               
                address:$scope.walkInLocation.formatted_address,
                url:$scope.walkInLocation.url
            };
            $scope.jobModel.walkInLocationGeopoint=wloc;
            $scope.jobModel.walkInLocationDetails=walkInLocationJson;
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

                if(getEndUserCookie()){
                    $scope.userObj=CB.fromJSON(JSON.parse(getEndUserCookie()).document); 
                    $scope.continueExistUser=true;                    
                }
                $("#enterPhone").modal();
                                         
            }
        }       
    }; 

    $scope.resend=function(){
        $scope.isOTPSent=false;
    }; 

    $scope.continueWithPhone=function(){
        $("#enterPhone").modal("hide");
        prepareCompanyAndSave();
    };

    $scope.changePhone=function(){
        $scope.continueExistUser=false;   
        $scope.tempUser=angular.copy($scope.userObj);
        $scope.userObj=null;
        deleteCookie();        
    };

    $scope.cancelPost=function(){
        $("#enterPhone").modal("hide");
        $scope.isOTPSent=false;
        $scope.userModel.phone=null;
        $scope.userModel.otpCode=null;

        if($scope.tempUser){
            $scope.continueExistUser=true;  
            $scope.userObj=$scope.tempUser;            
            setEndUserCookie(CB.toJSON($scope.tempUser));
        }
    }; 

    $scope.sendOTP=function(){   
        $scope.userModel.phone=$("#mobile-number").intlTelInput("getNumber");     
        userServices.sendOTP($scope.userModel)
        .then(function(user){
            if(user){                
             $scope.isOTPSent=true;
             setEndUserCookie(user);
             $scope.userObj=CB.fromJSON(user.document);
            } 
                                      
        },function(error){ 
           errorNotification("Something went wrong. Please try again..");               
        });   
    };

    $scope.verifyOTP=function(){
        $scope.invalidOTPError=null;
        userServices.verifyOTP($scope.userModel.phone,$scope.userModel.otpCode)
        .then(function(userObj){          
           $("#enterPhone").modal("hide");
           prepareCompanyAndSave();                           
        },function(error){    
           $scope.invalidOTPError="This OTP is expired or timedout";                             
        });

    };

    function prepareCompanyAndSave(){
        //Setting Company JSON
        $scope.companyModel._user=$scope.userObj; 
        $scope.companyModel._industry=getIndustryObject($scope.companyModel._industry);        
        if($scope.companyLogoObj){
            getCBFile($scope.companyLogoObj)
            .then(function(cloudBoostFile){

                $scope.companyModel.logo=cloudBoostFile;
                companyServices.saveCompany($scope.companyModel)
                .then(function(companyObj){
                    prepareJobAndSave(companyObj);
                }, function(err){
                    errorNotification("Error in creating company..try again");  
                });

            }, function(err){ 
                errorNotification("Error in selecting Logo..try again"); 
            });
        }else{
            companyServices.saveCompany($scope.companyModel)
            .then(function(companyObj){
                prepareJobAndSave(companyObj);
            }, function(err){
                errorNotification("Error in creating company..try again"); 
            });
        }
    }
    function prepareJobAndSave(companyObj){    

        //Setting Job JSON
        $scope.jobModel._user=$scope.userObj;
        $scope.jobModel._company=CB.fromJSON(companyObj.document);
        if($scope.jobModel.dateTime){
            $scope.jobModel.dateTime=new Date($scope.jobModel.dateTime);
        }        
        $scope.jobModel._jobType=getJobTypeObject($scope.jobModel._jobType);
        $scope.jobModel._interviewType=getInterviewTypeObject($scope.jobModel._interviewType);        

        jobServices.saveJob($scope.jobModel) 
        .then(function(jobObj){
            if($scope.jobList && $scope.jobList.length>0){
                $scope.jobList.push(jobObj);
            }else{
                $scope.jobList=[];
                $scope.jobList.push(jobObj);
            }

            successNotification("Successfully posted your job");
            $scope.openFullForm = false;

            nullifyFields();            

        }, function(err){ 
            errorNotification("We couldn't post your job now..try again");
        });              
        
    } 

    $scope.deleteJob=function(index){
        $scope.editableIndex=index;
        $scope.modifyJobOptions[index]=false;
        $("#deleteJob").modal();
    };

    $scope.deleteSendOTP=function(){ 
        var jobId=$scope.jobList[$scope.editableIndex].get("id");  
        $scope.userPhone=$("#del-mobile-number").intlTelInput("getNumber"); 

        userServices.modifySendOTP($scope.userPhone,jobId,"delete")
        .then(function(user){
            if(user){
             $scope.isOTPSentForDel=true;
             setEndUserCookie(user);
             $scope.userObj=CB.fromJSON(user.document);
            } 
                                      
        },function(error){ 
           errorNotification("Something went wrong. Please try again..");               
        });   
    };

    $scope.deleteVerifyOTP=function(){
        $scope.invalidOTPError=null;
        userServices.verifyOTP($scope.userPhone,$scope.userOTP)
        .then(function(userObj){          
           deleteJob();                           
        },function(error){    
            $scope.invalidOTPError="We couldn't verify your OTP properly,try again..";                             
        });

    };

    function deleteJob(){
        var obj=$scope.jobList[$scope.editableIndex];
        jobServices.deleteJobByObj(obj)
        .then(function(userObj){          
             $scope.jobList.splice($scope.editableIndex,1); 
             $scope.editableIndex=null;
             $scope.userPhone=null;
             $scope.userOTP=null; 
             $scope.isOTPSentForDel=false;
             $("#deleteJob").modal("hide");                       
        },function(error){    
                                         
        });
    }

    $scope.editJob=function(index){
        $scope.modifyJobOptions[index]=false;
        $scope.editableIndex=index;       

        loadEditJob($scope.jobList[index]);

        $("#editJob").modal();
    };

    $scope.initEditJob=function(){
        //Setting 
        if($scope.editJobModel.experience){
           $scope.editJobModel.experience=parseInt($scope.editJobModel.experience); 
        }

        if($scope.editCompanyLocation){
            if(typeof $scope.editCompanyLocation!="string"){
                var comloc = new CB.CloudGeoPoint($scope.editCompanyLocation.geometry.location.A,$scope.editCompanyLocation.geometry.location.F);
                var comLocationJson={
                    placeId:$scope.editCompanyLocation.place_id,            
                    address:$scope.editCompanyLocation.formatted_address,
                    url:$scope.editCompanyLocation.url
                };

                $scope.editJobModel.companyLocationGeopoint=comloc;
                $scope.editJobModel.companyLocationDetails=comLocationJson;
            }else{
                $scope.editJobModel.companyLocationGeopoint=$scope.editableJobObj.get("companyLocationGeopoint");
                $scope.editJobModel.companyLocationDetails=$scope.editableJobObj.get("companyLocationDetails");
            }            
        }

        if($scope.editWalkInLocation){
            if(typeof $scope.editWalkInLocation!="string"){
                var wloc = new CB.CloudGeoPoint($scope.editWalkInLocation.geometry.location.A,$scope.editWalkInLocation.geometry.location.F);
                var walkInLocationJson={
                    placeId:$scope.editWalkInLocation.place_id,               
                    address:$scope.editWalkInLocation.formatted_address,
                    url:$scope.editWalkInLocation.url
                };
                $scope.editJobModel.walkInLocationGeopoint=wloc;
                $scope.editJobModel.walkInLocationDetails=walkInLocationJson;
            }else{
                $scope.editJobModel.walkInLocationGeopoint=$scope.editableJobObj.get("walkInLocationGeopoint");
                $scope.editJobModel.walkInLocationDetails=$scope.editableJobObj.get("walkInLocationDetails");
            }    
        }

        //Validate and passing
        var companyErr=validationServices.validateFields("company",$scope.editCompanyModel);        
        if(companyErr){
            warningNotification(companyErr);
        }else{
           var jobErr=validationServices.validateFields("job",$scope.editJobModel);
           if(jobErr){
             warningNotification(jobErr);
           }else{
            $("#editJob").modal("hide");
            $("#editJobAuth").modal();
           }
        }       
    };

    $scope.editSendOTP=function(){  
        var jobId=$scope.jobList[$scope.editableIndex].get("id");  
        $scope.userPhone=$("#edit-mobile-number").intlTelInput("getNumber"); 

        userServices.modifySendOTP($scope.userPhone,jobId,"edit")
        .then(function(user){
            if(user){
             $scope.isOTPSentForEdit=true;
             setEndUserCookie(user);
             $scope.userObj=CB.fromJSON(user.document);
            } 
                                      
        },function(error){ 
           errorNotification("Something went wrong. Please try again..");               
        });   
    };

    $scope.editVerifyOTP=function(){
        $scope.invalidOTPError=null;
        userServices.verifyOTP($scope.userPhone,$scope.userOTP)
        .then(function(userObj){          
           $("#editJobAuth").modal("hide");
           prepareCompanyAndUpdate();                          
        },function(error){    
            $scope.invalidOTPError="We couldn't verify your OTP properly,try again..";                             
        });

    };

    function prepareCompanyAndUpdate(){
        //Setting Company JSON      
        $scope.editCompanyModel._industry=getIndustryObject($scope.editCompanyModel._industry);        
        if($scope.editCompanyLogoObj){
            getCBFile($scope.editCompanyLogoObj)
            .then(function(cloudBoostFile){

                $scope.editCompanyModel.logo=cloudBoostFile;
                companyServices.updateCompany($scope.editableJobObj.get("_company"),$scope.editCompanyModel)
                .then(function(companyObj){
                    prepareJobAndUpdate();
                }, function(err){
                    errorNotification("Error in creating company..try again");  
                });

            }, function(err){ 
                errorNotification("Error in selecting Logo..try again"); 
            });
        }else{
            companyServices.updateCompany($scope.editableJobObj.get("_company"),$scope.editCompanyModel)
            .then(function(companyObj){
                prepareJobAndUpdate();
            }, function(err){
                errorNotification("Error in creating company..try again");  
            });
        }
    }
    function prepareJobAndUpdate(){    

        //Setting Job JSON      
        if($scope.editJobModel.dateTime){
            $scope.editJobModel.dateTime=new Date($scope.editJobModel.dateTime);
        }        
        $scope.editJobModel._jobType=getJobTypeObject($scope.editJobModel._jobType);
        $scope.editJobModel._interviewType=getInterviewTypeObject($scope.editJobModel._interviewType);        

        jobServices.updateJob($scope.editableJobObj,$scope.editJobModel) 
        .then(function(jobObj){
            if($scope.jobList && $scope.jobList.length>0){
                $scope.jobList[$scope.editableIndex]=jobObj;
            }

            successNotification("Successfully posted your job");          

            nullifyFields();            

        }, function(err){ 
            errorNotification("We couldn't post your job now..try again");
        });              
        
    }    

    $scope.cancelEdit=function(){
        nullifyFields();
        $("#editJob").modal("hide");
    };

    function getJobList(){
        jobServices.getJobList($scope.searchByLocation,
            $scope.filDateTime,
            $scope.filGradYear,
            $scope.filAcademicGrade,
            $scope.filDegreeName,
            $scope.filInterviewType,
            $scope.filSkills,
            $scope.filSectorType,
            $scope.filDesignation,
            $scope.filExperience,
            $scope.filCompany)
        .then(function(list){
            if(list.length>0){
              $scope.jobList=list;               
            }else{
              $scope.jobList=null;
            }                                       
        },function(error){                
        }); 
    }

    $scope.addMoreJobs=function(){
        console.log("Add more jobs");
    };

/******************Small Functions***********************/
    $scope.kuljaSimSim = function (event) {
        event.stopPropagation();
        $timeout(function () {
            $scope.openFullForm = true;
        });
    };

    $scope.setCategory = function (e, tab) {
        e.preventDefault();
        $('a[href=#' + tab + ']').tab('show');
    };

    $scope.toggle = function (id) {

        //Walk in Location
        if(id=="add-walkin"){
            if($scope.walkInLocation){
              $scope.walkInLocation=null;
            }
        }

        if(id=="edit-walkin"){
            if($scope.editWalkInLocation){
              $scope.editWalkInLocation=null;
            }
        }

        //Apply Link
        if(id=="add-link"){
            if($scope.jobModel.applyLink){
              $scope.jobModel.applyLink="http://"
            }
        }
        if(id=="edit-link"){
            if($scope.editJobModel.applyLink){
              $scope.editJobModel.applyLink="http://"
            }
        }

        //DateTime
        if(id=="add-date-time"){
            if($scope.jobModel.dateTime){
              $scope.jobModel.dateTime=null;
            }
        }
        if(id=="edit-date-time"){
            if($scope.editJobModel.dateTime){
              $scope.editJobModel.dateTime=null;
            }
        }

        //Phone
        if(id=="add-phone"){
            if($scope.jobModel.phone){
              $scope.jobModel.phone=null;
            }
        }
        if(id=="edit-phone"){
            if($scope.editJobModel.phone){
              $scope.editJobModel.phone=null;
            }
        }

        //Job Type
        if(id=="add-job-type"){
            if($scope.jobModel._jobType){
              $scope.jobModel._jobType=getJobTypeObject($scope.jobModel._jobType);
            }
        }
        if(id=="edit-job-type"){
            if($scope.editJobModel._jobType){
              //$scope.editJobModel._jobType=null;
            }
        }

        //Interview Type
        if(id=="add-interview-type"){
            if($scope.jobModel._interviewType){
              $scope.jobModel._interviewType=getInterviewTypeObject($scope.jobModel._interviewType);
            }
        }

        if(id=="edit-interview-type"){
            if($scope.editJobModel._interviewType){
              //$scope.editJobModel._interviewType=null;
            }
        }

        $timeout(function () {
            $('#' + id).toggle();
        }, 10);
    };

    //Logo specific
    $scope.changeToggle = function (el) {
        if($scope.editableJobObj){
          $timeout(function () {
            $('#edit-logo').after($('#' + el).detach());
          });
        }else{
          $timeout(function () {
            $('#add-logo').after($('#' + el).detach());
          });  
        }       
    };

    $scope.selectLogo = function () {
        if($scope.editableJobObj){
            if($scope.editCompanyLogo){
                $scope.editCompanyLogo = '';
                $scope.editCroppedCompanyLogo = '';
                $scope.toggle('edit-logo');
            }else if(!$scope.editCompanyLogo){
                $('#edit-logo-input').click(); 
            }
        }else{
            if($scope.companyLogo){
                $scope.companyLogo = '';
                $scope.croppedCompanyLogo = '';
                $scope.toggle('add-logo');
            }else if(!$scope.companyLogo){
                $('#logo-input').click(); 
            }  
        }                       
    };

    $scope.clearCompanyLogo = function () {
        if($scope.editableJobObj){

            $timeout(function () {
                $scope.editCompanyLogo = '';
                $scope.editCroppedCompanyLogo = '';
                $('#edit-logo-input').val('');
                $scope.toggle('edit-logo');
            });
        }else{
            $timeout(function () {
                $scope.companyLogo = '';
                $scope.croppedCompanyLogo = '';
                $('#logo-input').val('');
                $scope.toggle('add-logo');
            });  
        }
        
    };
    //End Logo specific

    $scope.getType = function (x) {
        return typeof x;
    };
    $scope.isDate = function (x) {
        return x instanceof Date;
    };    

    $scope.setModalCategory = function (e, tab) {
        e.preventDefault();
        $('a[href=#' + tab + ']').tab('show');
    };

    function handleFileSelect(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function ($scope) {
                if($scope.editableJobObj){
                  $scope.editCroppedCompanyLogo=null;  
                  $scope.editCompanyLogo = evt.target.result;
                }else{
                  $scope.companyLogo = evt.target.result;
                }                
            });
        };
        reader.readAsDataURL(file);
        if($scope.editableJobObj){
          $scope.editCompanyLogoObj=file;
          $('#edit-logo').show();
        }else{
          $scope.companyLogoObj=file;
          $('#add-logo').show();  
        }
        
    };
    
    /*$($document[0]).on('click', function (EVENT) {
        if(~EVENT.target.className.indexOf('k-')) {
            return;
        }
        $timeout(function () {
            $scope.openFullForm = false;
        }, 0);
    });*/

    $(document).click(function (e){
        var container = $("#app-full-form");
        var postJobModal=$("#enterPhone");
        var location=$(".autokmplt-plug");

        var sameContainer=container.is(e.target) // if the target of the click isn't the container...
        var childContainer=container.has(e.target).length === 0;
        var samePostJobModal=postJobModal.is(e.target);
        var childPostJobModal=postJobModal.has(e.target).length === 0;
       

        if (!sameContainer && childContainer && !samePostJobModal && childPostJobModal && !location){
            $scope.openFullForm = false;
            $scope.$digest();
        }
    });

    $('#app-full-form').on('click', function (event) {
        event.stopPropagation();
    });

    function tooltip() {
        $('[data-toggle="tooltip"]').tooltip();
        $('#logo-input').on('change', handleFileSelect);
        $('#edit-logo-input').on('change', handleFileSelect);
    }

    tooltip();

    $scope.prefixHTTP=function(){
      if($scope.jobModel.applyLink==null || $scope.jobModel.applyLink==""){
        $scope.jobModel.applyLink="http://";
      }
      if($scope.companyModel.url==null || $scope.companyModel.url==""){
        $scope.companyModel.url="http://";
      }

      if($scope.editableJobObj){
          if($scope.editJobModel.applyLink==null || $scope.editJobModel.applyLink==""){
            $scope.editJobModel.applyLink="http://";
          }
          if($scope.editCompanyModel.url==null || $scope.editCompanyModel.url==""){
            $scope.editCompanyModel.url="http://";
          }
      }
      
    };

    //Filter Specific Functions
    $scope.toggleFiltersMenu=function(){        
        if($scope.showFiltersMenu){
            $scope.showFiltersMenu=false;
        }else{
            $scope.showFiltersMenu=true;
        }
    };

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

    function setEndUserCookie(userObj){
        var userStr=JSON.stringify(userObj);
        $.cookie('user', userStr, { expires: 2,path: '/' });
    }
    function getEndUserCookie(){
        return $.cookie('user');
    }
    function deleteCookie(){
        $.removeCookie('user', { path: '/' });
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

    function nullifyFields(){
        //If in edit mode
        if($scope.editableJobObj){
            $scope.editableJobObj=null;

            //User,Company,Job model templates
            $scope.editUserModel=null;   
            $scope.editCompanyModel=null;     
            $scope.editJobModel=null;

            $scope.editCompanyLocation=null;
            $scope.editWalkInLocation=null;
            $scope.editCompanyLogo = '';
            $scope.editCroppedCompanyLogo = '';

            $('#edit-logo').hide();
            $('#edit-walkin').hide();
            $('#edit-link').hide();
            $('#edit-date-time').hide();
            $('#edit-phone').hide();
            $('#edit-job-type').hide();
            $('#edit-interview-type').hide();

        }else{
           //User,Company,Job model templates
            $scope.userModel=userModel.user();   
            $scope.companyModel=companyModel.company();      
            $scope.jobModel=jobModel.job();

            $scope.companyLocation=null;
            $scope.walkInLocation=null;
            $scope.companyLogo = '';
            $scope.croppedCompanyLogo = '';

            $('#add-logo').hide();
            $('#add-walkin').hide();
            $('#add-link').hide();
            $('#add-date-time').hide();
            $('#add-phone').hide();
            $('#add-job-type').hide();
            $('#add-interview-type').hide(); 
        }           
        
    }

    function loadEditJob(editableJobObj){

        $scope.editableJobObj=editableJobObj;

        //Assinging Company,Job model       
        $scope.editCompanyModel=companyModel.company();      
        $scope.editJobModel=jobModel.job();

        $scope.editCompanyModel.name=editableJobObj.get("_company").get("name");

        if(editableJobObj.get("_company") && editableJobObj.get("_company").get("about")){
            $scope.editCompanyModel.about=editableJobObj.get("_company").get("about");
        }
        
        if(editableJobObj.get("_company").get("url")!="http://"){
           $scope.editCompanyModel.url=editableJobObj.get("_company").get("url"); 
        }else{
           $scope.editCompanyModel.url="http://";
        }
        
        $scope.editCompanyModel._industry=editableJobObj.get("_industry");

        if(editableJobObj.get("_company").get("logo") && editableJobObj.get("_company").get("logo").url){
            $scope.editCompanyModel.logo=editableJobObj.get("_company").get("logo");
            $scope.editCroppedCompanyLogo=editableJobObj.get("_company").get("logo").url;
            if($scope.editCroppedCompanyLogo){
                $('#edit-logo').show();
            }                       
        }        

        $scope.editJobModel.title=editableJobObj.get("title");
        $scope.editJobModel.description=editableJobObj.get("description");
        $scope.editJobModel.dateTime=editableJobObj.get("dateTime");
        $scope.editJobModel.applyLink=editableJobObj.get("applyLink");
        $scope.editJobModel.resumeTo=editableJobObj.get("resumeTo");
        $scope.editJobModel.phone=editableJobObj.get("phone");
        $scope.editJobModel._interviewType=editableJobObj.get("_interviewType");
        $scope.editJobModel.experience=editableJobObj.get("experience");
        $scope.editJobModel._jobType=editableJobObj.get("_jobType");

        if(editableJobObj.get("companyLocationDetails") && editableJobObj.get("companyLocationDetails").address){
          $scope.editCompanyLocation=editableJobObj.get("companyLocationDetails").address;
        }
        if(editableJobObj.get("walkInLocationDetails") && editableJobObj.get("walkInLocationDetails").address){
          $scope.editWalkInLocation=editableJobObj.get("walkInLocationDetails").address;
        }         

    }


    /*****FILTERS*****/
    function loadAllStaticFilterData(){
        $scope.staticLocationList=staticDataServices.getLocations();
        $scope.staticGraduationYearList=staticDataServices.getGraduationYears();
        $scope.staticAcademicGradesList=staticDataServices.getAcademicGrades();
        $scope.staticDegreeNameList=staticDataServices.getDegreeNames();        
        $scope.staticSkillList=staticDataServices.getSkillSet();        
        $scope.staticDesignationNameList=staticDataServices.getDesignationNames();
        $scope.staticExperienceList=staticDataServices.getExperiences();
        $scope.staticCompanyNameList=staticDataServices.getCompanyNames();
    }
    
    $scope.selectLocation=function(index){
        $scope.searchByLocation=$scope.staticLocationList[index];
        $scope.searchLocation();
    };
    $scope.searchLocation=function(){
       if(typeof $scope.searchByLocation=="object"){
        getJobList();
       }
    };    
    $scope.filterDateTime=function(){
       if($scope.filDateTime){
        $scope.filDateTime=new Date($scope.filDateTime);
        getJobList();
       }
    };
    $scope.filterGradYear=function(index){
       $scope.filGradYear=staticGraduationYearList[index];
       if($scope.filGradYear){       
        getJobList();
       }
    };
    $scope.filterAcademicPercentage=function(index){
        $scope.filAcademicGrade=$scope.staticAcademicGradesList[index];
        if($scope.filAcademicGrade){       
         getJobList();
        }
    };
    $scope.filterDegreeName=function(index){
        $scope.filDegreeName=$scope.staticDegreeNameList[index];
        if($scope.filDegreeName){       
         getJobList();
        }
    };
    $scope.filterInterviewType=function(index){
        $scope.filInterviewType=$scope.interviewTypeList[index];
        if($scope.filInterviewType){
           getJobList(); 
        }
    };
    $scope.filterSkills=function(index){
        //$scope.staticSkillList[index];
        $scope.filSkills=angular.copy($scope.staticSkillList);
        getJobList(); 
    };
    $scope.filterSectorType=function(index){
        $scope.filSectorType=$scope.companyIndustryList[index];
        if($scope.filSectorType){
           getJobList(); 
        }
    };
    $scope.filterDesignation=function(index){
        $scope.filDesignation=$scope.staticDesignationNameList[index];
        if($scope.filDesignation){
           getJobList(); 
        }
    };
    $scope.filterExperience=function(index){
        $scope.filExperience=$scope.staticExperienceList[index];
        if($scope.filExperience){
           getJobList(); 
        }
    };
    $scope.filterCompany=function(index){
        $scope.filCompany=$scope.staticCompanyNameList[index];
        if($scope.filCompany){
           getJobList(); 
        }
    };
           
});







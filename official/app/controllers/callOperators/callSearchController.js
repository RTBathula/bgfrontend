app.controller('callSearchController',
function ($scope,
    staticDataServices,
    jobTypeServices,
    interviewTypeServices,
    companyIndustryServices,
    jobServices,
    $rootScope) {

	$scope.init=function(){
        //Getting static values
        getJobTypeList();
        getInterviewTypeList();
        getCompanyIndustryList();
		loadAllStaticFilterData();        
	};

    $scope.searchDeGrande=function(){
        jobServices.searchDeGrande($scope.searchByLocation,
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
              $rootScope.searchedJobList=list; 
              window.location.href="/official/#/call/searchresults";              
            }else{
              $scope.searchResults="No Jobs Found";
            }                                      
        },function(error){                
        }); 
    };

	/*****FILTERS*****/
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
    $scope.filterGradYear=function(index){
       $scope.filGradYear=staticGraduationYearList[index];       
    };
    $scope.filterDegreeName=function(index){
        $scope.filDegreeName=$scope.staticDegreeNameList[index];        
    };
    $scope.filterDesignation=function(index){
        $scope.filDesignation=$scope.staticDesignationNameList[index];        
    };
    $scope.filterExperience=function(index){
        $scope.filExperience=$scope.staticExperienceList[index];        
    };
    $scope.filterDateTime=function(){
       if($scope.filDateTime){
        $scope.filDateTime=new Date($scope.filDateTime);        
       }
    };
    $scope.filterAcademicPercentage=function(index){
        $scope.filAcademicGrade=$scope.staticAcademicGradesList[index];        
    };    
    $scope.filterInterviewType=function(index){
        $scope.filInterviewType=$scope.interviewTypeList[index];        
    };
    $scope.filterSkills=function(index){
        //$scope.staticSkillList[index];
        $scope.filSkills=angular.copy($scope.staticSkillList);        
    };
    $scope.filterSectorType=function(index){
        $scope.filSectorType=$scope.companyIndustryList[index];        
    };    
    $scope.filterCompany=function(index){
        $scope.filCompany=$scope.staticCompanyNameList[index];        
    };
});

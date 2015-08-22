app.controller('jobDetailsController',
function ($scope,
	$stateParams,
	jobServices,
	uiGmapGoogleMapApi) {

	var jobId;
	$scope.init=function(){		
	    jobId = $stateParams.jobId;
	   	if(jobId){
	   		getJobDetails(jobId);	
	   	}   
	};

	function getJobDetails(){
		jobServices.getJobDetails(jobId)
		.then(function(jobDet){
			if(jobDet){
				$scope.jobDetails=jobDet; 

				//Prepare google map
				if($scope.jobDetails.get('walkInLocationGeopoint')){
					prepareGoogleMap(jobDet);
				}        
	            
			}
                                       
        },function(error){                
        }); 
	}


	function prepareGoogleMap(jobDet){
		uiGmapGoogleMapApi.then(function(maps) {            
          
			$scope.map = {
	          center: {
	              latitude: jobDet.get("walkInLocationGeopoint").latitude,
	              longitude: jobDet.get("walkInLocationGeopoint").longitude
	          },
	          zoom: 18
	        };
	        $scope.marker = {
	          id: 1,
	          coords: {
	              latitude: jobDet.get("walkInLocationGeopoint").latitude,
	              longitude: jobDet.get("walkInLocationGeopoint").longitude
	          }
	        };      

		});
	}
});

app.controller('callSearchResultsController',
function ($scope,$rootScope,userServices) {

	var jobsCount=4;

	$scope.init=function(){
		console.log("AYN RAND");				
	};

	$scope.sendSMSModal=function(){
		$("#send-sms-modal").modal();
	};

	$scope.sendSMS=function(){
		$scope.phone=$("#smsjobs-mobile-number").intlTelInput("getNumber");
		if($scope.phone){
			if($rootScope.searchedJobList && $rootScope.searchedJobList.length>0){
				
				var jobsListToSMS=[];
				for(var i=0;i<$rootScope.searchedJobList.length;++i){
					if(i<jobsCount){
						jobsListToSMS.push($rootScope.searchedJobList[i]);
					}
				}

				//Send SMS
				userServices.SMSJobs($scope.phone,jobsListToSMS)
				.then(function(resp){
					$scope.respBody=resp;
					if(resp){
						successNotification("SMS sent successfully!");
					}
					$("#send-sms-modal").modal("hide"); 
							                                               
		        },function(error){ 
		        	$("#send-sms-modal").modal("hide"); 
		        	errorNotification(error);              
		        }); 
			}
			
		}
	};

	//Private fuctions

	//Notifications
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

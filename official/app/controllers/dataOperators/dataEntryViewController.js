app.controller('dataEntryViewController',
function ($scope,jobServices) {
    $scope.init=function(){
        getJobList();
    };
    $scope.deleteJob=function(job){
        if(job){
            var index=$scope.jobList.indexOf(job);

            jobServices.deleteJobByObj(job)
            .then(function(resp){          
                $scope.jobList.splice(index,1);                                       
            },function(error){    
                                             
            });
        }
    };
    $scope.shuffleToRecent=function(job){
        if(job){
            var index=$scope.jobList.indexOf(job);
            job.set("createdAt",new Date());

            jobServices.saveJobByObj(job)
            .then(function(resp){          
                $scope.jobList[index]=resp;                                       
            },function(error){    
                                             
            });            
        }
    };

    //Private Functions
    function getJobList(){
        jobServices.getJobList()
        .then(function(list){
            if(list.length>0){
              $scope.jobList=list;               
            }else{
              $scope.jobList=null;
            }                                       
        },function(error){                
        }); 
    }
});

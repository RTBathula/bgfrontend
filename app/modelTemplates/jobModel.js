app.factory('jobModel', ['$q',function ($q) {

    var global = {};

    global.job = function(){
    	
    	var job={				
			_company:null,
			_user:null,
			title:null,
			description:null,
			dateTime:null,
			applyLink:"http://",
			resumeTo:null,
			phone:null,
			_interviewType:null,
			experience:null,
			_jobType:null,
			companyLocationGeopoint:null,
			companyLocationDetails:null,
			walkInLocationGeopoint:null,
			walkInLocationDetails:null
		}

		return job;
    }; 

    return global;

}]);

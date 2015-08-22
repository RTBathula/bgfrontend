app.service('jobTypeServices', function ($rootScope, $q) {

    this.getJobTypeList = function () {
        var q=$q.defer();

       	var query = new CB.CloudQuery("JobType");		
		query.find({
			success: function(list){
				q.resolve(list);
			},
			error: function(err) {
				q.reject(err);
			}
		});       

        return  q.promise;
    };

});

app.service('interviewTypeServices', function ($rootScope, $q) {

    this.getInterviewTypeList = function () {
        var q=$q.defer();

       	var query = new CB.CloudQuery("InterviewType");		
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

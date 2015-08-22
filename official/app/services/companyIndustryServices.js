app.service('companyIndustryServices', function ($rootScope, $q) {

    this.getCompanyIndustryList = function () {
        var q=$q.defer();

       	var query = new CB.CloudQuery("CompanyIndustry");		
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

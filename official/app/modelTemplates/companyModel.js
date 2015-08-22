app.factory('companyModel', ['$q',function ($q) {

    var global = {};

    global.company = function(){
    	
        var company={		
			_user:null,
			name:null,
			about:null,
			url:"http://",
			_industry:null,
			logo:null	
		}
		return company;
    }; 

    return global;

}]);

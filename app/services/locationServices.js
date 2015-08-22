app.factory('locationServices', ['$q','$http',function ($q,$http) {

    var global = {};

    global.getAddress = function(latitude,longitude){
        var q = $q.defer();   

        $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=false')

        .success(function(response, status, headers, config) {
           console.log(response);
           q.resolve(response);
        }).error(function(data, status, headers, config) {
           console.log(status);
           q.reject(status);               
        }); 

        return  q.promise;
    };     
    return global;

}]);

/*
app.factory('Location', function ($http) {

    function get(val) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false
            }
        }).then(function (response) {
            return response.data.results.map(function (item) {
                return item.formatted_address;
            });
        });
    }

    return {
        get: get
    };

});

app.factory('locationServices', function ($http) {   

    function getAddress(latitude,longitude) {       
      
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=false')
        .success(function(response, status, headers, config) {
            return response.data.results.map(function (item) {
                return item.formatted_address;
            });
        }).error(function(data, status, headers, config) {
            console.log(status);               
        });

    };

    return {
        get: get
    };

});*/


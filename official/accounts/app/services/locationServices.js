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

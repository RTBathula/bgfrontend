

app.directive('intlphone', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).intlTelInput({
                allowExtensions:true,
                autoFormat:true,
                utilsScript:"bower_components/intl-tel-input/lib/libphonenumber/build/utils.js",
                defaultCountry: "auto",
                geoIpLookup: function(callback) {
                    $.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                      var countryCode = (resp && resp.country) ? resp.country : "";
                      callback(countryCode);
                    });
                }
            });          
        }
    };
});

app.directive('autokomplete', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['(cities)']
            };
            autocomplete  = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                scope.$apply(function() { 
                    var place = autocomplete.getPlace();
                    console.log(place); 
                    model.$setViewValue(place);
                });
            });
        }
    };
});







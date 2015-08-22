/**
 * AngularJS reverse geocoding directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.0.0
 */
(function () {
    angular.module('angularReverseGeocode', [])
    .directive('reverseGeocode', function ($timeout) {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);

                $timeout(function () {
                     geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                element.text(results[0].formatted_address);
                            } else {
                                element.text('Location not found');
                            }
                        } else {
                            element.text('Geocoder failed due to: ' + status);
                        }
                    });
                }, 5000);
               
            },
            replace: true
        }
    });
})();
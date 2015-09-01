app.directive('typed', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            $(element).typed({
                strings: [" and send you SMS", "CALL at"],
                typeSpeed: 20,
                contentType: 'text',
                loop:true,
                showCursor: true,
                cursorChar: "|"
            });
            
        }
    };
});

app.directive('txtshort', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            var showChar = 60; // How many characters are shown by default
            var ellipsestext = "...";           
            $(element).each(function() {
                var content = $(this).text();
                content=content.trim();
                content=content.replace(/\s+/, ""); 
                if(content.length > showChar) {
         
                    var c = content.substr(0, showChar);                             
                    var html = c + '' + ellipsestext;
         
                    $(this).text(html);
                }
         
            });
                        
        }
    };
});

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

app.directive('fakecrop', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            $(element).fakecrop();
            
        }
    };
});

app.directive('cropbox', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            $(element).cropbox({
                width: 80,
                height:80,
                showControls:"never"
            });            
        }
    };
});

app.directive('resizeanddrop', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            $(element).resizeAndCrop({
             crop: true,
             width:80,
             height:80,
             center:true,
             smart:true
         } );      
        }
    };
});


app.directive('autokomplete', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: ['address']
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







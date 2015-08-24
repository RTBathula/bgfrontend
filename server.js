
var express = require('express');
var app = express();

//var seojs = require('express-seojs');
//app.use(seojs('14f59vej5dr1mmx95pvzb9qlx'));

//app.use(require('prerender-node').set('prerenderServiceUrl', 'http://localhost:1445').set('prerenderToken', '9I6PNQ4jxLzvPISvvUo7'));
//console.log(__dirname);
app.use(express.static(__dirname));

//This will ensure that all routing is handed over to AngularJS 
app.get('*', function(req, res){
	console.log(__dirname);
  res.sendFile(__dirname+'/index.html'); 
});

app.set('port', process.env.PORT || 1440);

var server = app.listen(app.get('port'), function() {
	console.log("Port "+app.get('port')+" is ON");
	console.log("Man cannot survive except through his mind!");
});

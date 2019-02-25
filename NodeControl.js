var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');

var app = express();
var path = require("path");
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())

app.get('/',function(req,res){//Starts Server from html file
  res.sendFile(path.join(__dirname+'/travelcompanion.html'));
});
app.use(express.static('.'));

app.get('/weather', function(req,res){
  var URL = "https://api.aerisapi.com/forecasts/"+ req.query.city + "?&format=json&filter=day&limit="+req.query.day+"&fields=.weatherPrimary,periods.avgTempF,periods.icon,periods.weather&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz";
  request.get(URL,function(error,response,body){
    var respond = JSON.parse(body)
    var output = respond.response[0].periods[respond.response[0].periods.length-1]
    //var output = [respond.response[0].periods[respond.response[0].periods.length-1].avgTempF,respond.response[0].periods[respond.response[0].periods.length-1].icon,respond.response[0].periods[respond.response[0].periods.length-1].pop,respond.response[0].periods[respond.response[0].periods.length-1].weather]
    return res.send(JSON.stringify(output))
	});
})

app.listen(8080, function(){
  console.log("Server started")
})

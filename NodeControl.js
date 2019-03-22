var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var unirest = require('unirest');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "rds-mysql-cs275.cgcd11jp8kci.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "mysqlcs275",
  database: "airports"
});

con.connect(function(err){
  if (err) {
    console.log("Failed to connect to database")
    console.log(err)
  }
  else{
    console.log("Connected to database");
  }
});

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

app.get('/iata', function(req,res){
  var name = []
  var iata = []
  var count = 1
  for(var i = 0; i < req.query.cities.length; i++){
    var sql_str = 'select distinct iata, name from airportsus where city = \"' + req.query.cities[i] + "\""
    con.query(sql_str, function(err,rows,fields){
    if (err){
      console.log('Failed to get data')
    }
    else{
      var a = []
      var b = []
      for(var j = 0; j < rows.length; j++){
        a.push(rows[j].name)
        b.push(rows[j].iata)
      }
      name.push(a)
      iata.push(b)
      if (count == req.query.cities.length){
        res.json({
          name:name,
          iata:iata
        })
      }
      else{
        count += 1
      }
    }
    })
  }
})
app.get('/quotes', function(req,res){
  var codes = []
  var placeid = []
  var regionid = []
  var skycode = []
  var count = 1
  for(var i = 0; i < req.query.iata.length; i++){
    var str = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query="+req.query.iata[i]
    unirest.get(str)
    .header("X-RapidAPI-Key", "18aa168972msh162649f7af22656p129a1ejsn164eb25c5fce")
    .end(function (result) {
      for(var j = 0; j < result.body.Places.length; j++){
        placeid.push(result.body.Places[j].PlaceId)
        regionid.push(result.body.Places[j].RegionId)
      }

      if (count == req.query.iata.length){
        var c = 0
        while (c < req.query.region.length){
          for(var k = 0; k < regionid.length; k++){
            if(regionid[k] == req.query.region[c]){
              skycode.push(placeid[k])
            }
          }
          codes.push(skycode)
          skycode = []
          c += 1
        }
        var counter = 0
        var prices = []
        for(var i = 0; i < codes.length-1; i++){
            var str ="https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/"+codes[i][0]+"/"+codes[i+1][0]+"/"+req.query.date[i+1]
            unirest.get(str)
            .header("X-RapidAPI-Key", "18aa168972msh162649f7af22656p129a1ejsn164eb25c5fce")
            .end(function (result) {
              if(typeof result.body.Quotes[0] == "undefined"){
                prices.push("No Price Found")
              }
              else{
                prices.push(result.body.Quotes[0].MinPrice)
              }
              counter += 1
              if(counter == codes.length - 1) {
                res.send(prices)
              }
            });
        }
      }
      else{
        count += 1
      }
    });
  }
})

app.get('/poi', function(req,res){
  var URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+req.query.city+"+tourism&language=en&key=AIzaSyADptAzE3RDVXq6GjgXCdTPYZBn7BYMU0Y"
  request.get(URL,function(error,response,body){
    var respond = JSON.parse(body)
    var arr = []
    if (respond.results.length == 0){
      res.send(JSON.stringify("No POIs"))
    }
    else if (respond.results.length == 1){
      res.send(JSON.stringify([{name:respond.results[0].name, rating:respond.results[0].rating}]))
    }
    for(var i = 0; i < respond.results.length; i++){
      arr.push({name: respond.results[i].name, rating: respond.results[i].rating})
    }
    arr.sort(function(a, b) {
      return ((a.rating < b.rating) ? -1 : ((a.rating == b.rating) ? 0 : 1));
    });
    console.log(arr.length)
    var newarr = []
    if(arr.length <= 3){
      res.send(JSON.stringify(arr))
    }
    for(var i = 1; i != 4; i++){
      newarr.push(arr[arr.length-i])
    }
    res.send(JSON.stringify(newarr))
	});
})

app.listen(8080, function(){
  console.log("Server started")
})

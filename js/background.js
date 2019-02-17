var i = 0
var z = -1

function createDiv() {
  var button = document.createElement('div')
  button.id = "addbutton"
  button.innerHTML = '<img src="https://i.imgur.com/tJGKRxW.png" align="middle" width="100" height="100" onclick="createDiv();" />'
  i += 1
  z += 1
  if (i > 6) {
    i = 0
  }
  var arr = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"]
  var div = document.createElement('div');
  div.innerHTML = "
  <input class="addresses" id="citysearch" type="text" style="width: 150px; height: 30px" placeholder="Enter City">
  <div id="result">
    <div id="date">

    </div>
    <div id="weather">

    </div>
    <div id="weathericon">

    </div>
    <div id="temp">

    </div>
  </div>";
  //div.innerHTML = document.getElementById("box1").innerHTML
  div.id = arr[i];
  document.getElementById('display').removeChild(document.getElementById("addbutton"));
  document.getElementById('display').appendChild(div);
  document.getElementById('display').appendChild(button);
  initialize()
  var city = $("#" + arr[z]).find('#citysearch').val();
  console.log(city)
  getWeather(city, arr)
}

function getWeather(city, arr) {

  //var url = "https://api.aerisapi.com/forecasts/"+ city +"?&format=json&filter=day&limit=14&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  var url =  "https://api.aerisapi.com/forecasts/"+ city + "?&format=json&filter=day&limit=14&fields=.weatherPrimary,periods.avgTempF,periods.icon,periods.pop,periods.weather&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  $.ajax({
    type: "GET",
    url: url,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(msg) {

      //var json = msg;
      var weatherPrimary = msg.response[0].periods[i-1].weather
      //var weatherIcon = msg.repsonse[0].periods[i-1].icon
      //console.log(weatherIcon)
      var averageTemp = msg.response[0].periods[i-1].avgTempF

      $("#" + arr[z]).find('#weather').html(weatherPrimary)
      //$("#" + arr[z]).find('#weathericon').html(weathericon)
      //$("#" + arr[z]).find("#weathericon").append('<img id="theImg" src="img/chancetstorm.png" />')
      $("#" + arr[z]).find('#temp').html(averageTemp+" °F")

      //document.getElementById("weather").innerHTML = weatherPrimary
      //document.getElementById("temp").innerHTML = averageTemp

    },
    //Error message if bad response
    error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
}

var i = 0

//$(document).ready(function(){
  //$("#citysearch").change(doGeocode)
//})
function doGeocode() {
  var addr = document.getElementById("citysearch");
  // Get geocoder instance
  var geocoder = new google.maps.Geocoder();

  // Geocode the address
  geocoder.geocode({
    'address': addr.value
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK && results.length > 0) {

      // set it to the correct, formatted address if it's valid
      addr.value = results[0].formatted_address
      document.getElementById("d").style.display="block";

      // show an error if it's not
    } else alert("Invalid address");
  });
};

function createDiv() {
  var button = document.createElement('div')
  button.id = "addbutton"
  button.innerHTML = '<img src="https://i.imgur.com/tJGKRxW.png" align="middle" width="100" height="100" onclick="createDiv();" />'
  i += 1
  if (i > 6) {
    i = 0
  }
  var arr = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"]
  var div = document.createElement('div');
  div.innerHTML = `
      <input class="addresses" id="citysearch" type="text" style="width: 150px; height: 30px" placeholder="Enter City" onchange="doGeocode()">

      <div id="result">
        <div id="date">
          <center>
              <input id="d" type="date" min="0000-00-00" style="width: 140px; height: 20px; text-align: center; display: none" onchange="getWeather()">
          </center>
        </div>
        <div id="weather">

        </div>
        <div id="weathericon">

        </div>
        <div id="temp">

        </div>
      </div>
    </div>`;
  //div.innerHTML = document.getElementById("box1").innerHTML
  div.id = arr[i];
  document.getElementById('display').removeChild(document.getElementById("addbutton"));
  document.getElementById('display').appendChild(div);
  document.getElementById('display').appendChild(button);
  initialize()
}

function getDateDiff(firstDate,secondDate){
  var oneDay = 24*60*60*1000;
  d1 = new Date(firstDate)
  d2 = new Date(secondDate)
  d2.setDate(d2.getDate()+2)
  var datediff = Math.round(Math.abs((d1.getTime() - d2.getTime())/(oneDay)))
  return datediff
}

function getWeather() {
  var arr = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"]
  var city = $("#" + arr[i]).find('#citysearch').val();
  var day = getDateDiff(new Date(),document.getElementById("d").value)
  //var url = "https://api.aerisapi.com/forecasts/"+ city +"?&format=json&filter=day&limit=14&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  //var url =  "https://api.aerisapi.com/forecasts/"+ city + "?&format=json&filter=day&limit=14&fields=.weatherPrimary,periods.avgTempF,periods.icon,periods.pop,periods.weather&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  var url = "/weather"
  $.ajax({
    type: "GET",
    url: url,
    data: {
      city:city,
      day:day,
    },
    dataType: "text",
    success: function(msg) {
      var arr = JSON.parse(msg)
      var weatherPrimary = arr.weather
      var weatherIcon = arr.icon
      //console.log(weatherIcon)
      var averageTemp = arr.avgTempF

      $("#" + arr[i]).find('#weather').html(weatherPrimary)
      $("#" + arr[i]).find('#weathericon').html(weathericon)
      $("#" + arr[i]).find("#weathericon").append('<img id="theImg" src="img/chancetstorm.png" />')
      $("#" + arr[i]).find('#temp').html(averageTemp+" °F")

      //document.getElementById("weather").innerHTML = weatherPrimary
      //document.getElementById("temp").innerHTML = averageTemp

    },
    //Error message if bad response
    error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
}

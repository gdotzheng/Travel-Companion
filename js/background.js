var i = 0

//$(document).ready(function(){
  //$("#citysearch").change(doGeocode)
//})
function doGeocode() {
  var addr = document.getElementsByClassName("addresses");
  // Get geocoder instance
  var geocoder = new google.maps.Geocoder();

  // Geocode the address
  geocoder.geocode({
    'address': addr[i].value
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK && results.length > 0) {

      // set it to the correct, formatted address if it's valid
      addr.value = results[0].formatted_address;
      document.getElementsByClassName("d")[i].style.display="block";
      datelimits()

      // show an error if it's not
    } else alert("Invalid address");
  });
};

function datelimits(){
  var today = new Date();
  var nextdate = new Date();
  nextdate.setDate(nextdate.getDate() + 16)
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0
  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  }
  if(mm<10){
    mm='0'+mm
  }
  var d2 = nextdate.getDate()
  var y2 = nextdate.getFullYear()
  var m2 = nextdate.getMonth()+1
  if(d2<10){
    d2='0'+d2
  }
  if(m2<10){
    m2='0'+m2
  }
  var min = yyyy+'-'+mm+'-'+dd;
  var max = y2+'-'+m2+'-'+d2;
  document.getElementsByClassName("d")[i].setAttribute("min", min);
  document.getElementsByClassName("d")[i].setAttribute("max", max);
}

function createDiv() {
  if (document.getElementsByClassName("d")[i].style.display=="none"){
    alert("Please fill in current box before adding more locations")
    return
  }
  if (document.getElementsByClassName("d")[i].value == ""){
    alert("Please input a date before adding more locations")
    return
  }
  var button = document.createElement('div')
  button.id = "addbutton"
  button.innerHTML = '<img src="https://i.imgur.com/tJGKRxW.png" align="middle" width="100" height="100" onclick="createDiv();" />'
  i += 1
  if (i > 6) {
    i = 0
  }
  var arr = ["box1", "box2", "box3", "box4", "box5", "box6", "box7"]
  var div = document.createElement('div');
  div.className = arr[i]
  div.innerHTML = `
    <center><input class="addresses" type="text" style="width: 150px; height: 30px" placeholder="Enter City" onchange="doGeocode()">

    <div class="result">
      <div class="date">
        <center>
            <input class="d" type="date" min="0000-00-00" style="width: 140px; height: 20px; text-align: center; display: none" onchange="getWeather()">
        </center>
      </div>
      <div class="weather">

      </div>
      <div class="weathericon">

      </div>
      <div class="temp">

      </div>
    </div>
  </center>`;
  //div.innerHTML = document.getElementsByClassName("box1").innerHTML
  document.getElementsByClassName("display")[0].removeChild(document.getElementById("addbutton"));
  document.getElementsByClassName("display")[0].appendChild(div);
  document.getElementsByClassName("display")[0].appendChild(button);
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

function createlink(){
  document.getElementById("Link").innerHTML = ""
  var link = "https://www.google.com/maps/dir/"
  for(var a = 0; a <= document.getElementsByClassName("addresses").length-1; a++){
    var str = document.getElementsByClassName("addresses")[a].value;
    str = str.replace(/\s+/g, '');//Strips white spaces
    link += ""+str+"\\"
  }
  document.getElementById("Link").innerHTML = "<a href="+link+">Link</a>"
}

function getWeather() {
  var city = document.getElementsByClassName("addresses")[i].value;
  var day = getDateDiff(new Date(),document.getElementsByClassName("d")[i].value)
  //var url = "https://api.aerisapi.com/forecasts/"+ city +"?&format=json&filter=day&limit=14&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  //var url =  "https://api.aerisapi.com/forecasts/"+ city + "?&format=json&filter=day&limit=14&fields=.weatherPrimary,periods.avgTempF,periods.icon,periods.pop,periods.weather&client_id=KSCDpQX8QB3nS5miKzeN4&client_secret=X5jy1n9EDwpMA3j02v1wadma59bHM3rR5qRykTyz"
  $.ajax({
    type: "GET",
    url: "/weather",
    data: {
      city:city,
      day:day,
    },
    dataType: "text",
    success: function(msg) {
      var arr = JSON.parse(msg)
      document.getElementsByClassName("weather")[i].innerHTML = "<p>"+arr.weather+"</p>"
      document.getElementsByClassName("weathericon")[i].innerHTML = '<img src="img/'+arr.icon+'" style="margin-left: auto;margin-right: auto;display: block;"/>'
      document.getElementsByClassName("temp")[i].innerHTML = "<p>"+arr.avgTempF+" °F</p>"
      //var weatherPrimary = arr.weather
      //var weatherIcon = arr.icon
      //console.log(weatherIcon)
      //var averageTemp = arr.avgTempF

      //$("#" + arr[i]).find('#weather').html(weatherPrimary)
      //$("#" + arr[i]).find('#weathericon').html(weathericon)
      //$("#" + arr[i]).find("#weathericon").append('<img id="theImg" src="img/chancetstorm.png" />')
      //$("#" + arr[i]).find('#temp').html(averageTemp+" °F")

      //document.getElementsByClassName("weather").innerHTML = weatherPrimary
      //document.getElementsByClassName("temp").innerHTML = averageTemp
      document.getElementById("addbutton").style.display = "block"
    },
    //Error message if bad response
    error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
}

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

function createQuote(){
  var arr = []
  if (document.getElementsByClassName("d")[i].value == ""){
    alert("Please input a date before getting price quotes")
    return
  }
  for(var a = 0; a < document.getElementsByClassName("addresses").length; a++){
    s = document.getElementsByClassName("addresses")[a].value;
    s = s.substring(0, s.indexOf(','));
    arr.push(s)
  }
  $.ajax({
    type: "GET",
    url: "/iata",
    data: {
      cities:arr,
    },
    dataType: "text",
    success: function(data) {
      document.getElementsByClassName("quotes")[0].innerHTML = ""
      var arr = JSON.parse(data)
      for (var i = 0; i < arr.name.length; i++){
        var select = "<select name='Select' class='airports'><option>Please Select an Airport</option>"
        for (var j = 0; j < arr.name[i].length; j++){
          select += "<option>"+arr.iata[i][j]+" - "+arr.name[i][j]+"</option>"
          if (arr.name[i].length == 1){
            select = "<select name='Select' class='airports'><option>"+arr.iata[i][j]+" - "+arr.name[i][j]+"</option>"
          }
        }
        select += "</select>"
        if (arr.name[i].length == 0){
          var select ='<input type="text" placeholder="Airport not found, Enter IATA">'
        }
        var div = document.createElement('div');
        div.className = "quote"
        div.innerHTML = select

        var button = document.createElement('div')
        button.id = "addbutton"
        button.innerHTML = '<input type="button" value="Get Prices" onclick="getPrice()"/>'
        document.getElementsByClassName("quotes")[0].appendChild(div);
        initialize();
      }
      document.getElementsByClassName("quotes")[0].appendChild(button);
      initialize()
    },
    //Error message if bad response
    error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
}

function getPrice(){
  var arr = []
  for(var a = 0; a < document.getElementsByClassName("airports").length; a++){
    var s = document.getElementsByClassName("airports")[a].value;
    s = s.substring(0, s.indexOf('-'));
    if (s == ""){
      alert("Please Select Airports")
      return
    }
    arr.push(s.trim())
  }
  var region = []
  for(var a = 0; a < document.getElementsByClassName("addresses").length; a++){
    var c = document.getElementsByClassName("addresses")[a].value;
    c = c.substring(c.lastIndexOf(",") + 1,c.indexOf(','));
    c = c.replace(',','')
    c = c.replace(',','')
    region.push(c.trim())
  }
  var dates = []
  for(var a = 0; a < document.getElementsByClassName("addresses").length; a++){
    var c = document.getElementsByClassName("d")[a].value;
    dates.push(c)
  }
  $.ajax({
    type: "GET",
    url: "/quotes",
    data: {
      iata:arr,
      region:region,
      date:dates
    },
    dataType: "text",
    success: function(data) {
      var arr = JSON.parse(data)
      document.getElementsByClassName("prices")[0].innerHTML = ""
      var string = ""
      for(var i = 0; i < arr.length; i++){
        string += "<p>"+arr[i]+"</p>"
      }
      var div = document.createElement('div');
      div.className = "price"
      div.innerHTML = string
      document.getElementsByClassName("prices")[0].appendChild(div);
      initialize();
  },
  error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
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

      document.getElementById("addbutton").style.display = "block"
    },
    //Error message if bad response
    error: function(xhr, ajaxOptions, thrownError) {
      $("#result").html("Invalid client id or secret key")
    }
  });
}

var i = 0

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
  div.innerHTML = document.getElementById("box1").innerHTML
  div.id = arr[i];
  document.getElementById('display').removeChild(document.getElementById("addbutton"));
  document.getElementById('display').appendChild(div);
  document.getElementById('display').appendChild(button);
  initialize()
  var id = $('#citysearch').val();
  alert(id)
}

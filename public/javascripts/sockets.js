var roomName = window.location.pathname.split("/")[2];
var socket = io("/" + roomName);


socket.on('connect', function(){
  console.log("Connecting to server for room: " + roomName);
  $('#messages').append($('<li>').text(currentUser + " connected to room: " + roomName));
});

$('form').submit(function(){
  //send message to server
  socket.emit('send message', $('#m').val());
  console.log("Message sent to server: " + $('#m').val());
  $('#m').val('');
  return false
});

socket.on('send message', function(msg){
  var line = `${currentUser}: ${msg}`;
  $('#messages').append($('<li>').text(line));
});

socket.on('send location', function(msg){
  var line = `${currentUser} placed a point at: ${msg}`;
  var routeButton = $("<button class='route-button'/>").text('Route Location');
  $('#messages').append($("<li class='location-li'>").text(line).append(routeButton));

  setNewIds();

  var id = $('.location-li').length;

  document.getElementById('route-button-' + id).addEventListener('click', function() {
    var waypts = [];
    //message way point
    waypts.push({ location: new google.maps.LatLng(msg.split(",")[0], msg.split(",")[1]), stopover: true });
    //current location
    waypts.push({ location: new google.maps.LatLng(window.currentPosition["lat"], window.currentPosition["lng"]), stopover: true });

    calculateAndDisplayRoute(window.directionsService, window.directionsDisplay, waypts);
   });
});

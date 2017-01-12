var userId = window.location.pathname.split("/")[3];
var socket = io("/" + userId);

socket.on('connect', function(){
  console.log("Connecting to server for direct message: " + userId);
  $('#messages').append($('<li>').text(currentUser + " connected to user: " + userId));
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

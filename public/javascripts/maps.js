function initMap() {
   window.directionsService = new google.maps.DirectionsService;
   window.directionsDisplay = new google.maps.DirectionsRenderer;
   var map = new google.maps.Map(document.getElementById('map'), {
     zoom: 19,
     center: {lat: 39.749635, lng: -105.000106},
     mapTypeId: 'satellite',
     disableDoubleClickZoom: true
  });
  map.setTilt(0);
  window.directionsDisplay.setMap(map);
  map.addListener('dblclick', function(event) {
    placeMarker(event.latLng, map, directionsService, directionsDisplay);
    addMarkerToChat(event);
  });
  setCurrentLocation(map);
 }

 function placeMarker(location, map, directionsService, directionsDisplay) {
   var marker = new google.maps.Marker({
       position: location,
       map: map,
       draggable: true
   });

   marker.addListener('dblclick', function(event){
     var msg = currentUser + " removed a point";
     marker.setMap(null);
     socket.emit('send message', msg);
     console.log("Message sent to server: " + msg);
   });
 }

 function setNewIds(){
   var id = $('.location-li').length;
   $('.route-button').last().attr('id', 'route-button-' + id);
 }

 function setCurrentLocation(map){
   if(navigator.geolocation){
     navigator.geolocation.getCurrentPosition(function(position){
       window.currentPosition = {
         lat: position.coords.latitude,
         lng: position.coords.longitude
       };
       placeMarker(window.currentPosition, map);
     });
   }
 }

 function addMarkerToChat(marker){
   var lat = marker.latLng.lat();
   var lng = marker.latLng.lng();
   var msg = currentUser + " placed a point at: " + lat.toFixed(3) + ", " + lng.toFixed(3);

   socket.emit('send location', [lat, lng]);
   console.log("Message sent to server: " + [lat, lng]);
 }

 function calculateAndDisplayRoute(directionsService, directionsDisplay, waypts) {
    directionsService.route({
      origin: waypts[0].location,
      destination: waypts[1].location,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'WALKING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];

        // $('#messages').append($("<li class='location-li'>").text(line));

        var summaryPanel = $('#messages');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

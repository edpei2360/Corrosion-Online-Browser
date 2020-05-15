/* TODO: have it such that no calculations are do by client
         all changing of variables should be down soley by server
         client just needs to take input and draw stuff
         Implement using webgl
         Implement drawing for other entities
         change the implementation of the interpolation to preform all at once during drawing
         to increase the efficiency of what the fuck ur doing
*/

var socket = io();

//tell server new player has connected
socket.emit('new player');

// store a temporary version of the data every time new player joins
// should only be used as position reference
var localData;
socket.on('update local log', function(players) {
  localData = players;
});

// stores the data that was transmitted by the server
var serverData;
socket.on('transmit', function(players) {
  serverData = players;
});

/*
//draw players (done for testing will be removed/modified in future)
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
// draw the player do something with transmitted data
setInterval(function() {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in localData) {
    var player = localData[id];
    context.beginPath();
    context.arc(player.x_pos_player, player.y_pos_player, 30, 0, 2 * Math.PI);
    context.fill();
    //console.log("server: " +serverData[id].x_pos_player);
    //console.log("local: " + localData[id].x_pos_player);

  }
}, 1000 / 60);
*/

/* TODO: have it such that no calculations are do by client
         all changing of variables should be down soley by server
         client just needs to take input and draw stuff
*/

var socket = io();

//tell server new player has connected
socket.emit('new player');

// basic IO used to test if the server is able to transmit
// how keys will be pressed
var key_input = {
  up: false,
  down: false,
  left: false,
  right: false,
  time_modification: 1
}

// listen for certain key inputs
// subject to change and may be moved into new file
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      key_input.left = true;
      break;
    case 87: // W
      key_input.up = true;
      break;
    case 68: // D
      key_input.right = true;
      break;
    case 83: // S
      key_input.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      key_input.left = false;
      break;
    case 87: // W
      key_input.up = false;
      break;
    case 68: // D
      key_input.right = false;
      break;
    case 83: // S
      key_input.down = false;
      break;
  }
});

// tell the server how to move the player and keeps track of
// keeps track of how many milis have passed and uses it to
// compared to what should actually happen inorder to keep the
// players movement speed consistent
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;

  player_mov.time_modification = timeDifference;
  socket.emit('key input', key_input);

  lastUpdateTime = currentTime;
}, 1000 / 60);


/* TODO: Implement using webgl
         Implement drawing for other entities
         ensure player movement is persistent across different devices
         get rid of random lag jumps ... using the fucking interpolation method
         better organize your code
*/

/* INTERPOLATION:
1. have old data prestored in a specific dictionary to access
2. get new pos from server
3. have client draw movment of all sub frames that would appear between old and new pos
   you might want it so sub frame position increase is not a fixed number and is instead a ratio
4. DONE
*/

/*
// store a temporary version of the data locally every transmission
var localData;
socket.on('transmit', function(players) {
  localData = players;
});
*/


//draw players (done for testing will be removed/modified in future)
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
// draw the player do something with transmitted data
  socket.on('transmit', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x_pos_player, player.y_pos_player, 30, 0, 2 * Math.PI);
    context.fill();
  }
});

var socket = io();

// basic IO used to test if the server is able to transmit
// how the player will move (TEST)
var player_mov = {
  up: false,
  down: false,
  left: false,
  right: false,
  time_modification: 1
}

// listen for movement
// subject to change and may be moved into new folder
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      player_mov.left = true;
      break;
    case 87: // W
      player_mov.up = true;
      break;
    case 68: // D
      player_mov.right = true;
      break;
    case 83: // S
      player_mov.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      player_mov.left = false;
      break;
    case 87: // W
      player_mov.up = false;
      break;
    case 68: // D
      player_mov.right = false;
      break;
    case 83: // S
      player_mov.down = false;
      break;
  }
});

//tell server new player has connected
socket.emit('new player');

// tell the server how to move the player and keeps track of
// keeps track of how many milis have passed and uses it to
// compared to what should actually happen inorder to keep the
// players movement speed consistent
var lastUpdateTime = (new Date()).getTime();
setInterval(function() {
  var currentTime = (new Date()).getTime();
  var timeDifference = currentTime - lastUpdateTime;

  player_mov.time_modification = timeDifference;
  socket.emit('p_movement', player_mov);

  lastUpdateTime = currentTime;
}, 1000 / 60);


/* TODO: Implement using webgl
         Implement drawing for other entities
         ensure player movement is persistent across different devices
         get rid of random lag jumps ... using the fucking interpolation method
         better organize your code
*/

//draw players (done for testing will be removed/modified in future)
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
// draw the player
socket.on('player movement state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x_pos_player, player.y_pos_player, 10, 0, 2 * Math.PI);
    context.fill();
  }
});

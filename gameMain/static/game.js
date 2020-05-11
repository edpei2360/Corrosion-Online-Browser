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

  key_input.time_modification = timeDifference;
  socket.emit('key input', key_input);

  lastUpdateTime = currentTime;
}, 1000 / 60);


/* TODO: Implement using webgl
         Implement drawing for other entities
         change the implementation of the interpolation to preform all at once during drawing
         to increase the efficiency of what the fuck ur doing
*/


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

function moveTo(p_id) {
  var difference_y = serverData[p_id].y_pos_player - localData[p_id].y_pos_player;
  var difference_x = serverData[p_id].x_pos_player - localData[p_id].x_pos_player;

  localData[p_id].y_pos_player += difference_y/10;
  localData[p_id].x_pos_player += difference_x/10;
      console.log(difference_x + ", " + difference_y);

}

// smoothy use the local data and transition the values to the new ones that were sent by server
// this increments on a seperate timer than the drawing
// probably would be more efficient to run a for loop to draw individual frames to prevent lag
// next time fix that please, since code is modular you only need to change a few things
setInterval(function() {
  for (var id in localData) {
    if ((localData[id].x_pos_player != serverData[id].x_pos_player) ||
        (localData[id].y_pos_player != serverData[id].y_pos_player)) {
      moveTo(id);
    }
  }
}, 1000/ 500);


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

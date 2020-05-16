/**
// moves player by small increments to their new position
function moveTo(p_id) {
  var difference_y = serverData[p_id].y_pos_player - localData[p_id].y_pos_player;
  var difference_x = serverData[p_id].x_pos_player - localData[p_id].x_pos_player;

  localData[p_id].y_pos_player += difference_y/10;
  localData[p_id].x_pos_player += difference_x/10;

  // prevent the calculations going on forever
  if(Math.abs(difference_y) < 0.5) {
    localData[p_id].y_pos_player = serverData[p_id].y_pos_player
  }
  if(Math.abs(difference_x) < 0.5) {
    localData[p_id].x_pos_player = serverData[p_id].x_pos_player
  }
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

**/

/**
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
**/

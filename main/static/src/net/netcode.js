import {Player} from "../player.js"

export var socket = io();

var localData = {};
var serverData;

export function listen() {
  //TODO: move into network folder
  //tell server new player has connected
  socket.emit('new player');

  socket.on('remove player', function(data) {
    localData[data].e.remove();
    delete localData[data];
  });

  // updates local storage to match server storage when a new client joins
  socket.on('update local log', function(players) {
    for(var id in players) {
      if (!(id in localData)) {
        localData[id] = new Player(players[id].x_pos_player, players[id].y_pos_player,
                                   players[id].p_vel, players[id].rotation);
        localData[id].draw();
      } else {
        localData[id].setX(players[id].x_pos_player);
        localData[id].setY(players[id].y_pos_player);
        localData[id].setVel(players[id].p_vel);
        localData[id].setRot(players[id].rotation);
      }
    }
  });

  // stores the data that was transmitted by the server
  socket.on('transmit', function(players) {
    serverData = players;
  });

}

export function interpolate() {
  // interpolation call
  /* TODO: fix
   * 	causes error (serverData[id] not defined)
   * 	possible fix:
   * 		where ever localData[id] is inited serverData[id] should be inited before
   * 		where ever localData[id] is deleted serverData[id] should be deleted after
   */
  for (var id in localData) {
    while ((localData[id].x_pos_player != serverData[id].x_pos_player) ||
        (localData[id].y_pos_player != serverData[id].y_pos_player)) {
        var diffY = serverData[id].y_pos_player - localData[id].y_pos_player;
        var diffX = serverData[id].x_pos_player - localData[id].x_pos_player;
        localData[id].moveTo(diffX, diffY, serverData[id].x_pos_player, serverData[id].y_pos_player);
    }
  }
}

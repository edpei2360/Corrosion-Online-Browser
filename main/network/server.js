/* TODO:
 *      fix the file organizations and imports for server
 *      fix the file organizations for client side networking into the files michael made
 *      ^(netcode connects to main player and player and they connect to main)
*/


// dependencies
var socketIO = require('socket.io');
var routing = require('./routing.js');

var app = routing.app;
var server = routing.server;
var io = routing.io;

routing.establish();
routing.route();
routing.start_server();

// handles connection and dissconnection
io.on('connection', function(socket) {
    console.log('someone has connected');

    socket.on('disconnect', function () {
      delete players[socket.id]
        io.sockets.emit('remove player', socket.id);
        console.log('A user disconnected');
    });
});

// create empty dictionary to store players in
// setters and getters for this are below
var players = {};

// returns value of x pos of player with certain id
function getPlayerXPos(players, id) {
  if (id in players){
    return players[id].x_pos_player;
  }
}

// sets value of x pos of player with certain id
// requires that position is valid
function setPlayerXPos(players, id, newPos) {
  if (id in players){
    players[id].x_pos_player = newPos;
  }
}

// returns value of y pos of player with certain id
function getPlayerYPos(players, id) {
  if (id in players){
    return players[id].y_pos_player;
  }
}

// sets value of y pos of player with certain id
// requires that position is valid
function setPlayerYPos(players, id, newPos) {
  if (id in players){
    players[id].y_pos_player = newPos;
  }
}

// returns velocity of player with certain id
function getPlayerVel(players, id) {
  if (id in players){
    return players[id].p_vel;
  }
}

// sets value of the velocity of player with certain id
// requires that new velocity is valid
function setPlayerYPos(players, id, newVel) {
  if (id in players){
    players[id].p_vel = newVel;
  }
}

// handles new players and movement
io.on('connection', function(socket) {

  // when a new player connects, set the socket.id to be the key to the
  // player object in the dictionary and initalize this dictionary value
  // with default values
  socket.on('new player', function() {
    players[socket.id] = {
      x_pos_player: 0,
      y_pos_player: 0,
      p_vel : 1
    };
    io.sockets.emit('update local log', players, socket.id);
  });

  // check the connect sockets id and effect its position
  // based on the socket.emit data given from game.js
  // the time_modification variables allows for smoother and
  // more consistent movement as the client is not guarenteed
  // to send data every 60th of a second
  socket.on('key input', function(data) {
    var player = players[socket.id] || {};

    if (data.left) {
      player.x_pos_player -= player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.up) {
      player.y_pos_player += player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.right) {
      player.x_pos_player += player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.down) {
      player.y_pos_player -= player.p_vel * (( data.time_modification / (1000 / 60)));
    }

  });
});

// send the new player positions to all clients
setInterval(function() {
  io.sockets.emit('transmit', players);
}, 1000 / 60);

// dependencies
var socketIO = require('socket.io');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// start server
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

// handles connection and dissconnection msg
io.on('connection', function(socket) {
    console.log('A user connected');


    socket.on('disconnect', function () {
      delete players[socket.id]
        console.log('A user disconnected');
    });
});

/* TODO: add any new variables that need to be sent
         make it so that server only forwards data
*/


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
      x_pos_player: 300,
      y_pos_player: 300,
      p_vel : 3
    };
    io.sockets.emit('update local log', players);
  });

  // check the connect sockets id and effect its position
  // based on the socket.emit data given from game.js
  // the time_modification variables allows for smoother and
  // more consistent movement as the client is not guarenteed
  // to send data every 60th of a second
  socket.on('key input', function(data) {
    // NOTE: socket.id is reffering to the id number of the socket which emits a signal
    var player = players[socket.id] || {};

    if (data.left) {
      player.x_pos_player -= player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.up) {
      player.y_pos_player -= player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.right) {
      player.x_pos_player += player.p_vel * (( data.time_modification / (1000 / 60)));
    }

    if (data.down) {
      player.y_pos_player += player.p_vel * (( data.time_modification / (1000 / 60)));
    }

  });
});

// send the new player positions to all clients
setInterval(function() {
  io.sockets.emit('transmit', players);
}, 1000 / 60);

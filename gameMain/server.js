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

*/


var players = {}; // create empty dictionary to store players in

// handles new players and movement
io.on('connection', function(socket) {

  socket.on('new player', function() {
    // when a new player connects, set the socket.id to be the key to the
    // player object in the dictionary and initalize this dictionary value
    // with default values
    players[socket.id] = {
      x_pos_player: 300,
      y_pos_player: 300
    };
  });

  socket.on('p_movement', function(data) {
    // check the connect sockets id and effect its position
    // based on the socket.emit data given from game.js
    // the time_modification variables allows for smoother and
    // more consistent movement as the client is not guarenteed
    // to send data every 60th of a second
    var player = players[socket.id] || {};
    if (data.left) {
      player.x_pos_player -= 3 * (( data.time_modification / (1000 / 60)));
    }
    if (data.up) {
      player.y_pos_player -= 3 * (( data.time_modification / (1000 / 60)));
    }
    if (data.right) {
      player.x_pos_player += 3 * (( data.time_modification / (1000 / 60)));
    }
    if (data.down) {
      player.y_pos_player += 3 * (( data.time_modification / (1000 / 60)));
    }
  });
});

// send the new player positions to all clients
setInterval(function() {
  io.sockets.emit('player movement state', players);
}, 1000 / 120);



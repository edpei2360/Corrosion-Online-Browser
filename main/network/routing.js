// this is a nodejs module 

// dependencies
var socketIO = require('socket.io');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var PORT = 5000;

// export routing functions
module.exports = {
  // bind port and etablish sending of static folder
  establish: function() {
    app.set('port', PORT);
    app.use('/static', express.static(path.dirname(__dirname) + '/static'));
  },

  // give the client the web page
  route: function() {
    app.get('/', function(request, response) {
      response.sendFile(path.join(path.dirname(__dirname), 'index.html'));
    });
  },

// make server listen on the given port
  start_server: function() {
    server.listen(PORT, function() {
      console.log('Starting server on port: ' + PORT);
    });
  },

  app: app,

  server: server,

  io: io
}

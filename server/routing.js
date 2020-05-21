// dependencies
var socketIO = require('socket.io');
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var PORT = 5000;

/* TODO:
 * put server.js and routing.js in seperate folders while not breaking routing
 * do the send file "{root:}" thingy or the require thingy
*/

// export routing functions
module.exports = {
  // bind port and etablish sending of static folder
  establish: function() {
    app.set('port', PORT);
    app.use('/static', express.static(__dirname + '/static'));
  },

  // give the client the web page
  route: function() {
    app.get('/', function(request, response) {
      response.sendFile(path.join(__dirname, 'index.html'));
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

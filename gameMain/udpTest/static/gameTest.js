/* TODO : make the host ip dynamic so it doesnt have to be local host
*/

var dgram = require('dgram');
var message = new Buffer('fuck you');

var PORTUDP = 8081;
var HOST = '127.0.0.1';

var socket = io();

//tell server new player has connected (TCP)
socket.emit('new player');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
  if (err) throw err;
  console.log('UDP message sent to ' + HOST +':'+ PORT);
  client.close();
});

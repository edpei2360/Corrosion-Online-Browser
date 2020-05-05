var socket = io();

// if 'message' recieved then write data in console
socket.on('message', function(data) {
  console.log(data);
});
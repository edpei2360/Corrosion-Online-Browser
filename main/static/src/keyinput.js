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
	//console.log(event);
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

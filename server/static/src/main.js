/*
 * CHANGES:
 * 	changed entitiesDict to playersDict
 * 	.remove() in remove player
 *
 * TODO:
 * 	semitransparent entities
 * 	text
 *
 * 	documentation :(
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 *
 *  seperate interpolation into sub file (ask micheal how he wants to organize it)
 * 		put it in player.js
 *
 * 	rotation only effect mainplayer
 *
 * 	move movement calculations onto client side
 * 	send rotation data as vector and use rotateToVec
 * 	keep main player in center of screen using entity.setStatic() (will need to setScale)
 *
 * 	key/mouse bind system
 */

var socket = io();

import {glInit, canvas} from "./gl/glManager.js"
import {setCamera, moveCamera} from "./gl/camera.js"
import {Entity} from "./entity.js"
import {texPoop, texCircle} from "./gl/texture.js"

function main() {
	glInit();
}

var playersDict = {};
var localData;
var serverData;
export function loaded() {
	setCamera(0, 0);

	//mouse stuff
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);

	//tell server new player has connected
	socket.emit('new player');

	//moved here because shaders take to long to load and result in no data sent
	// store a temporary version of the data every time new player joins
	// should only be used as position reference
	socket.on('update local log', function(players, id) {
	  localData = players;
		// add new entity
		playersDict[id] = new Entity();

		// if client is missing any entites add them
		for(var id in players) {
			if (!(id in playersDict)) {
				playersDict[id] = new Entity();
				playersDict[id].setTexture(texCircle); // change others texture
			}
		}
		playersDict[id].setTexture(texCircle); // change main player texture
	});

	socket.on('remove player', function(data) {
		delete localData[data];
		playersDict[data].remove();
		delete playersDict[data];
	});

	// stores the data that was transmitted by the server
	socket.on('transmit', function(players) {
	  serverData = players;
	});

	told = performance.now();
	setInterval(loop, 1000/60); //60 times a second could go full speed but idk
}

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

	// draw sub frames of movement
	playersDict[p_id].translateTo(localData[p_id].x_pos_player * 0.1,localData[p_id].y_pos_player * 0.1);
	playersDict[p_id].sendDataToGPU();

}

var told;
function loop() {
	const tnow = performance.now();
	const t = tnow - told;
	told = tnow;

	// draw all entities atleast once every 60th of a second (shouldn't be needed as moveTo should set the changes)
	for (var id in playersDict) {
    var ent = playersDict[id];
		ent.translateTo(localData[id].x_pos_player * 0.1,localData[id].y_pos_player * 0.1);
		ent.sendDataToGPU();
  }

  key_input.time_modification = t;
	socket.emit('key input', key_input);

  for (var id in localData) {
    while ((localData[id].x_pos_player != serverData[id].x_pos_player) ||
        (localData[id].y_pos_player != serverData[id].y_pos_player)) {
      moveTo(id);
    }
  }
}

window.onload = main;

function onMouseMove(evt) {
	const rect = canvas.getBoundingClientRect();
	const x = evt.clientX - rect.left - 320;
	const y = rect.top + 240 - evt.clientY;
	//TODO only effect mainPlayer
	for (var id in playersDict) {
    var ent = playersDict[id];
		ent.rotateToVec(x, y);
		ent.sendDataToGPU();
  }
}

function onMouseDown(evt) {
}

function onMouseUp(evt) {
}

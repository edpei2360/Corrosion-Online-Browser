/*
 * TODO:
 * 	semitransparent entities
 * 	text
 *
 * 	documentation :(
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 *  shaders dont work in chrome! only work in firefox
 */

var socket = io();

import {glInit} from "./gl/glManager.js"
import {setCamera, moveCamera} from "./gl/camera.js"//tmp
import {Entity} from "./entity.js"//tmp
import {texPoop, texCircle} from "./gl/texture.js"//tmp

function main() {
	glInit();
	//code to run on window load

	//
}

var entitiesDict = {};
var localData;
var serverData;
export function loaded() {
	setCamera(0, 0);

	//code to run once textures, shaders, rest of webgl stuff has finished loading

	//
	//tell server new player has connected
	socket.emit('new player');

	//moved here because shaders take to long to load and result in no data sent
	// store a temporary version of the data every time new player joins
	// should only be used as position reference
	socket.on('update local log', function(players, id) {
	  localData = players;
		console.log("fuck you cunt");
		entitiesDict[id] = new Entity();
		entitiesDict[id].setTexture(texPoop);
	});
	
	socket.on('remove player', function(data) {
		delete localData[data];
		delete entitiesDict[data];
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

  localData[p_id].y_pos_player += difference_y/5;
  localData[p_id].x_pos_player += difference_x/5;

  // prevent the calculations going on forever
  if(Math.abs(difference_y) < 0.5) {
    localData[p_id].y_pos_player = serverData[p_id].y_pos_player
  }
  if(Math.abs(difference_x) < 0.5) {
    localData[p_id].x_pos_player = serverData[p_id].x_pos_player
  }
}

var told;
function loop() {
	const tnow = performance.now();
	const t = tnow - told;
	told = tnow;

	//game logic loop (runs 60 times a second)

	//

	// draw all entities
	for (var id in entitiesDict) {
    var ent = entitiesDict[id];
		// IDK how this works still
		ent.translateTo(localData[id].x_pos_player*0.01,localData[id].y_pos_player*0.01);
		ent.sendDataToGPU();
		//console.log("asjdoiasdoij");
  }

  key_input.time_modification = t;
	socket.emit('key input', key_input);

  for (var id in localData) {
    if ((localData[id].x_pos_player != serverData[id].x_pos_player) ||
        (localData[id].y_pos_player != serverData[id].y_pos_player)) {
      moveTo(id);
    }
  }

}

window.onload = main;

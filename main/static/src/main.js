/*
 * TODO:
 * 	documentation :(
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 *
 * 	put interpolation in to player.js
 *
 * 	move movement calculations onto client side
 * 	send rotation data as vector and use rotateToVec
 * 	keep main player in center of screen using entity.setStatic() (will need to setScale)
 *
 *  move all the player stuff into different sub folders (getters/setters to modify variables)
 *  merge local data and playersDict, server data will stay the same but use the new player class to merge
 *	make sure the interpolation still works with the new player class system!!!! (fix jumping bug somehow)
 *
 * 	key/mouse bind system
 */

var socket = io();

import {glInit, canvas} from "./gl/glManager.js"
import {setCamera, moveCamera} from "./gl/camera.js"
import {Entity} from "./entity.js"
import {Button} from "./button.js"
import {texPoop, texCircle} from "./gl/texture.js"
import {Player} from "./player.js"
import {onMouseDown, onMouseMove} from "./input/mouseevents.js" 

function main() {
	glInit();
}

var localData = {};
var serverData;

export function loaded() {
	setCamera(0, 0);

	//button test todo hoveroff
		var b = new Button(0, 0, 0xff, "BUTTON TEST\nHONK", 0, 255, 0, 128, -1,
		-1, 1, 0, 0 , 5,  5, 10, 14, 1, 1, 0, 0);
		b.onHover(function(t) {
			t.background.setColor(255,0,0,128);
			t.sendDataToGPU();
		});
		b.onClick(function(t) {
			alert("AYYYYY");
		});
		b.sendDataToGPU();
	//test


	//mouse stuff
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mousemove", onMouseMove);

	/*
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mouseup", onMouseUp);
	*/

	//tell server new player has connected
	socket.emit('new player');

	socket.on('remove player', function(data) {
		localData[data].e.remove(); // idk if this is needed
		delete localData[data];
		//playersDict[data].remove();
		delete playersDict[data];
	});

	// updates local storage to match server storage when a new client joins
	socket.on('update local log', function(players) {
		for(var id in players) {
			if (!(id in localData)) {
				localData[id] = new Player(players[id].x_pos_player, players[id].y_pos_player,
																	 players[id].p_vel, players[id].rotation);
				localData[id].draw();
			} else {
				localData[id].setX(players[id].x_pos_player);
				localData[id].setY(players[id].y_pos_player);
				localData[id].setVel(players[id].p_vel);
				localData[id].setRot(players[id].rotation);
			}
		}
	});

	// stores the data that was transmitted by the server
	socket.on('transmit', function(players) {
	  serverData = players;
	});


	told = performance.now();
	setInterval(loop, 1000/60); //60 times a second could go full speed but idk
}

var told;
function loop() {
	const tnow = performance.now();
	const t = tnow - told;
	told = tnow;

	// send key inputs
  key_input.time_modification = t;
	socket.emit('key input', key_input);

	// interpolation call
  for (var id in localData) {
    while ((localData[id].x_pos_player != serverData[id].x_pos_player) ||
        (localData[id].y_pos_player != serverData[id].y_pos_player)) {
				var diffY = serverData[id].y_pos_player - localData[id].y_pos_player;
				var diffX = serverData[id].x_pos_player - localData[id].x_pos_player;
      	localData[id].moveTo(diffX, diffY, serverData[id].x_pos_player, serverData[id].y_pos_player);
    }
  }

}

window.onload = main;

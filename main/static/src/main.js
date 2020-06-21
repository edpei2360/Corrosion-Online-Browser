/*
 * TODO:
 * 	documentation :(
 *
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 * 	fix serverData[id] is undefined
 *
 * 	move movement calculations onto client side
 * 	send rotation data as vector and use rotateToVec
 * 	keep main player in center of screen using entity.setStatic() (will need to setScale)
 *
 * 	move all the player stuff into different sub folders (getters/setters to modify variables)
 * 	merge local data and playersDict, server data will stay the same but use the new player class to merge
 * 	make sure the interpolation still works with the new player class system!!!! (fix jumping bug somehow) possibly fixed
 *
 * 	Button
 * 		hoverOff()
 * 		setters (and getters?)
 * 		one hitbox
 * 		tranforms
 *
 * 	Entity
 * 		minor optimizations
 *
 * 	TransparentEntity
 * 		minor optimizations
 *
 * 	Text
 * 		minor optimizations
 * 		getters?
 *
 * 	ClickBox
 * 		minor optimizations
 * 		general geometry and intersection
 *
 * 	Geometry
 * 		intersection functions
 * 		translations
 *
 * 	Loading
 * 		actual loading screen
 *
 * 	Textures
 * 		create and setup actual final textures
 *
 * 	VertexArray
 * 		possible bug (look more into)
 *
 * 	KeyEvents
 * 		modular binding system so users can have custom key binds
 * 		move keyinput to work with keyevent system (need keyevent system implemented first)
 *
 * 	MouseEvents
 * 		modular binding system so users can have custom mousekey/scroll binds
 *
 */

import {glInit, canvas} from "./gl/glManager.js"
import {setCamera, moveCamera} from "./gl/camera.js"
import {Entity} from "./entity.js"
import {Button} from "./button.js"
import {texPoop, texCircle} from "./gl/texture.js"
import {Player} from "./player.js"
import {onMouseDown, onMouseMove, onMouseUp} from "./input/mouseevents.js"
import {socket,listen, interpolate} from "./net/netcode.js"

function main() {
	glInit();
}

//var localData = {};
//var serverData;

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

	//TODO: move to input/mouseevents
	//mouse stuff
	//enables right clicking on canvas
	canvas.oncontextmenu = function() {
		return false;
	}
	canvas.addEventListener("mousedown", onMouseDown);
	canvas.addEventListener("mousemove", onMouseMove);
	canvas.addEventListener("mouseup", onMouseUp);

	// call of netcode
	listen();

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
	interpolate();

}

window.onload = main;

/*
 * TODO:
 * 	semitransparent entities
 * 	text
 * 
 * 	documentation :(
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 */

import {glInit} from "./gl/glManager.js"
import {setCamera, moveCamera} from "./gl/camera.js"//tmp
import {Entity} from "./entity.js"//tmp
import {texPoop, texCircle} from "./gl/texture.js"//tmp

function main() {
	glInit();
	//code to run on window load
	
	//
}

export function loaded() {
	setCamera(0, 0);
	//code to run once textures, shaders, rest of webgl stuff has finished loading
	
	//
	told = performance.now();
	setInterval(loop, 1000/60); //60 times a second could go full speed but idk
}


var told;
function loop() {
	const tnow = performance.now();
	const t = tnow - told;
	told = tnow;
	
	//game logic loop (runs 60 times a second)
	
	//
}

window.onload = main;

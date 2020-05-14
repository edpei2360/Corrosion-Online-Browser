/*
 * TODO:
 * 	with shader/vertexarray have bit dedicated to selecting if the entity 
 * 		is effected by the projection matrix or a static matrix
 * 	multiple types of uniforms
 * 	support for semitransparent objects
 * 	loading screen
 * 
 * 	transforms
 * 		optimize Entity.transform, math.transformVec2
 * 		add trasformations that dont update entity immediately
 * 
 * 	error handling and callbacks
 * 
 * 	clean tmps and genneral cleaning
 * 	move all gl stuff into own folder
 * 	move functions/vars from glManager, globals to appropriate locations
 * 	documentation :(
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 */
import {glInit, setCamera} from "/glManager.js"//tmp remove setCamera
import {Entity} from "/entity.js"//tmp
import {texPoop, texCircle} from "/texture.js"//tmp

function main() {
	glInit();
}

//test/example (you can delete)
	var v3;
//
export function loaded() {
	//test test/example (you can delete)
		setCamera(0, 0);
		const v = new Entity(2.0, 2.0);
		v.setTexture(texCircle);
		v.rotateToVec(4, 3);
		v.rotateVec(4, 3);
		v.setZ(0.5);
		v.sendDataToGPU();
		
		const v2 = new Entity(5.0,5.0);
		v2.setTexture(texPoop);
		v2.translateTo(3,3);
		v2.rotateToRads(3.14159265/8);
		v2.rotateRads(3.14159265/8);
		v2.sendDataToGPU();
		
		v3 = new Entity(2.0,2.0);
		v3.setColor(123,25,190);
		v3.translateTo(-3,3);
		v3.translate(1.5,0);
		v3.setZ(1.0);
		v3.sendDataToGPU();
	//
	
	told = performance.now();
	setInterval(loop, 1000/60); //60 times a second could go full speed but idk
}


var told;
function loop() {
	const tnow = performance.now();
	const t = tnow - told;
	told = tnow;
	
	//test test/example (you can delete)
		v3.rotateRads(t/1000);
		v3.sendDataToGPU();
	//
}

window.onload = main;

/*
 * TODO:
 * 	glManager removeEntity(entity)
 * 	with shader/vertexarray have bit dedicated to selecting if the entity 
 * 		is effected by the projection matrix or a static matrix
 * 	multiple types of uniforms
 * 
 * 	loading screen
 * 	
 * 	maths (web assembly?)
 * 	entity modeltransforms and stuff
 * 		scale, rotation, translation, center of object/pivot (for rotation)
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

//tmp
	export function loaded() {
			setCamera(0, 0);
			const v = new Entity();
			v.setTexture(texCircle);
			v.sendDataToGPU();
			
			const v2 = new Entity();
			v2.setTexture(texPoop);
			v2.translate(3,3);
			v2.sendDataToGPU();
			
			
			const v3 = new Entity();
			v3.setColor(123,25,190);
			v3.translate(-3,3);
			v3.sendDataToGPU();
	}
//

window.onload = main;

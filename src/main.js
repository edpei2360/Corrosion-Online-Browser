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
}

//test/example (you can delete)
	var v3;
	var v2;
	var v;
//
export function loaded() {
	setCamera(0, 0);
	//test/example (you can delete)
		v = new Entity(100.0, 100.0);
		v.setTexture(texCircle);			//use texture
		v.rotateToVec(4, 3);
		v.rotateVec(4, 3);
		v.setZ(2);							//z value unsigned int from 0 to 65536, higher z value draws ontop
		v.setStatic();						//makes entity static (is not effected by camera movement (useful for UI)
												//NOTE static uses a different scale then dynamic
		v.sendDataToGPU();					//IMPORTANT! if not sent to gpu it wont change how it is drawn
		
		v2 = new Entity(5.0,5.0, 0.0, -0.3);
		v2.setTexture(texPoop);
		v2.translateTo(3,3);
		v2.rotateToRads(3.14159265/8);
		v2.rotateRads(3.14159265/8);
		v2.sendDataToGPU();
		
		v3 = new Entity();
		v3.setColor(123,25,190);		//use solid color entity
		v3.translateTo(-3,3);
		v3.translate(1.5,0);
		v3.setZ(3);
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
	
	//test/example (you can delete)
		setCamera(5*Math.sin(tnow*0.001), 0); //moves camera
											  //could also use moveCamera(x, y)
		v2.rotateRads(t*-0.001);
		v2.sendDataToGPU();
		
		v3.rotateRads(t*0.001);
		v3.sendDataToGPU();
		
		v.rotateVec(1, t*0.002);
		v.sendDataToGPU();
	//
}

window.onload = main;

/*
 * TODO:
 * 	move modelview matrixs
 * 	textures
 * 	error handling and callbacks
 * 	possible use element buffers to reduce repeated vertexs???
 * 	multiple types of uniforms???
 * 	add more types for vertex array???
 */
import {glInit} from "/glManager.js"
import {Entity} from "/entity.js"

//tmp
	var entities = []

	var t = 0;
	function blah() {
		t += 0.025;
		const pos = 1.5*Math.sin(t);
		const green = 0.5*Math.sin(t*3)+0.5;
		const positions = [
				//x         y    R    G    B
				 1.5+pos,  2.0, 0.0, green, 0.0,//1 left top
				 2.0+pos,  2.0, 0.0, green, 0.0,//2 right top
				 1.5+pos,  1.5, 0.0, green, 0.0,//3 left bottom
				 
				 2.0+pos,  1.5, 0.0, green, 0.0,//4 bottom left
				 1.5+pos,  1.5, 0.0, green, 0.0,//3 left bottom
				 2.0+pos,  2.0, 0.0, green, 0.0,//2 right top
			];
		entities[1].setVertexs(positions);
	}
//

function main() {
	glInit();
	//tmp
		const positions1 = [
			//x     y    R    G    B
			-1.0,  1.0, 1.0, 0.0, 0.0,//1 left top
			 1.0,  1.0, 0.0, 1.0, 0.0,//2 right top
			-1.0, -1.0, 0.0, 0.0, 1.0,//3 left bottom
			 
			 1.0, -1.0, 0.0, 1.0, 1.0,//4 bottom left
			-1.0, -1.0, 0.0, 0.0, 1.0,//3 left bottom
			 1.0,  1.0, 0.0, 1.0, 0.0,//2 right top
		];
		const e = new Entity()
		e.setVertexs(positions1);
		entities.push(e);
		
		const positions2 = [
			//x     y    R    G    B
			 1.5,  2.0, 0.0, 1.0, 0.0,//1 left top
			 2.0,  2.0, 0.0, 1.0, 0.0,//2 right top
			 1.5,  1.5, 0.0, 1.0, 0.0,//3 left bottom
			 
			 2.0,  1.5, 0.0, 1.0, 0.0,//4 bottom left
			 1.5,  1.5, 0.0, 1.0, 0.0,//3 left bottom
			 2.0,  2.0, 0.0, 1.0, 0.0,//2 right top
		];
		const e2 = new Entity()
		e2.setVertexs(positions2);
		entities.push(e2);
		
		setInterval(blah, 10);
	//
}

window.onload = main;

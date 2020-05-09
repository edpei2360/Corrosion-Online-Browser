/*
 * TODO:
 * 	glManager removeEntity(entity)
 * 	textures
 * 	remove color from shader
 * 	entity modeltransforms
 * 	mat4 class? (other maths)
 * 	add z to vb for depth when drawing
 * 	error handling and callbacks
 * 	clean tmps
 * 	move all gl stuff into own folder
 * 	possible use element buffers to reduce repeated vertexs???
 * 	multiple types of uniforms???
 */
import {glInit, setCamera} from "/glManager.js"
import {Entity} from "/entity.js"

//tmp
	var entities = []

	var t = 0;
	function blah() {
		t += 0.025;
		const pos0 = 3*Math.sin(t)
		const pos1 = 3*Math.cos(t)
		const pos = 1.5*Math.sin(t);
		const green = 0.5*Math.sin(t*3)+0.5;
		const positions1 = [
			//x             y    R    G    B
			-1.0+pos1,  1.0+pos0, 1.0, 0.0, 0.0,//1 left top
			 1.0+pos1,  1.0+pos0, 0.0, 1.0, 0.0,//2 right top
			-1.0+pos1, -1.0+pos0, 0.0, 0.0, 1.0,//3 left bottom
			 
			 1.0+pos1, -1.0+pos0, 0.0, 1.0, 1.0,//4 bottom left
			-1.0+pos1, -1.0+pos0, 0.0, 0.0, 1.0,//3 left bottom
			 1.0+pos1,  1.0+pos0, 0.0, 1.0, 0.0,//2 right top
		];
		const positions2 = [
				//x         y    R    G    B
				 1.5+pos,  2.0, 0.0, green, 0.0,//1 left top
				 2.0+pos,  2.0, 0.0, green, 0.0,//2 right top
				 1.5+pos,  1.5, 0.0, green, 0.0,//3 left bottom
				 
				 2.0+pos,  1.5, 0.0, green, 0.0,//4 bottom left
				 1.5+pos,  1.5, 0.0, green, 0.0,//3 left bottom
				 2.0+pos,  2.0, 0.0, green, 0.0,//2 right top
			];
		entities[0].setVertexs(positions1);
		entities[1].setVertexs(positions2);
	}
//

function main() {
	glInit();
	setCamera(0, 0);
	//
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
	
	//e2.remove(); TODO
}

window.onload = main;

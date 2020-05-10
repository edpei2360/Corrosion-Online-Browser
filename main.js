/*
 * TODO:
 * 	glManager removeEntity(entity)
 * 	subtextures: load from texfile and link with loadingscreen
 * 	loading screen
 * 	entity modeltransforms
 * 	with vertexarray have bit dedicated to selecting if the entity is effected by the projection matrix
 * 	entity more setdata stuff
 * 	mat4 class? (other maths)
 * 	error handling and callbacks
 * 	clean tmps
 * 	move all gl stuff into own folder
 * 	possible use element buffers to reduce repeated vertexs
 * 	multiple types of uniforms???
 * 	fix annoying warning "XMLHttpRequest on the main thread ..."
 */
import {glInit, setCamera} from "/glManager.js"//tmp remove setCamera
import {Entity} from "/entity.js"//tmp
import {TextureAtlas} from "/texture.js"//tmp

//tmp
	var t = 0;
	function spin() {
		t += 0.025;
		var c = Math.cos(t);
		var s = Math.sin(t);

		var vertex = [
			//x    y    z    color texxy
			-1.0*c-1.0*-s, -1.0*s-1.0*c, 0.0, 0.0, 0.0,
			-1.0*c+1.0*-s, -1.0*s+1.0*c, 0.0, 0.0, 0.0,
			 1.0*c+1.0*-s, 1.0*s+1.0*c, 0.0, 0.0, 0.0,
			 
			 1.0*c+1.0*-s, 1.0*s+1.0*c, 0.0, 0.0, 0.0,
			 1.0*c-1.0*-s, 1.0*s-1.0*c, 0.0, 0.0, 0.0,
			-1.0*c-1.0*-s, -1.0*s-1.0*c, 0.0, 0.0, 0.0
		];
		
		var vertexData = new Float32Array(vertex);
		intrep = new Uint16Array(vertexData.buffer);
		intrep[8] = 0;
		intrep[9] = 0xffff;
		
		intrep[18] = 0;
		intrep[19] = 0;
		
		intrep[28] = 0xffff;
		intrep[29] = 0;
		
		intrep[38] = 0xffff;
		intrep[39] = 0;
		
		intrep[48] = 0xffff;
		intrep[49] = 0xffff;
		
		intrep[58] = 0;
		intrep[59] = 0xffff;
		
		e.setVertexs(intrep);
		
		var x = -3*Math.cos(t);
		var y = 5*Math.sin(t);
		c = Math.cos(3.14*t);
		s = Math.sin(3.14*t);
		vertex = [
			//x    y    z    color texxy
			-1.0*c-1.0*-s + x, -1.0*s-1.0*c + y, 0.0, 0.0, 0.0,
			-1.0*c+1.0*-s + x, -1.0*s+1.0*c + y, 0.0, 0.0, 0.0,
			 1.0*c+1.0*-s + x,  1.0*s+1.0*c + y, 0.0, 0.0, 0.0,
			 
			 1.0*c+1.0*-s + x,  1.0*s+1.0*c + y, 0.0, 0.0, 0.0,
			 1.0*c-1.0*-s + x,  1.0*s-1.0*c + y, 0.0, 0.0, 0.0,
			-1.0*c-1.0*-s + x, -1.0*s-1.0*c + y, 0.0, 0.0, 0.0
		];

		var vertexData = new Float32Array(vertex);
		var intrep = new Uint32Array(vertexData.buffer);
		//setting color uint
		intrep[3] =  0xffff00ff;
		intrep[8] =  0xffff00ff;
		intrep[13] = 0xffff00ff;
		intrep[18] = 0xffff00ff;
		intrep[23] = 0xffff00ff;
		intrep[28] = 0xffff00ff;
		
		e2.setVertexs(intrep);
	}

	var e;
	var e2;
//

function main() {
	glInit();
	
	//tmp
		setCamera(0, 0);
		new TextureAtlas("/test.png", "null");
		var vertex = [
			//x    y    z    color texxy
			-1.0, -1.0, 0.0, 0.0, 0.0,
			-1.0,  1.0, 0.0, 0.0, 0.0,
			 1.0,  1.0, 0.0, 0.0, 0.0,
			 
			 1.0,  1.0, 0.0, 0.0, 0.0,
			 1.0, -1.0, 0.0, 0.0, 0.0,
			-1.0, -1.0, 0.0, 0.0, 0.0
		];

		var vertexData = new Float32Array(vertex);
		var intrep = new Uint16Array(vertexData.buffer);
		//setting vertexCords
		intrep[8] = 0;
		intrep[9] = 0xffff;
		intrep[18] = 0;
		intrep[19] = 0;
		intrep[28] = 0xffff;
		intrep[29] = 0;
		intrep[38] = 0xffff;
		intrep[39] = 0;
		intrep[48] = 0xffff;
		intrep[49] = 0xffff;
		intrep[58] = 0;
		intrep[59] = 0xffff;
		
		e = new Entity();
		e.setVertexs(intrep);
		
		var vertex = [
			//x    y    z    color texxy
			 2.0,  2.0, 0.0, 0.0, 0.0,
			 2.0,  4.0, 0.0, 0.0, 0.0,
			 4.0,  4.0, 0.0, 0.0, 0.0,
			 
			 4.0,  4.0, 0.0, 0.0, 0.0,
			 4.0,  2.0, 0.0, 0.0, 0.0,
			 2.0,  2.0, 0.0, 0.0, 0.0
		];

		var vertexData = new Float32Array(vertex);
		var intrep = new Uint32Array(vertexData.buffer);
		//setting color uint
		intrep[3] =  0xffff00ff;
		intrep[8] =  0xffff00ff;
		intrep[13] = 0xffff00ff;
		intrep[18] = 0xffff00ff;
		intrep[23] = 0xffff00ff;
		intrep[28] = 0xffff00ff;
		intrep = new Uint16Array(vertexData.buffer);
		intrep[9] = 0xffff;
		e2 = new Entity();
		e2.setVertexs(intrep);
		
		setInterval(spin, 1000/60);
	//
}

window.onload = main;

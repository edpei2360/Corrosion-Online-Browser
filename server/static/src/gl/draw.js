import {gl} from "./glManager.js"
import {mainShader} from "./shader.js"
import {vertexArrays} from "./vertexarray.js"

function draw() {
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//use main shader
	mainShader.use()
	//main drawing
	for (var i = 0; i < vertexArrays.length; i++){
		vertexArrays[i].use();
		gl.drawElements(gl.TRIANGLES, vertexArrays[i].getIndexCount(), gl.UNSIGNED_SHORT, 0);
	}
}

//tmp
	import {loaded} from "../main.js"
//
var drawLoop = null;
export function startDrawLoop() {
	if (drawLoop != null) throw "draw loop already running";
	drawLoop = setInterval(draw, 0);
	
	loaded();//tmp
}

export function endDrawLoop() {
	if (drawLoop == null) return;
	clearInterval(drawLoop);
	drawLoop = null;
}

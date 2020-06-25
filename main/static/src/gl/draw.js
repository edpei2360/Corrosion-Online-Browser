import {gl} from "./glManager.js"
import {mainShader, transparentShader} from "./shader.js"
import {vertexArrays, transparentVertexArrays} from "./vertexarray.js"
import {loaded} from "../main.js"

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
	
	//transparent drawing
	transparentShader.use();
	for (var i = 0; i < transparentVertexArrays.length; i++){
		transparentVertexArrays[i].use();
		gl.drawElements(gl.TRIANGLES, transparentVertexArrays[i].getIndexCount(), gl.UNSIGNED_SHORT, 0);
	}
}

var drawLoop = null;
export function startDrawLoop() {
	if (drawLoop != null) throw "draw loop already running";
	drawLoop = setInterval(draw, 1000/60);
	
	loaded();
}

export function endDrawLoop() {
	if (drawLoop == null) return;
	clearInterval(drawLoop);
	drawLoop = null;
}

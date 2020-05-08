import {vertexBufferSize} from "/globals.js"
import {gl} from "/glManager.js"

export class VertexBuffer {
	static bound = -1;
    constructor() {
		this.rendererID = gl.createBuffer();
		this.use();
		gl.bufferData(gl.ARRAY_BUFFER, vertexBufferSize, gl.DYNAMIC_DRAW);
	}
	
	use() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererID);
	}
	
	setData(offset, data) {
		this.use();
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
	}
}

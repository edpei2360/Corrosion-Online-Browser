//shouldn't be used directly. should only be used by a vertex array
import {ENTITY_SIZE_8, ENTITIES_PER_BUFFER, VERTEX_BUFFER_SIZE} from "./global.js"
import {gl} from "./glManager.js"

export class VertexBuffer {
	constructor() {
		this.rendererID = gl.createBuffer();
		this.use();
		gl.bufferData(gl.ARRAY_BUFFER, VERTEX_BUFFER_SIZE, gl.DYNAMIC_DRAW);
	}
	
	use() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererID);
	}
	
	setData(offset, data) {
		this.use();
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
	}
	
	remove() {
		gl.deleteBuffer(this.rendererID);
	}
}

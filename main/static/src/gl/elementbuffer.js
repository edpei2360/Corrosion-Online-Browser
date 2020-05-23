import {gl} from "./glManager.js"
import {ENTITIES_PER_BUFFER} from "./global.js"

export var mainEB;
export function initElementBuffer() {
	mainEB = new ElementBuffer();
}

export class ElementBuffer {
	constructor() {
		this.rendererID = gl.createBuffer();
		this.use();
		//pattern [0, 1, 3, 3, 1, 2]
		const indexs = [];
		for (var i = 0; i < ENTITIES_PER_BUFFER; i++) {
			indexs.push(...[i*4, i*4+1, i*4+3, i*4+3, i*4+1, i*4+2]);
		}
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexs), gl.STATIC_DRAW);
	}
	
	use() {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.rendererID);
	}
}

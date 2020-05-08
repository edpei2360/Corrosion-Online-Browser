import {VertexBuffer} from '/vertexbuffer.js'
import {gl} from "/glManager.js"

class Layout {
	constructor(name, num, type) { 
		this.name = name;
		this.num = num;
		this.type = type;
	}
}

function sizeof(type) {
	if (type === gl.FLOAT) {
		return 4;
	} else {
		throw "Type not supported: " + type;
	}
}

export class VertexArray {
	static bound = -1;
    constructor() {
		this.rendererID = gl.createVertexArray();
		this.use();
		this.layout = [];
		this.stride = 0;
		this.vb = new VertexBuffer();
		this.vertexCount = 0;
	}
	
	use() {
		gl.bindVertexArray(this.rendererID);
	}
	
	/* 
	 * gl: webgl context
	 * name: str name of attribute in shader
	 * num: number of componets in the vertex buffer
	 * type: type to interpret
	 * example  addAttributes("aPosition", 2, gl.FLOAT)
	 * */
	addAttribute(name, num, type) {
		this.layout.push(new Layout(name, num, type))
		this.stride += sizeof(type) * num;
	}
	
	setAttributes(shader) {
		var offset = 0;
		for (var i = 0; i < this.layout.length; i++) {
			const item = this.layout[i];
			gl.vertexAttribPointer(
				shader[item.name],
				item.num,
				item.type,
				false,
				this.stride,
				offset);
			gl.enableVertexAttribArray(shader[item.name]);
			offset += sizeof(item.type) * item.num;
		}
	}
	
	getVertexBuffer() {
		return this.vb;
	}
	
	setData(offset, data) {
		this.use();
		this.vb.setData(offset, data);
	}
	
	remove() {
		throw "Not Implemented";
	}
	
	getVertexCount() {
		return this.vertexCount;
	}
	
	addVertexs(amount) {
		this.vertexCount += amount;
	}
	
	removeVertexs(amount) {
		this.vertexCount -= amount;
	}
}
	

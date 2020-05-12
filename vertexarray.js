import {VertexBuffer} from '/vertexbuffer.js'
import {gl} from "/glManager.js"

class Layout {
	constructor(name, num, type, int, normalized) { 
		this.name = name;
		this.num = num;
		this.type = type;
		this.int = int;
		this.normalized = normalized;
	}
}

function sizeof(type) {
	if (type === gl.FLOAT) {
		return 4;
	} else if (type === gl.BYTE) {
		return 1;
	} else if (type === gl.UNSIGNED_BYTE) {
		return 1;
	}else if (type === gl.SHORT) {
		return 2;
	}else if (type === gl.UNSIGNED_SHORT) {
		return 2;
	}else if (type === gl.INT) {
		return 4;
	}else if (type === gl.UNSIGNED_INT) {
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
		this.indexCount = 0;
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
	addAttribute(name, num, type, int=false, normalized = false) {
		this.layout.push(new Layout(name, num, type, int, normalized))
		this.stride += sizeof(type) * num;
	}
	
	setAttributes(shader) {
		var offset = 0;
		for (var i = 0; i < this.layout.length; i++) {
			const item = this.layout[i];
			if (item.int) {
				gl.vertexAttribIPointer(
					shader[item.name],
					item.num,
					item.type,
					this.stride,
					offset);
			} else {
				gl.vertexAttribPointer(
					shader[item.name],
					item.num,
					item.type,
					item.normalized,
					this.stride,
					offset);
			}
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
		gl.deleteVertexArray(this.rendererID);
		this.vb.remove();
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
	
	getIndexCount() {
		return this.indexCount;
	}
	
	addIndexs(amount) {
		this.indexCount += amount;
	}
	
	removeIndexs(amount) {
		this.indexCount -= amount;
	}
}

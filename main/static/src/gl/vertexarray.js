import {VertexBuffer} from './vertexbuffer.js'
import {gl} from "./glManager.js"
import {mainShader, transparentShader} from "./shader.js"
import {mainEB} from "./elementbuffer.js"
import {transparentEntityArray} from "../transparententity.js"
import {entityArray} from "../entity.js"
import {VERTEXS_PER_ENTITY, INDEXS_PER_ENTITY, ENTITY_SIZE_8, VERTEX_BUFFER_SIZE, ENTITIES_PER_BUFFER} from "./global.js"

class VertexArrayIndex {
	constructor(vertexArray, offset) {
		this.vertexArray = vertexArray;
		this.offset = offset;
	}
}

export const transparentVertexArrays = [];
export function setTransparentData(index, data) {
	transparentVertexArrays[Math.floor(index/ENTITIES_PER_BUFFER)].setData((index%ENTITIES_PER_BUFFER)*ENTITY_SIZE_8, data);
}

export function addTransparentVertexArray() {
	const va = new VertexArray();
	va.use();
	
	va.addAttribute("aVertexPosition", 2, gl.FLOAT);
	va.addAttribute("aZ", 1, gl.UNSIGNED_SHORT, false, true);
	va.addAttribute("aData", 1, gl.UNSIGNED_SHORT, true);
	va.addAttribute("aVertexColor", 4, gl.UNSIGNED_BYTE, false, true);
	va.addAttribute("aTextureCords", 2, gl.UNSIGNED_SHORT, false, true);
	
	va.setAttributes(transparentShader);
	mainEB.use();
	transparentVertexArrays.push(va);
}

export function removeTransparentVertexArray() {
	var removed = transparentVertexArrays.pop();
	removed.remove();
}

export function getTransparentEntity(e) {
	//tell vertex array to draw another entity
	if (transparentEntityArray.length % ENTITIES_PER_BUFFER == 0) {
		//need new va
		addTransparentVertexArray();
	}
	
	//tell va to draw one more entity
	transparentVertexArrays[transparentVertexArrays.length - 1].addVertexs(VERTEXS_PER_ENTITY);
	transparentVertexArrays[transparentVertexArrays.length - 1].addIndexs(INDEXS_PER_ENTITY);
	
	//bin search to find index
	var left = 0;
	var right = Math.max(0, transparentEntityArray.length-1);
	while (left != right) {
		var mid = Math.floor((left + right) / 2);
		if (transparentEntityArray[mid].z < e.z) {
			left = Math.min(mid + 1, right);
		} else if (transparentEntityArray[mid].z > e.z) {
			right = Math.max(mid - 1, left);
		} else {
			left = mid;
			right = mid;
		}
	}
	
	//insert element
	transparentEntityArray.splice(left, 0, e);
	
	//update indexs
	for (var i = left; i < transparentEntityArray.length; i++) {
		const e = transparentEntityArray[i];
		e.index = i;
	}
	
	//updates GPU data
	insertTranparentData(left);
}

function insertTranparentData(index) {
	while (index < transparentEntityArray.length) {
		const startindex = index;
		const entities = Math.min(ENTITIES_PER_BUFFER-(index%ENTITIES_PER_BUFFER), transparentEntityArray.length - index)
		const data = new Uint8Array(ENTITY_SIZE_8*entities);
		for (var i = 0; i < entities; i+=ENTITY_SIZE_8) {
			data.set(transparentEntityArray[index].vertexData, i);
			index++;
		}
		setTransparentData(startindex, data);
	}
}

export function removeTransparentEntity(e) {
	//update indexs
	transparentEntityArray.splice(e.index, 1);
	for (var i = e.index; i < transparentEntityArray.length; i++) {
		const e = transparentEntityArray[i];
		e.index = i;
	}
	
	//update GPU
	insertTranparentData(e.index);
	
	//tell va to draw one less entity
	transparentVertexArrays[transparentVertexArrays.length - 1].removeVertexs(VERTEXS_PER_ENTITY);
	transparentVertexArrays[transparentVertexArrays.length - 1].removeIndexs(INDEXS_PER_ENTITY);
	
	//check if va is empty
	if (transparentVertexArrays[transparentVertexArrays.length - 1].getVertexCount() == 0) {
		//remove empty va
		removeTransparentVertexArray();
	}
}

export function setData(vertexs, data) {
	vertexArrays[vertexs.vertexArray].setData(vertexs.offset, data);
}

export function initVertexArray() {
	addVertexArray();
}

export const vertexArrays = [];
var vertexArrayEnd = new VertexArrayIndex(0,0);
//creates a new vertex array when the others are out of space
function addVertexArray() {
	const va = new VertexArray();
	va.use();
	
	va.addAttribute("aVertexPosition", 2, gl.FLOAT);
	va.addAttribute("aZ", 1, gl.UNSIGNED_SHORT, false, true);
	va.addAttribute("aData", 1, gl.UNSIGNED_SHORT, true);
	va.addAttribute("aVertexColor", 4, gl.UNSIGNED_BYTE, false, true);
	va.addAttribute("aTextureCords", 2, gl.UNSIGNED_SHORT, false, true);
	
	va.setAttributes(mainShader);
	mainEB.use();
	vertexArrays.push(va);
}

//removes last vertexArrays
function removeVertexArray() {
	var removed = vertexArrays.pop();
	removed.remove();
}

//returns new free index(in the vertexArrays) for an entity to use for drawing
export function getEntity(entity) {
	entity.index = entityArray.length;
	entityArray.push(entity);
	const out = vertexArrayEnd;
	
	//tell vertex array to draw another entity
	vertexArrays[out.vertexArray].addVertexs(VERTEXS_PER_ENTITY);
	vertexArrays[out.vertexArray].addIndexs(INDEXS_PER_ENTITY);
	
	//update end position
	if (out.offset+ENTITY_SIZE_8 >= VERTEX_BUFFER_SIZE) { //check if new end position is out of bounds
		vertexArrayEnd = new VertexArrayIndex(out.vertexArray+1, 0);
		addVertexArray();
	} else {
		vertexArrayEnd = new VertexArrayIndex(out.vertexArray, out.offset+ENTITY_SIZE_8);
	}
	
	//set end position of entity
	entity.vertexs = out;
}

export function removeEntity(entity) {
	//get last item
	const back = entityArray.pop();
	vertexArrays[back.vertexs.vertexArray].removeVertexs(VERTEXS_PER_ENTITY);
	vertexArrays[back.vertexs.vertexArray].removeIndexs(INDEXS_PER_ENTITY);
	
	//update end position
	vertexArrayEnd = new VertexArrayIndex(back.vertexs.vertexArray, back.vertexs.offset);
	
	if (back.index !== entity.index) {
		//swap entity with last item
		entityArray[entity.index] = back;
		back.index = entity.index;
		back.vertexs = entity.vertexs;
		back.sendDataToGPU();//TODO: could cause glitch (CPU side data != GPU data)
	}
	
	//check if vertexarray can be removed
	if (vertexArrays.length >= 2 
		&& vertexArrays[vertexArrays.length-2].getIndexCount() == 0 
		&& vertexArrays[vertexArrays.length-1].getIndexCount() == 0) {
		removeVertexArray();
	}
}

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

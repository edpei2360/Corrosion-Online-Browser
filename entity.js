import {entitySize, vertexsPerEntity, vertexSize} from "/globals.js"
import {getEntity, setData, removeEntity} from "/glManager.js"
import {idmat3} from "/math.js"

function defVertexs(scale = 1.0) {
	return [
		//x    y    z    color texxy
		-scale,  scale, 0.0, 0.0, 0.0,
		 scale,  scale, 0.0, 0.0, 0.0,
		 scale, -scale, 0.0, 0.0, 0.0,
		-scale, -scale, 0.0, 0.0, 0.0];
}

export class Entity {
	constructor() {
		getEntity(this);// sets this.vertexs and this.index
		this.scale = 1.0;
		this.x = this.y = this.z = 0.0;
		
		//init data
		this.setVertexs(new Float32Array(defVertexs(this.scale)));
		this.sendDataToGPU();
	}
	
	setVertexs(data) {
		if (data.byteLength != entitySize) throw "Data not proper len:" + data.byteLength + " != " + entitySize;
		this.vertexData = new Uint8Array(data.buffer);
	}
	
	sendDataToGPU() {
		setData(this.vertexs, this.vertexData);
	}
	
	remove() {
		removeEntity(this);
	}
	
	setTexture(tex) {
		const data32 = new Uint32Array(this.vertexData.buffer);
		for (var i = 0; i < vertexsPerEntity; i++) {
			data32[i*5 + 3] = tex.slot;
		}
		
		const data16 = new Uint16Array(this.vertexData.buffer);
		//top left
		data16[8] = tex.x;
		data16[9] = tex.y;
		
		//top right
		data16[18] = tex.x + tex.width;
		data16[19] = tex.y;
		
		//bottom right
		data16[28] = tex.x + tex.width;
		data16[29] = tex.y + tex.height;
		
		//bottom left
		data16[38] = tex.x;
		data16[39] = tex.y + tex.height;
	}
	
	setColor(r,g,b,a=255){
		if (r==0 && g==0 && b==0 && a<32) throw "Color not supported: used for texture slots";
		for (var i = 0; i < vertexsPerEntity; i++) {
			this.vertexData[i*vertexSize + 12] = r;
			this.vertexData[i*vertexSize + 13] = g;
			this.vertexData[i*vertexSize + 14] = b;
			this.vertexData[i*vertexSize + 15] = a;
		}
	}
	
	setZ(z) {
		const data = new Float32Array(this.vertexData.buffer);
		for (var i = 0; i < vertexsPerEntity; i++) {
			data[i*5 + 2] = z;
		}
		this.z = z;
	}
	
	translate(x,y) {
		const data = new Float32Array(this.vertexData.buffer);
		for (var i = 0; i < vertexsPerEntity; i++) {
			data[i*5] += x;
			data[i*5 + 1] += y;
		}
		this.x += x;
		this.y += y;
	}
	
	translateTo(x,y) {
		const data = new Float32Array(this.vertexData.buffer);
		
		//top left
		data[0] = -1.0 + x;
		data[1] = 1.0 + y;
		//top right
		data[5] = 1.0 + x;
		data[6] = 1.0 + y;
		//bottom right
		data[10] = 1.0 + x;
		data[11] = -1.0 + y;
		//bottom left
		data[15] = -1.0 + x;
		data[16] = -1.0 + y;
		
		this.x = x;
		this.y = y;
	}
	
	rotateRads(rads) {
		throw "not implimented";
	}
	
	rotateToRads(rads) {
		const data = new Float32Array(this.vertexData.buffer);
		const s = this.scale*Math.sin(rads);
		const c = this.scale*Math.cos(rads);
		//xpart = cos(r)*x + sin(r)*y
		//ypart = -sin(r)*x + cos(r)*y
		//top left
		data[0] = s - c + this.x;
		data[1] = s + c + this.y;
		//top right
		data[5] = c + s + this.x;
		data[6] = c - s + this.y;
		//bottom right
		data[10] = c - s + this.x;
		data[11] = this.y - s - c;
		//bottom left
		data[15] = this.x - c - s;
		data[16] = s - c + this.y;
	}

	rotateVec(rads) {
		throw "not implimented";
	}
	
	rotateToVec(x, y) {
		if (x == 0 && y == 0) throw "invalid vector";
		const data = new Float32Array(this.vertexData.buffer);
		const d = 1.0/Math.sqrt(x*x + y*y);
		const c = this.scale*y*d;
		const s = this.scale*x*d;
		//xpart = cos(r)*x + sin(r)*y
		//ypart = -sin(r)*x + cos(r)*y
		//top left
		data[0] = s - c + this.x;
		data[1] = s + c + this.y;
		//top right
		data[5] = c + s + this.x;
		data[6] = c - s + this.y;
		//bottom right
		data[10] = c - s + this.x;
		data[11] = this.y - s - c;
		//bottom left
		data[15] = this.x - c - s;
		data[16] = s - c + this.y;
	}
	
	transformTo(mat3) {
		throw "not implimented";
	}
	
	transform(mat3) {
		throw "not implimented";
	}
}

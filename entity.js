import {entitySize, vertexsPerEntity, vertexSize} from "/globals.js"
import {getEntity, setData, removeEntity} from "/glManager.js"

export class Entity {
	constructor() {
		getEntity(this);// sets this.vertexs and this.index
		
		//init data
		var vertexs = [
			//x    y    z    color texxy
			-1.0,  1.0, 0.0, 0.0, 0.0,
			 1.0,  1.0, 0.0, 0.0, 0.0,
			 1.0, -1.0, 0.0, 0.0, 0.0,
			-1.0, -1.0, 0.0, 0.0, 0.0];
		this.setVertexs(new Float32Array(vertexs));
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
	
	translate(x,y) {
		const data = new Float32Array(this.vertexData.buffer);
		for (var i = 0; i < vertexsPerEntity; i++) {
			data[i*5] += x;
			data[i*5 + 1] += y;
		}
	}
}

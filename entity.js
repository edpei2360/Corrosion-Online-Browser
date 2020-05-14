import {entitySize, vertexsPerEntity, vertexSize} from "/globals.js"
import {getEntity, setData, removeEntity} from "/glManager.js"
import {Vec2, transformVec2} from "/math.js"

export class Entity {
	constructor(scaleX = 1.0, scaleY = 1.0, offsetX = 0.0, offsetY = 0.0) {
		getEntity(this);// sets this.vertexs and this.index
		this.scale = Vec2(scaleX, scaleY);
		this.translation = Vec2();
		this.trig = Vec2(0.0, 1.0); //[sin(rads), cos(rads)]
		this.offset = Vec2(offsetX, offsetY);
		
		//init data
		this.setVertexs(new Float32Array(20));
		this.transform();
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
	
	setScale(scaleX = 1.0, scaleY = 1.0) {
		this.scale[0] = scaleX;
		this.scale[1] = scaleY;
		this.transform();
	}
	
	setOffset(setOffsetX = 0.0, setOffsetY = 0.0) {
		this.offset[0] = setOffsetX;
		this.offset[1] = setOffsetY;
		this.transform();
	}
	
	translate(x, y) {
		const data = new Float32Array(this.vertexData.buffer);
		//top right
		data[0] += x;
		data[1] += y;
		//top right
		data[5] += x;
		data[6] += y;
		//bottom right
		data[10] += x;
		data[11] += y;
		//bottom left
		data[15] += x;
		data[16] += y;
		this.translation[0] += x;
		this.translation[1] += y;
	}
	
	translateTo(x, y) {
		const data = new Float32Array(this.vertexData.buffer);
		const oldx = this.translation[0];
		const oldy = this.translation[1];
		//top right
		data[0] += x - oldx;
		data[1] += y - oldy;
		//top right
		data[5] += x - oldx;
		data[6] += y - oldy;
		//bottom right
		data[10] += x - oldx;
		data[11] += y - oldy;
		//bottom left
		data[15] += x - oldx;
		data[16] += y - oldy;
		this.translation[0] = x;
		this.translation[1] = y;
	}
	
	rotateRads(rads) {
		const s = Math.sin(rads);
		const c = Math.cos(rads);
		const tmp0 = this.trig[0]*c + this.trig[1]*s;
		const tmp1 = this.trig[1]*c - this.trig[0]*s;
		this.trig[0] = tmp0;
		this.trig[1] = tmp1;
		this.transform();
	}
	
	rotateToRads(rads) {
		this.trig[0] = Math.sin(rads);
		this.trig[1] = Math.cos(rads);
		this.transform();
	}
	
	rotateToVec(x, y) {
		const h = Math.sqrt(x*x + y*y);
		this.trig[0] = y/h;
		this.trig[1] = x/h;
		this.transform();
	}
	
	rotateVec(x, y) {
		const h = Math.sqrt(x*x + y*y);
		const s = y/h;
		const c = x/h;
		this.trig = Vec2(this.trig[0]*c + this.trig[1]*s, this.trig[1]*c - this.trig[0]*s);
		this.transform();
	}
	
	transform() {
		const data = new Float32Array(this.vertexData.buffer);
		//top left
		var v = Vec2(-1.0, 1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[0] = v[0];
		data[1] = v[1];
		//top right
		v = Vec2(1.0, 1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[5] = v[0];
		data[6] = v[1];
		//bottom right
		v = Vec2(1.0, -1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[10] = v[0];
		data[11] = v[1];
		//bottom left
		v = Vec2(-1.0, -1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[15] = v[0];
		data[16] = v[1];
	}
}

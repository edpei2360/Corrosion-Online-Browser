import {getEntity, setData, removeEntity} from "./gl/vertexarray.js"
import {Vec2, transformVec2} from "./math.js"
import {ENTITY_SIZE_8, VERTEXS_PER_ENTITY, VERTEX_SIZE_8, VERTEX_SIZE_16} from "./gl/global.js"

/* TODO:
 * 	transforms
 * 		optimize Entity.transform, math.transformVec2
 * 		add trasformations that dont update entity immediately 
 */

export const entityArray = [];

//Flags
const CLEAR_COLOR_FLAG = 0x7f;
const SET_COLOR_FLAG = 0x80;
const CLEAR_STATIC_MATRIX_FLAG = 0xbf;
const SET_STATIC_MATRIX_FLAG = 0x40;

//Vertex Offsets
const OFFSET_X = 0; //use Float32Array
const OFFSET_Y = 1; //use Float32Array
const OFFSET_Z = 4; //use Uint16Array
const OFFSET_DATA = 10; //use Uint8Array
const OFFSET_TEX_SLOT = 11; //use Uint8Array
const OFFSET_R = 12; //use Uint8Array
const OFFSET_G = 13; //use Uint8Array
const OFFSET_B = 14; //use Uint8Array
const OFFSET_A = 15; //use Uint8Array
const OFFSET_TEX_X = 8; //use Uint16Array
const OFFSET_TEX_Y = 9; //use Uint16Array

//Entity Offsets
const OFFSET_TOP_LEFT_X = 0;//use Float32Array
const OFFSET_TOP_LEFT_Y = 1;//use Float32Array
const OFFSET_TOP_RIGHT_X = 5;//use Float32Array
const OFFSET_TOP_RIGHT_Y = 6;//use Float32Array
const OFFSET_BOTTOM_RIGHT_X = 10;//use Float32Array
const OFFSET_BOTTOM_RIGHT_Y = 11;//use Float32Array
const OFFSET_BOTTOM_LEFT_X = 15;//use Float32Array
const OFFSET_BOTTOM_LEFT_Y = 16;//use Float32Array
const OFFSET_TOP_LEFT_TEX_X = 8;//use UInt16Array
const OFFSET_TOP_LEFT_TEX_Y = 9;//use UInt16Array
const OFFSET_TOP_RIGHT_TEX_X = 18;//use UInt16Array
const OFFSET_TOP_RIGHT_TEX_Y = 19;//use UInt16Array
const OFFSET_BOTTOM_RIGHT_TEX_X = 28;//use UInt16Array
const OFFSET_BOTTOM_RIGHT_TEX_Y = 29;//use UInt16Array
const OFFSET_BOTTOM_LEFT_TEX_X = 38;//use UInt16Array
const OFFSET_BOTTOM_LEFT_TEX_Y = 39;//use UInt16Array

//vec indexs
const X = 0;
const Y = 1;

//trig indexs
const SIN = 0;
const COS = 1;

export class Entity {
	constructor(scaleX = 1.0, scaleY = 1.0, offsetX = 0.0, offsetY = 0.0) {
		getEntity(this);// sets this.vertexs and this.index
		this.scale = Vec2(scaleX, scaleY);
		this.translation = Vec2();
		this.trig = Vec2(0.0, 1.0); //[sin(rads), cos(rads)]
		this.offset = Vec2(offsetX, offsetY);
		this.z = 0.0;
		
		//init data
		this.setVertexs(new Uint8Array(ENTITY_SIZE_8));
		this.transform();
		this.sendDataToGPU();
	}
	
	setVertexs(data) {
		if (data.byteLength != ENTITY_SIZE_8) throw "Data not proper len:" + data.byteLength + " != " + ENTITY_SIZE_8;
		this.vertexData = new Uint8Array(data.buffer);
	}
	
	sendDataToGPU() {
		setData(this.vertexs, this.vertexData);
	}
	
	remove() {
		removeEntity(this);
	}
	
	setTexture(tex) {
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_DATA] &= CLEAR_COLOR_FLAG;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_TEX_SLOT] = tex.slot;
		}
		
		const data16 = new Uint16Array(this.vertexData.buffer);
		//top left
		data16[OFFSET_TOP_LEFT_TEX_X] = tex.x;
		data16[OFFSET_TOP_LEFT_TEX_Y] = tex.y;
		
		//top right
		data16[OFFSET_TOP_RIGHT_TEX_X] = tex.x + tex.width;
		data16[OFFSET_TOP_RIGHT_TEX_Y] = tex.y;
		
		//bottom right
		data16[OFFSET_BOTTOM_RIGHT_TEX_X] = tex.x + tex.width;
		data16[OFFSET_BOTTOM_RIGHT_TEX_Y] = tex.y + tex.height;
		
		//bottom left
		data16[OFFSET_BOTTOM_LEFT_TEX_X] = tex.x;
		data16[OFFSET_BOTTOM_LEFT_TEX_Y] = tex.y + tex.height;
	}
	
	setColor(r,g,b){
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_DATA] |= SET_COLOR_FLAG;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_R] = r;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_G] = g;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_B] = b;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_A] = 255;
		}
	}
	
	setStatic() {
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_DATA] |= SET_STATIC_MATRIX_FLAG;
		}
	}
	
	setDynamic() {
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_DATA] &= CLEAR_STATIC_MATRIX_FLAG;
		}
	}
	
	setZ(z) {
		const data = new Uint16Array(this.vertexData.buffer);
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data[i*VERTEX_SIZE_16 + OFFSET_Z] = z;
		}
		this.z = z;
	}
	
	setScale(scaleX = 1.0, scaleY = 1.0) {
		this.scale[X] = scaleX;
		this.scale[Y] = scaleY;
		this.transform();
	}
	
	setOffset(setOffsetX = 0.0, setOffsetY = 0.0) {
		this.offset[X] = setOffsetX;
		this.offset[Y] = setOffsetY;
		this.transform();
	}
	
	translate(x, y) {
		const data = new Float32Array(this.vertexData.buffer);
		//top right
		data[OFFSET_TOP_LEFT_X] += x;
		data[OFFSET_TOP_LEFT_Y] += y;
		//top right
		data[OFFSET_TOP_RIGHT_X] += x;
		data[OFFSET_TOP_RIGHT_Y] += y;
		//bottom right
		data[OFFSET_BOTTOM_RIGHT_X] += x;
		data[OFFSET_BOTTOM_RIGHT_Y] += y;
		//bottom left
		data[OFFSET_BOTTOM_LEFT_X] += x;
		data[OFFSET_BOTTOM_LEFT_Y] += y;
		this.translation[X] += x;
		this.translation[Y] += y;
	}
	
	
	translateTo(x, y) {
		const data = new Float32Array(this.vertexData.buffer);
		x -= this.translation[X];
		y -= this.translation[Y];
		//top right
		data[OFFSET_TOP_LEFT_X] += x;
		data[OFFSET_TOP_LEFT_Y] += y;
		//top right
		data[OFFSET_TOP_RIGHT_X] += x;
		data[OFFSET_TOP_RIGHT_Y] += y;
		//bottom right
		data[OFFSET_BOTTOM_RIGHT_X] += x;
		data[OFFSET_BOTTOM_RIGHT_Y] += y;
		//bottom left
		data[OFFSET_BOTTOM_LEFT_X] += x;
		data[OFFSET_BOTTOM_LEFT_Y] += y;
		this.translation[X] = x;
		this.translation[Y] = y;
	}
	
	rotateRads(rads) {
		const s = Math.sin(rads);
		const c = Math.cos(rads);
		const tmp0 = this.trig[SIN]*c + this.trig[COS]*s;
		const tmp1 = this.trig[COS]*c - this.trig[SIN]*s;
		this.trig[SIN] = tmp0;
		this.trig[COS] = tmp1;
		this.transform();
	}
	
	rotateToRads(rads) {
		this.trig[SIN] = Math.sin(rads);
		this.trig[COS] = Math.cos(rads);
		this.transform();
	}
	
	rotateToVec(x, y) {
		const h = Math.sqrt(x*x + y*y);
		this.trig[SIN] = y/h;
		this.trig[COS] = x/h;
		this.transform();
	}
	
	rotateVec(x, y) {
		const h = Math.sqrt(x*x + y*y);
		const s = y/h;
		const c = x/h;
		const tmp0 = this.trig[SIN]*c + this.trig[COS]*s;
		const tmp1 = this.trig[COS]*c - this.trig[SIN]*s;
		this.trig[SIN] = tmp0;
		this.trig[COS] = tmp1;
		this.transform();
	}
	
	transform() {
		const data = new Float32Array(this.vertexData.buffer);
		//top left
		var v = Vec2(-1.0, 1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[OFFSET_TOP_LEFT_X] = v[X];
		data[OFFSET_TOP_LEFT_Y] = v[Y];
		//top right
		v = Vec2(1.0, 1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[OFFSET_TOP_RIGHT_X] = v[X];
		data[OFFSET_TOP_RIGHT_Y] = v[Y];
		//bottom right
		v = Vec2(1.0, -1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[OFFSET_BOTTOM_RIGHT_X] = v[X];
		data[OFFSET_BOTTOM_RIGHT_Y] = v[Y];
		//bottom left
		v = Vec2(-1.0, -1.0);
		transformVec2(v, this.translation, this.trig, this.scale, this.offset);
		data[OFFSET_BOTTOM_LEFT_X] = v[X];
		data[OFFSET_BOTTOM_LEFT_Y] = v[Y];
	}
}

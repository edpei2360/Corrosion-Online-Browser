import {getEntity, setData, removeEntity} from "./gl/vertexarray.js"
import {Vec2, transformVec2} from "./math.js"
import {ENTITY_SIZE_8, VERTEXS_PER_ENTITY, VERTEX_SIZE_8, VERTEX_SIZE_16} from "./gl/global.js"

/* TODO:
 * 	transforms
 * 		optimize Entity.transform, math.transformVec2
 * 		add trasformations that dont update entity immediately
 */

//contains all entities
export const entityArray = [];

//Clear Flag (use &= to apply)
const CLEAR_COLOR_FLAG = 0xfffe;
const CLEAR_STATIC_MATRIX_FLAG = 0xfffd;

//Set Flag (use |= to apply)
const SET_COLOR_FLAG = 0x01;
const SET_STATIC_MATRIX_FLAG = 0x02;

//Vertex Offsets
const OFFSET_X = 0; //use Float32Array
const OFFSET_Y = 1; //use Float32Array
const OFFSET_Z = 4; //use Uint16Array
const OFFSET_DATA = 5; //use Uint16Array
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


/*
 * class Entity
 * 	int index: The index of this Entity in entityArray
 * 	vertexs: Stores which vertexarray and at what offset this entity is
 * 		stored on the GPU.
 * 	Vec2 scale: Scale of x and y of the Entity. Negative values mirror the Entity.
 * 		default scale = [1.0, 1.0]
 * 	Vec2 translation: The current position of the center of the Entity.
 * 	Vec2 trig: Contains [sin(rads), cos[rads]] where rads is the current
 * 		rotation in radians of the Entity
 * 	Vec2 offset: Moves the point of rotation/scale of the entity.
 * 		By default it is in the center of the square.
 * 		positive offset move the point of rotation/scale right and up, negative down and left
 * 		default offset = [0.0, 0.0]
 * 	int z: The z position of the Entity. Higher get drawn on top.
 * 		z should be in inclusive range(0, 65535)
 * 		default  z = 0
 * 	UInt8Array vertexData: Buffer of most up to date vertex data.
 *
 * NOTES:
 * 	e.remove() must be called to actually stop the entity from being drawn.
 */
export class Entity {
	constructor(scaleX = 1.0, scaleY = 1.0, offsetX = 0.0, offsetY = 0.0) {
		getEntity(this);// sets this.vertexs and this.index
		this.scale = Vec2(scaleX, scaleY);
		this.translation = Vec2();
		this.trig = Vec2(0.0, 1.0); //[sin(rads), cos(rads)]
		this.offset = Vec2(offsetX, offsetY);
		this.z = 0;

		//init data
		this.setVertexs(new Uint8Array(ENTITY_SIZE_8));
		this.transform();
		this.sendDataToGPU();
	}

	/*
	 * Sets the vertexs of the entity by given data.
	 * ArrayBuffer data: data change vertexs to.
	 *
	 * data.byteLength == ENTITY_SIZE_8
	 * otherwise throws: Data not proper len
	 *
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setVertexs(data) {
		if (data.byteLength != ENTITY_SIZE_8) {
			throw "Data not proper len:" + data.byteLength + " != " + ENTITY_SIZE_8;
		}
		this.vertexData = new Uint8Array(data.buffer);
	}

	/*
	 * Send vertex data to the vertexArray for further processing
	 */
	sendDataToGPU() {
		setData(this.vertexs, this.vertexData);
	}

	/*
	 * Removes the entity.
	 */
	remove() {
		removeEntity(this);
	}


	/*
	 * Sets the current texture of the entity.
	 * Texture tex: the texture to set.
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 * NOTE: Removes the current color.
	 */
	setTexture(tex) {
		const data16 = new Uint16Array(this.vertexData.buffer);

		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data16[i*VERTEX_SIZE_16 + OFFSET_DATA] &= CLEAR_COLOR_FLAG;
		}

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

	/*
	 * Sets the current color of the entity.
	 * int r: The red value of the color.
	 * 		r should be in inclusive range(0, 255)
	 * int g: The green value of the color.
	 * 		g should be in inclusive range(0, 255)
	 * int b: The blue value of the color.
	 * 		b should be in inclusive range(0, 255)
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 * NOTE: remove current texture
	 */
	setColor(r,g,b){
		const data16 = new Uint16Array(this.vertexData.buffer);
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data16[i*VERTEX_SIZE_16 + OFFSET_DATA] |= SET_COLOR_FLAG;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_R] = r;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_G] = g;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_B] = b;
			this.vertexData[i*VERTEX_SIZE_8 + OFFSET_A] = 255;
		}
	}

	/*
	 * Makes it so the entity is not effectied by the ProjectionMatrix and
	 * 		instead by the StaticMatrix. (not effected by moveCamera/setCamera)
	 * NOTE: Entitiy are by default Dynamic not Static.
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setStatic() {
		const data16 = new Uint16Array(this.vertexData.buffer);
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data16[i*VERTEX_SIZE_16 + OFFSET_DATA] |= SET_STATIC_MATRIX_FLAG;
		}
	}

	/*
	 * Makes it so the entity is effectied by the ProjectionMatrix and
	 * 		not by the StaticMatrix. (effected by moveCamera/setCamera)
	 * NOTE: Entitiy are by default Dynamic.
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setDynamic() {
		const data16 = new Uint16Array(this.vertexData.buffer);
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data16[i*VERTEX_SIZE_16 + OFFSET_DATA] &= CLEAR_STATIC_MATRIX_FLAG;
		}
	}

	/*
	 * Sets the Z position of the entity. Higher Z's get drawn on top.
	 * int z: The Z value to set.
	 * 		z value should be in the inclusive range(0, 65535)
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setZ(z) {
		const data = new Uint16Array(this.vertexData.buffer);
		for (var i = 0; i < VERTEXS_PER_ENTITY; i++) {
			data[i*VERTEX_SIZE_16 + OFFSET_Z] = z;
		}
		this.z = z;
	}

	/*
	 * Sets the scale
	 * float scaleX: Scales the x componet of the entity
	 * 		default scaleX = 1.0
	 * float scaleY: Scales the y componet of the entity
	 * 		default scaleY = 1.0
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setScale(scaleX = 1.0, scaleY = 1.0) {
		this.scale[X] = scaleX;
		this.scale[Y] = scaleY;
		this.transform();
	}

	/*
	 * Moves the point of rotation/scale of the entity.
	 * By default it is in the center of the square.
	 * positive offset move the point of rotation/scale right and up, negative down and left
	 *
	 * float offsetX: Sets the offset x value
	 * 		default offsetX = 0.0
	 * float offsetY: Sets the offset y value
	 * 		default offsetY = 0.0
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	setOffset(setOffsetX = 0.0, setOffsetY = 0.0) {
		this.offset[X] = setOffsetX;
		this.offset[Y] = setOffsetY;
		this.transform();
	}

	/*
	 * Moves the entity by the given vector.
	 *
	 * float x: x value to tranlate
	 * float y: y value to tranlate
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
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

	/*
	 * Moves the entity to the given vector.
	 *
	 * float x: x value to tranlate to
	 * float y: y value to tranlate to
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
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

	/*
	 * Rotates the entity by a given angle.
	 *
	 * float rads: angle in radians to rotate
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	rotateRads(rads) {
		const s = Math.sin(rads);
		const c = Math.cos(rads);
		const tmp0 = this.trig[SIN]*c + this.trig[COS]*s;
		const tmp1 = this.trig[COS]*c - this.trig[SIN]*s;
		this.trig[SIN] = tmp0;
		this.trig[COS] = tmp1;
		this.transform();
	}

	/*
	 * Rotates the entity to a given angle.
	 *
	 * float rads: angle in radians to rotate
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	rotateToRads(rads) {
		this.trig[SIN] = Math.sin(rads);
		this.trig[COS] = Math.cos(rads);
		this.transform();
	}

	/*
	 * Rotates the entity to a given vector.
	 * 	(1,0) rotates to (x,y) (does not strech)
	 * float rads: angle in radians to rotate to
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
	rotateToVec(x, y) {
		const h = Math.sqrt(x*x + y*y);
		this.trig[SIN] = y/h;
		this.trig[COS] = x/h;
		this.transform();
	}

	/*
	 * Rotates the entity by a given vector.
	 * 	the curretn (1,0) rotates to (x,y) (does not strech)
	 * float rads: angle in radians to rotate
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 */
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

	/*
	 * Applies a transformation from the currently set info (translation, trig/angle, scale, offset)
	 * NOTE: e.sendDataToGPU() must be called to update what is seen on screen.
	 * NOTE: this should not be needed to be called outside of the Entity class.
	 */
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

/*
 * mat4 index format
 * 0  4  8 12
 * 1  5  9 13
 * 2  6 10 14
 * 3  7 11 15
 *
 * mat3 index format
 * 0 3 6
 * 1 4 7
 * 2 5 8
 * */

export function Mat4ortho(x, y, width, height) {
		const out = new Float32Array(16);
		const lr = 2 / width;
		const bt = 2 / height;
		out[0] = lr;
		out[5] = bt;
		out[10] = 1;
		out[12] = -x * lr;
		out[13] = -y * bt;
		out[15] = 1;
		return out;
}

export function Mat3orthoInv(x, y, width, height) {
		const out = new Float32Array(9);
		out[0] = width*0.5;
		out[4] = height*0.5;
		out[6] = 2*x;
		out[7] = 2*y;
		out[8] = 1;
		return out;
}

export function Mat4() {
	return new Float32Array(16);
}

export function Mat4id() {
	const out = new Float32Array(16);
	out[0] = 1;
	out[5] = 1;
	out[10] = 1;
	out[15] = 1;
	return out
}

export function Mat3id() {
	const out = new Float32Array(9);
	out[0] = 1;
	out[4] = 1;
	out[8] = 1;
	return out;
}

export function Mat3() {
	return new Float32Array(9);
}

export function Mat3rotateORads(rads) {
	const out = new Float32Array(9);
	const s = Math.sin(rads);
	const c = Math.cos(rads);
	out[0] = c;
	out[1] = s;
	out[3] = -s;
	out[4] = c;
	out[8] = 1;
	return out;
}

export function Mat3scaleO(x, y) {
	const out = new Float32Array(9);
	out[0] = x;
	out[4] = y;
	out[8] = 1;
	return out;
}

export function Mat3translate(x, y) {
	const out = new Float32Array(9);
	out[0] = 1;
	out[4] = 1;
	out[6] = x;
	out[7] = y;
	out[8] = 1;
	return out;
}

export function Mat3multMat3(l, r) {
	const out = new Float32Array(9);
	out[0] = l[0] * r[0] + l[1] * r[3] + l[2] * r[6];
	out[1] = l[0] * r[1] + l[1] * r[4] + l[2] * r[7];
	out[2] = l[0] * r[2] + l[1] * r[5] + l[2] * r[8];

	out[3] = l[3] * r[0] + l[4] * r[3] + l[5] * r[6];
	out[4] = l[3] * r[1] + l[4] * r[4] + l[5] * r[7];
	out[5] = l[3] * r[2] + l[4] * r[5] + l[5] * r[8];

	out[6] = l[6] * r[0] + l[7] * r[3] + l[8] * r[6];
	out[7] = l[6] * r[1] + l[7] * r[4] + l[8] * r[7];
	out[8] = l[6] * r[2] + l[7] * r[5] + l[8] * r[8];
	return out;
}

//modifies v
export function Mat3transformVec2(m, v){
	const x = v[0];
	const y = v[1];
	v[0] = m[0]*x + m[3]*y + m[6];
	v[1] = m[1]*x + m[4]*y + m[7];
	return v;
}

/*
 * v: vec2 input (is modified and returned)
 * trans: vec2
 * trig: vec2 [sin(rads), cos(rads)]
 * scale: vec2
 * offset: vec2
 *
 * in the following order
 *  translates by -offset
 *  scales vertically and horizontally (centered at 0,0)
 *  rotates by rads (centered at 0,0)
 *  translates by translation
 */
export function transformVec2(v, trans, trig, scale, offset){
	const s = trig[0];
	const c = trig[1];
	const x = v[0];
	const y = v[1];

	v[0] = trans[0] + scale[0]*c*(x - offset[0]) + scale[1]*s*(offset[1] - y);
	v[1] = trans[1] + scale[0]*s*(x - offset[0]) + scale[1]*c*(y - offset[1]);
	return v;
}

export function Vec2(x=0.0, y=0.0) {
	return new Float32Array([x, y]);
}

export function Vec2i(x=0, y=0) {
	return new Int32Array([x, y]);
}

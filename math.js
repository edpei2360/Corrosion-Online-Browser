//returns mat4
export function ortho(x, y, width, height) {
		const out = new Float32Array(16);
		const lr = 2 / width;
		const bt = 2 / height;
		out[0] = lr;
		out[5] = bt;
		out[12] = -x * lr;
		out[13] = -y * bt;
		out[10] = 1;
		out[15] = 1;
		return out;
	}

//returns mat4
export function idmat4() {
	const out = new Float32Array(16);
	out[0] = 1;
	out[5] = 1;
	out[10] = 1;
	out[15] = 1;
	return out
}

export function idmat3() {
	const out = new Float32Array(9);
	out[0] = 1;
	out[4] = 1;
	out[8] = 1;
	return out;
}

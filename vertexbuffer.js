/*
 * TODO
 * 	find good defualt size for VB
 *  way to add rects
 * 	overflow protection/use multiple vbs
*/
export class VertexBuffer {
	static bound = -1;
    constructor(gl) {
		this.rendererID = gl.createBuffer();
		this.use(gl)
		gl.bufferData(gl.ARRAY_BUFFER, 1024, gl.DYNAMIC_DRAW);
	}
	
	use(gl) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.rendererID);
	}
	
	//check if data will overflow buffer ???
	setData(gl, offset, data) {
		this.use(gl);
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
	}
	
	addRect(gl) {}
}

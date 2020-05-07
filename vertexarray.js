class Layout {
	constructor(name, num, type) { 
		this.name = name;
		this.num = num;
		this.type = type;
	}
}

function sizeof(gl, type) {
	if (type === gl.FLOAT) {
		return 4;
	} else {
		throw "Type not supported: " + type;
	}
}

export class VertexArray {
	static bound = -1;
    constructor(gl) {
		this.rendererID = gl.createVertexArray();
		this.layout = [];
		this.stride = 0;
		
		this.use(gl);
	}
	
	use(gl) {
		gl.bindVertexArray(this.rendererID);
	}
	
	/* 
	 * gl: webgl context
	 * name: str name of attribute in shader
	 * num: number of componets in the vertex buffer
	 * type: type to interpret
	 * example  addAttributes("aPosition", 2, gl.FLOAT)
	 * */
	addAttribute(gl, name, num, type) {
		this.layout.push(new Layout(name, num, type))
		this.stride += sizeof(gl, type) * num;
	}
	
	setAttributes(gl, shader) {
		var offset = 0;
		for (var i = 0; i < this.layout.length; i++) {
			const item = this.layout[i];
			gl.vertexAttribPointer(
				shader[item.name],
				item.num,
				item.type,
				false,
				this.stride,
				offset);
			gl.enableVertexAttribArray(shader[item.name]);
			offset += sizeof(gl, item.type) * item.num;
		}
	}
}
	

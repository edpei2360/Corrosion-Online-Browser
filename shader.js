import {gl} from "/glManager.js"

//gets shader source code
function loadFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", filePath, false);
	xmlhttp.overrideMimeType("text/html");
	xmlhttp.send();
	if (xmlhttp.status==200) {
		result = xmlhttp.responseText;
	} else {
		throw "Shader src does't exist";
	}
	return result;
}

//compiles shader source code
function loadShader(type, location) {
	const source = loadFile(location);
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
		gl.deleteShader(shader);
	}

	return shader;
}

export class Shader {
	constructor(vsSrc, fsSrc) {
		//compile shaders
		const vertexShader = loadShader(gl.VERTEX_SHADER, vsSrc);
		const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSrc);

		//attach shaders
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		
		//check for error
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			throw 'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram);
		}

		this.shaderProgram = shaderProgram;
	}

	//bind shader for use
	use() {
		gl.useProgram(this.shaderProgram);
	}

	//add a attribute to the shader
	addAttribute(attrib) {
		this[attrib] = gl.getAttribLocation(this.shaderProgram, attrib);
	}
	
	//add a uniform to the shader
	addUniform(uni) {
		this[uni] = gl.getUniformLocation(this.shaderProgram, uni);
	}

	//change the value of a uniform of a shader
	setUniform(uni, val) {
		gl.uniformMatrix4fv(this[uni], false, val);
	}
}

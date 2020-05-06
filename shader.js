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
function loadShader(gl, type, location) {
	const source = loadFile(location);
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	gl.deleteShader(shader);
		throw 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
	}

	return shader;
}

export class Shader {
    constructor(gl, vsSrc, fsSrc) {
		//compile shaders
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSrc);
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSrc);
        
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
    use(gl) {
		gl.useProgram(this.shaderProgram);
	}
    
    //add a attribute to the shader
    addAttribute(gl, attrib) {
		this[attrib] = gl.getAttribLocation(this.shaderProgram, attrib);
	}
	
	/*TODO allow for multiple types of uniforms not just mat4*/
	//add a uniform to the shader
	addUniform(gl, uni) {
		this[uni] = gl.getUniformLocation(this.shaderProgram, uni);
	}
	/*TODO allow for multiple types of uniforms not just mat4*/
	//change the value of a uniform of a shader
	setUniform(gl, uni, val) {
		gl.uniformMatrix4fv(this[uni], false, val);
	}
}

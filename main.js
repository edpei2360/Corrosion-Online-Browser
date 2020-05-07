/*
 * code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 * TODO: Abstraction
 * 	multiple types of uniforms
 * 	textures
 * 	error handling and callbacks
 *  move/change projection and modelview matrixs
 * 	dynamically count veretxs
 *  get data from draw calls from entity class
 * 	add more types for vertex array
 * 	possible use element buffers to reduce repeated vertexs
 * */
 
import 'https://cdn.jsdelivr.net/npm/gl-matrix@3/gl-matrix.js';
const mat4 = glMatrix.mat4;

import {Shader} from '/shader.js'
import {VertexArray} from '/vertexarray.js'
import {VertexBuffer} from '/vertexbuffer.js'

function glinit(gl) {
	console.log("Shader version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.log("Webgl version: " + gl.getParameter(gl.VERSION));
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
}

function drawScene(gl, shaderProgram, vb) {
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	/*TODO: 
	 * move proj matrix to appropriate location (will be edited by playermovement)
	 * remove modelViewMatrix matrix (model transform will be calculated on CPU and vertexs will be put into the vb)
	 */
	
	/* TODO: change to othogonal projection (will produce 2d top down view)*/
	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	const fieldOfView = 45 * Math.PI / 180;   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective(projectionMatrix,
				   fieldOfView,
				   aspect,
				   zNear,
				   zFar);

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	const modelViewMatrix = mat4.create();

	// Now move the drawing position a bit to where we want to
	// start drawing the square.

	mat4.translate(modelViewMatrix,     // destination matrix
				 modelViewMatrix,     // matrix to translate
				 [ 0.0, 0.0, -6.0]);  // amount to translate
	mat4.rotate(modelViewMatrix,     // destination matrix
				 modelViewMatrix, 	// matrix to translate
				 performance.now()/1000.0,    				//rads
				 [ 2.14, 3.1415, 1.0]);  // axis
	
	shaderProgram.use(gl)
	shaderProgram.setUniform(gl, "uProjectionMatrix", projectionMatrix);
	shaderProgram.setUniform(gl, "uModelViewMatrix", modelViewMatrix);

	{
	//TODO: dynamically count vertexs to be drawn
	const offset = 0;
	const vertexCount = 6;
	gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
	}
}

function main() {
	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	const gl = canvas.getContext("webgl2");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	glinit(gl);
	
	const shaderProgram = new Shader(gl, "/vs.glsl", "/fs.glsl");
	shaderProgram.addAttribute(gl, "aVertexPosition");
	shaderProgram.addAttribute(gl, "aVertexColor");
	
	shaderProgram.addUniform(gl, "uProjectionMatrix")
	shaderProgram.addUniform(gl, "uModelViewMatrix")
	
	
	//TODO: get data from draw calls from entity class
	const positions = [
		//x     y    R    G    B
		-1.0,  1.0, 1.0, 0.0, 0.0,//1 left top
		 1.0,  1.0, 0.0, 1.0, 0.0,//2 right top
		-1.0, -1.0, 0.0, 0.0, 1.0,//3 left bottom
		 
		 1.0, -1.0, 0.0, 1.0, 1.0,//4 bottom left
		-1.0, -1.0, 0.0, 0.0, 1.0,//3 left bottom
		 1.0,  1.0, 0.0, 1.0, 0.0,//2 right top
	];
	
	const va = new VertexArray(gl);
	const vb = new VertexBuffer(gl);
	vb.setData(gl, 0, positions);
	va.addAttribute(gl, "aVertexPosition", 2, gl.FLOAT);
	va.addAttribute(gl, "aVertexColor", 3, gl.FLOAT);
	va.setAttributes(gl, shaderProgram);
	

	setInterval( function() { drawScene(gl, shaderProgram, vb); }, 0);
}

window.onload = main;

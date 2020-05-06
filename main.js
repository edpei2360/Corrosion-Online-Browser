/*
 * code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 * TODO: Abstraction
 * 	vertexbuffer
 * 	vertexarray
 * 	multiple types of uniforms
 * 	textures
 * 	error handling and callbacks
 * */
import 'https://cdn.jsdelivr.net/npm/gl-matrix@3/gl-matrix.js';
const mat4 = glMatrix.mat4;

import {Shader} from '/shader.js'


function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}

function drawScene(gl, shaderProgram, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	
	/* TODO: change to othogonal projection */
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
				 [ 1.0, 1.0, 1.0]);  // axis

	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute.
	{
	const numComponents = 2;  // pull out 2 values per iteration
	const type = gl.FLOAT;    // the data in the buffer is 32bit floats
	const normalize = false;  // don't normalize
	const stride = 0;         // how many bytes to get from one set of values to the next
							  // 0 = use type and numComponents above
	const offset = 0;         // how many bytes inside the buffer to start from
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
	gl.vertexAttribPointer(
		shaderProgram.aVertexPosition,
		numComponents,
		type,
		normalize,
		stride,
		offset);
	gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
	}

	shaderProgram.use(gl)
	shaderProgram.setUniform(gl, "uProjectionMatrix", projectionMatrix);
	shaderProgram.setUniform(gl, "uModelViewMatrix", modelViewMatrix);

	{
	const offset = 0;
	const vertexCount = 4;
	gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}

//
// start here
//
function main() {
	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	const gl = canvas.getContext("webgl");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	const shaderProgram = new Shader(gl, "/vs.glsl", "/fs.glsl");
	shaderProgram.addAttribute(gl, "aVertexPosition");
	shaderProgram.addUniform(gl, "uProjectionMatrix")
	shaderProgram.addUniform(gl, "uModelViewMatrix")

	const buffers = initBuffers(gl);
	
	setInterval( function() { drawScene(gl, shaderProgram, buffers); }, 0);
}

window.onload = main;

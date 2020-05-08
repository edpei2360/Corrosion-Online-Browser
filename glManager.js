import {Shader} from '/shader.js'
import {VertexArray} from '/vertexarray.js'
import {vertexBufferSize, entitySize, vertexsPerEntity} from '/globals.js'

import 'https://cdn.jsdelivr.net/npm/gl-matrix@3/gl-matrix.js';
const mat4 = glMatrix.mat4;

export var gl;
export var mainShader;

const vertexArrays = [];
class VertexArrayIndex {
	constructor(vertexArray, offset) {
		this.vertexArray = vertexArray;
		this.offset = offset;
	}
}
var vertexArrayEnd = new VertexArrayIndex(0,0);
var drawLoop = null;

export function glInit() {
	const canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	gl = canvas.getContext("webgl2");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	//versions
	console.log("Shader version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.log("Webgl version: " + gl.getParameter(gl.VERSION));
	
	//gl settings
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
	
	//compile main shader
	mainShader = new Shader("/vs.glsl", "/fs.glsl");
	mainShader.addAttribute("aVertexPosition");
	mainShader.addAttribute("aVertexColor");
	mainShader.addUniform("uProjectionMatrix");
	mainShader.addUniform("uModelViewMatrix");
	
	//init va
	addVertexArray();
	
	//tmp
		setCamera();
	//
	
	startDrawLoop();
}

//returns new free index(in the vertexArrays) for a entity to use for drawing
export function getEntity() {
	const out = vertexArrayEnd;
	//tell vertex array to draw another entity
	vertexArrays[out.vertexArray].addVertexs(vertexsPerEntity);
	
	//update end position
	vertexArrayEnd = new VertexArrayIndex(out.vertexArray, out.offset+entitySize);
	//check if new end position is out of bounds
	if (vertexArrayEnd.offset >= vertexBufferSize) {
		//create new vertex array and set new end
		addVertexArray();
		vertexArrayEnd = new VertexArrayIndex(vertexArrayEnd.vertexArray+1, 0);
	}
	return out;
}

export function setData(index, data) {
	vertexArrays[index.vertexArray].setData(index.offset, data);
}

//TODO proper implementation
/* TODO: change to othogonal projection (will produce 2d top down view)
 * 	have a way to change the camera
 */
export function setCamera() {
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

	mainShader.use();
	mainShader.setUniform("uProjectionMatrix", projectionMatrix);
}

function draw() {
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// TODO move to be calculated by entities
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
	
	//use main shader
	mainShader.use()
	mainShader.setUniform("uModelViewMatrix", modelViewMatrix);
	
	//main drawing
	for (var i = 0; i < vertexArrays.length; i++){
		vertexArrays[i].use();
		gl.drawArrays(gl.TRIANGLES, 0, vertexArrays[i].getVertexCount());
	}
}

//creates a new vertex array when the others are out of space
function addVertexArray() {	
	const va = new VertexArray();
	va.use();
	va.addAttribute("aVertexPosition", 2, gl.FLOAT);
	va.addAttribute("aVertexColor", 3, gl.FLOAT);
	va.setAttributes(mainShader);
	vertexArrays.push(va);
}

//removes last vertexArrays
function removeVertexArray() {
	removed = vertexArrays.pop(va);
	removed.remove();
}

function startDrawLoop() {
	if (drawLoop != null) return;
	drawLoop = setInterval(draw, 0);
}

function endDrawLoop() {
	if (drawLoop == null) return;
	clearInterval(drawLoop);
	drawLoop = null;
}

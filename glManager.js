import {Shader} from '/shader.js'
import {VertexArray} from '/vertexarray.js'
import {vertexBufferSize, entitySize, vertexsPerEntity} from '/globals.js'
import {ortho, idmat4} from "/math.js"

export var gl;
export var mainShader;

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
	//enable transparency
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	//compile main shader
	mainShader = new Shader("/vs.glsl", "/fs.glsl");
	mainShader.addAttribute("aVertexPosition");
	mainShader.addAttribute("aVertexCords");
	mainShader.addAttribute("aVertexColor");
	mainShader.addUniform("uProjectionMatrix");
	for (var i = 0; i < 32; i++) {
		mainShader.addUniform("uProjectionMatrix[" + i + "]");
	}
	
	//init va
	addVertexArray();
	
	//initTextures();
	//startLoadingScreen();
	
	startDrawLoop();//tmp
}

class VertexArrayIndex {
	constructor(vertexArray, offset) {
		this.vertexArray = vertexArray;
		this.offset = offset;
	}
}

const vertexArrays = [];
const entityArray = [];
var vertexArrayEnd = new VertexArrayIndex(0,0);
//returns new free index(in the vertexArrays) for a entity to use for drawing
export function getEntity(entity) {
	entity.index = entityArray.length;
	entityArray.push(entity);
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
	entity.vertexs = out;
}

//swaps entity at the end with the entity being removed
//then pops back
//checks if vertexarray can be removed
export function removeEntity(entity) {
	throw "Not implimented";
}

export function setData(vertexs, data) {
	vertexArrays[vertexs.vertexArray].setData(vertexs.offset, data);
}

//tmp
	const width = 6.4*2;
	const height = 4.8*2;
//
//sets the camera position
export function setCamera(x, y) {
	const projectionMatrix = ortho(x, y, width, height);
	mainShader.use();
	mainShader.setUniform("uProjectionMatrix", projectionMatrix);
}

function draw() {
	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//use main shader
	mainShader.use()
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
	va.addAttribute("aVertexPosition", 3, gl.FLOAT);
	va.addAttribute("aVertexColor", 1, gl.UNSIGNED_INT, true);
	va.addAttribute("aVertexCords", 1, gl.UNSIGNED_INT, true);
	va.setAttributes(mainShader);
	vertexArrays.push(va);
}

//removes last vertexArrays
function removeVertexArray() {
	removed = vertexArrays.pop(va);
	removed.remove();
}

var drawLoop = null;
function startDrawLoop() {
	if (drawLoop != null) return;
	drawLoop = setInterval(draw, 0);
}

function endDrawLoop() {
	if (drawLoop == null) return;
	clearInterval(drawLoop);
	drawLoop = null;
}

function startLoadingScreen() {
	throw "Not Implemented";
}

function stopLoadingScreen() {
	throw "Not Implemented";
}

function loadingScreenLoop() {
	throw "Not Implemented";
}

function initTextures() {
	throw "Not Implemented";
}

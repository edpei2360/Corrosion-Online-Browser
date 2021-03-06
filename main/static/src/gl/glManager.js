import {initShaders} from "./shader.js"
import {initElementBuffer} from "./elementbuffer.js"
import {initVertexArray} from "./vertexarray.js"
import {startLoading} from "./loading.js"

export var gl;
export var canvas;

export function glInit() {
	canvas = document.querySelector("#glCanvas");
	// Initialize the GL context
	gl = canvas.getContext("webgl2", {premultipliedAlpha: false});

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
	gl.clearDepth(0.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.GEQUAL);            // Near things obscure far things
	
	//enable transparency
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	initShaders();
	
	//init va
	initElementBuffer();
	initVertexArray();
	
	startLoading();
}

import {Mat4ortho, Mat3orthoInv} from "../math.js"
import {mainShader, transparentShader} from "./shader.js"

export var staticMatrix;  //4x4
export var dynamicMatrix; //4x4
export var inverseDynamicMatrix; //3x3
export var inverseStaticMatrix; //3x3

export function initStaticMatrix() {
	staticMatrix = Mat4ortho(0, 0, 640, 480);
	inverseStaticMatrix = Mat3orthoInv(0, 0, 640, 480);
	
	mainShader.setUniformMat4("uStaticMatrix", staticMatrix);
	transparentShader.setUniformMat4("uStaticMatrix", staticMatrix);
}

//tmp
	const width = 24;
	const height = 18;
//
const cameraPos = new Float32Array(2);

//sets the camera position
export function setCamera(x, y) {
	cameraPos[0] = x;
	cameraPos[1] = y;
	
	dynamicMatrix = Mat4ortho(x, y, width, height);
	inverseDynamicMatrix = Mat3orthoInv(x, y, width, height);
	
	mainShader.setUniformMat4("uProjectionMatrix", dynamicMatrix);
	transparentShader.setUniformMat4("uProjectionMatrix", dynamicMatrix);
}

//TODO: more optimized implemention
export function moveCamera(x, y) {
	setCamera(cameraPos[0]+x, cameraPos[1]+y);
}

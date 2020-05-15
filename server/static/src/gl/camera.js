import {Mat4ortho} from "../math.js"
import {mainShader} from "./shader.js"

//tmp
	const width = 24;
	const height = 18;
//
const cameraPos = new Float32Array(2);

//sets the camera position
export function setCamera(x, y) {
	cameraPos[0] = x;
	cameraPos[1] = y;
	const projectionMatrix = Mat4ortho(x, y, width, height);
	mainShader.setUniformMat4("uProjectionMatrix", projectionMatrix);
}

//TODO: more optimized implemention
export function moveCamera(x, y) {
	setCamera(cameraPos[0]+x, cameraPos[1]+y);
}

import {primary_func, hover} from "../collision/clickbox.js"
import {canvas} from "../gl/glManager.js"
import {Mat3transformVec2, Vec2} from "../math.js"
import {inverseStaticMatrix, inverseDynamicMatrix} from "../gl/camera.js"

export var staticMousePos;

export var mousePos = Vec2();

export function getDynamicMousePos() {
	return Mat3transformVec2(inverseDynamicMatrix, mousePos);
}

export const MOUSE_DOWN = {};
export const MOUSE_UP = {};
MOUSE_DOWN[0] = primary_func; //left mouse button

function getPosition(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) { 
		x = e.pageX;
		y = e.pageY;
	}
	else { 
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	x = 2*x/canvas.width-1;
	y = 1-2*y/canvas.height;
	
	mousePos[0] = x;
	mousePos[1] = y;
	
	return [Mat3transformVec2(inverseDynamicMatrix, [x,y]), 
		Mat3transformVec2(inverseStaticMatrix, [x,y])];
}

export function onMouseMove(e) {
	const tmp = getPosition(e);
	staticMousePos = tmp[1];
	
	hover(...tmp);
}

export function onMouseDown(e) {
	if(e.button in MOUSE_DOWN) {
		MOUSE_DOWN[e.button](...getPosition(e));
	}
}

export function onMouseUp(e) {
	if(e.button in MOUSE_UP) {
		MOUSE_UP[e.button](...getPosition(e));
	}
}

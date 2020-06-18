import {primary_func, hover} from "../collision/clickbox.js"
import {canvas} from "../gl/glManager.js"
import {Mat3transformVec2} from "../math.js"
import {inverseStaticMatrix, inverseDynamicMatrix} from "../gl/camera.js"

export var staticMousePos;

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
	
	return [Mat3transformVec2(inverseDynamicMatrix, [x,y]), 
		Mat3transformVec2(inverseStaticMatrix, [x,y])];
}

//TODO: way to store dynamic pos as it changes without a on mouseMove/CameraMove
export function onMouseMove(e) {
	const tmp = getPosition(e);
	staticMousePos = tmp[1];
	
	hover(...tmp);
}

//TODO: be able to bind with whatever function
export function onMouseDown(e) {
	primary_func(...getPosition(e));
}

export function onMouseUp(e) {
}

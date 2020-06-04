import {click, hover} from "../collision/clickbox.js"
import {canvas} from "../gl/glManager.js"
import {Mat3transformVec2} from "../math.js"
import {inverseStaticMatrix, inverseDynamicMatrix} from "../gl/camera.js"

export function onMouseMove(e) {
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
	
	hover(Mat3transformVec2(inverseDynamicMatrix ,[x,y]),
		Mat3transformVec2(inverseStaticMatrix,[x,y]));
}

export function onMouseDown(e) {
	//TODO cleaning
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
	
	click(Mat3transformVec2(inverseDynamicMatrix ,[x,y]),
		Mat3transformVec2(inverseStaticMatrix,[x,y]));
	
}

export function onMouseUp(e) {
}

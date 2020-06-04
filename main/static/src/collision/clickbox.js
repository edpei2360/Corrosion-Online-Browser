import {STATIC_MATRIX} from "../global.js"

const clickBoxes_Hover = [];
const clickBoxes_Click = [];

//listen
export const CLICK = 0;
export const HOVER = 1;

export function hover(d, s) {
	for (var i in clickBoxes_Hover) {
		const c = clickBoxes_Hover[i];
		
		var x, y;
		if (c.matrix == STATIC_MATRIX) {
			x = s[0];
			y = s[1];
		} else {
			x = d[0];
			y = d[1];
		}
		
		if (c.containsPoint(x,y)) {
			c.call();
			return;
		}
	}
}

export function click(d, s) {
	for (var i in clickBoxes_Click) {
		const c = clickBoxes_Click[i];
		
		var x, y;
		if (c.matrix == STATIC_MATRIX) {
			x = s[0];
			y = s[1];
		} else {
			x = d[0];
			y = d[1];
		}
		
		if (c.containsPoint(x,y)) {
			c.call();
			return;
		}
	}
}

function addClickBox(listen, clickBox) {
	//get listener arr
	var l;
	if (listen == CLICK) {
		l = clickBoxes_Click;
	} else if(listen == HOVER) {
		l = clickBoxes_Hover;
	} else {
		throw "invalid listener";
	}
	
	//TODO: bin search instead of linear
	//find index to insert
	var index = 0;
	const z = clickBox.z;
	while (index < l.length && l[index].z > z) {
		index++;
	}
	
	//insert
	l.splice(index, 0, clickBox);
}

function removeClickBox(c) {
	var index = array.indexOf(c);
	if (index !== -1) array.splice(index, 1);
}

class ClickBox {
	constructor(z, matrix, listener, func, parent) {
		this.z = z;
		this.matrix = matrix;
		this.listener = listener;
		this.func = func;
		this.parent = parent
		addClickBox(listener, this);
	}
	
	call() {
		this.func(this.parent);
	}
	
	remove() {
		removeClickBox(this);
	}
	
	containsPoint() {throw "Not implemented";}
	intersectsLine() {throw "Not implemented";}
	intersectsRay() {throw "Not implemented";}
	intersectsLineSegment() {throw "Not implemented";}
	intersectsBoundingBox() {throw "Not implemented";}
	intersectsRotatedBox() {throw "Not implemented";}
	intersectsCircle() {throw "Not implemented";}
	intersectsTriangle() {throw "Not implemented";}
	intersectsPolygon() {throw "Not implemented";}
}

export class Point extends ClickBox {
	constructor(x, y, z, matrix, listener, func, parent) {
		super(z, matrix, listener, func, parent);
		this.x = x;
		this.y = y;
	}
}

export class BoundingBox extends ClickBox {
	constructor(points, z, matrix, listener, func, parent) {
		super(z, matrix, listener, func, parent);
		
		this.maxX = points[0][0];
		this.minX = points[0][0];
		
		this.maxY = points[0][1];
		this.minY = points[0][1];
		
		for (var i = 1; i < points.length; i++) {
			const x = points[i][0];
			const y = points[i][1];
			if (this.maxX < x) { this.maxX = x}
			if (this.minX > x) { this.minX = x}
			if (this.maxY < y) { this.maxY = y}
			if (this.minY > y) { this.minY = y}
		}
	}
	
	containsPoint(x, y) {
		return (this.maxX >= x && this.minX <= x) &&
			(this.maxY >= y && this.minY <= y)
	}
}


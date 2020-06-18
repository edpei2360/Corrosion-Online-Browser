import {STATIC_MATRIX, PROJECTION_MATRIX} from "../global.js"
import {Point} from "./geom/point.js"

const clickBoxes_Hover = [];
const clickBoxes_Primary = [];

//listen
export const PRIMARY_FUNC = 0;
export const HOVER = 1;

export function hover(d, s) {
	d = new Point(...d, PROJECTION_MATRIX);
	s = new Point(...s, STATIC_MATRIX);
	
	for (var i in clickBoxes_Hover) {
		const c = clickBoxes_Hover[i];

		var p;
		if (c.getMatrix() == STATIC_MATRIX) {
			p = s;
		} else {
			p = d;
		}
		
		if (c.containsPoint(p)) {
			c.call();
			return;
		}
	}
}

export function primary_func(d, s) {
	d = new Point(...d, PROJECTION_MATRIX);
	s = new Point(...s, STATIC_MATRIX);
	
	for (var i in clickBoxes_Primary) {
		const c = clickBoxes_Primary[i];
		
		var p;
		if (c.getMatrix() == STATIC_MATRIX) {
			p = s;
		} else {
			p = d;
		}
		
		if (c.containsPoint(p)) {
			c.call();
			return;
		}
	}
}

function addClickBox(listen, clickBox) {
	//get listener arr
	var l;
	if (listen == PRIMARY_FUNC) {
		l = clickBoxes_Primary;
	} else if(listen == HOVER) {
		l = clickBoxes_Hover;
	} else {
		throw "invalid listener";
	}
	
	//TODO: bin search instead of linear
	//find index to insert
	var index = 0;
	const z = clickBox.getZ();
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

export class ClickBox {
	constructor(geom, listener, func, parent) {
		this.geom = geom;
		this.listener = listener;
		this.func = func;
		this.parent = parent;
		addClickBox(listener, this);
	}
	
	call() {
		this.func(this.parent);
	}
	
	remove() {
		removeClickBox(this);
	}
	
	getZ() {
		return this.geom.z;
	}
	
	getMatrix() {
		return this.geom.matrix;
	}
	
	containsPoint(p) {
		return this.geom.containsPoint(p);
	}
	
	intersectsLine(l) {
		return this.geom.intersectsLine(l);
	}
	
	intersectsRay(r) {
		return this.geom.intersectsRay(r);
	}
	
	intersectsLineSegment(l) {
		return this.geom.intersectsLineSegment(l);
	}
	
	intersectsBoundingBox(b) {
		return this.geom.intersectsBoundingBox(b);
	}
	
	intersectsRotatedBox(b) {
		return this.geom.intersectsRotatedBox(b);
	}
	
	intersectsCircle(c) {
		return this.geom.intersectsCircle(c);
	}
	
	intersectsTriangle(t) {
		return this.geom.intersectsTriangle(t);
	}
	
	intersectsPolygon(p) {
		return this.geom.intersectsPolygon(p);
	}
}

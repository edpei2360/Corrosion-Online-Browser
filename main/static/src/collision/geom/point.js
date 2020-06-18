import {Geometry} from "./geometry.js" 

export class Point extends Geometry {
	constructor(x, y, matrix, z=0) {
		super(z, matrix);
		this.x = x;
		this.y = y;
	}
	
	containsPoint(p) {throw "Not implemented";}
	intersectsLine(l) {throw "Not implemented";}
	intersectsRay(r) {throw "Not implemented";}
	intersectsLineSegment(l) {throw "Not implemented";}
	intersectsBoundingBox(b) {throw "Not implemented";} //can use bb implementation
	intersectsRotatedBox(b) {throw "Not implemented";}
	intersectsCircle(c) {throw "Not implemented";}
	intersectsTriangle(t) {throw "Not implemented";}
	intersectsPolygon(p) {throw "Not implemented";}
}

import {Geometry} from "./geometry.js" 

export class BoundingBox extends Geometry {
	constructor(points, z, matrix) {
		super(z, matrix);
		this.z = z;
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
	
	containsPoint(p) {
		if (this.matrix != p.matrix) {throw "matrix doesn't match";}
		const x = p.x;
		const y = p.y;
		return (this.maxX >= x && this.minX <= x) &&
			(this.maxY >= y && this.minY <= y)
	}
	
	intersectsLine(l) {throw "Not implemented";}
	intersectsRay(r) {throw "Not implemented";}
	intersectsLineSegment(l) {throw "Not implemented";}
	intersectsBoundingBox(b) {throw "Not implemented";}
	intersectsRotatedBox(b) {throw "Not implemented";}
	intersectsCircle(c) {throw "Not implemented";}
	intersectsTriangle(t) {throw "Not implemented";}
	intersectsPolygon(p) {throw "Not implemented";}
}

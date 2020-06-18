export class Geometry {
	constructor(z, matrix) {
		this.z = z;
		this.matrix = matrix;
	}
	
	containsPoint(p) {throw "Not implemented";}
	intersectsLine(l) {throw "Not implemented";}
	intersectsRay(r) {throw "Not implemented";}
	intersectsLineSegment(l) {throw "Not implemented";}
	intersectsBoundingBox(b) {throw "Not implemented";}
	intersectsRotatedBox(b) {throw "Not implemented";}
	intersectsCircle(c) {throw "Not implemented";}
	intersectsTriangle(t) {throw "Not implemented";}
	intersectsPolygon(p) {throw "Not implemented";}
	
	/* TODO
	 * draw();
	 * translate/rotate and other translations
	 */
}

import {texText} from "./gl/texture.js"
import {Entity} from "./entity.js"
import {Vec2, Vec2i} from "./math.js"
import {CENTERED, LEFT, RIGHT, TOP, BOTTOM, PROJECTION_MATRIX, STATIC_MATRIX} from "./global.js"

/*
 * TODO: can improve
 * 	translateTo
 * 	setCharSize
 * 	setCharPadding
 * 	setAlign
 * 	setText
 * 	_initEntities
 */

export class Text {
	constructor(x, y, text, z = 0, horizontalAlign = CENTERED, verticalAlign = CENTERED,
		matrix = STATIC_MATRIX, charWidth = 10, rowHeight = 14, horizontalPadding = 1, verticalPadding = 1) {
		
		this.setMatrix(matrix);
		this.position = Vec2(x,y);
		this.setZ(z);
		this.charSize = Vec2(charWidth, rowHeight);
		this.charPadding = Vec2(horizontalPadding, verticalPadding);
		this.align = Vec2i(horizontalAlign, verticalAlign);
		this.text = text.split('\n');
		this.entities = [];
		
		this._initEntities();
	}
	
	translateTo(x, y) {
		this.position[0] = x;
		this.position[1] = y; 
		
		this.remove();
		this._initEntities();
	}
	
	translate(x, y) {
		for (var i in this.entities) {
			this.entities[i].translate(x, y);
		}
		this.position[0] += x;
		this.position[1] += y; 
	}
	
	setZ(z) {
		for (var i in this.entities) {
			this.entities[i].setZ(z);
		}
		this.z = z;
	}
	
	setMatrix(m) {
		if (m == PROJECTION_MATRIX) {
			for (var i in this.entities) {
				this.entities[i].setDynamic();
			}
		} else if (m == STATIC_MATRIX) {
			for (var i in this.entities) {
				this.entities[i].setStatic();
			}
		} else {
			throw "invalid matrix";
		}
		this.matrix = m;
	}
	
	setCharSize(width, height) {
		this.charSize = Vec2(width, height);
		
		this.remove();
		this._initEntities();
	}
	
	setCharPadding(hPadding, vPadding) {
		this.charPadding = Vec2(hPadding, vPadding);
		
		this.remove();
		this._initEntities();
	}
	
	setAlign(hAlign, vAlign) {
		this.align = Vec2i(hAlign, vAlign);
		
		this.remove();
		this._initEntities();
	}
	
	setText(text) {
		this.text = text.split('\n');
		
		this.remove();
		this._initEntities();
	}
	
	remove() {
		while (this.entities.length != 0) {
			var e = this.entities.pop();
			e.remove();
		}
	}
	
	sendDataToGPU() {
		for (var i in this.entities) {
			this.entities[i].sendDataToGPU();
		}
	}
	
	getMiddle() {
		return this.middle;
	}
	
	getTopLeft() {
		return this.topLeft;
	}
	
	getBottomRight() {
		return this.bottomRight;
	}
	
	getSize() {
		return this.size;
	}
	
	_initEntities() {
		delete this.topLeft;
		delete this.bottomRight;

		var offsetY;
		if (this.align[1] == CENTERED) {
			offsetY = -0.5*(this.text.length * (this.charSize[1]+this.charPadding[1]) - this.charPadding[1]) + this.charSize[1]*0.5;
		} else if (this.align[1] == TOP) {
			offsetY = this.charSize[1]*0.5;
		} else if (this.align[1] == BOTTOM) {
			offsetY = -this.text.length * (this.charSize[1]+this.charPadding[1]) + this.charPadding[1] + this.charSize[1]*0.5;
		}
		
		for (var i = 0; i < this.text.length; i++) {
			var line = this.text[i];
			var offsetX;
			if (this.align[0] == CENTERED) {
				offsetX = 0.5*((this.charSize[0] + this.charPadding[0]) * line.length - this.charPadding[0]) - this.charSize[0]*0.5;
			} else if (this.align[0] == LEFT) {
				offsetX = -this.charSize[0]*0.5;
			} else if (this.align[0] == RIGHT) {
				offsetX = (this.charSize[0] + this.charPadding[0]) * line.length - this.charPadding[0] - this.charSize[0]*0.5;
			}
			
			for (var j = 0; j < line.length; j++) {
				this._charAt(this.position[0] - offsetX, this.position[1] - offsetY);
				var c = line.charCodeAt(j);
				//space
				if (c === 32) {
					offsetX -= this.charSize[0] + this.charPadding[0];
					continue;
				}
				var e = new Entity(this.charSize[0]*0.5, this.charSize[1]*0.5);
				e.translateTo(this.position[0] - offsetX, this.position[1] - offsetY);
				if (this.matrix == STATIC_MATRIX) {
					e.setStatic();
				}
				e.setTexture(texText[c]);
				e.setZ(this.z);
				
				this.entities.push(e);
				offsetX -= this.charSize[0] + this.charPadding[0];
			}
			offsetY += this.charSize[1] + this.charPadding[0];
		}
		
		this.topLeft[0] -= 0.5*this.charSize[0];
		this.topLeft[1] += 0.5*this.charSize[1];
		this.bottomRight[0] += 0.5*this.charSize[0];
		this.bottomRight[1] -= 0.5*this.charSize[1];
		
		this.middle = Vec2(0.5*(this.topLeft[0] + this.bottomRight[0]), 0.5*(this.topLeft[1] + this.bottomRight[1]));
		this.size = Vec2(this.middle[0] - this.topLeft[0], this.middle[1] - this.bottomRight[1]);
	}
	
	_charAt(x, y) {
		if (this.topLeft === undefined) {
			this.topLeft = Vec2(x, y);
		} else {
			this.topLeft[0] = Math.min(this.topLeft[0], x);
			this.topLeft[1] = Math.max(this.topLeft[1], y);
		}
		
		if (this.bottomRight === undefined) {
			this.bottomRight = Vec2(x, y);
		} else {
			this.bottomRight[0] = Math.max(this.bottomRight[0], x);
			this.bottomRight[1] = Math.min(this.bottomRight[1], y);
		}
	}
}

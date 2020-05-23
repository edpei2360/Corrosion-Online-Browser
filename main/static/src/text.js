import {texText} from "./gl/texture.js"
import {Entity} from "./entity.js"

/*
 * TODO
 * size
 * padding
 * background
 * z value
 * remove
 */
export const CENTERED = 0;
export const LEFT = 1;
export const RIGHT = 2;
export const TOP = 1;
export const BOTTOM = 2;
export const PROJECTION_MATRIX = 0;
export const STATIC_MATRIX = 1;

export class Text {
	constructor(x, y, text, horizontalAlign = CENTERED, verticalAlign = CENTERED, matrix = STATIC_MATRIX, z = 0) {
		this.entities = [];
		
		text = text.split('\n');
		var rowHeight = 14;
		var charWidth = 10;
		var verticalPadding = 1;
		var horizontalPadding = 1;
		
		var offsetY;
		if (verticalAlign == CENTERED) {
			offsetY = -0.5*(text.length * (rowHeight+verticalPadding) - verticalPadding) + rowHeight*0.5;
		} else if (verticalAlign == TOP) {
			offsetY = rowHeight*0.5;
		} else if (verticalAlign == BOTTOM) {
			offsetY = -text.length * (rowHeight+verticalPadding) + verticalPadding + rowHeight*0.5;
		} else {
			throw "Invalid verticalAlign";
		}
		for (var i = 0; i < text.length; i++) {
			var line = text[i];
			var offsetX;
			if (horizontalAlign == CENTERED) {
				offsetX = 0.5*((charWidth + horizontalPadding) * line.length - horizontalPadding) - charWidth*0.5;
			} else if (horizontalAlign == LEFT) {
				offsetX = -charWidth*0.5;
			} else if (horizontalAlign == RIGHT) {
				offsetX = (charWidth + horizontalPadding) * line.length - horizontalPadding - charWidth*0.5;
			} else {
				throw "Invalid horizontalAlign";
			}
			for (var j = 0; j < line.length; j++) {
				var c = line.charCodeAt(j);
				//space
				if (c == 32) {
					offsetX += charWidth + horizontalPadding;
					continue;
				}
				var e = new Entity(charWidth*0.5, rowHeight*0.5);
				e.translateTo(x - offsetX, y - offsetY);
				if (matrix == STATIC_MATRIX) {
					e.setStatic();
				}
				e.setTexture(texText[c]);
				e.setZ(z);
				e.sendDataToGPU();
				
				this.entities.push(e);
				offsetX -= charWidth + horizontalPadding;
			}
			offsetY += rowHeight + horizontalPadding;
		}
	}
	
	remove() {
		while (this.entities.length != 0) {
			var e = this.entities.pop();
			e.remove();
		}
	}
}

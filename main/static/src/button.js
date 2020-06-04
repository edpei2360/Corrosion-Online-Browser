import {Vec2, Vec2i} from "./math.js"
import {Entity} from "./entity.js"
import {TransparentEntity} from "./transparententity.js"
import {Text} from "./text.js"
import {CENTERED, LEFT, RIGHT, TOP, BOTTOM, PROJECTION_MATRIX, STATIC_MATRIX, AUTO_SIZE} from "./global.js"
import {ClickBoundingBox, CLICK, HOVER} from "./collision/clickbox.js"

/* TODO
 * hover off
 * 
 * gets/sets
 * 
 * position
 * size (AUTO = (-1,-1))
 * buttonAlignment
 * padding
 * 
 * background
 * 
 * charsettings
 * 		charSize
 * 		charPadding
 * 		charAlign
 */

export class Button {
	constructor(x, y, z, text, r, g, b, a = 255, sizeX = AUTO_SIZE, sizeY = AUTO_SIZE, 
		matrix = STATIC_MATRIX, hButtonAlign = CENTERED, vButtonAlign = CENTERED, 
		hButtonPadding = 5, vButtonPadding = 5, charWidth = 10, charHeight = 14, 
		hCharPadding = 1, vCharPadding = 1, hCharAlign = CENTERED, vCharAlign = CENTERED) {
		
		this.position = Vec2(x, y);
		this.size = Vec2(sizeX, sizeY);
		this.actualSize = Vec2();
		this.buttonAlign = Vec2i(hButtonAlign, vButtonAlign);
		this.buttonPadding = Vec2(hButtonPadding, vButtonPadding);
		
		this.text = new Text(x, y, text, z+1, hCharAlign, vCharAlign, matrix, 
			charWidth, charHeight, hCharPadding, vCharPadding);
		if (a == 255) {
			this.background = new Entity(0, 0);
			this.background.setColor(r, g, b);
			this.setZ(z);
		} else {
			this.background = new TransparentEntity(z, 0, 0);
			this.background.setColor(r, g, b, a);
		}
		
		this.setMatrix(matrix);
		
		this._autosize();
		this.translateTo(x, y);
	}
	
	onHover(func) {
		var points = [[this.position[0] + this.actualSize[0], this.position[1] + this.actualSize[1]], 
			[this.position[0] - this.actualSize[0], this.position[1] - this.actualSize[1]]];
		if (this.hoverBox != undefined) {
			this.hoverBox.remove();
		}
		this.hoverBox = new ClickBoundingBox(points, this.background.z, this.matrix, HOVER, func, this);
	}
	
	onClick(func) {
		var points = [[this.position[0] + this.actualSize[0], this.position[1] + this.actualSize[1]], 
			[this.position[0] - this.actualSize[0], this.position[1] - this.actualSize[1]]];
		if (this.clickBox != undefined) {
			this.clickBox.remove();
		}
		this.clickBox = new ClickBoundingBox(points, this.background.z, this.matrix, CLICK, func, this);
	}
	
	onHoverOff(func) { throw "not Implemented"; } //other functions?
	
	sendDataToGPU() {
		this.text.sendDataToGPU();
		this.background.sendDataToGPU();
	}
	
	setMatrix(m) {
		this.text.setMatrix(m); //throws if invalid
		if (m == PROJECTION_MATRIX) {
			this.background.setDynamic();
		} else if (m == STATIC_MATRIX) {
			this.background.setStatic();
		}
		this.matrix = m;
	}
	
	setZ(z) {
		this.text.setZ(z+1);
		if (this.background instanceof Entity) {
			this.background.setZ(z);
		} else {
			throw "cannot set z of transparent entity";
		}
	}
	
	setText(t) {
		this.text.setText(t);
		this._autosize();
	}
	
	remove() {
		this.text.remove();
		this.background.remove();
	}
	
	translateTo(x, y) {
		this.position[0] = x;
		this.position[1] = y;
		
		this._position();
	}
	
	_autosize() {
		var scaleX = this.size[0];
		var scaleY = this.size[1];
		
		const tSize = this.text.getSize();
		tSize[0] += 2*this.buttonPadding[0];
		tSize[1] += 2*this.buttonPadding[1];
		
		if (scaleX < tSize[0]) {
			scaleX = tSize[0];
		}
		if (scaleY < tSize[1]) {
			scaleY = tSize[1];
		}
		
		this.background.setScale(scaleX, scaleY);
		this.actualSize[0] = scaleX;
		this.actualSize[1] = scaleY;
		
		this._position();
	}
	
	_position() {
		var textX, textY, backX, backY;
		if (this.buttonAlign[0] == CENTERED) {
			backX = this.position[0];
		} else if (this.buttonAlign[0] == LEFT) {
			backX = this.position[0] + this.actualSize[0];
		} else if (this.buttonAlign[0] == RIGHT) {
			backX = this.position[0] - this.actualSize[0];
		} 
		if (this.buttonAlign[1] == CENTERED) {
			backY = this.position[1];
		} else if (this.buttonAlign[1] == TOP) {
			backY = this.position[1] - this.actualSize[1];
		} else if (this.buttonAlign[1] == BOTTOM) {
			backY = this.position[1] + this.actualSize[1];
		}
		
		if (this.text.align[0] == CENTERED) {
			textX = backX;
		} else if (this.text.align[0] == LEFT) {
			textX = backX - this.actualSize[0] + 2*this.buttonPadding[0];
		} else if (this.text.align[0] == RIGHT) {
			textX = backX + this.actualSize[0] - 2*this.buttonPadding[0];
		}
		
		if (this.text.align[1] == CENTERED) {
			textY = backY;
		} else if (this.text.align[1] == TOP) {
			textY = backY + this.actualSize[1] - 2*this.buttonPadding[1];
		} else if (this.text.align[1] == BOTTOM) {
			textY = backY - this.actualSize[1] + 2*this.buttonPadding[1];
		}
		
		this.text.translateTo(textX, textY);
		this.background.translateTo(backX, backY);
	}
}

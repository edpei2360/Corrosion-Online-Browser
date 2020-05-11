import {gl, mainShader, textureLoaded, textureAtlases} from "/glManager.js"

class Texture {
	constructor(slot, x, y, width, height) {
		this.slot = slot;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

function downloadImage(url, ta) {
	const image = new Image();
	image.onload = function() {ta.setImage(image);};
	image.src = url;
} 

var slot = 0;
function getTexSlot() {
	if (slot >= gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)) throw "No more texture slots";
	return slot++;
}

export class TextureAtlas {
	constructor(imgURL) {
		this.loaded = false;
		this.rendererID = gl.createTexture();
		downloadImage(imgURL, this);
	}
	
	setImage(image){
		this.texSlot = getTexSlot();
		this.width = image.width;
		this.height = image.height;
		
		gl.activeTexture(gl["TEXTURE" + this.texSlot]);
		this.bind();
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, 
			image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
		
		//TODO find best settings
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		
		//tmp TODO set uniform with shade need 1 int implementeation in shader
			mainShader.use();
			gl.uniform1i(mainShader["textures" + this.texSlot], this.texSlot); 
		//
		this.loaded = true;
		textureLoaded();
	}
	
	bind() {
		gl.bindTexture(gl.TEXTURE_2D, this.rendererID);
	}
	
	getTexture(x, y, width, height) {
		if (!this.loaded) throw "Image not loaded.";
		const multx = 0xffff/this.width;
		const multy = 0xffff/this.height;
		
		return new Texture(this.texSlot, x*multx, y*multy, width*multx, height*multy); 
	}
}

//tmp
	export var texPoop;
	export var texCircle;
//
export function generateSubTextures() {
	//tmp
		texPoop = textureAtlases[0].getTexture(0, 0, 256, 256);
		texCircle = textureAtlases[0].getTexture(256, 0, 256, 256);
	//
}

import {vertexSize, elementsPerEntity} from "/globals.js"
import {getEntity, setData} from "/glManager.js"

export class Entity {
	constructor() {
		this.vertexs = getEntity();
		
		//init data to 0's
		var vertexData = [];
		for (var i = 0; i < elementsPerEntity; i++) {
			vertexData.push(0.0);
		}
		this.setVertexs(vertexData);
	}
	
	setVertexs(data) {
		if (data.length != elementsPerEntity) throw "Data not proper len";
		setData(this.vertexs, data);
		this.vertexData = data;
	}
	
	remove() {
		throw "Not implemented";
	}
}

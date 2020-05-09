import {vertexSize, elementsPerEntity} from "/globals.js"
import {getEntity, setData, removeEntity} from "/glManager.js"

export class Entity {
	constructor() {
		getEntity(this);// sets this.vertexs and this.index
		
		//init data to 0's
		var vertexData = [];
		for (var i = 0; i < elementsPerEntity; i++) {
			vertexData.push(0.0);
		}
		this.setVertexs(vertexData);
	}
	
	setVertexs(data) {
		if (data.length != elementsPerEntity) throw "Data not proper len";
		setData(this, data);
		this.vertexData = data;
	}
	
	remove() {
		removeEntity(this);
	}
}

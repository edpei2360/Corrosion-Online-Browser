//TODO more set data options set xy, set xyz, set tex, set color
import {entitySize} from "/globals.js"
import {getEntity, setData, removeEntity} from "/glManager.js"

export class Entity {
	constructor() {
		getEntity(this);// sets this.vertexs and this.index
		
		//init data to 0's
		var vertexData = new Uint8Array(entitySize);
		this.setVertexs(vertexData);
	}
	
	setVertexs(data) {
		if (data.byteLength != entitySize) throw "Data not proper len:" + data.byteLength + " != " + entitySize;
		setData(this.vertexs, data);
		this.vertexData = data;
	}
	
	remove() {
		removeEntity(this);
	}
}

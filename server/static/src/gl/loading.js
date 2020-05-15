import {initTextures, generateSubTextures} from "./texture.js"
import {startDrawLoop} from "./draw.js"

var loadingLoop = null;
export function startLoading() {
	if (loadingLoop != null) throw "draw loop already running";
	initTextures();
	loadingLoop = setInterval(loadingScreenLoop, 0);
}

export function stopLoading() {
	generateSubTextures();
	clearInterval(loadingLoop);
	startDrawLoop();
}

function loadingScreenLoop() {
	console.log("loading");//TODO actual loading page not spaming console
}

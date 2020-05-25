//TODO keypress event handler for typing and stuff

//dictionaries key: keyCode(aka int), item function()
export const KEY_DOWN = {};
export const KEY_UP = {};

document.addEventListener('keydown', function(e) {
	if (e.keyCode in KEY_DOWN) {
		KEY_DOWN[e.keyCode]();
	}
}

document.addEventListener('keyup', function(e) {
	if (e.keyCode in KEY_UP) {
		KEY_UP[e.keyCode]();
	}
}

document.addEventListener('keypress', function(e) {

}

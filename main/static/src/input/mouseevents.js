//list of functions: function(event)
export const MOUSE_DOWN = [];
export const MOUSE_UP = [];
export const MOUSE_MOVE = [];

function onMouseMove(e) {
	for (var i in MOUSE_MOVE) {
		MOUSE_MOVE[i](e);
	}
}

function onMouseDown(e) {
	for (var i in MOUSE_MOVE) {
		MOUSE_MOVE[i](e);
	}
}

function onMouseUp(e) {
	for (var i in MOUSE_MOVE) {
		MOUSE_MOVE[i](e);
	}
}

attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMatrix;

varying lowp vec4 vertexColor;
void main() {
	gl_Position = uProjectionMatrix * aVertexPosition;
	vertexColor = aVertexColor;
}

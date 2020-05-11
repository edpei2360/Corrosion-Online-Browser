# version 300 es
in vec4 aVertexPosition;
in uint aVertexColor;
in uint aVertexCords;

uniform mat4 uProjectionMatrix;

out lowp vec4 vertexColor;
out highp vec2 texCords;
flat out int texSlot;
void main() {
	gl_Position = uProjectionMatrix * aVertexPosition;
	if (aVertexColor < uint(32)) {
		texCords = vec2(aVertexCords & uint(0xffff), aVertexCords >> 16) * (1.0/65536.0);
		texSlot = int(aVertexColor);
	} else {
		vertexColor = vec4(
			aVertexColor & uint(0xff),
			(aVertexColor >> 8) & uint(0xff),
			(aVertexColor >> 16) & uint(0xff),
			aVertexColor >> 24) * (1.0/255.0);
		texSlot = -1;
	}
}

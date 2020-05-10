# version 300 es
in vec4 aVertexPosition;
in uint aVertexColor;
in uint aVertexCords;

uniform mat4 uProjectionMatrix;

out lowp vec4 vertexColor;
out mediump vec2 texCords;
flat out int texSlot;
void main() {
	gl_Position = uProjectionMatrix * aVertexPosition;
	if (aVertexColor < uint(32)) {
		texCords = vec2(aVertexCords >> 16, aVertexCords & uint(0xffff)) * (1.0/65536.0);
		texSlot = int(aVertexCords);
	} else {
		vertexColor = vec4(
			aVertexColor >> 24,
			(aVertexColor >> 16) & uint(0xff),
			(aVertexColor >> 8) & uint(0xff),
			aVertexColor & uint(0xff)) * (1.0/255.0);
		texSlot = -1;
	}
}

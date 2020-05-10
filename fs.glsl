# version 300 es
in lowp vec4 vertexColor;
in mediump vec2 texCords;
flat in int texSlot;

uniform sampler2D textures[32];

out lowp vec4 outColor;

void main() {
	if (texSlot == -1) {
		outColor = vertexColor;
	} else {
		outColor = texture(textures[texSlot], texCords);
	}
}

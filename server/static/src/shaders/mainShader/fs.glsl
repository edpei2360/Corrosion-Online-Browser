# version 300 es
in mediump vec4 vertexColor;
in highp vec2 texCords;
flat in uint texSlot;

uniform sampler2D uTextures[32];

out mediump vec4 outColor;

void main() {
	if (texSlot >= uint(32)) {
		//use color
		outColor = vertexColor;
	} else {
		//use texture
		outColor = texture(uTextures[texSlot], texCords);
	}
	if (outColor.w < 0.5) discard;
}

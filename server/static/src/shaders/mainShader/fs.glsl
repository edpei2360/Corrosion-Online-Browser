# version 300 es
in mediump vec4 vertexColor;
in highp vec2 texCords;
flat in uint useTex;

uniform sampler2D uTexture;

out mediump vec4 outColor;

void main() {
	if (useTex == uint(0)) {
		//use color
		outColor = vertexColor;
	} else {
		//use texture
		outColor = texture(uTexture, texCords);
	}
	if (outColor.w < 0.5) discard;
}

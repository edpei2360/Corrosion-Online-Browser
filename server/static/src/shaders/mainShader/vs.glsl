# version 300 es
in highp vec2 aVertexPosition;
in highp float aZ;
in uint aData; 
in mediump vec4 aVertexColor;
in highp vec2 aTextureCords;

uniform mat4 uProjectionMatrix;
uniform mat4 uStaticMatrix;

out mediump vec4 vertexColor;
out highp vec2 texCords;
flat out uint useTex;
void main() {
	if ((aData & uint(0x1)) == uint(0)) {
		//use Texture
		texCords = aTextureCords;
		useTex = uint(1);
	} else {
		//use color
		vertexColor = aVertexColor;
		useTex = uint(0);
	}
	
	if ((aData & uint(0x2)) == uint(0)) {
		//use projection matrix
		gl_Position = uProjectionMatrix * vec4(aVertexPosition, aZ, 1);
	} else {
		//use static matrix
		gl_Position = uStaticMatrix * vec4(aVertexPosition, aZ, 1);
	}
}

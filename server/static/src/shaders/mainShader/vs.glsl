# version 300 es
in highp vec2 aVertexPosition;
in highp float aZ;
in uint aData; 
in uint aTexSlot; 
in mediump vec4 aVertexColor;
in highp vec2 aTextureCords;

uniform mat4 uProjectionMatrix;
uniform mat4 uStaticMatrix;

out mediump vec4 vertexColor;
out highp vec2 texCords;
flat out uint texSlot;
void main() {
	if ((aData & uint(0x80)) == uint(0)) {
		//use Texture
		texCords = aTextureCords;
		texSlot = aTexSlot;
	} else {
		//use color
		vertexColor = aVertexColor;
		texSlot = uint(32);
	}
	
	if ((aData & uint(0x40)) == uint(0)) {
		//use projection matrix
		gl_Position = uProjectionMatrix * vec4(aVertexPosition, aZ, 1);
	} else {
		//use static matrix
		gl_Position = uStaticMatrix * vec4(aVertexPosition, aZ, 1);//CHANGE TMP JUST FOR DEBUGGING
	}
}

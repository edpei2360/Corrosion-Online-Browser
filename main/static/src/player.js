import {Entity} from "./entity.js"
import {texPoop, texCircle} from "./gl/texture.js"

export class Player{
  constructor(x_pos_player, y_pos_player, p_vel, rotation){
    this.e = new Entity; // store entity within player
    this.e.setTexture(texCircle); // change others texture
		this.e.setZ(100); //need good value

    this.x_pos_player = x_pos_player;
    this.y_pos_player = y_pos_player;
    this.p_vel = p_vel;
    this.rotation = rotation;
  }

  draw() {
    this.e.setTexture(texCircle);
		this.e.translateTo(this.x_pos_player * 0.1,this.y_pos_player * 0.1); // * 0.1 is temp should be fixed
		this.e.sendDataToGPU();
  }


  setX(newX) {
    this.x_pos_player = newX;
  }

  getX() {
    return this.x_pos_player;
  }

  setY(newY) {
    this.y_pos_player = newY;
  }

  getY() {
    return this.y_pos_player;
  }

  setVel(newVel) {
    this.p_vel = newVel;
  }

  getVel() {
    return this.p_vel;
  }

}

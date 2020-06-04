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
    this.e.translateTo(this.x_pos_player,this.y_pos_player);
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

  setRot(newRot) {
    this.rotation = newRot;
  }

  getRot() {
    return this.rotation;
  }

  moveTo(diffX, diffY, serX, serY) {
    this.y_pos_player += diffY/10;
    this.x_pos_player += diffX/10;

    // prevent the calculations going on forever
    if(Math.abs(diffY) < 0.05) { //may need to change value so its smooth and doesnt go on forever
      this.y_pos_player = serY;
    }
    if(Math.abs(diffX) < 0.05) { //may need to change value so its smooth and doesnt go on forever
      this.x_pos_player = serX;
    }
    this.draw();
  }

}

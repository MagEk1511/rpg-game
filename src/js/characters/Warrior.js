import Player from './Player.js';
import Sword from '../weapons/Sword.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.description = 'Воин';
    this.weapon = new Sword();
  }

  takeDamage(damage) {
    if (this.life < 60 && this.getLuck() > 0.8) {
      if (this.magic > 0) {
        const dmgToMagic = Math.min(damage, this.magic);
        this.magic -= dmgToMagic;
        const remainingDamage = damage - dmgToMagic;
        if (remainingDamage > 0) {
          this.life = Math.max(0, this.life - remainingDamage);
        }
        return;
      }
    }
    super.takeDamage(damage);
  }

  checkWeapon() {
    if (this.weapon.isBroken()) {
      if (this.weapon.name === 'Меч' || this.weapon.name === 'Секира') {
        this.weapon = new Knife();
      } else if (this.weapon.name === 'Нож') {
        this.weapon = new Arm();
      }
    }
  }
}
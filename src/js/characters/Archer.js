import Player from './Player.js';
import Bow from '../weapons/Bow.js';
import Knife from '../weapons/Knife.js';
import Arm from '../weapons/Arm.js';

export default class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.description = 'Лучник';
    this.weapon = new Bow();
  }

  getDamage(distance) {
    if (distance > this.weapon.range) return 0;
    const weaponDamage = this.weapon.getDamage();
    return ((this.attack + weaponDamage) * this.getLuck() * distance) / this.weapon.range;
  }

  checkWeapon() {
    if (this.weapon.isBroken()) {
      if (this.weapon.name === 'Лук' || this.weapon.name === 'Длинный лук') {
        this.weapon = new Knife();
      } else if (this.weapon.name === 'Нож') {
        this.weapon = new Arm();
      }
    }
  }
}
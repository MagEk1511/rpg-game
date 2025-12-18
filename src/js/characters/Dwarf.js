import Warrior from './Warrior.js';
import Axe from '../weapons/Axe.js';

export default class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.description = 'Гном';
    this.weapon = new Axe();
    this._hitCounter = 0; // для подсчета ударов
  }

  takeDamage(damage) {
    this._hitCounter++;
    let actualDamage = damage;
    if (this._hitCounter % 6 === 0 && this.getLuck() > 0.5) {
      actualDamage /= 2;
    }
    super.takeDamage(actualDamage);
  }
}

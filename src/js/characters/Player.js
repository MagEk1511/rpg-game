import Arm from '../weapons/Arm.js';
import Knife from '../weapons/Knife.js';

export default class Player {
  constructor(position, name) {
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.description = 'Игрок';
    this.weapon = new Arm();
    this.position = position;
    this.name = name;
  }

  getLuck() {
    return (Math.random() * 100 + this.luck) / 100;
  }

  getDamage(distance) {
    if (!this.weapon || distance > this.weapon.range) return 0;
    const weaponDamage = this.weapon.getDamage();
    return (this.attack + weaponDamage) * this.getLuck() / distance;
  }

  takeDamage(damage) {
    this.life = Math.max(0, this.life - damage);
  }

  isDead() {
    return this.life <= 0;
  }

  moveLeft(distance) {
    const step = Math.min(distance, this.speed);
    this.position -= step;
  }

  moveRight(distance) {
    const step = Math.min(distance, this.speed);
    this.position += step;
  }

  move(distance) {
    if (distance < 0) this.moveLeft(-distance);
    else this.moveRight(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      console.log(`${this.name} заблокировал атаку!`);
    } else if (this.dodged()) {
      console.log(`${this.name} увернулся от атаки!`);
    } else {
      this.takeDamage(damage);
      console.log(`${this.name} получил урон ${damage.toFixed(2)}`);
    }
  }

  checkWeapon() {
    if (this.weapon.isBroken()) {
      if (this.weapon.name === 'Нож') {
        this.weapon = new Arm();
      } else if (this.weapon.name !== 'Рука') {
        this.weapon = new Knife();
      }
    }
  }

  getWeaponList() {
    return [new Knife(), new Arm()];
  }

  tryAttack(enemy) {
    const distance = Math.abs(this.position - enemy.position);
    if (distance > this.weapon.range) {
      console.log(`${this.name} не может достать до ${enemy.name} (расстояние: ${distance}, дальность: ${this.weapon.range})`);
      return;
    }

    const luck = this.getLuck();
    this.weapon.takeDamage(10 * luck);
    this.checkWeapon();

    const damage = this.getDamage(distance);
    
    if (this.position === enemy.position) {
      console.log(`${this.name} наносит удар вплотную ${enemy.name}!`);
      enemy.takeAttack(damage);
      enemy.position += 1;
      enemy.takeAttack(damage);
    } else {
      console.log(`${this.name} атакует ${enemy.name} с расстояния ${distance}`);
      enemy.takeAttack(damage);
    }
  }

  chooseEnemy(players) {
    const aliveEnemies = players.filter(p => p !== this && !p.isDead());
    if (!aliveEnemies.length) return null;
    return aliveEnemies.reduce((min, p) => (p.life < min.life ? p : min), aliveEnemies[0]);
  }

  moveToEnemy(enemy) {
    if (!enemy) return;
    const distance = enemy.position - this.position;
    const moveDistance = Math.sign(distance) * Math.min(Math.abs(distance), this.speed);
    this.move(moveDistance);
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);
    if (!enemy) return;
    this.moveToEnemy(enemy);
    this.tryAttack(enemy);
    this.checkWeapon();
  }
}
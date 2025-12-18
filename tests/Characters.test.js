import { 
  Player,
  Warrior,
  Archer,
  Mage,
  Dwarf,
  Crossbowman,
  Demiurge
} from '../src/js/characters/index.js';

describe('Characters', () => {
  const position = 1;
  const name = 'Test';

  describe('Player', () => {
    test('default properties', () => {
      const p = new Player(position, name);
      expect(p.life).toBe(100);
      expect(p.magic).toBe(20);
      expect(p.speed).toBe(1);
      expect(p.attack).toBe(10);
      expect(p.agility).toBe(5);
      expect(p.luck).toBe(10);
      expect(p.description).toBe('Игрок');
      expect(p.weapon).toBeDefined();
      expect(p.weapon.name).toBe('Рука');
      expect(p.position).toBe(position);
      expect(p.name).toBe(name);
    });

    test('getLuck() returns between 0.1 and 1.1', () => {
      const p = new Player(position, name);
      for (let i = 0; i < 20; i++) {
        const luck = p.getLuck();
        expect(luck).toBeGreaterThanOrEqual(0.1);
        expect(luck).toBeLessThanOrEqual(1.1);
      }
    });

    test('takeDamage and isDead works', () => {
      const p = new Player(position, name);
      p.takeDamage(50);
      expect(p.life).toBe(50);
      expect(p.isDead()).toBe(false);
      
      p.takeDamage(100);
      expect(p.life).toBe(0);
      expect(p.isDead()).toBe(true);
    });

    test('getDamage respects distance and weapon range', () => {
      const p = new Player(position, name);
      const dmg1 = p.getDamage(1);
      expect(dmg1).toBeGreaterThan(0);
      
      // Рука имеет range=1, поэтому на расстоянии 2+ урон = 0
      expect(p.getDamage(2)).toBe(0);
      expect(p.getDamage(10)).toBe(0);
    });

    test('moveLeft and moveRight respect speed', () => {
      const p = new Player(5, name);
      p.moveLeft(5);
      expect(p.position).toBe(4);
      
      p.moveRight(2);
      expect(p.position).toBe(5);
      
      p.moveRight(1);
      expect(p.position).toBe(6);
    });

    test('move() works with positive and negative distance', () => {
      const p = new Player(5, name);
      p.move(-3);
      expect(p.position).toBe(4);
      
      p.move(2);
      expect(p.position).toBe(5);
    });

    test('isAttackBlocked() returns boolean', () => {
      const p = new Player(position, name);
      const result = p.isAttackBlocked();
      expect(typeof result).toBe('boolean');
    });

    test('dodged() returns boolean', () => {
      const p = new Player(position, name);
      const result = p.dodged();
      expect(typeof result).toBe('boolean');
    });

    test('checkWeapon() handles broken weapon correctly', () => {
      const p = new Player(position, name);
      
      // Базовое оружие - Рука, она не ломается
      expect(p.weapon.name).toBe('Рука');
      expect(p.weapon.durability).toBe(Infinity);
      
      // Проверим что checkWeapon не ломает ничего для небьющегося оружия
      p.checkWeapon();
      expect(p.weapon.name).toBe('Рука');
    });
  });

  describe('Warrior', () => {
    test('default properties', () => {
      const w = new Warrior(position, name);
      expect(w.life).toBe(120);
      expect(w.speed).toBe(2);
      expect(w.description).toBe('Воин');
      expect(w.weapon.name).toBe('Меч');
    });

    test('takeDamage uses magic when life < 50% and luck > 0.8', () => {
      const w = new Warrior(1, 'Алёша Попович');
      
      w.takeDamage(50);
      expect(w.life).toBe(70);
      expect(w.magic).toBe(20);

      w.takeDamage(20);
      expect(w.life).toBe(50);
      expect(w.magic).toBe(20);

      // Теперь life < 60, мокаем высокую удачу
      jest.spyOn(w, 'getLuck').mockReturnValue(0.9);
      
      w.takeDamage(5);
      expect(w.life).toBe(50);
      expect(w.magic).toBe(15);

      w.takeDamage(7);
      expect(w.life).toBe(50);
      expect(w.magic).toBe(8);

      w.takeDamage(5);
      expect(w.life).toBe(50);
      expect(w.magic).toBe(3);

      w.takeDamage(10);
      expect(w.life).toBe(43);
      expect(w.magic).toBe(0);

      w.takeDamage(50);
      expect(w.life).toBe(0);
      expect(w.magic).toBe(0);
    });

    test('checkWeapon changes Sword -> Knife -> Arm', () => {
      const w = new Warrior(position, name);
      expect(w.weapon.name).toBe('Меч');
      
      w.weapon.durability = 0;
      w.checkWeapon();
      expect(w.weapon.name).toBe('Нож');
      
      w.weapon.durability = 0;
      w.checkWeapon();
      expect(w.weapon.name).toBe('Рука');
    });
  });

  describe('Archer', () => {
    test('default properties', () => {
      const a = new Archer(position, name);
      expect(a.life).toBe(80);
      expect(a.magic).toBe(35);
      expect(a.attack).toBe(5);
      expect(a.agility).toBe(10);
      expect(a.weapon.name).toBe('Лук');
    });

    test('getDamage uses special formula: (attack + weaponDamage) * luck * distance / weaponRange', () => {
      const a = new Archer(position, name);
      jest.spyOn(a, 'getLuck').mockReturnValue(1.0);
      
      const distance = 2;
      // Формула лучника: (attack + weaponDamage) * luck * distance / weaponRange
      // Лук: attack=10, range=3
      // (5 + 10) * 1.0 * 2 / 3 = 10
      const expectedDamage = (a.attack + a.weapon.getDamage()) * 1.0 * distance / a.weapon.range;
      const dmg = a.getDamage(distance);
      
      expect(dmg).toBeCloseTo(expectedDamage, 5);
      expect(a.getDamage(a.weapon.range + 1)).toBe(0);
    });

    test('checkWeapon changes Bow -> Knife -> Arm', () => {
      const a = new Archer(position, name);
      expect(a.weapon.name).toBe('Лук');
      
      a.weapon.durability = 0;
      a.checkWeapon();
      expect(a.weapon.name).toBe('Нож');
      
      a.weapon.durability = 0;
      a.checkWeapon();
      expect(a.weapon.name).toBe('Рука');
    });
  });

  describe('Crossbowman', () => {
    test('default properties', () => {
      const c = new Crossbowman(position, name);
      expect(c.life).toBe(85);
      expect(c.attack).toBe(8);
      expect(c.agility).toBe(20);
      expect(c.luck).toBe(15);
      expect(c.description).toBe('Арбалетчик');
      expect(c.weapon.name).toBe('Длинный лук');
      expect(c.position).toBe(position);
      expect(c.name).toBe(name);
    });

    test('getDamage works with distance', () => {
      const c = new Crossbowman(position, name);
      jest.spyOn(c, 'getLuck').mockReturnValue(1.0);
      
      const dmg = c.getDamage(2);
      expect(dmg).toBeGreaterThan(0);
      expect(c.getDamage(c.weapon.range + 1)).toBe(0);
    });

    test('takeDamage decreases life considering Mage protection', () => {
      const c = new Crossbowman(position, name);
      const lifeBefore = c.life;
      
      // Crossbowman наследуется от Archer, который наследуется от Player
      // Проверяем базовую механику урона
      jest.spyOn(c, 'isAttackBlocked').mockReturnValue(false);
      jest.spyOn(c, 'dodged').mockReturnValue(false);
      
      c.takeAttack(20);
      expect(c.life).toBe(lifeBefore - 20);
    });
  });

  describe('Mage', () => {
    test('default properties', () => {
      const m = new Mage(position, name);
      expect(m.life).toBe(70);
      expect(m.magic).toBe(100);
      expect(m.attack).toBe(5);
      expect(m.agility).toBe(8);
      expect(m.description).toBe('Маг');
      expect(m.weapon.name).toBe('Посох');
    });

    test('takeDamage reduces life by half if magic > 50', () => {
      const m = new Mage(position, name);
      
      m.takeDamage(50);
      expect(m.life).toBe(45);
      expect(m.magic).toBe(88);

      m.takeDamage(20);
      expect(m.life).toBe(35);
      expect(m.magic).toBe(76);

      m.takeDamage(10);
      expect(m.life).toBe(30);
      expect(m.magic).toBe(64);

      m.takeDamage(20);
      expect(m.life).toBe(20);
      expect(m.magic).toBe(52);

      m.takeDamage(20);
      expect(m.life).toBe(10);
      expect(m.magic).toBe(40);

      // Теперь magic <= 50, урон идет полностью
      m.takeDamage(10);
      expect(m.life).toBe(0);
      expect(m.magic).toBe(40);
    });

    test('checkWeapon changes Staff -> Knife -> Arm', () => {
      const m = new Mage(position, name);
      expect(m.weapon.name).toBe('Посох');
      
      m.weapon.durability = 0;
      m.checkWeapon();
      expect(m.weapon.name).toBe('Нож');
      
      m.weapon.durability = 0;
      m.checkWeapon();
      expect(m.weapon.name).toBe('Рука');
    });
  });

  describe('Dwarf', () => {
    test('default properties', () => {
      const d = new Dwarf(position, name);
      expect(d.life).toBe(130);
      expect(d.attack).toBe(15);
      expect(d.luck).toBe(20);
      expect(d.description).toBe('Гном');
      expect(d.weapon.name).toBe('Секира');
    });

    test('halves damage every 6th hit if luck > 0.5', () => {
      const d = new Dwarf(position, name);
      jest.spyOn(d, 'getLuck').mockReturnValue(0.6);

      const lifeBefore = d.life;
      
      // Первые 5 ударов - полный урон
      for (let i = 1; i <= 5; i++) {
        d.takeDamage(10);
      }
      expect(d.life).toBe(lifeBefore - 50);

      // 6-й удар - половина урона
      const lifeBeforeSixth = d.life;
      d.takeDamage(10);
      expect(d.life).toBe(lifeBeforeSixth - 5);
    });

    test('checkWeapon changes Axe -> Knife -> Arm', () => {
      const d = new Dwarf(position, name);
      expect(d.weapon.name).toBe('Секира');
      
      d.weapon.durability = 0;
      d.checkWeapon();
      expect(d.weapon.name).toBe('Нож');
      
      d.weapon.durability = 0;
      d.checkWeapon();
      expect(d.weapon.name).toBe('Рука');
    });
  });

  describe('Demiurge', () => {
    test('default properties', () => {
      const dm = new Demiurge(position, name);
      expect(dm.life).toBe(80);
      expect(dm.magic).toBe(120);
      expect(dm.attack).toBe(6);
      expect(dm.luck).toBe(12);
      expect(dm.description).toBe('Демиург');
      expect(dm.weapon.name).toBe('Посох Бури');
    });

    test('getDamage boosts by 1.5x if magic > 0 and luck > 0.6', () => {
      const dm = new Demiurge(position, name);
      
      let luckValue = 0.7;
      jest.spyOn(dm, 'getLuck').mockImplementation(() => luckValue);
      
      const distance = 1;
      const baseDamage = (dm.attack + dm.weapon.getDamage()) * luckValue / distance;
      const boostedDamage = baseDamage * 1.5;
      
      const dmg = dm.getDamage(distance);
      expect(dmg).toBeCloseTo(boostedDamage, 5);

      // Проверяем без буста (низкая удача)
      luckValue = 0.5;
      const dmgLowLuck = dm.getDamage(distance);
      const expectedLowLuck = (dm.attack + dm.weapon.getDamage()) * luckValue / distance;
      expect(dmgLowLuck).toBeCloseTo(expectedLowLuck, 5);
    });

    test('checkWeapon changes StormStaff -> Knife -> Arm', () => {
      const dm = new Demiurge(position, name);
      expect(dm.weapon.name).toBe('Посох Бури');
      
      dm.weapon.durability = 0;
      dm.checkWeapon();
      expect(dm.weapon.name).toBe('Нож');
      
      dm.weapon.durability = 0;
      dm.checkWeapon();
      expect(dm.weapon.name).toBe('Рука');
    });
  });

  describe('Game mechanics', () => {
    test('chooseEnemy selects enemy with lowest life', () => {
      const p1 = new Player(0, 'P1');
      const p2 = new Player(5, 'P2');
      const p3 = new Player(10, 'P3');
      
      p2.life = 30;
      p3.life = 50;
      
      const players = [p1, p2, p3];
      const enemy = p1.chooseEnemy(players);
      
      expect(enemy).toBe(p2);
    });

    test('tryAttack works within weapon range', () => {
      const w = new Warrior(0, 'W');
      const a = new Archer(1, 'A');
      
      // Мокаем методы защиты, чтобы гарантировать получение урона
      jest.spyOn(a, 'isAttackBlocked').mockReturnValue(false);
      jest.spyOn(a, 'dodged').mockReturnValue(false);
      
      const lifeBefore = a.life;
      w.tryAttack(a);
      
      expect(a.life).toBeLessThan(lifeBefore);
    });

    test('tryAttack does not work beyond weapon range', () => {
      const w = new Warrior(0, 'W');
      const a = new Archer(5, 'A');
      
      const lifeBefore = a.life;
      w.tryAttack(a);
      
      // Меч имеет range=1, расстояние=5, атака не должна пройти
      expect(a.life).toBe(lifeBefore);
    });

    test('tryAttack with double damage when positions are equal', () => {
      const w = new Warrior(0, 'W');
      const a = new Archer(0, 'A');
      
      jest.spyOn(a, 'isAttackBlocked').mockReturnValue(false);
      jest.spyOn(a, 'dodged').mockReturnValue(false);
      
      const lifeBefore = a.life;
      const posBefore = a.position;
      
      w.tryAttack(a);
      
      // Archer должен был получить двойной урон и отлететь на позицию +1
      expect(a.life).toBeLessThan(lifeBefore);
      expect(a.position).toBe(posBefore + 1);
    });
  });
});
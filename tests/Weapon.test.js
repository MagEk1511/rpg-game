import {
  Weapon,
  Arm,
  Bow,
  Sword,
  Knife,
  Staff,
  LongBow,
  Axe,
  StormStaff
} from '../src/js/weapons';

describe('Weapon base class', () => {
  test('constructor sets properties correctly', () => {
    const weapon = new Weapon('Test', 10, 100, 2);

    expect(weapon.name).toBe('Test');
    expect(weapon.attack).toBe(10);
    expect(weapon.durability).toBe(100);
    expect(weapon.initDurability).toBe(100);
    expect(weapon.range).toBe(2);
  });

  test('takeDamage reduces durability', () => {
    const weapon = new Weapon('Test', 10, 100, 2);

    weapon.takeDamage(30);
    expect(weapon.durability).toBe(70);
  });

  test('durability cannot drop below zero', () => {
    const weapon = new Weapon('Test', 10, 50, 2);

    weapon.takeDamage(100);
    expect(weapon.durability).toBe(0);
  });

  test('takeDamage does nothing for Infinity durability', () => {
    const weapon = new Weapon('Test', 10, Infinity, 1);

    weapon.takeDamage(1000);
    expect(weapon.durability).toBe(Infinity);
  });

  test('isBroken returns true when durability is zero', () => {
    const weapon = new Weapon('Test', 10, 10, 1);

    weapon.takeDamage(10);
    expect(weapon.isBroken()).toBe(true);
  });
});

describe('Weapon.getDamage()', () => {
  test('returns full attack when durability >= 30%', () => {
    const weapon = new Weapon('Test', 20, 100, 1);

    weapon.takeDamage(50); // durability = 50
    expect(weapon.getDamage()).toBe(20);
  });

  test('returns half attack when durability < 30%', () => {
    const weapon = new Weapon('Test', 20, 100, 1);

    weapon.takeDamage(80); // durability = 20
    expect(weapon.getDamage()).toBe(10);
  });

  test('returns 0 when durability is zero', () => {
    const weapon = new Weapon('Test', 20, 100, 1);

    weapon.takeDamage(200);
    expect(weapon.getDamage()).toBe(0);
  });
});

describe('Standard weapons', () => {
  test('Arm has infinite durability', () => {
    const arm = new Arm();

    expect(arm.name).toBe('Рука');
    expect(arm.attack).toBe(1);
    expect(arm.durability).toBe(Infinity);
    expect(arm.range).toBe(1);
  });

  test('Bow properties', () => {
    const bow = new Bow();

    expect(bow.attack).toBe(10);
    expect(bow.durability).toBe(200);
    expect(bow.range).toBe(3);
  });

  test('Sword takes damage correctly', () => {
    const sword = new Sword();

    sword.takeDamage(100);
    expect(sword.durability).toBe(400);
  });

  test('Knife properties', () => {
    const knife = new Knife();

    expect(knife.name).toBe('Нож');
    expect(knife.attack).toBe(5);
  });

  test('Staff range and attack', () => {
    const staff = new Staff();

    expect(staff.range).toBe(2);
    expect(staff.attack).toBe(8);
  });
});

describe('Enhanced weapons', () => {
  test('LongBow overrides attack and range', () => {
    const longBow = new LongBow();

    expect(longBow.name).toBe('Длинный лук');
    expect(longBow.attack).toBe(15);
    expect(longBow.range).toBe(4);
    expect(longBow.durability).toBe(200);
  });

  test('Axe overrides durability and attack', () => {
    const axe = new Axe();

    expect(axe.name).toBe('Секира');
    expect(axe.attack).toBe(27);
    expect(axe.durability).toBe(800);
    expect(axe.initDurability).toBe(800);
  });

  test('StormStaff overrides attack and range', () => {
    const stormStaff = new StormStaff();

    expect(stormStaff.name).toBe('Посох Бури');
    expect(stormStaff.attack).toBe(10);
    expect(stormStaff.range).toBe(3);
  });
});

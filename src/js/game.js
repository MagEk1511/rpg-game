import { 
  Warrior,
  Archer,
  Mage,
} from './characters';

export function play() {
  const combatants = [
    new Warrior(2, 'Воин'),
    new Archer(7, 'Лучник'),
    new Mage(12, 'Маг'),
  ];

  console.log('🔥 Битва начинается! 🔥');
  
  for (let round = 1; round <= 100; round++) {
    console.log(`\n=== Раунд ${round} ===`);
    
    const activeFighters = combatants.filter(c => !c.isDead());
    
    if (activeFighters.length <= 1) {
      break;
    }
    
    activeFighters.forEach(fighter => fighter.turn(combatants));
    
    combatants.forEach(character => {
      const stats = [
        `[${character.name}] ${character.description}`,
        `HP: ${character.life.toFixed(1)}`,
        `MP: ${character.magic}`,
        `Position: ${character.position}`,
        `Weapon: ${character.weapon.name} (${character.weapon.durability})`
      ].join(' — ');
      
      console.log(stats);
    });
  }
  
  const remaining = combatants.filter(c => !c.isDead());
  
  if (remaining.length === 1) {
    const winner = remaining[0];
    console.log(`\n🏆 Победитель: ${winner.name} — ${winner.description}!`);
  } else if (remaining.length > 1) {
    console.log('\n🤝 Ничья между:');
    remaining.forEach(survivor => {
      console.log(`  ${survivor.name} — ${survivor.description}`);
    });
  } else {
    console.log('\n💀 Все погибли в бою!');
  }
  
  return combatants;
}
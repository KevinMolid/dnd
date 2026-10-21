import type { CharacterClass } from "../../../types";

export const monk: CharacterClass = {
  id: "monk",
  name: "Monk",
  hitDie: 8,
  primaryAbilities: ["dex", "wis"],
  savingThrowProficiencies: ["str", "dex"],
  armorTraining: [],
  weaponProficiencies: ["simple-weapons", "martial-light"],
  toolProficiencies: [],
  skillChoice: { choose: 2, options: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] },
  startingEquipment: { choose: 1, options: [
    { id: "monk-starting-equipment-a", label: "Spear, 5 Daggers, Artisan’s Tools or Musical Instrument, Explorer’s Pack, and 11 GP", grants: [ { type: "item", id: "spear", quantity: 1 }, { type: "item", id: "dagger", quantity: 5 }, { type: "item", id: "explorers-pack", quantity: 1 }, { type: "currency", amount: 11, currency: "gp" } ] },
    { id: "monk-starting-equipment-b", label: "50 GP", grants: [{ type: "currency", amount: 50, currency: "gp" }] },
  ] },
  subclasses: [
    { id: "warrior-of-mercy", name: "Warrior of Mercy", description: "Heal allies and harm enemies with supernatural touch." },
    { id: "warrior-of-shadow", name: "Warrior of Shadow", description: "Manipulate darkness and teleport through shadows." },
    { id: "warrior-of-the-elements", name: "Warrior of the Elements", description: "Channel elemental power through martial arts." },
    { id: "warrior-of-the-open-hand", name: "Warrior of the Open Hand", description: "Control opponents with refined unarmed techniques." },
  ],
  featuresByLevel: {
    1: [
      { id: "martial-arts", name: "Martial Arts", level: 1, description: "Use Dexterity for attacks and damage with Unarmed Strikes and Monk weapons; your Martial Arts die replaces their normal damage die. You can make one Unarmed Strike as a Bonus Action after attacking with an Unarmed Strike or Monk weapon." },
      { id: "unarmored-defense", name: "Unarmored Defense", level: 1, description: "While not wearing armor or wielding a Shield, your AC equals 10 + Dexterity modifier + Wisdom modifier." },
    ],
    2: [
      { id: "monks-focus", name: "Monk’s Focus", level: 2, description: "You have Focus Points equal to your Monk level, restored on a Short or Long Rest. Flurry of Blows: spend 1 Focus Point for two Unarmed Strikes as a Bonus Action. Patient Defense: Disengage as a Bonus Action, or spend 1 Focus Point to also Dodge. Step of the Wind: Dash as a Bonus Action, or spend 1 Focus Point to also Disengage and double jump distance." },
      { id: "unarmored-movement", name: "Unarmored Movement", level: 2, description: "Your Speed increases while you wear no armor and wield no Shield." },
      { id: "uncanny-metabolism", name: "Uncanny Metabolism", level: 2, description: "When rolling Initiative, you can restore all expended Focus Points and regain Hit Points equal to your Monk level plus one roll of your Martial Arts die. Once per Long Rest." },
    ],
    3: [
      { id: "deflect-attacks", name: "Deflect Attacks", level: 3, description: "Use your Reaction to reduce Bludgeoning, Piercing, or Slashing damage from an attack that hits you; if reduced to zero, you can spend 1 Focus Point to redirect the attack." },
      { id: "monk-subclass", name: "Monk Subclass", level: 3, description: "Choose a Monk subclass; gain subclass features at levels 3, 6, 11, and 17." },
      { id: "subclass-feature-3", name: "Subclass Feature", level: 3, description: "Gain your level 3 subclass features." },
    ],
    4: [
      { id: "ability-score-improvement-4", name: "Ability Score Improvement", level: 4, description: "Choose Ability Score Improvement or another eligible feat." },
      { id: "slow-fall", name: "Slow Fall", level: 4, description: "Use your Reaction to reduce falling damage by five times your Monk level." },
    ],
    5: [
      { id: "extra-attack", name: "Extra Attack", level: 5, description: "Attack twice when taking the Attack action." },
      { id: "stunning-strike", name: "Stunning Strike", level: 5, description: "Once per turn when you hit with a Monk weapon or Unarmed Strike, spend 1 Focus Point to force a Constitution saving throw. On failure, the target is Stunned until the start of your next turn; on success, its Speed is halved and your next attack against it has Advantage until the end of your next turn." },
    ],
    6: [
      { id: "empowered-strikes", name: "Empowered Strikes", level: 6, description: "Your Unarmed Strikes can deal Force damage instead of their normal damage." },
      { id: "subclass-feature-6", name: "Subclass Feature", level: 6, description: "Gain your level 6 subclass feature." },
    ],
    7: [
      { id: "evasion", name: "Evasion", level: 7, description: "On a Dexterity saving throw for half damage, take no damage on success and half on failure, unless Incapacitated." },
      { id: "stillness-of-mind", name: "Stillness of Mind", level: 7, description: "At the end of your turn, end Charmed or Frightened on yourself." },
    ],
    8: [
      { id: "ability-score-improvement-8", name: "Ability Score Improvement", level: 8, description: "Choose Ability Score Improvement or another eligible feat." },
    ],
    9: [
      { id: "acrobatic-movement", name: "Acrobatic Movement", level: 9, description: "Move along vertical surfaces and across liquids during your turn without falling during that movement." },
    ],
    10: [
      { id: "heightened-focus", name: "Heightened Focus", level: 10, description: "Flurry of Blows makes three Unarmed Strikes; Patient Defense grants Temporary Hit Points equal to two Martial Arts dice when spending a Focus Point; Step of the Wind lets you carry a willing creature when spending a Focus Point." },
      { id: "self-restoration", name: "Self-Restoration", level: 10, description: "At the end of your turn, end Poisoned on yourself. You can also forgo food and drink without suffering Exhaustion." },
    ],
    11: [
      { id: "subclass-feature-11", name: "Subclass Feature", level: 11, description: "Gain your level 11 subclass feature." },
    ],
    12: [
      { id: "ability-score-improvement-12", name: "Ability Score Improvement", level: 12, description: "Choose Ability Score Improvement or another eligible feat." },
    ],
    13: [
      { id: "deflect-energy", name: "Deflect Energy", level: 13, description: "Deflect Attacks can also reduce damage of any type except Psychic." },
    ],
    14: [
      { id: "disciplined-survivor", name: "Disciplined Survivor", level: 14, description: "Gain proficiency in all saving throws; spend 1 Focus Point to reroll a failed saving throw." },
    ],
    15: [
      { id: "perfect-focus", name: "Perfect Focus", level: 15, description: "When rolling Initiative, if you have fewer than 4 Focus Points, regain Focus Points until you have 4." },
    ],
    16: [
      { id: "ability-score-improvement-16", name: "Ability Score Improvement", level: 16, description: "Choose Ability Score Improvement or another eligible feat." },
    ],
    17: [
      { id: "subclass-feature-17", name: "Subclass Feature", level: 17, description: "Gain your level 17 subclass feature." },
    ],
    18: [
      { id: "superior-defense", name: "Superior Defense", level: 18, description: "Spend 3 Focus Points to gain Resistance to all damage except Force for 1 minute." },
    ],
    19: [
      { id: "epic-boon", name: "Epic Boon", level: 19, description: "Choose an Epic Boon feat or another eligible feat." },
    ],
    20: [
      { id: "body-and-mind", name: "Body and Mind", level: 20, description: "Increase Dexterity and Wisdom by 4, to a maximum of 25." },
    ],
  },
};

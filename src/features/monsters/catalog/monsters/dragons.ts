import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Dragon catalog from SRD 5.2.1.
 *
 * Includes:
 * - Black, Blue, Green, Red, and White chromatic dragons
 * - Brass, Bronze, Copper, Gold, and Silver metallic dragons
 * - Wyrmling, Young, Adult, and Ancient age categories
 * - Dragon Turtle
 * - Half-Dragon
 * - Pseudodragon
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */

export const dragons: MonsterDefinition[] = [
  {
    "id": "black-dragon-wyrmling",
    "name": "Black Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Medium",
    "alignment": "Chaotic Evil",
    "armorClass": 17,
    "hp": 33,
    "hitDice": "6d8 + 6",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 30,
      "fly": 60,
      "swim": 30
    },
    "stats": {
      "str": 15,
      "dex": 14,
      "con": 13,
      "int": 10,
      "wis": 11,
      "cha": 13
    },
    "savingThrows": {
      "dex": 4,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 4
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Slashing damage plus 2 (1d4) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 11, each creature in a 15-foot-long, 5-foot-wide Line. Failure: 22 (5d8) Acid damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "young-black-dragon",
    "name": "Young Black Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 18,
    "hp": 127,
    "hitDice": "15d10 + 45",
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 19,
      "dex": 14,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 5,
      "wis": 3
    },
    "skills": {
      "Perception": 6,
      "Stealth": 5
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 16
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "7",
    "xp": 2900,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 9 (2d4 + 4) Slashing damage plus 3 (1d6) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 14, each creature in a 30-foot-long, 5-foot-wide Line. Failure: 49 (14d6) Acid damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "adult-black-dragon",
    "name": "Adult Black Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Huge",
    "alignment": "Chaotic Evil",
    "armorClass": 19,
    "hp": 195,
    "hitDice": "17d12 + 85",
    "initiative": {
      "modifier": 12,
      "score": 22
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 23,
      "dex": 14,
      "con": 21,
      "int": 14,
      "wis": 13,
      "cha": 19
    },
    "savingThrows": {
      "dex": 7,
      "wis": 6
    },
    "skills": {
      "Perception": 11,
      "Stealth": 7
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 21
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "14",
    "xp": 11500,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Acid Arrow (level 3 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 13 (2d6 + 6) Slashing damage plus 4 (1d8) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 18, each creature in a 60-foot-long, 5-foot-wide Line. Failure: 54 (12d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17, +9 to hit with spell attacks): At Will: Acid Arrow (level 3 version), Detect Magic, Fear 1/Day Each: Speak with Dead, Vitriolic Sphere"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Cloud of Insects",
        "text": "Dexterity Saving Throw: DC 17, one creature the dragon can see within 120 feet. Failure: 22 (4d10) Poison damage, and the target has Disadvantage on saving throws to maintain Concentration until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Frightful Presence",
        "text": "The dragon uses Spellcasting to cast Fear. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-black-dragon",
    "name": "Ancient Black Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Gargantuan",
    "alignment": "Chaotic Evil",
    "armorClass": 22,
    "hp": 367,
    "hitDice": "21d20 + 147",
    "initiative": {
      "modifier": 16,
      "score": 26
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 27,
      "dex": 14,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 22
    },
    "savingThrows": {
      "dex": 9,
      "wis": 9
    },
    "skills": {
      "Perception": 16,
      "Stealth": 9
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 26
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "21",
    "xp": 33000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Acid Arrow (level 4 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +15, reach 15 ft. Hit: 17 (2d8 + 8) Slashing damage plus 9 (2d8) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 22, each creature in a 90-foot-long, 10-foot-wide Line. Failure: 67 (15d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 21, +13 to hit with spell attacks): At Will: Acid Arrow (level 4 version), Detect Magic, Fear 1/Day Each: Create Undead, Speak with Dead, Vitriolic Sphere (level 5 version)"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Cloud of Insects",
        "text": "Dexterity Saving Throw: DC 21, one creature the dragon can see within 120 feet. Failure: 33 (6d10) Poison damage, and the target has Disadvantage on saving throws to maintain Concentration until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Frightful Presence",
        "text": "The dragon uses Spellcasting to cast Fear. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "blue-dragon-wyrmling",
    "name": "Blue Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Medium",
    "alignment": "Lawful Evil",
    "armorClass": 17,
    "hp": 65,
    "hitDice": "10d8 + 20",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "burrow": 15,
      "fly": 60
    },
    "stats": {
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (1d10 + 3) Slashing damage plus 3 (1d6) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 12, each creature in a 30-foot-long, 5-foot-wide Line. Failure: 21 (6d6) Lightning damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "young-blue-dragon",
    "name": "Young Blue Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Large",
    "alignment": "Lawful Evil",
    "armorClass": 18,
    "hp": 152,
    "hitDice": "16d10 + 64",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 40,
      "burrow": 20,
      "fly": 80
    },
    "stats": {
      "str": 21,
      "dex": 10,
      "con": 19,
      "int": 14,
      "wis": 13,
      "cha": 17
    },
    "savingThrows": {
      "dex": 4,
      "wis": 5
    },
    "skills": {
      "Perception": 9,
      "Stealth": 4
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 19
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "9",
    "xp": 5000,
    "proficiencyBonus": 4,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +9, reach 10 ft. Hit: 12 (2d6 + 5) Slashing damage plus 5 (1d10) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 16, each creature in a 60-foot-long, 5-foot-wide Line. Failure: 55 (10d10) Lightning damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "adult-blue-dragon",
    "name": "Adult Blue Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Huge",
    "alignment": "Lawful Evil",
    "armorClass": 19,
    "hp": 212,
    "hitDice": "17d12 + 102",
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "speed": {
      "walk": 40,
      "burrow": 30,
      "fly": 80
    },
    "stats": {
      "str": 25,
      "dex": 10,
      "con": 23,
      "int": 16,
      "wis": 15,
      "cha": 20
    },
    "savingThrows": {
      "dex": 5,
      "wis": 7
    },
    "skills": {
      "Perception": 12,
      "Stealth": 5
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 22
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "16",
    "xp": 15000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Shatter."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +12, reach 10 ft. Hit: 16 (2d8 + 7) Slashing damage plus 5 (1d10) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 19, each creature in a 90-foot-long, 5-foot-wide Line. Failure: 60 (11d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 18): At Will: Detect Magic, Invisibility, Mage Hand, Shatter 1/Day Each: Scrying, Sending"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Cloaked Flight",
        "text": "The dragon uses Spellcasting to cast Invisibility on itself, and it can fly up to half its Fly Speed. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Sonic Boom",
        "text": "The dragon uses Spellcasting to cast Shatter. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Tail Swipe",
        "text": "The dragon makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-blue-dragon",
    "name": "Ancient Blue Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Gargantuan",
    "alignment": "Lawful Evil",
    "armorClass": 22,
    "hp": 481,
    "hitDice": "26d20 + 208",
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "speed": {
      "walk": 40,
      "burrow": 40,
      "fly": 80
    },
    "stats": {
      "str": 29,
      "dex": 10,
      "con": 27,
      "int": 18,
      "wis": 17,
      "cha": 25
    },
    "savingThrows": {
      "dex": 7,
      "wis": 10
    },
    "skills": {
      "Perception": 17,
      "Stealth": 7
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 27
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "23",
    "xp": 50000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Shatter (level 3 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +16, reach 15 ft. Hit: 18 (2d8 + 9) Slashing damage plus 11 (2d10) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 23, each creature in a 120-foot-long, 10-foot-wide Line. Failure: 88 (16d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 22): At Will: Detect Magic, Invisibility, Mage Hand, Shatter (level 3 version) 1/Day Each: Scrying, Sending"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Cloaked Flight",
        "text": "The dragon uses Spellcasting to cast Invisibility on itself, and it can fly up to half its Fly Speed. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Sonic Boom",
        "text": "The dragon uses Spellcasting to cast Shatter (level 3 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Tail Swipe",
        "text": "The dragon makes one Rend attack."
      }
    ]
  },
  {
    "id": "brass-dragon-wyrmling",
    "name": "Brass Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Medium",
    "alignment": "Chaotic Good",
    "armorClass": 15,
    "hp": 22,
    "hitDice": "4d8 + 4",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "burrow": 15,
      "fly": 60
    },
    "stats": {
      "str": 15,
      "dex": 10,
      "con": 13,
      "int": 10,
      "wis": 11,
      "cha": 13
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (1d10 + 2) Slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 11, each creature in a 20-foot-long, 5-foot-wide Line. Failure: 14 (4d6) Fire damage. Success: Half damage."
      },
      {
        "name": "Sleep Breath",
        "text": "Constitution Saving Throw: DC 11, each creature in a 15-foot Cone. Failure: The target has the Incapacitated condition until the end of its next turn, at which point it repeats the save. Second Failure: The target has the Unconscious condition for 1 minute. This effect ends for the target if it takes damage or a creature within 5 feet of it takes an action to wake it."
      }
    ]
  },
  {
    "id": "young-brass-dragon",
    "name": "Young Brass Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Large",
    "alignment": "Chaotic Good",
    "armorClass": 17,
    "hp": 110,
    "hitDice": "13d10 + 39",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 40,
      "burrow": 20,
      "fly": 80
    },
    "stats": {
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 3,
      "wis": 3
    },
    "skills": {
      "Perception": 6,
      "Persuasion": 5,
      "Stealth": 3
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 16
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace two attacks with a use of Sleep Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 15 (2d10 + 4) Slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 14, each creature in a 40-foot-long, 5-foot-wide Line. Failure: 38 (11d6) Fire damage. Success: Half damage."
      },
      {
        "name": "Sleep Breath",
        "text": "Constitution Saving Throw: DC 14, each creature in a 30-foot Cone. Failure: The target has the Incapacitated condition until the end of its next turn, at which point it repeats the save. Second Failure: The target has the Unconscious condition for 1 minute. This effect ends for the target if it takes damage or a creature within 5 feet of it takes an action to wake it."
      }
    ]
  },
  {
    "id": "adult-brass-dragon",
    "name": "Adult Brass Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Huge",
    "alignment": "Chaotic Good",
    "armorClass": 18,
    "hp": 172,
    "hitDice": "15d12 + 75",
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "speed": {
      "walk": 40,
      "burrow": 30,
      "fly": 80
    },
    "stats": {
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 13,
      "cha": 17
    },
    "savingThrows": {
      "dex": 5,
      "wis": 6
    },
    "skills": {
      "History": 7,
      "Perception": 11,
      "Persuasion": 8,
      "Stealth": 5
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 21
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "13",
    "xp": 10000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Sleep Breath or (B) Spellcasting to cast Scorching Ray."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 17 (2d10 + 6) Slashing damage plus 4 (1d8) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 18, each creature in a 60-foot-long, 5-foot-wide Line. Failure: 45 (10d8) Fire damage. Success: Half damage."
      },
      {
        "name": "Sleep Breath",
        "text": "Constitution Saving Throw: DC 18, each creature in a 60-foot Cone. Failure: The target has the Incapacitated condition until the end of its next turn, at which point it repeats the save. Second Failure: The target has the Unconscious condition for 10 minutes. This effect ends for the target if it takes damage or a creature within 5 feet of it takes an action to wake it."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 16): At Will: Detect Magic, Minor Illusion, Scorching Ray, Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell), Speak with Animals 1/Day Each: Detect Thoughts, Control Weather"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Blazing Light",
        "text": "The dragon uses Spellcasting to cast Scorching Ray."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      },
      {
        "name": "Scorching Sands",
        "text": "Dexterity Saving Throw: DC 16, one creature the dragon can see within 120 feet. Failure: 27 (6d8) Fire damage, and the target’s Speed is halved until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      }
    ]
  },
  {
    "id": "ancient-brass-dragon",
    "name": "Ancient Brass Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Gargantuan",
    "alignment": "Chaotic Good",
    "armorClass": 20,
    "hp": 332,
    "hitDice": "19d20 + 133",
    "initiative": {
      "modifier": 12,
      "score": 22
    },
    "speed": {
      "walk": 40,
      "burrow": 40,
      "fly": 80
    },
    "stats": {
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 22
    },
    "savingThrows": {
      "dex": 6,
      "wis": 8
    },
    "skills": {
      "History": 9,
      "Perception": 14,
      "Persuasion": 12,
      "Stealth": 6
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 24
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "20",
    "xp": 25000,
    "proficiencyBonus": 6,
    "traits": [
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Sleep Breath or (B) Spellcasting to cast Scorching Ray (level 3 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +14, reach 15 ft. Hit: 19 (2d10 + 8) Slashing damage plus 7 (2d6) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 21, each creature in a 90-foot-long, 5-foot-wide Line. Failure: 58 (13d8) Fire damage. Success: Half damage."
      },
      {
        "name": "Sleep Breath",
        "text": "Constitution Saving Throw: DC 21, each creature in a 90-foot Cone. Failure: The target has the Incapacitated condition until the end of its next turn, at which point it repeats the save. Second Failure: The target has the Unconscious condition for 10 minutes. This effect ends for the target if it takes damage or a creature within 5 feet of it takes an action to wake it."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 20): At Will: Detect Magic, Minor Illusion, Scorching Ray (level 3 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell), Speak with Animals 1/Day Each: Control Weather, Detect Thoughts"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Blazing Light",
        "text": "The dragon uses Spellcasting to cast Scorching Ray (level 3 version)."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      },
      {
        "name": "Scorching Sands",
        "text": "Dexterity Saving Throw: DC 20, one creature the dragon can see within 120 feet. Failure: 36 (8d8) Fire damage, and the target’s Speed is halved until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn. Bronze Dragons"
      }
    ]
  },
  {
    "id": "bronze-dragon-wyrmling",
    "name": "Bronze Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Medium",
    "alignment": "Lawful Good",
    "armorClass": 15,
    "hp": 39,
    "hitDice": "6d8 + 12",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "fly": 60,
      "swim": 30
    },
    "stats": {
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (1d10 + 3) Slashing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 12, each creature in a 40-foot-long, 5-foot-wide Line. Failure: 16 (3d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Repulsion Breath",
        "text": "Strength Saving Throw: DC 12, each creature in a 30-foot Cone. Failure: The target is pushed up to 30 feet straight away from the dragon and has the Prone condition."
      }
    ]
  },
  {
    "id": "young-bronze-dragon",
    "name": "Young Bronze Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Large",
    "alignment": "Lawful Good",
    "armorClass": 17,
    "hp": 142,
    "hitDice": "15d10 + 60",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 21,
      "dex": 10,
      "con": 19,
      "int": 14,
      "wis": 13,
      "cha": 17
    },
    "savingThrows": {
      "dex": 3,
      "wis": 4
    },
    "skills": {
      "Insight": 4,
      "Perception": 7,
      "Stealth": 3
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 17
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "8",
    "xp": 3900,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Repulsion Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +8, reach 10 ft. Hit: 16 (2d10 + 5) Slashing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 15, each creature in a 60-foot-long, 5-foot-wide Line. Failure: 49 (9d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Repulsion Breath",
        "text": "Strength Saving Throw: DC 15, each creature in a 30-foot Cone. Failure: The target is pushed up to 40 feet straight away from the dragon and has the Prone condition."
      }
    ]
  },
  {
    "id": "adult-bronze-dragon",
    "name": "Adult Bronze Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Huge",
    "alignment": "Lawful Good",
    "armorClass": 18,
    "hp": 212,
    "hitDice": "17d12 + 102",
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 25,
      "dex": 10,
      "con": 23,
      "int": 16,
      "wis": 15,
      "cha": 20
    },
    "savingThrows": {
      "dex": 5,
      "wis": 7
    },
    "skills": {
      "Insight": 7,
      "Perception": 12,
      "Stealth": 5
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 22
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "15",
    "xp": 13000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Repulsion Breath or (B) Spellcasting to cast Guiding Bolt (level 2 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +12, reach 10 ft. Hit: 16 (2d8 + 7) Slashing damage plus 5 (1d10) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 19, each creature in a 90-foot-long, 5-foot-wide Line. Failure: 55 (10d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Repulsion Breath",
        "text": "Strength Saving Throw: DC 19, each creature in a 30-foot Cone. Failure: The target is pushed up to 60 feet straight away from the dragon and has the Prone condition."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17, +10 to hit with spell attacks): At Will: Detect Magic, Guiding Bolt (level 2 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell), Speak with Animals, Thaumaturgy 1/Day Each: Detect Thoughts, Water Breathing"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Guiding Light",
        "text": "The dragon uses Spellcasting to cast Guiding Bolt (level 2 version)."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      },
      {
        "name": "Thunderclap",
        "text": "Constitution Saving Throw: DC 17, each creature in a 20-foot-radius Sphere centered on a point the dragon can see within 90 feet. Failure: 10 (3d6) Thunder damage, and the target has the Deafened condition until the end of its next turn."
      }
    ]
  },
  {
    "id": "ancient-bronze-dragon",
    "name": "Ancient Bronze Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Gargantuan",
    "alignment": "Lawful Good",
    "armorClass": 22,
    "hp": 444,
    "hitDice": "24d20 + 192",
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 29,
      "dex": 10,
      "con": 27,
      "int": 18,
      "wis": 17,
      "cha": 25
    },
    "savingThrows": {
      "dex": 7,
      "wis": 10
    },
    "skills": {
      "Insight": 10,
      "Perception": 17,
      "Stealth": 7
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 27
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "22",
    "xp": 41000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Repulsion Breath or (B) Spellcasting to cast Guiding Bolt (level 2 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +16, reach 15 ft. Hit: 18 (2d8 + 9) Slashing damage plus 9 (2d8) Lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 23, each creature in a 120-foot-long, 10-foot-wide Line. Failure: 82 (15d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Repulsion Breath",
        "text": "Strength Saving Throw: DC 23, each creature in a 30-foot Cone. Failure: The target is pushed up to 60 feet straight away from the dragon and has the Prone condition."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 22, +14 to hit with spell attacks): At Will: Detect Magic, Guiding Bolt (level 2 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell), Speak with Animals, Thaumaturgy 1/Day Each: Detect Thoughts, Control Water, Scrying, Water Breathing"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Guiding Light",
        "text": "The dragon uses Spellcasting to cast Guiding Bolt (level 2 version)."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      },
      {
        "name": "Thunderclap",
        "text": "Constitution Saving Throw: DC 22, each creature in a 20-foot-radius Sphere centered on a point the dragon can see within 120 feet. Failure: 13 (3d8) Thunder damage, and the target has the Deafened condition until the end of its next turn. Bugbears"
      }
    ]
  },
  {
    "id": "copper-dragon-wyrmling",
    "name": "Copper Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Medium",
    "alignment": "Chaotic Good",
    "armorClass": 16,
    "hp": 22,
    "hitDice": "4d8 + 4",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 30,
      "climb": 30,
      "fly": 60
    },
    "stats": {
      "str": 15,
      "dex": 12,
      "con": 13,
      "int": 14,
      "wis": 11,
      "cha": 13
    },
    "savingThrows": {
      "dex": 3,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 3
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (1d10 + 2) Slashing damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 11, each creature in a 20-foot-long, 5-foot-wide Line. Failure: 18 (4d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Slowing Breath",
        "text": "Constitution Saving Throw: DC 11, each creature in a 15-foot Cone. Failure: The target can’t take Reactions; its Speed is halved; and it can take either an action or a Bonus Action on its turn, not both. This effect lasts until the end of its next turn."
      }
    ]
  },
  {
    "id": "young-copper-dragon",
    "name": "Young Copper Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Large",
    "alignment": "Chaotic Good",
    "armorClass": 17,
    "hp": 119,
    "hitDice": "14d10 + 42",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 19,
      "dex": 12,
      "con": 17,
      "int": 16,
      "wis": 13,
      "cha": 15
    },
    "savingThrows": {
      "dex": 4,
      "wis": 4
    },
    "skills": {
      "Deception": 5,
      "Perception": 7,
      "Stealth": 4
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 17
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "7",
    "xp": 2900,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Slowing Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 15 (2d10 + 4) Slashing damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 14, each creature in a 40-foot-long, 5-foot-wide Line. Failure: 40 (9d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Slowing Breath",
        "text": "Constitution Saving Throw: DC 14, each creature in a 30-foot Cone. Failure: The target can’t take Reactions; its Speed is halved; and it can take either an action or a Bonus Action on its turn, not both. This effect lasts until the end of its next turn."
      }
    ]
  },
  {
    "id": "adult-copper-dragon",
    "name": "Adult Copper Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Huge",
    "alignment": "Chaotic Good",
    "armorClass": 18,
    "hp": 184,
    "hitDice": "16d12 + 80",
    "initiative": {
      "modifier": 11,
      "score": 21
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 23,
      "dex": 12,
      "con": 21,
      "int": 18,
      "wis": 15,
      "cha": 18
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7
    },
    "skills": {
      "Deception": 9,
      "Perception": 12,
      "Stealth": 6
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 22
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "14",
    "xp": 11500,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Slowing Breath or (B) Spellcasting to cast Mind Spike (level 4 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 17 (2d10 + 6) Slashing damage plus 4 (1d8) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 18, each creature in an 60-foot-long, 5-foot-wide Line. Failure: 54 (12d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Slowing Breath",
        "text": "Constitution Saving Throw: DC 18, each creature in a 60-foot Cone. Failure: The target can’t take Reactions; its Speed is halved; and it can take either an action or a Bonus Action on its turn, not both. This effect lasts until the end of its next turn."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17): At Will: Detect Magic, Mind Spike (level 4 version), Minor Illusion, Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Greater Restoration, Major Image"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Giggling Magic",
        "text": "Charisma Saving Throw: DC 17, one creature the dragon can see within 90 feet. Failure: 24 (7d6) Psychic damage. Until the end of its next turn, the target rolls 1d6 whenever it makes an ability check or attack roll and subtracts the number rolled from the D20 Test. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Mind Jolt",
        "text": "The dragon uses Spellcasting to cast Mind Spike (level 4 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-copper-dragon",
    "name": "Ancient Copper Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Gargantuan",
    "alignment": "Chaotic Good",
    "armorClass": 21,
    "hp": 367,
    "hitDice": "21d20 + 147",
    "initiative": {
      "modifier": 15,
      "score": 25
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 27,
      "dex": 12,
      "con": 25,
      "int": 20,
      "wis": 17,
      "cha": 22
    },
    "savingThrows": {
      "dex": 8,
      "wis": 10
    },
    "skills": {
      "Deception": 13,
      "Perception": 17,
      "Stealth": 8
    },
    "damageImmunities": [
      "Acid"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 27
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "21",
    "xp": 33000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Slowing Breath or (B) Spellcasting to cast Mind Spike (level 5 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +15, reach 15 ft. Hit: 19 (2d10 + 8) Slashing damage plus 9 (2d8) Acid damage."
      },
      {
        "name": "Acid Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 22, each creature in an 90-foot-long, 10-foot-wide Line. Failure: 63 (14d8) Acid damage. Success: Half damage."
      },
      {
        "name": "Slowing Breath",
        "text": "Constitution Saving Throw: DC 22, each creature in a 90-foot Cone. Failure: The target can’t take Reactions; its Speed is halved; and it can take either an action or a Bonus Action on its turn, not both. This effect lasts until the end of its next turn."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 21): At Will: Detect Magic, Mind Spike (level 5 version), Minor Illusion, Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Greater Restoration, Major Image, Project Image"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Giggling Magic",
        "text": "Charisma Saving Throw: DC 21, one creature the dragon can see within 120 feet. Failure: 31 (9d6) Psychic damage. Until the end of its next turn, the target rolls 1d8 whenever it makes an ability check or attack roll and subtracts the number rolled from the D20 Test. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Mind Jolt",
        "text": "The dragon uses Spellcasting to cast Mind Spike (level 5 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "gold-dragon-wyrmling",
    "name": "Gold Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Medium",
    "alignment": "Lawful Good",
    "armorClass": 17,
    "hp": 60,
    "hitDice": "8d8 + 24",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 30,
      "fly": 60,
      "swim": 30
    },
    "stats": {
      "str": 19,
      "dex": 14,
      "con": 17,
      "int": 14,
      "wis": 11,
      "cha": 16
    },
    "savingThrows": {
      "dex": 4,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 4
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 9 (1d10 + 4) Slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 13, each creature in a 15-foot Cone. Failure: 22 (4d10) Fire damage. Success: Half damage."
      },
      {
        "name": "Weakening Breath",
        "text": "Strength Saving Throw: DC 13, each creature that isn’t currently affected by this breath in a 15-foot Cone. Failure: The target has Disadvantage on Strength-based D20 Tests and subtracts 2 (1d4) from its damage rolls. It repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ]
  },
  {
    "id": "young-gold-dragon",
    "name": "Young Gold Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Large",
    "alignment": "Lawful Good",
    "armorClass": 18,
    "hp": 178,
    "hitDice": "17d10 + 85",
    "initiative": {
      "modifier": 6,
      "score": 16
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 23,
      "dex": 14,
      "con": 21,
      "int": 16,
      "wis": 13,
      "cha": 20
    },
    "savingThrows": {
      "dex": 6,
      "wis": 5
    },
    "skills": {
      "Insight": 5,
      "Perception": 9,
      "Persuasion": 9,
      "Stealth": 6
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 19
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "10",
    "xp": 5900,
    "proficiencyBonus": 4,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Weakening Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +10, reach 10 ft. Hit: 17 (2d10 + 6) Slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 17, each creature in a 30-foot Cone. Failure: 55 (10d10) Fire damage. Success: Half damage."
      },
      {
        "name": "Weakening Breath",
        "text": "Strength Saving Throw: DC 17, each creature that isn’t currently affected by this breath in a 30-foot Cone. Failure: The target has Disadvantage on Strength-based D20 Tests and subtracts 3 (1d6) from its damage rolls. It repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ]
  },
  {
    "id": "adult-gold-dragon",
    "name": "Adult Gold Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Huge",
    "alignment": "Lawful Good",
    "armorClass": 19,
    "hp": 243,
    "hitDice": "18d12 + 126",
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 27,
      "dex": 14,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 24
    },
    "savingThrows": {
      "dex": 8,
      "wis": 8
    },
    "skills": {
      "Insight": 8,
      "Perception": 14,
      "Persuasion": 13,
      "Stealth": 8
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 24
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "17",
    "xp": 18000,
    "proficiencyBonus": 6,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Spellcasting to cast Guiding Bolt (level 2 version) or (B) Weakening Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +14, reach 10 ft. Hit: 17 (2d8 + 8) Slashing damage plus 4 (1d8) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 21, each creature in a 60-foot Cone. Failure: 66 (12d10) Fire damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 21, +13 to hit with spell attacks): At Will: Detect Magic, Guiding Bolt (level 2 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Flame Strike, Zone of Truth"
      },
      {
        "name": "Weakening Breath",
        "text": "Strength Saving Throw: DC 21, each creature that isn’t currently affected by this breath in a 60-foot Cone. Failure: The target has Disadvantage on Strength-based D20 Tests and subtracts 3 (1d6) from its damage rolls. It repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Banish",
        "text": "Charisma Saving Throw: DC 21, one creature the dragon can see within 120 feet. Failure: 10 (3d6) Force damage, and the target has the Incapacitated condition and is transported to a harmless demiplane until the start of the dragon’s next turn, at which point it re­ appears in an unoccupied space of the dragon’s choice within 120 feet of the dragon. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Guiding Light",
        "text": "The dragon uses Spellcasting to cast Guiding Bolt (level 2 version)."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-gold-dragon",
    "name": "Ancient Gold Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Gargantuan",
    "alignment": "Lawful Good",
    "armorClass": 22,
    "hp": 546,
    "hitDice": "28d20 + 252",
    "initiative": {
      "modifier": 16,
      "score": 26
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 30,
      "dex": 14,
      "con": 29,
      "int": 18,
      "wis": 17,
      "cha": 28
    },
    "savingThrows": {
      "dex": 9,
      "wis": 10
    },
    "skills": {
      "Insight": 10,
      "Perception": 17,
      "Persuasion": 16,
      "Stealth": 9
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 27
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "24",
    "xp": 62000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Spellcasting to cast Guiding Bolt (level 4 version) or (B) Weakening Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +17 to hit, reach 15 ft. Hit: 19 (2d8 + 10) Slashing damage plus 9 (2d8) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 24, each creature in a 90-foot Cone. Failure: 71 (13d10) Fire damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 24, +16 to hit with spell attacks): At Will: Detect Magic, Guiding Bolt (level 4 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Flame Strike (level 6 version), Word of Recall, Zone of Truth"
      },
      {
        "name": "Weakening Breath",
        "text": "Strength Saving Throw: DC 24, each creature that isn’t currently affected by this breath in a 90-foot Cone. Failure: The target has Disadvantage on Strength-based D20 Tests and subtracts 5 (1d10) from its damage rolls. It repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Banish",
        "text": "Charisma Saving Throw: DC 24, one creature the dragon can see within 120 feet. Failure: 24 (7d6) Force damage, and the target has the Incapacitated condition and is transported to a harmless demiplane until the start of the dragon’s next turn, at which point it reappears in an unoccupied space of the dragon’s choice within 120 feet of the dragon. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Guiding Light",
        "text": "The dragon uses Spellcasting to cast Guiding Bolt (level 4 version)."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "green-dragon-wyrmling",
    "name": "Green Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Medium",
    "alignment": "Lawful Evil",
    "armorClass": 17,
    "hp": 38,
    "hitDice": "7d8 + 7",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 30,
      "fly": 60,
      "swim": 30
    },
    "stats": {
      "str": 15,
      "dex": 12,
      "con": 13,
      "int": 14,
      "wis": 11,
      "cha": 13
    },
    "savingThrows": {
      "dex": 3,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 3
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Poisoned"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (1d10 + 2) Slashing damage plus 3 (1d6) Poison damage."
      },
      {
        "name": "Poison Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 11, each creature in a 15-foot Cone. Failure: 21 (6d6) Poison damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "young-green-dragon",
    "name": "Young Green Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Large",
    "alignment": "Lawful Evil",
    "armorClass": 18,
    "hp": 136,
    "hitDice": "16d10 + 48",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 19,
      "dex": 12,
      "con": 17,
      "int": 16,
      "wis": 13,
      "cha": 15
    },
    "savingThrows": {
      "dex": 4,
      "wis": 4
    },
    "skills": {
      "Deception": 5,
      "Perception": 7,
      "Stealth": 4
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Poisoned"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 17
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "8",
    "xp": 3900,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 11 (2d6 + 4) Slashing damage plus 7 (2d6) Poison damage."
      },
      {
        "name": "Poison Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 14, each creature in a 30-foot Cone. Failure: 42 (12d6) Poison damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "adult-green-dragon",
    "name": "Adult Green Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Huge",
    "alignment": "Lawful Evil",
    "armorClass": 19,
    "hp": 207,
    "hitDice": "18d12 + 90",
    "initiative": {
      "modifier": 11,
      "score": 21
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 23,
      "dex": 12,
      "con": 21,
      "int": 18,
      "wis": 15,
      "cha": 18
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7
    },
    "skills": {
      "Deception": 9,
      "Perception": 12,
      "Persuasion": 9,
      "Stealth": 6
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Poisoned"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 22
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "15",
    "xp": 13000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Mind Spike (level 3 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 15 (2d8 + 6) Slashing damage plus 7 (2d6) Poison damage."
      },
      {
        "name": "Poison Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 18, each creature in a 60-foot Cone. Failure: 56 (16d6) Poison damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17): At Will: Detect Magic, Mind Spike (level 3 version) 1/Day: Geas"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Mind Invasion",
        "text": "The dragon uses Spellcasting to cast Mind Spike (level 3 version)."
      },
      {
        "name": "Noxious Miasma",
        "text": "Constitution Saving Throw: DC 17, each creature in a 20-foot-radius Sphere centered on a point the dragon can see within 90 feet. Failure: 7 (2d6) Poison damage, and the target takes a -2 penalty to AC until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-green-dragon",
    "name": "Ancient Green Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Gargantuan",
    "alignment": "Lawful Evil",
    "armorClass": 21,
    "hp": 402,
    "hitDice": "23d20 + 161",
    "initiative": {
      "modifier": 15,
      "score": 25
    },
    "speed": {
      "walk": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 27,
      "dex": 12,
      "con": 25,
      "int": 20,
      "wis": 17,
      "cha": 22
    },
    "savingThrows": {
      "dex": 8,
      "wis": 10
    },
    "skills": {
      "Deception": 13,
      "Perception": 17,
      "Persuasion": 13,
      "Stealth": 8
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Poisoned"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 27
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "22",
    "xp": 41000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Mind Spike (level 5 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +15, reach 15 ft. Hit: 17 (2d8 + 8) Slashing damage plus 10 (3d6) Poison damage."
      },
      {
        "name": "Poison Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 22, each creature in a 90-foot Cone. Failure: 77 (22d6) Poison damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 21): At Will: Detect Magic, Mind Spike (level 5 version) 1/Day Each: Geas, Modify Memory"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Mind Invasion",
        "text": "The dragon uses Spellcasting to cast Mind Spike (level 5 version)."
      },
      {
        "name": "Noxious Miasma",
        "text": "Constitution Saving Throw: DC 21, each creature in a 30-foot-radius Sphere centered on a point the dragon can see within 90 feet. Failure: 17 (5d6) Poison damage, and the target takes a -2 penalty to AC until the end of its next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "red-dragon-wyrmling",
    "name": "Red Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Medium",
    "alignment": "Chaotic Evil",
    "armorClass": 17,
    "hp": 75,
    "hitDice": "10d8 + 30",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "climb": 30,
      "fly": 60
    },
    "stats": {
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "4",
    "xp": 1100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 9 (1d10 + 4) Slashing damage plus 3 (1d6) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 13, each creature in a 15-foot Cone. Failure: 24 (7d6) Fire damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "young-red-dragon",
    "name": "Young Red Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 18,
    "hp": 178,
    "hitDice": "17d10 + 85",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 11,
      "cha": 19
    },
    "savingThrows": {
      "dex": 4,
      "wis": 4
    },
    "skills": {
      "Perception": 8,
      "Stealth": 4
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 18
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "10",
    "xp": 5900,
    "proficiencyBonus": 4,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +10, reach 10 ft. Hit: 13 (2d6 + 6) Slashing damage plus 3 (1d6) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 17, each creature in a 30-foot Cone. Failure: 56 (16d6) Fire damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "adult-red-dragon",
    "name": "Adult Red Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Huge",
    "alignment": "Chaotic Evil",
    "armorClass": 19,
    "hp": 256,
    "hitDice": "19d12 + 133",
    "initiative": {
      "modifier": 12,
      "score": 22
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 13,
      "cha": 23
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7
    },
    "skills": {
      "Perception": 13,
      "Stealth": 6
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 23
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "17",
    "xp": 18000,
    "proficiencyBonus": 6,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Scorching Ray."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +14, reach 10 ft. Hit: 13 (1d10 + 8) Slashing damage plus 5 (2d4) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 21, each creature in a 60-foot Cone. Failure: 59 (17d6) Fire damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 20, +12 to hit with spell attacks): At Will: Command (level 2 version), Detect Magic, Scorching Ray 1/Day: Fireball"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Commanding Presence",
        "text": "The dragon uses Spellcasting to cast Command (level 2 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Fiery Rays",
        "text": "The dragon uses Spellcasting to cast Scorching Ray. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-red-dragon",
    "name": "Ancient Red Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Gargantuan",
    "alignment": "Chaotic Evil",
    "armorClass": 22,
    "hp": 507,
    "hitDice": "26d20 + 234",
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "speed": {
      "walk": 40,
      "climb": 40,
      "fly": 80
    },
    "stats": {
      "str": 30,
      "dex": 10,
      "con": 29,
      "int": 18,
      "wis": 15,
      "cha": 27
    },
    "savingThrows": {
      "dex": 7,
      "wis": 9
    },
    "skills": {
      "Perception": 16,
      "Stealth": 7
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 26
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "24",
    "xp": 62000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Spellcasting to cast Scorching Ray (level 3 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +17, reach 15 ft. Hit: 19 (2d8 + 10) Slashing damage plus 10 (3d6) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 24, each creature in a 90-foot Cone. Failure: 91 (26d6) Fire damage. Success: Half damage."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 23, +15 to hit with spell attacks): At Will: Command (level 2 version), Detect Magic, Scorching Ray (level 3 version) 1/Day Each: Fireball (level 6 version), Scrying"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Commanding Presence",
        "text": "The dragon uses Spellcasting to cast Command (level 2 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Fiery Rays",
        "text": "The dragon uses Spellcasting to cast Scorching Ray (level 3 version). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "silver-dragon-wyrmling",
    "name": "Silver Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Medium",
    "alignment": "Lawful Good",
    "armorClass": 17,
    "hp": 45,
    "hitDice": "6d8 + 18",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "fly": 60
    },
    "stats": {
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 9 (1d10 + 4) Piercing damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 13, each creature in a 15-foot Cone. Failure: 18 (4d8) Cold damage. Success: Half damage."
      },
      {
        "name": "Paralyzing Breath",
        "text": "Constitution Saving Throw: DC 13, each creature in a 15-foot Cone. First Failure: The target has the Incapacitated condition until the end of its next turn, when it repeats the save. Second Failure: The target has the Paralyzed condition, and it repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ]
  },
  {
    "id": "young-silver-dragon",
    "name": "Young Silver Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Large",
    "alignment": "Lawful Good",
    "armorClass": 18,
    "hp": 168,
    "hitDice": "16d10 + 80",
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "speed": {
      "walk": 40,
      "fly": 80
    },
    "stats": {
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 11,
      "cha": 19
    },
    "savingThrows": {
      "dex": 4,
      "wis": 4
    },
    "skills": {
      "History": 6,
      "Perception": 8,
      "Stealth": 4
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 18
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "9",
    "xp": 5000,
    "proficiencyBonus": 4,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of Paralyzing Breath."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +10, reach 10 ft. Hit: 15 (2d8 + 6) Slashing damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 17, each creature in a 30-foot Cone. Failure: 49 (11d8) Cold damage. Success: Half damage."
      },
      {
        "name": "Paralyzing Breath",
        "text": "Constitution Saving Throw: DC 17, each creature in a 30-foot Cone. First Failure: The target has the Incapacitated condition until the end of its next turn, when it repeats the save. Second Failure: The target has the Paralyzed condition, and it repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ]
  },
  {
    "id": "adult-silver-dragon",
    "name": "Adult Silver Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Huge",
    "alignment": "Lawful Good",
    "armorClass": 19,
    "hp": 216,
    "hitDice": "16d12 + 112",
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "speed": {
      "walk": 40,
      "fly": 80
    },
    "stats": {
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 13,
      "cha": 22
    },
    "savingThrows": {
      "dex": 5,
      "wis": 6
    },
    "skills": {
      "History": 8,
      "Perception": 11,
      "Stealth": 5
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 21
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "16",
    "xp": 15000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Paralyzing Breath or (B) Spellcasting to cast Ice Knife."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +13, reach 10 ft. Hit: 17 (2d8 + 8) Slashing damage plus 4 (1d8) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 20, each creature in a 60-foot Cone. Failure: 54 (12d8) Cold damage. Success: Half damage."
      },
      {
        "name": "Paralyzing Breath",
        "text": "Constitution Saving Throw: DC 20, each creature in a 60-foot Cone. First Failure: The target has the Incapacitated condition until the end of its next turn, when it repeats the save. Second Failure: The target has the Paralyzed condition, and it repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 19, +11 to hit with spell attacks): At Will: Detect Magic, Hold Monster, Ice Knife, Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Ice Storm (level 5 version), Zone of Truth"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Chill",
        "text": "The dragon uses Spellcasting to cast Hold Monster. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Cold Gale",
        "text": "Dexterity Saving Throw: DC 19, each creature in a 60-foot-long, 10-foot-wide Line. Failure: 14 (4d6) Cold damage, and the target is pushed up to 30 feet straight away from the dragon. Success: Half damage only. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-silver-dragon",
    "name": "Ancient Silver Dragon",
    "type": "Dragon",
    "subtype": "Metallic",
    "size": "Gargantuan",
    "alignment": "Lawful Good",
    "armorClass": 22,
    "hp": 468,
    "hitDice": "24d20 + 216",
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "speed": {
      "walk": 40,
      "fly": 80
    },
    "stats": {
      "str": 30,
      "dex": 10,
      "con": 29,
      "int": 18,
      "wis": 15,
      "cha": 26
    },
    "savingThrows": {
      "dex": 7,
      "wis": 9
    },
    "skills": {
      "History": 11,
      "Perception": 16,
      "Stealth": 7
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 26
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "23",
    "xp": 50000,
    "proficiencyBonus": 7,
    "traits": [
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks. It can replace one attack with a use of (A) Paralyzing Breath or (B) Spellcasting to cast Ice Knife (level 2 version)."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +17, reach 15 ft. Hit: 19 (2d8 + 10) Slashing damage plus 9 (2d8) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 24, each creature in a 90-foot Cone. Failure: 67 (15d8) Cold damage. Success: Half damage."
      },
      {
        "name": "Paralyzing Breath",
        "text": "Constitution Saving Throw: DC 24, each creature in a 90-foot Cone. First Failure: The target has the Incapacitated condition until the end of its next turn, when it repeats the save. Second Failure: The target has the Paralyzed condition, and it repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      },
      {
        "name": "Spellcasting",
        "text": "The dragon casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 23, +15 to hit with spell attacks): At Will: Detect Magic, Hold Monster, Ice Knife (level 2 version), Shapechange (Beast or Humanoid form only, no Temporary Hit Points gained from the spell, and no Concentration or Temporary Hit Points required to maintain the spell) 1/Day Each: Control Weather, Ice Storm (level 7 version), Teleport, Zone of Truth"
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Chill",
        "text": "The dragon uses Spellcasting to cast Hold Monster. The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Cold Gale",
        "text": "Dexterity Saving Throw: DC 23, each creature in a 60-foot-long, 10-foot-wide Line. Failure: 14 (4d6) Cold damage, and the target is pushed up to 30 feet straight away from the dragon. Success: Half damage only. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack. Skeletons"
      }
    ]
  },
  {
    "id": "white-dragon-wyrmling",
    "name": "White Dragon Wyrmling",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Medium",
    "alignment": "Chaotic Evil",
    "armorClass": 16,
    "hp": 32,
    "hitDice": "5d8 + 10",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "burrow": 15,
      "fly": 60,
      "swim": 30
    },
    "stats": {
      "str": 14,
      "dex": 10,
      "con": 14,
      "int": 5,
      "wis": 10,
      "cha": 11
    },
    "savingThrows": {
      "dex": 2,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Stealth": 2
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Ice Walk",
        "text": "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, Difficult Terrain composed of ice or snow doesn’t cost it extra movement."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 6 (1d8 + 2) Slashing damage plus 2 (1d4) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 12, each creature in a 15-foot Cone. Failure: 22 (5d8) Cold damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "young-white-dragon",
    "name": "Young White Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 17,
    "hp": 123,
    "hitDice": "13d10 + 52",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 40,
      "burrow": 20,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 18,
      "dex": 10,
      "con": 18,
      "int": 6,
      "wis": 11,
      "cha": 12
    },
    "savingThrows": {
      "dex": 3,
      "wis": 3
    },
    "skills": {
      "Perception": 6,
      "Stealth": 3
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 30,
      "darkvision": 120,
      "passivePerception": 16
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Ice Walk",
        "text": "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, Difficult Terrain composed of ice or snow doesn’t cost it extra movement."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 9 (2d4 + 4) Slashing damage plus 2 (1d4) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 15, each creature in a 30-foot Cone. Failure: 40 (9d8) Cold damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "adult-white-dragon",
    "name": "Adult White Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Huge",
    "alignment": "Chaotic Evil",
    "armorClass": 18,
    "hp": 200,
    "hitDice": "16d12 + 96",
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "speed": {
      "walk": 40,
      "burrow": 30,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 22,
      "dex": 10,
      "con": 22,
      "int": 8,
      "wis": 12,
      "cha": 12
    },
    "savingThrows": {
      "dex": 5,
      "wis": 6
    },
    "skills": {
      "Perception": 11,
      "Stealth": 5
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 21
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "13",
    "xp": 10000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Ice Walk",
        "text": "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, Difficult Terrain composed of ice or snow doesn’t cost it extra movement."
      },
      {
        "name": "Legendary Resistance (3/Day, or 4/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 13 (2d6 + 6) Slashing damage plus 4 (1d8) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 19, each creature in a 60-foot Cone. Failure: 54 (12d8) Cold damage. Success: Half damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Freezing Burst",
        "text": "Constitution Saving Throw: DC 14, each creature in a 30-foot-radius Sphere centered on a point the dragon can see within 120 feet. Failure: 7 (2d6) Cold damage, and the target’s Speed is 0 until the end of the target’s next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Frightful Presence",
        "text": "The dragon casts Fear, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 14). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "ancient-white-dragon",
    "name": "Ancient White Dragon",
    "type": "Dragon",
    "subtype": "Chromatic",
    "size": "Gargantuan",
    "alignment": "Chaotic Evil",
    "armorClass": 20,
    "hp": 333,
    "hitDice": "18d20 + 144",
    "initiative": {
      "modifier": 12,
      "score": 22
    },
    "speed": {
      "walk": 40,
      "burrow": 40,
      "fly": 80,
      "swim": 40
    },
    "stats": {
      "str": 26,
      "dex": 10,
      "con": 26,
      "int": 10,
      "wis": 13,
      "cha": 18
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7
    },
    "skills": {
      "Perception": 13,
      "Stealth": 6
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "blindsight": 60,
      "darkvision": 120,
      "passivePerception": 23
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "20",
    "xp": 25000,
    "proficiencyBonus": 6,
    "traits": [
      {
        "name": "Ice Walk",
        "text": "The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, Difficult Terrain composed of ice or snow doesn’t cost it extra movement."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +14, reach 15 ft. Hit: 17 (2d8 + 8) Slashing damage plus 7 (2d6) Cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 22, each creature in a 90-foot Cone. Failure: 63 (14d8) Cold damage. Success: Half damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Legendary Action Uses: 3 (4 in Lair)",
        "text": "Immediately after another creature’s turn, the dragon can expend a use to take one of the following actions. The dragon regains all expended uses at the start of each of its turns."
      },
      {
        "name": "Freezing Burst",
        "text": "Constitution Saving Throw: DC 20, each creature in a 30-foot-radius Sphere centered on a point the dragon can see within 120 feet. Failure: 14 (4d6) Cold damage, and the target’s Speed is 0 until the end of the target’s next turn. Failure or Success: The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Frightful Presence",
        "text": "The dragon casts Fear, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 18). The dragon can’t take this action again until the start of its next turn."
      },
      {
        "name": "Pounce",
        "text": "The dragon moves up to half its Speed, and it makes one Rend attack."
      }
    ]
  },
  {
    "id": "dragon-turtle",
    "name": "Dragon Turtle",
    "type": "Dragon",
    "size": "Gargantuan",
    "alignment": "Neutral",
    "armorClass": 20,
    "hp": 356,
    "hitDice": "23d20 + 115",
    "initiative": {
      "modifier": 6,
      "score": 16
    },
    "speed": {
      "walk": 20,
      "swim": 50
    },
    "stats": {
      "str": 25,
      "dex": 10,
      "con": 20,
      "int": 10,
      "wis": 12,
      "cha": 12
    },
    "savingThrows": {
      "con": 11,
      "wis": 7
    },
    "damageResistances": [
      "Fire"
    ],
    "senses": {
      "darkvision": 120,
      "passivePerception": 11
    },
    "languages": [
      "Draconic",
      "Primordial (Aquan)"
    ],
    "challengeRating": "17",
    "xp": 18000,
    "proficiencyBonus": 6,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The dragon makes three Bite attacks. It can replace one attack with a Tail attack."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +13, reach 15 ft. Hit: 23 (3d10 + 7) Piercing damage plus 7 (2d6) Fire damage. Being underwater doesn’t grant Resistance to this Fire damage."
      },
      {
        "name": "Tail",
        "text": "Melee Attack Roll: +13, reach 15 ft. Hit: 18 (2d10 + 7) Bludgeoning damage. If the target is a Huge or smaller creature, it has the Prone condition."
      },
      {
        "name": "Steam Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 19, each creature in a 60-foot Cone. Failure: 56 (16d6) Fire damage. Success: Half damage. Failure or Success: Being underwater doesn’t grant Resistance to this Fire damage."
      }
    ]
  },
  {
    "id": "half-dragon",
    "name": "Half-Dragon",
    "type": "Dragon",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 18,
    "hp": 105,
    "hitDice": "14d8 + 42",
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "speed": {
      "walk": 40
    },
    "stats": {
      "str": 19,
      "dex": 14,
      "con": 16,
      "int": 10,
      "wis": 15,
      "cha": 14
    },
    "savingThrows": {
      "dex": 5,
      "wis": 5
    },
    "skills": {
      "Athletics": 7,
      "Perception": 5,
      "Stealth": 5
    },
    "damageResistances": [
      "Damage type chosen for the Draconic Origin trait below"
    ],
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 15
    },
    "languages": [
      "Common",
      "Draconic"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Draconic Origin",
        "text": "The half-dragon is related to a type of dragon associated with one of the following damage types (GM’s choice): Acid, Cold, Fire, Lightning, or Poison. This choice affects other aspects of the stat block."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The half-dragon makes two Claw attacks."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 6 (1d4 + 4) Slashing damage plus 7 (2d6) damage of the type chosen for the Draconic Origin trait."
      },
      {
        "name": "Dragon’s Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 14, each creature in a 30-foot Cone. Failure: 28 (8d6) damage of the type chosen for the Draconic Origin trait. Success: Half damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Leap",
        "text": "The half-dragon jumps up to 30 feet by spending 10 feet of movement."
      }
    ]
  },
  {
    "id": "pseudodragon",
    "name": "Pseudodragon",
    "type": "Dragon",
    "size": "Tiny",
    "alignment": "Neutral Good",
    "armorClass": 14,
    "hp": 10,
    "hitDice": "3d4 + 3",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 15,
      "fly": 60
    },
    "stats": {
      "str": 6,
      "dex": 15,
      "con": 13,
      "int": 10,
      "wis": 12,
      "cha": 10
    },
    "skills": {
      "Perception": 5,
      "Stealth": 4
    },
    "senses": {
      "blindsight": 10,
      "darkvision": 60,
      "passivePerception": 15
    },
    "languages": [
      "Understands Common and Draconic but can’t speak"
    ],
    "challengeRating": "1/4",
    "xp": 50,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Magic Resistance",
        "text": "The pseudodragon has Advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The pseudodragon makes two Bite attacks."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 4 (1d4 + 2) Piercing damage."
      },
      {
        "name": "Sting",
        "text": "Constitution Saving Throw: DC 12, one creature the pseudodragon can see within 5 feet. Failure: 5 (2d4) Poison damage, and the target has the Poisoned condition for 1 hour. Failure by 5 or More: While Poisoned, the target also has the Unconscious condition, which ends early if the target takes damage or a creature within 5 feet of it takes an action to wake it."
      }
    ]
  }
];

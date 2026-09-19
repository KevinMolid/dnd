import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Humanoid catalog from SRD 5.2.1.
 *
 * SRD 5.2.1 lists these generic Humanoid stat blocks as "Medium or Small".
 * MonsterDefinition currently accepts only one MonsterSize, so `size` is
 * normalized to "Medium" here rather than changing the shared schema.
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */

export const humanoids: MonsterDefinition[] = [
  {
    "id": "assassin",
    "name": "Assassin",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 16,
    "initiative": {
      "modifier": 10,
      "score": 20
    },
    "hp": 97,
    "hitDice": "15d8 + 30",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 18,
      "con": 14,
      "int": 16,
      "wis": 11,
      "cha": 10
    },
    "savingThrows": {
      "dex": 7,
      "int": 6
    },
    "skills": {
      "Acrobatics": 7,
      "Perception": 6,
      "Stealth": 10
    },
    "damageResistances": [
      "Poison"
    ],
    "gear": [
      "Light Crossbow",
      "Shortsword",
      "Studded Leather Armor"
    ],
    "senses": {
      "passivePerception": 16
    },
    "languages": [
      "Common",
      "Thieves’ Cant"
    ],
    "challengeRating": "8",
    "xp": 3900,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Evasion",
        "text": "If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the save and only half damage if it fails. It can’t use this trait if it has the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The assassin makes three attacks, using Shortsword or Light Crossbow in any combination."
      },
      {
        "name": "Shortsword",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 7 (1d6 + 4) Piercing damage plus 17 (5d6) Poison damage, and the target has the Poisoned condition until the start of the assassin’s next turn."
      },
      {
        "name": "Light Crossbow",
        "text": "Ranged Attack Roll: +7, range 80/320 ft. Hit: 8 (1d8 + 4) Piercing damage plus 21 (6d6) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Cunning Action",
        "text": "The assassin takes the Dash, Disengage, or Hide action."
      }
    ]
  },
  {
    "id": "bandit",
    "name": "Bandit",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 11,
    "hitDice": "2d8 + 2",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 12,
      "con": 12,
      "int": 10,
      "wis": 10,
      "cha": 10
    },
    "gear": [
      "Leather Armor",
      "Light Crossbow",
      "Scimitar"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common",
      "Thieves’ Cant"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Scimitar",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 4 (1d6 + 1) Slashing damage."
      },
      {
        "name": "Light Crossbow",
        "text": "Ranged Attack Roll: +3, range 80/320 ft. Hit: 5 (1d8 + 1) Piercing damage."
      }
    ]
  },
  {
    "id": "bandit-captain",
    "name": "Bandit Captain",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 15,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 52,
    "hitDice": "8d8 + 16",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 15,
      "dex": 16,
      "con": 14,
      "int": 14,
      "wis": 11,
      "cha": 14
    },
    "savingThrows": {
      "str": 4,
      "dex": 5,
      "wis": 2
    },
    "skills": {
      "Athletics": 4,
      "Deception": 4
    },
    "gear": [
      "Pistol",
      "Scimitar",
      "Studded Leather Armor"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common",
      "Thieves’ Cant"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The bandit makes two attacks, using Scimitar and Pistol in any combination."
      },
      {
        "name": "Scimitar",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 6 (1d6 + 3) Slashing damage."
      },
      {
        "name": "Pistol",
        "text": "Ranged Attack Roll: +5, range 30/90 ft. Hit: 8 (1d10 + 3) Piercing damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "text": "Trigger: The bandit is hit by a melee attack roll while holding a weapon. Response: The bandit adds 2 to its AC against that attack, possibly causing it to miss."
      }
    ]
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 67,
    "hitDice": "9d8 + 27",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 16,
      "dex": 12,
      "con": 17,
      "int": 9,
      "wis": 11,
      "cha": 9
    },
    "gear": [
      "Greataxe",
      "Hide Armor"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Bloodied Frenzy",
        "text": "While Bloodied, the berserker has Advantage on attack rolls and saving throws."
      }
    ],
    "actions": [
      {
        "name": "Greataxe",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 9 (1d12 + 3) Slashing damage."
      }
    ]
  },
  {
    "id": "commoner",
    "name": "Commoner",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 10,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 4,
    "hitDice": "1d8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 10,
      "con": 10,
      "int": 10,
      "wis": 10,
      "cha": 10
    },
    "gear": [
      "Club"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "0",
    "xp": 10,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Training",
        "text": "The commoner has proficiency in one skill of the GM’s choice and has Advantage whenever it makes an ability check using that skill."
      }
    ],
    "actions": [
      {
        "name": "Club",
        "text": "Melee Attack Roll: +2, reach 5 ft. Hit: 2 (1d4) Bludgeoning damage."
      }
    ]
  },
  {
    "id": "cultist",
    "name": "Cultist",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 9,
    "hitDice": "2d8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 12,
      "con": 10,
      "int": 10,
      "wis": 11,
      "cha": 10
    },
    "savingThrows": {
      "wis": 2
    },
    "skills": {
      "Deception": 2,
      "Religion": 2
    },
    "gear": [
      "Leather Armor",
      "Sickle"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Ritual Sickle",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 3 (1d4 + 1) Slashing damage plus 1 Necrotic damage."
      }
    ]
  },
  {
    "id": "cultist-fanatic",
    "name": "Cultist Fanatic",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 44,
    "hitDice": "8d8 + 8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 14,
      "con": 12,
      "int": 10,
      "wis": 14,
      "cha": 13
    },
    "savingThrows": {
      "wis": 4
    },
    "skills": {
      "Deception": 3,
      "Persuasion": 3,
      "Religion": 2
    },
    "gear": [
      "Holy Symbol",
      "Leather Armor"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Pact Blade",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 6 (1d8 + 2) Slashing damage plus 7 (2d6) Necrotic damage."
      },
      {
        "name": "Spellcasting",
        "text": "The cultist casts one of the following spells, using Wisdom as the spellcasting ability (spell save DC 12, +4 to hit with spell attacks): At Will: Light, Thaumaturgy 2/Day: Command 1/Day: Hold Person"
      }
    ],
    "bonusActions": [
      {
        "name": "Spiritual Weapon (2/Day)",
        "text": "The cultist casts the Spiritual Weapon spell, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  {
    "id": "druid",
    "name": "Druid",
    "type": "Humanoid",
    "subtype": "Druid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 44,
    "hitDice": "8d8 + 8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 12,
      "con": 13,
      "int": 12,
      "wis": 16,
      "cha": 11
    },
    "skills": {
      "Medicine": 5,
      "Nature": 3,
      "Perception": 5
    },
    "gear": [
      "Studded Leather Armor"
    ],
    "senses": {
      "passivePerception": 15
    },
    "languages": [
      "Common",
      "Druidic",
      "Sylvan"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The druid makes two attacks, using Vine Staff or Verdant Wisp in any combination."
      },
      {
        "name": "Vine Staff",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Bludgeoning damage plus 2 (1d4) Poison damage."
      },
      {
        "name": "Verdant Wisp",
        "text": "Ranged Attack Roll: +5, range 90 ft. Hit: 10 (3d6) Radiant damage."
      },
      {
        "name": "Spellcasting",
        "text": "The druid casts one of the following spells, using Wisdom as the spellcasting ability (spell save DC 13): At Will: Druidcraft, Speak with Animals 2/Day Each: Entangle, Thunderwave 1/Day Each: Animal Messenger, Longstrider, Moonbeam"
      }
    ]
  },
  {
    "id": "gladiator",
    "name": "Gladiator",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 16,
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "hp": 112,
    "hitDice": "15d8 + 45",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 12,
      "cha": 15
    },
    "savingThrows": {
      "str": 7,
      "dex": 5,
      "con": 6,
      "wis": 4
    },
    "skills": {
      "Athletics": 10,
      "Performance": 5
    },
    "gear": [
      "Shield",
      "Spears (3)",
      "Studded Leather Armor"
    ],
    "senses": {
      "passivePerception": 11
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The gladiator makes three Spear attacks. It can replace one attack with a use of Shield Bash."
      },
      {
        "name": "Spear",
        "text": "Melee or Ranged Attack Roll: +7, reach 5 ft. or range 20/60 ft. Hit: 11 (2d6 + 4) Piercing damage."
      },
      {
        "name": "Shield Bash",
        "text": "Strength Saving Throw: DC 15, one creature within 5 feet that the gladiator can see. Failure: 9 (2d4 + 4) Bludgeoning damage. If the target is a Medium or smaller creature, it has the Prone condition."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "text": "Trigger: The gladiator is hit by a melee attack roll while holding a weapon. Response: The gladiator adds 3 to its AC against that attack, possibly causing it to miss."
      }
    ]
  },
  {
    "id": "guard",
    "name": "Guard",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 16,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 11,
    "hitDice": "2d8 + 2",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 13,
      "dex": 12,
      "con": 12,
      "int": 10,
      "wis": 11,
      "cha": 10
    },
    "skills": {
      "Perception": 2
    },
    "gear": [
      "Chain Shirt",
      "Shield",
      "Spear"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Spear",
        "text": "Melee or Ranged Attack Roll: +3, reach 5 ft. or range 20/60 ft. Hit: 4 (1d6 + 1) Piercing damage."
      }
    ]
  },
  {
    "id": "guard-captain",
    "name": "Guard Captain",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 18,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 75,
    "hitDice": "10d8 + 30",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 18,
      "dex": 14,
      "con": 16,
      "int": 12,
      "wis": 14,
      "cha": 13
    },
    "skills": {
      "Athletics": 6,
      "Perception": 4
    },
    "gear": [
      "Breastplate",
      "Javelins (6)",
      "Longsword",
      "Shield"
    ],
    "senses": {
      "passivePerception": 14
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "4",
    "xp": 1100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The guard makes two attacks, using Javelin or Longsword in any combination."
      },
      {
        "name": "Javelin",
        "text": "Melee or Ranged Attack Roll: +6, reach 5 ft. or range 30/120 ft. Hit: 14 (3d6 + 4) Piercing damage."
      },
      {
        "name": "Longsword",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 15 (2d10 + 4) Slashing damage."
      }
    ]
  },
  {
    "id": "knight",
    "name": "Knight",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 18,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 52,
    "hitDice": "8d8 + 16",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 16,
      "dex": 11,
      "con": 14,
      "int": 11,
      "wis": 11,
      "cha": 15
    },
    "savingThrows": {
      "con": 4,
      "wis": 2
    },
    "conditionImmunities": [
      "Frightened"
    ],
    "gear": [
      "Greatsword",
      "Heavy Crossbow",
      "Plate Armor"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The knight makes two attacks, using Greatsword or Heavy Crossbow in any combination."
      },
      {
        "name": "Greatsword",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Slashing damage plus 4 (1d8) Radiant damage."
      },
      {
        "name": "Heavy Crossbow",
        "text": "Ranged Attack Roll: +2, range 100/400 ft. Hit: 11 (2d10) Piercing damage plus 4 (1d8) Radiant damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "text": "Trigger: The knight is hit by a melee attack roll while holding a weapon. Response: The knight adds 2 to its AC against that attack, possibly causing it to miss."
      }
    ]
  },
  {
    "id": "mage",
    "name": "Mage",
    "type": "Humanoid",
    "subtype": "Wizard",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 15,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 81,
    "hitDice": "18d8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 9,
      "dex": 14,
      "con": 11,
      "int": 17,
      "wis": 12,
      "cha": 11
    },
    "savingThrows": {
      "int": 6,
      "wis": 4
    },
    "skills": {
      "Arcana": 6,
      "History": 6,
      "Perception": 4
    },
    "gear": [
      "Wand"
    ],
    "senses": {
      "passivePerception": 14
    },
    "languages": [
      "Common plus three other languages"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The mage makes three Arcane Burst attacks."
      },
      {
        "name": "Arcane Burst",
        "text": "Melee or Ranged Attack Roll: +6, reach 5 ft. or range 120 ft. Hit: 16 (3d8 + 3) Force damage."
      },
      {
        "name": "Spellcasting",
        "text": "The mage casts one of the following spells, using Intelligence as the spellcasting ability (spell save DC 14): At Will: Detect Magic, Light, Mage Armor (included in AC), Mage Hand, Prestidigitation 2/Day Each: Fireball (level 4 version), Invisibility 1/Day Each: Cone of Cold, Fly"
      }
    ],
    "bonusActions": [
      {
        "name": "Misty Step (3/Day)",
        "text": "The mage casts Misty Step, using the same spellcasting ability as Spellcasting."
      }
    ],
    "reactions": [
      {
        "name": "Protective Magic (3/Day)",
        "text": "The mage casts Counterspell or Shield in response to the spell’s trigger, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  {
    "id": "archmage",
    "name": "Archmage",
    "type": "Humanoid",
    "subtype": "Wizard",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 17,
    "initiative": {
      "modifier": 7,
      "score": 17
    },
    "hp": 170,
    "hitDice": "31d8 + 31",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 14,
      "con": 12,
      "int": 20,
      "wis": 15,
      "cha": 16
    },
    "savingThrows": {
      "int": 9,
      "wis": 6
    },
    "skills": {
      "Arcana": 13,
      "History": 9,
      "Perception": 6
    },
    "damageImmunities": [
      "Psychic"
    ],
    "conditionImmunities": [
      "Charmed (with Mind Blank)"
    ],
    "gear": [
      "Wand"
    ],
    "senses": {
      "passivePerception": 16
    },
    "languages": [
      "Common plus five other languages"
    ],
    "challengeRating": "12",
    "xp": 8000,
    "proficiencyBonus": 4,
    "traits": [
      {
        "name": "Magic Resistance",
        "text": "The archmage has Advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The archmage makes four Arcane Burst attacks."
      },
      {
        "name": "Arcane Burst",
        "text": "Melee or Ranged Attack Roll: +9, reach 5 ft. or range 150 ft. Hit: 27 (4d10 + 5) Force damage."
      },
      {
        "name": "Spellcasting",
        "text": "The archmage casts one of the following spells, using Intelligence as the spellcasting ability (spell save DC 17): At Will: Detect Magic, Detect Thoughts, Disguise Self, Invisibility, Light, Mage Armor (included in AC), Mage Hand, Prestidigitation 2/Day Each: Fly, Lightning Bolt (level 7 version) 1/Day Each: Cone of Cold (level 9 version), Mind Blank (cast before combat), Scrying, Teleport"
      }
    ],
    "bonusActions": [
      {
        "name": "Misty Step (3/Day)",
        "text": "The mage casts Misty Step, using the same spellcasting ability as Spellcasting."
      }
    ],
    "reactions": [
      {
        "name": "Protective Magic (3/Day)",
        "text": "The archmage casts Counterspell or Shield in response to the spell’s trigger, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  {
    "id": "noble",
    "name": "Noble",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 15,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 9,
    "hitDice": "2d8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 12,
      "con": 11,
      "int": 12,
      "wis": 14,
      "cha": 16
    },
    "skills": {
      "Deception": 5,
      "Insight": 4,
      "Persuasion": 5
    },
    "gear": [
      "Breastplate",
      "Rapier"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common plus two other languages"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Rapier",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 5 (1d8 + 1) Piercing damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "text": "Trigger: The noble is hit by a melee attack roll while holding a weapon. Response: The noble adds 2 to its AC against that attack, possibly causing it to miss."
      }
    ]
  },
  {
    "id": "pirate",
    "name": "Pirate",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 14,
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "hp": 33,
    "hitDice": "6d8 + 6",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 16,
      "con": 12,
      "int": 8,
      "wis": 12,
      "cha": 14
    },
    "savingThrows": {
      "dex": 5,
      "cha": 4
    },
    "gear": [
      "Daggers (6)",
      "Leather Armor"
    ],
    "senses": {
      "passivePerception": 11
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The pirate makes two Dagger attacks. It can replace one attack with a use of Enthralling Panache."
      },
      {
        "name": "Dagger",
        "text": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 20/60 ft. Hit: 5 (1d4 + 3) Piercing damage."
      },
      {
        "name": "Enthralling Panache",
        "text": "Wisdom Saving Throw: DC 12, one creature the pirate can see within 30 feet. Failure: The target has the Charmed condition until the start of the pirate’s next turn."
      }
    ]
  },
  {
    "id": "pirate-captain",
    "name": "Pirate Captain",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 17,
    "initiative": {
      "modifier": 7,
      "score": 17
    },
    "hp": 84,
    "hitDice": "13d8 + 26",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 18,
      "con": 14,
      "int": 10,
      "wis": 14,
      "cha": 17
    },
    "savingThrows": {
      "str": 3,
      "dex": 7,
      "wis": 5,
      "cha": 6
    },
    "skills": {
      "Acrobatics": 7,
      "Perception": 5
    },
    "gear": [
      "Pistol",
      "Rapier"
    ],
    "senses": {
      "passivePerception": 15
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The pirate makes three attacks, using Rapier or Pistol in any combination."
      },
      {
        "name": "Rapier",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 13 (2d8 + 4) Piercing damage, and the pirate has Advantage on the next attack roll it makes before the end of this turn."
      },
      {
        "name": "Pistol",
        "text": "Ranged Attack Roll: +7, range 30/90 ft. Hit: 15 (2d10 + 4) Piercing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Captain’s Charm",
        "text": "Wisdom Saving Throw: DC 14, one creature the pirate can see within 30 feet. Failure: The target has the Charmed condition until the start of the pirate’s next turn."
      }
    ],
    "reactions": [
      {
        "name": "Riposte",
        "text": "Trigger: The pirate is hit by a melee attack roll while holding a weapon. Response: The pirate adds 3 to its AC against that attack, possibly causing it to miss. On a miss, the pirate makes one Rapier attack against the triggering creature if within range."
      }
    ]
  },
  {
    "id": "priest-acolyte",
    "name": "Priest Acolyte",
    "type": "Humanoid",
    "subtype": "Cleric",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 11,
    "hitDice": "2d8 + 2",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 14,
      "dex": 10,
      "con": 12,
      "int": 10,
      "wis": 14,
      "cha": 11
    },
    "skills": {
      "Medicine": 4,
      "Religion": 2
    },
    "gear": [
      "Chain Shirt",
      "Holy Symbol",
      "Mace"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1/4",
    "xp": 50,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Mace",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Bludgeoning damage plus 2 (1d4) Radiant damage."
      },
      {
        "name": "Radiant Flame",
        "text": "Ranged Attack Roll: +4, range 60 ft. Hit: 7 (2d6) Radiant damage."
      },
      {
        "name": "Spellcasting",
        "text": "The priest casts one of the following spells, using Wisdom as the spellcasting ability: At Will: Light, Thaumaturgy"
      }
    ],
    "bonusActions": [
      {
        "name": "Divine Aid (1/Day)",
        "text": "The priest casts Bless, Healing Word, or Sanctuary, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  {
    "id": "priest",
    "name": "Priest",
    "type": "Humanoid",
    "subtype": "Cleric",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 38,
    "hitDice": "7d8 + 7",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 16,
      "dex": 10,
      "con": 12,
      "int": 13,
      "wis": 16,
      "cha": 13
    },
    "skills": {
      "Medicine": 7,
      "Perception": 5,
      "Religion": 5
    },
    "gear": [
      "Chain Shirt",
      "Holy Symbol",
      "Mace"
    ],
    "senses": {
      "passivePerception": 15
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The priest makes two attacks, using Mace or Radiant Flame in any combination."
      },
      {
        "name": "Mace",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 6 (1d6 + 3) Bludgeoning damage plus 5 (2d4) Radiant damage."
      },
      {
        "name": "Radiant Flame",
        "text": "Ranged Attack Roll: +5, range 60 ft. Hit: 11 (2d10) Radiant damage."
      },
      {
        "name": "Spellcasting",
        "text": "The priest casts one of the following spells, using Wisdom as the spellcasting ability (spell save DC 13): At Will: Light, Thaumaturgy 1/Day: Spirit Guardians"
      }
    ],
    "bonusActions": [
      {
        "name": "Divine Aid (3/Day)",
        "text": "The priest casts Bless, Dispel Magic, Healing Word, or Lesser Restoration, using the same spellcasting ability as Spellcasting."
      }
    ]
  },
  {
    "id": "scout",
    "name": "Scout",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 16,
    "hitDice": "3d8 + 3",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 14,
      "con": 12,
      "int": 11,
      "wis": 13,
      "cha": 11
    },
    "skills": {
      "Nature": 4,
      "Perception": 5,
      "Stealth": 6,
      "Survival": 5
    },
    "gear": [
      "Leather Armor",
      "Longbow",
      "Shortsword"
    ],
    "senses": {
      "passivePerception": 15
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The scout makes two attacks, using Shortsword and Longbow in any combination."
      },
      {
        "name": "Shortsword",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Piercing damage."
      },
      {
        "name": "Longbow",
        "text": "Ranged Attack Roll: +4, range 150/600 ft. Hit: 6 (1d8 + 2) Piercing damage."
      }
    ]
  },
  {
    "id": "spy",
    "name": "Spy",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 27,
    "hitDice": "6d8",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 10,
      "dex": 15,
      "con": 10,
      "int": 12,
      "wis": 14,
      "cha": 16
    },
    "skills": {
      "Deception": 5,
      "Insight": 4,
      "Investigation": 5,
      "Perception": 6,
      "Sleight of Hand": 4,
      "Stealth": 6
    },
    "gear": [
      "Hand Crossbow",
      "Shortsword",
      "Thieves’ Tools"
    ],
    "senses": {
      "passivePerception": 16
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Shortsword",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Piercing damage plus 7 (2d6) Poison damage."
      },
      {
        "name": "Hand Crossbow",
        "text": "Ranged Attack Roll: +4, range 30/120 ft. Hit: 5 (1d6 + 2) Piercing damage plus 7 (2d6) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Cunning Action",
        "text": "The spy takes the Dash, Disengage, or Hide action."
      }
    ]
  },
  {
    "id": "tough",
    "name": "Tough",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 32,
    "hitDice": "5d8 + 10",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 15,
      "dex": 12,
      "con": 14,
      "int": 10,
      "wis": 10,
      "cha": 11
    },
    "gear": [
      "Heavy Crossbow",
      "Leather Armor",
      "Mace"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The tough has Advantage on an attack roll against a creature if at least one of the tough’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Mace",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Bludgeoning damage."
      },
      {
        "name": "Heavy Crossbow",
        "text": "Ranged Attack Roll: +3, range 100/400 ft. Hit: 6 (1d10 + 1) Piercing damage."
      }
    ]
  },
  {
    "id": "tough-boss",
    "name": "Tough Boss",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 16,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 82,
    "hitDice": "11d8 + 33",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 17,
      "dex": 14,
      "con": 16,
      "int": 11,
      "wis": 10,
      "cha": 11
    },
    "savingThrows": {
      "str": 5,
      "con": 5,
      "cha": 2
    },
    "gear": [
      "Chain Mail",
      "Heavy Crossbow",
      "Warhammer"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "4",
    "xp": 1100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The tough has Advantage on an attack roll against a creature if at least one of the tough’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The tough makes two attacks, using Warhammer or Heavy Crossbow in any combination."
      },
      {
        "name": "Warhammer",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 12 (2d8 + 3) Bludgeoning damage. If the target is a Large or smaller creature, the tough pushes the target up to 10 feet straight away from itself."
      },
      {
        "name": "Heavy Crossbow",
        "text": "Ranged Attack Roll: +4, range 100/400 ft. Hit: 13 (2d10 + 2) Piercing damage."
      }
    ]
  },
  {
    "id": "vampire-familiar",
    "name": "Vampire Familiar",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral Evil",
    "armorClass": 15,
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "hp": 65,
    "hitDice": "10d8 + 20",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 17,
      "dex": 16,
      "con": 15,
      "int": 10,
      "wis": 10,
      "cha": 14
    },
    "savingThrows": {
      "dex": 5,
      "wis": 2
    },
    "skills": {
      "Perception": 4,
      "Persuasion": 4,
      "Stealth": 7
    },
    "damageResistances": [
      "Necrotic"
    ],
    "conditionImmunities": [
      "Charmed (except from its vampire master)"
    ],
    "gear": [
      "Daggers (10)"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Vampiric Connection",
        "text": "While the familiar and its vampire master are on the same plane of existence, the vampire can communicate with the familiar telepathically, and the vampire can perceive through the familiar’s senses."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The familiar makes two Umbral Dagger attacks."
      },
      {
        "name": "Umbral Dagger",
        "text": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 20/60 ft. Hit: 5 (1d4 + 3) Piercing damage plus 7 (3d4) Necrotic damage. If the target is reduced to 0 Hit Points by this attack, the target becomes Stable but has the Poisoned condition for 1 hour. While it has the Poisoned condition, the target has the Paralyzed condition."
      }
    ],
    "bonusActions": [
      {
        "name": "Deathless Agility",
        "text": "The familiar takes the Dash or Disengage action."
      }
    ]
  },
  {
    "id": "warrior-infantry",
    "name": "Warrior Infantry",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 13,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 9,
    "hitDice": "2d8",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 13,
      "dex": 11,
      "con": 11,
      "int": 8,
      "wis": 11,
      "cha": 8
    },
    "gear": [
      "Chain Shirt",
      "Spear"
    ],
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The warrior has Advantage on an attack roll against a creature if at least one of the warrior’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Spear",
        "text": "Melee or Ranged Attack Roll: +3, reach 5 ft. or range 20/60 ft. Hit: 4 (1d6 + 1) Piercing damage."
      }
    ]
  },
  {
    "id": "warrior-veteran",
    "name": "Warrior Veteran",
    "type": "Humanoid",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 17,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 65,
    "hitDice": "10d8 + 20",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 16,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10
    },
    "skills": {
      "Athletics": 5,
      "Perception": 2
    },
    "gear": [
      "Greatsword",
      "Heavy Crossbow",
      "Splint Armor"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common plus one other language"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The warrior makes two Greatsword or Heavy Crossbow attacks."
      },
      {
        "name": "Greatsword",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Heavy Crossbow",
        "text": "Ranged Attack Roll: +3, range 100/400 ft. Hit: 12 (2d10 + 1) Piercing damage."
      }
    ],
    "reactions": [
      {
        "name": "Parry",
        "text": "Trigger: The warrior is hit by a melee attack roll while holding a weapon. Response: The warrior adds 2 to its AC against that attack, possibly causing it to miss."
      }
    ]
  }
];

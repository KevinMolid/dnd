import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Elemental catalog from SRD 5.2.1.
 *
 * Includes all stat blocks whose creature type is Elemental:
 * Air Elemental, Azer Sentinel, Djinni, Earth Elemental, Efreeti,
 * Fire Elemental, Gargoyle, Invisible Stalker, Magmin, four Mephits,
 * Merfolk Skirmisher, Salamander, Water Elemental, and Xorn.
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */

export const elementals: MonsterDefinition[] = [
  {
    "id": "air-elemental",
    "name": "Air Elemental",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral",
    "armorClass": 15,
    "hp": 90,
    "hitDice": "12d10 + 24",
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "speed": {
      "walk": 10,
      "fly": 90,
      "hover": true
    },
    "stats": {
      "str": 14,
      "dex": 20,
      "con": 14,
      "int": 6,
      "wis": 10,
      "cha": 6
    },
    "damageResistances": [
      "Bludgeoning",
      "Lightning",
      "Piercing",
      "Slashing"
    ],
    "damageImmunities": [
      "Poison",
      "Thunder"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Grappled",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Prone",
      "Restrained",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Auran)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Air Form",
        "text": "The elemental can enter a creature’s space and stop there. It can move through a space as narrow as 1 inch without expending extra movement to do so."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The elemental makes two Thunderous Slam attacks."
      },
      {
        "name": "Thunderous Slam",
        "text": "Melee Attack Roll: +8, reach 10 ft. Hit: 14 (2d8 + 5) Thunder damage."
      }
    ]
  },
  {
    "id": "azer-sentinel",
    "name": "Azer Sentinel",
    "type": "Elemental",
    "size": "Medium",
    "alignment": "Lawful Neutral",
    "armorClass": 17,
    "hp": 39,
    "hitDice": "6d8 + 12",
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 17,
      "dex": 12,
      "con": 15,
      "int": 12,
      "wis": 13,
      "cha": 10
    },
    "savingThrows": {
      "con": 4
    },
    "damageImmunities": [
      "Fire",
      "Poison"
    ],
    "conditionImmunities": [
      "Poisoned"
    ],
    "senses": {
      "passivePerception": 11
    },
    "languages": [
      "Primordial (Ignan)"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Fire Aura",
        "text": "At the end of each of the azer’s turns, each creature of the azer’s choice in a 5-foot Emanation originating from the azer takes 5 (1d10) Fire damage unless the azer has the Incapacitated condition."
      },
      {
        "name": "Illumination",
        "text": "The azer sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet."
      }
    ],
    "actions": [
      {
        "name": "Burning Hammer",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (1d10 + 3) Bludgeoning damage plus 3 (1d6) Fire damage."
      }
    ]
  },
  {
    "id": "djinni",
    "name": "Djinni",
    "type": "Elemental",
    "size": "Large",
    "subtype": "Genie",
    "alignment": "Neutral",
    "armorClass": 17,
    "hp": 218,
    "hitDice": "19d10 + 114",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "fly": 90,
      "hover": true
    },
    "stats": {
      "str": 21,
      "dex": 15,
      "con": 22,
      "int": 15,
      "wis": 16,
      "cha": 20
    },
    "savingThrows": {
      "dex": 6,
      "wis": 7
    },
    "damageImmunities": [
      "Lightning",
      "Thunder"
    ],
    "senses": {
      "darkvision": 120,
      "passivePerception": 13
    },
    "languages": [
      "Primordial (Auran)"
    ],
    "challengeRating": "11",
    "xp": 7200,
    "proficiencyBonus": 4,
    "traits": [
      {
        "name": "Elemental Restoration",
        "text": "If the djinni dies outside the Elemental Plane of Air, its body dissolves into mist, and it gains a new body in 1d4 days, reviving with all its Hit Points somewhere on the Plane of Air."
      },
      {
        "name": "Magic Resistance",
        "text": "The djinni has Advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Wishes",
        "text": "The djinni has a 30 percent chance of knowing the Wish spell. If the djinni knows it, the djinni can cast it only on behalf of a non-genie creature who communicates a wish in a way the djinni can understand. If the djinni casts the spell for the creature, the djinni suffers none of the spell’s stress. Once the djinni has cast it three times, the djinni can’t do so again for 365 days."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The djinni makes three attacks, using Storm Blade or Storm Bolt in any combination."
      },
      {
        "name": "Storm Blade",
        "text": "Melee Attack Roll: +9, reach 5 feet. Hit: 12 (2d6 + 5) Slashing damage plus 7 (2d6) Lightning damage."
      },
      {
        "name": "Storm Bolt",
        "text": "Ranged Attack Roll: +9, range 120 feet. Hit: 13 (3d8) Thunder damage. If the target is a Large or smaller creature, it has the Prone condition."
      },
      {
        "name": "Create Whirlwind",
        "text": "The djinni conjures a whirlwind at a point it can see within 120 feet. The whirlwind fills a 20-foot-radius, 60-foot-high Cylinder centered on that point. The whirlwind lasts until the djinni’s Concentration on it ends. The djinni can move the whirlwind up to 20 feet at the start of each of its turns. Whenever the whirlwind enters a creature’s space or a creature enters the whirlwind, that creature is subjected to the following effect. Strength Saving Throw: DC 17 (a creature makes this save only once per turn, and the djinni is unaffected). Failure: While in the whirlwind, the target has the Restrained condition and moves with the whirlwind. At the start of each of its turns, the Restrained target takes 21 (6d6) Thunder damage. At the end of each of its turns, the target repeats the save, ending the effect on itself on a success."
      },
      {
        "name": "Spellcasting",
        "text": "The djinni casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17): At Will: Detect Evil and Good, Detect Magic 2/Day Each: Create Food and Water (can create wine instead of water), Tongues, Wind Walk 1/Day Each: Creation, Gaseous Form, Invisibility, Major Image, Plane Shift"
      }
    ]
  },
  {
    "id": "earth-elemental",
    "name": "Earth Elemental",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral",
    "armorClass": 17,
    "hp": 147,
    "hitDice": "14d10 + 70",
    "initiative": {
      "modifier": -1,
      "score": 9
    },
    "speed": {
      "walk": 30,
      "burrow": 30
    },
    "stats": {
      "str": 20,
      "dex": 8,
      "con": 20,
      "int": 5,
      "wis": 10,
      "cha": 5
    },
    "damageVulnerabilities": [
      "Thunder"
    ],
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "tremorsense": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Terran)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Earth Glide",
        "text": "The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn’t disturb the material it moves through."
      },
      {
        "name": "Siege Monster",
        "text": "The elemental deals double damage to objects and structures."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The elemental makes two attacks, using Slam or Rock Launch in any combination."
      },
      {
        "name": "Slam",
        "text": "Melee Attack Roll: +8, reach 10 ft. Hit: 14 (2d8 + 5) Bludgeoning damage."
      },
      {
        "name": "Rock Launch",
        "text": "Ranged Attack Roll: +8, range 60 ft. Hit: 8 (1d6 + 5) Bludgeoning damage. If the target is a Large or smaller creature, it has the Prone condition."
      }
    ]
  },
  {
    "id": "efreeti",
    "name": "Efreeti",
    "type": "Elemental",
    "size": "Large",
    "subtype": "Genie",
    "alignment": "Neutral",
    "armorClass": 17,
    "hp": 212,
    "hitDice": "17d10 + 119",
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "speed": {
      "walk": 40,
      "fly": 60,
      "hover": true
    },
    "stats": {
      "str": 22,
      "dex": 12,
      "con": 24,
      "int": 16,
      "wis": 15,
      "cha": 19
    },
    "savingThrows": {
      "wis": 6,
      "cha": 8
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "darkvision": 120,
      "passivePerception": 12
    },
    "languages": [
      "Primordial (Ignan)"
    ],
    "challengeRating": "11",
    "xp": 7200,
    "proficiencyBonus": 4,
    "traits": [
      {
        "name": "Elemental Restoration",
        "text": "If the efreeti dies outside the Elemental Plane of Fire, its body dissolves into ash, and it gains a new body in 1d4 days, reviving with all its Hit Points somewhere on the Plane of Fire."
      },
      {
        "name": "Magic Resistance",
        "text": "The efreeti has Advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Wishes",
        "text": "The efreeti has a 30 percent chance of knowing the Wish spell. If the efreeti knows it, the efreeti can cast it only on behalf of a non-genie creature who communicates a wish in a way the efreeti can understand. If the efreeti casts the spell for the creature, the efreeti suffers none of the spell’s stress. Once the efreeti has cast it three times, the efreeti can’t do so again for 365 days."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The efreeti makes three attacks, using Heated Blade or Hurl Flame in any combination."
      },
      {
        "name": "Heated Blade",
        "text": "Melee Attack Roll: +10, reach 5 ft. Hit: 13 (2d6 + 6) Slashing damage plus 13 (2d12) Fire damage."
      },
      {
        "name": "Hurl Flame",
        "text": "Ranged Attack Roll: +8, range 120 ft. Hit: 24 (7d6) Fire damage."
      },
      {
        "name": "Spellcasting",
        "text": "The efreeti casts one of the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 16): At Will: Detect Magic, Elementalism 1/Day Each: Gaseous Form, Invisibility, Major Image, Plane Shift, Tongues, Wall of Fire (level 7 version)"
      }
    ]
  },
  {
    "id": "fire-elemental",
    "name": "Fire Elemental",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral",
    "armorClass": 13,
    "hp": 93,
    "hitDice": "11d10 + 33",
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "speed": {
      "walk": 50
    },
    "stats": {
      "str": 10,
      "dex": 17,
      "con": 16,
      "int": 6,
      "wis": 10,
      "cha": 7
    },
    "damageResistances": [
      "Bludgeoning",
      "Piercing",
      "Slashing"
    ],
    "damageImmunities": [
      "Fire",
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Grappled",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Prone",
      "Restrained",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Ignan)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Fire Aura",
        "text": "At the end of each of the elemental’s turns, each creature in a 10-foot Emanation originating from the elemental takes 5 (1d10) Fire damage. Creatures and flammable objects in the Emanation start burning."
      },
      {
        "name": "Fire Form",
        "text": "The elemental can move through a space as narrow as 1 inch without expending extra movement to do so, and it can enter a creature’s space and stop there. The first time it enters a creature’s space on a turn, that creature takes 5 (1d10) Fire damage."
      },
      {
        "name": "Illumination",
        "text": "The elemental sheds Bright Light in a 30foot radius and Dim Light for an additional 30 feet."
      },
      {
        "name": "Water Susceptibility",
        "text": "The elemental takes 3 (1d6) Cold damage for every 5 feet the elemental moves in water or for every gallon of water splashed on it."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The elemental makes two Burn attacks."
      },
      {
        "name": "Burn",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 10 (2d6 + 3) Fire damage. If the target is a creature or a flammable object, it starts burning."
      }
    ]
  },
  {
    "id": "gargoyle",
    "name": "Gargoyle",
    "type": "Elemental",
    "size": "Medium",
    "alignment": "Chaotic Evil",
    "armorClass": 15,
    "hp": 67,
    "hitDice": "9d8 + 27",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "fly": 60
    },
    "stats": {
      "str": 15,
      "dex": 11,
      "con": 16,
      "int": 6,
      "wis": 11,
      "cha": 7
    },
    "skills": {
      "Stealth": 4
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Petrified",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Terran)"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Flyby",
        "text": "The gargoyle doesn’t provoke an Opportunity Attack when it flies out of an enemy’s reach."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The gargoyle makes two Claw attacks."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (2d4 + 2) Slashing damage."
      }
    ]
  },
  {
    "id": "invisible-stalker",
    "name": "Invisible Stalker",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral",
    "armorClass": 14,
    "hp": 97,
    "hitDice": "13d10 + 26",
    "initiative": {
      "modifier": 7,
      "score": 22
    },
    "speed": {
      "walk": 50,
      "fly": 50,
      "hover": true
    },
    "stats": {
      "str": 16,
      "dex": 19,
      "con": 14,
      "int": 10,
      "wis": 15,
      "cha": 11
    },
    "skills": {
      "Perception": 8,
      "Stealth": 10
    },
    "damageResistances": [
      "Bludgeoning",
      "Piercing",
      "Slashing"
    ],
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Grappled",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Prone",
      "Restrained",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 18
    },
    "languages": [
      "Common",
      "Primordial (Auran)"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Air Form",
        "text": "The stalker can enter an enemy’s space and stop there. It can move through a space as narrow as 1 inch without expending extra movement to do so."
      },
      {
        "name": "Invisibility",
        "text": "The stalker has the Invisible condition."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The stalker makes three Wind Swipe attacks. It can replace one attack with a use of Vortex."
      },
      {
        "name": "Wind Swipe",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 11 (2d6 + 4) Force damage."
      },
      {
        "name": "Vortex",
        "text": "Constitution Saving Throw: DC 14, one Large or smaller creature in the stalker’s space. Failure: 7 (1d8 + 3) Thunder damage, and the target has the Grappled condition (escape DC 13). Until the grapple ends, the target can’t cast spells with a Verbal component and takes 7 (2d6) Thunder damage at the start of each of the stalker’s turns."
      }
    ]
  },
  {
    "id": "magmin",
    "name": "Magmin",
    "type": "Elemental",
    "size": "Small",
    "alignment": "Chaotic Neutral",
    "armorClass": 14,
    "hp": 13,
    "hitDice": "3d6 + 3",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 7,
      "dex": 15,
      "con": 12,
      "int": 8,
      "wis": 11,
      "cha": 10
    },
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Ignan)"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Death Burst",
        "text": "The magmin explodes when it dies. Dexterity Saving Throw: DC 11, each creature in a 10-foot Emanation originating from the magmin. Failure: 7 (2d6) Fire damage. Success: Half damage."
      }
    ],
    "actions": [
      {
        "name": "Touch",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (2d4 + 2) Fire damage. If the target is a creature or a flammable object that isn’t being worn or carried, it starts burning."
      }
    ]
  },
  {
    "id": "dust-mephit",
    "name": "Dust Mephit",
    "type": "Elemental",
    "size": "Small",
    "alignment": "Neutral Evil",
    "armorClass": 12,
    "hp": 17,
    "hitDice": "5d6",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "fly": 30
    },
    "stats": {
      "str": 5,
      "dex": 14,
      "con": 10,
      "int": 9,
      "wis": 11,
      "cha": 10
    },
    "skills": {
      "Perception": 2,
      "Stealth": 4
    },
    "damageVulnerabilities": [
      "Fire"
    ],
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 12
    },
    "languages": [
      "Primordial (Auran, Terran)"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Death Burst",
        "text": "The mephit explodes when it dies. Dexterity Saving Throw: DC 10, each creature in a 5-foot Emanation originating from the mephit. Failure: 5 (2d4) Bludgeoning damage. Success: Half damage."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 4 (1d4 + 2) Slashing damage."
      },
      {
        "name": "Blinding Breath (Recharge 6)",
        "text": "Dexterity Saving Throw: DC 10, each creature in a 15-foot Cone. Failure: The target has the Blinded condition until the end of the mephit’s next turn."
      },
      {
        "name": "Sleep (1/Day)",
        "text": "The mephit casts the Sleep spell, requiring no spell components and using Charisma as the spellcasting ability (spell save DC 10)."
      }
    ]
  },
  {
    "id": "ice-mephit",
    "name": "Ice Mephit",
    "type": "Elemental",
    "size": "Small",
    "alignment": "Neutral Evil",
    "armorClass": 11,
    "hp": 21,
    "hitDice": "6d6",
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "speed": {
      "walk": 30,
      "fly": 30
    },
    "stats": {
      "str": 7,
      "dex": 13,
      "con": 10,
      "int": 9,
      "wis": 11,
      "cha": 12
    },
    "skills": {
      "Perception": 2,
      "Stealth": 3
    },
    "damageVulnerabilities": [
      "Fire"
    ],
    "damageImmunities": [
      "Cold",
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 12
    },
    "languages": [
      "Primordial (Aquan, Auran)"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Death Burst",
        "text": "The mephit explodes when it dies. Constitution Saving Throw: DC 10, each creature in a 5-foot Emanation originating from the mephit. Failure: 5 (2d4) Cold damage. Success: Half damage."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 3 (1d4 + 1) Slashing damage plus 2 (1d4) Cold damage."
      },
      {
        "name": "Fog Cloud (1/Day)",
        "text": "The mephit casts Fog Cloud, requiring no spell components and using Charisma as the spellcasting ability."
      },
      {
        "name": "Frost Breath (Recharge 6)",
        "text": "Constitution Saving Throw: DC 10, each creature in a 15-foot Cone. Failure: 7 (3d4) Cold damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "magma-mephit",
    "name": "Magma Mephit",
    "type": "Elemental",
    "size": "Small",
    "alignment": "Neutral Evil",
    "armorClass": 11,
    "hp": 18,
    "hitDice": "4d6 + 4",
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "speed": {
      "walk": 30,
      "fly": 30
    },
    "stats": {
      "str": 8,
      "dex": 12,
      "con": 12,
      "int": 7,
      "wis": 10,
      "cha": 10
    },
    "skills": {
      "Stealth": 3
    },
    "damageVulnerabilities": [
      "Cold"
    ],
    "damageImmunities": [
      "Fire",
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Ignan, Terran)"
    ],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Death Burst",
        "text": "The mephit explodes when it dies. Dexterity Saving Throw: DC 11, each creature in a 5-foot Emanation originating from the mephit. Failure: 7 (2d6) Fire damage. Success: Half damage."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 3 (1d4 + 1) Slashing damage plus 3 (1d6) Fire damage."
      },
      {
        "name": "Fire Breath (Recharge 6)",
        "text": "Dexterity Saving Throw: DC 11, each creature in a 15-foot Cone. Failure: 7 (2d6) Fire damage. Success: Half damage."
      }
    ]
  },
  {
    "id": "steam-mephit",
    "name": "Steam Mephit",
    "type": "Elemental",
    "size": "Small",
    "alignment": "Neutral Evil",
    "armorClass": 10,
    "hp": 17,
    "hitDice": "5d6",
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "speed": {
      "walk": 30,
      "fly": 30
    },
    "stats": {
      "str": 5,
      "dex": 11,
      "con": 10,
      "int": 11,
      "wis": 10,
      "cha": 12
    },
    "skills": {
      "Stealth": 2
    },
    "damageImmunities": [
      "Fire",
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Aquan, Ignan)"
    ],
    "challengeRating": "1/4",
    "xp": 50,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Blurred Form",
        "text": "Attack rolls against the mephit are made with Disadvantage unless the mephit has the Incapacitated condition."
      },
      {
        "name": "Death Burst",
        "text": "The mephit explodes when it dies. Dexterity Saving Throw: DC 10, each creature in a 5-foot Emanation originating from the mephit. Failure: 5 (2d4) Fire damage. Success: Half damage."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +2, reach 5 ft. Hit: 2 (1d4) Slashing damage plus 2 (1d4) Fire damage."
      },
      {
        "name": "Steam Breath (Recharge 6)",
        "text": "Constitution Saving Throw: DC 10, each creature in a 15-foot Cone. Failure: 5 (2d4) Fire damage, and the target’s Speed decreases by 10 feet until the end of the mephit’s next turn. Success: Half damage only. Failure or Success: Being underwater doesn’t grant Resistance to this Fire damage."
      }
    ]
  },
  {
    "id": "merfolk-skirmisher",
    "name": "Merfolk Skirmisher",
    "type": "Elemental",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 11,
    "hp": 11,
    "hitDice": "2d8 + 2",
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "speed": {
      "walk": 10,
      "swim": 40
    },
    "stats": {
      "str": 10,
      "dex": 13,
      "con": 12,
      "int": 11,
      "wis": 14,
      "cha": 12
    },
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common",
      "Primordial (Aquan)"
    ],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The merfolk can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Ocean Spear",
        "text": "Melee or Ranged Attack Roll: +2, reach 5 ft. or range 20/60 ft. Hit: 3 (1d6) Piercing damage plus 2 (1d4) Cold damage. If the target is a creature, its Speed decreases by 10 feet until the end of its next turn. Hit or Miss: The spear magically returns to the merfolk’s hand immediately after a ranged attack."
      }
    ]
  },
  {
    "id": "salamander",
    "name": "Salamander",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral Evil",
    "armorClass": 15,
    "hp": 90,
    "hitDice": "12d10 + 24",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 18,
      "dex": 14,
      "con": 15,
      "int": 11,
      "wis": 10,
      "cha": 12
    },
    "damageVulnerabilities": [
      "Cold"
    ],
    "damageImmunities": [
      "Fire"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Ignan)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Fire Aura",
        "text": "At the end of each of the salamander’s turns, each creature of the salamander’s choice in a 5-foot Emanation originating from the salamander takes 7 (2d6) Fire damage."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The salamander makes two Flame Spear attacks. It can replace one attack with a use of Constrict."
      },
      {
        "name": "Flame Spear",
        "text": "Melee or Ranged Attack Roll: +7, reach 5 ft. or range 20/60 ft. Hit: 13 (2d8 + 4) Piercing damage plus 7 (2d6) Fire damage. Hit or Miss: The spear magically returns to the salamander’s hand immediately after a ranged attack."
      },
      {
        "name": "Constrict",
        "text": "Strength Saving Throw: DC 15, one Large or smaller creature the salamander can see within 10 feet. Failure: 11 (2d6 + 4) Bludgeoning damage plus 7 (2d6) Fire damage. The target has the Grappled condition (escape DC 14), and it has the Restrained condition until the grapple ends."
      }
    ]
  },
  {
    "id": "water-elemental",
    "name": "Water Elemental",
    "type": "Elemental",
    "size": "Large",
    "alignment": "Neutral",
    "armorClass": 14,
    "hp": 114,
    "hitDice": "12d10 + 48",
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "speed": {
      "walk": 30,
      "swim": 90
    },
    "stats": {
      "str": 18,
      "dex": 14,
      "con": 18,
      "int": 5,
      "wis": 10,
      "cha": 8
    },
    "damageResistances": [
      "Acid",
      "Fire"
    ],
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Exhaustion",
      "Grappled",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Prone",
      "Restrained",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Primordial (Aquan)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Freeze",
        "text": "If the elemental takes Cold damage, its Speed decreases by 20 feet until the end of its next turn."
      },
      {
        "name": "Water Form",
        "text": "The elemental can enter an enemy’s space and stop there. It can move through a space as narrow as 1 inch without expending extra movement to do so."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The elemental makes two Slam attacks."
      },
      {
        "name": "Slam",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 13 (2d8 + 4) Bludgeoning damage. If the target is a Medium or smaller creature, it has the Prone condition."
      },
      {
        "name": "Whelm (Recharge 4–6)",
        "text": "Strength Saving Throw: DC 15, each creature in the elemental’s space. Failure: 22 (4d8 + 4) Bludgeoning damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 14). Until the grapple ends, the target has the Restrained condition, is suffocating unless it can breathe water, and takes 9 (2d8) Bludgeoning damage at the start of each of the elemental’s turns. The elemental can grapple one Large creature or up to two Medium or smaller creatures at a time with Whelm. As an action, a creature within 5 feet of the elemental can pull a creature out of it by succeeding on a DC 14 Strength (Athletics) check. Success: Half damage only."
      }
    ]
  },
  {
    "id": "xorn",
    "name": "Xorn",
    "type": "Elemental",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 19,
    "hp": 84,
    "hitDice": "8d8 + 48",
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "speed": {
      "walk": 20,
      "burrow": 20
    },
    "stats": {
      "str": 17,
      "dex": 10,
      "con": 22,
      "int": 11,
      "wis": 10,
      "cha": 11
    },
    "skills": {
      "Perception": 6,
      "Stealth": 6
    },
    "damageImmunities": [
      "Poison"
    ],
    "conditionImmunities": [
      "Paralyzed",
      "Petrified",
      "Poisoned"
    ],
    "senses": {
      "darkvision": 60,
      "tremorsense": 60,
      "passivePerception": 16
    },
    "languages": [
      "Primordial (Terran)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Earth Glide",
        "text": "The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn’t disturb the material it moves through."
      },
      {
        "name": "Treasure Sense",
        "text": "The xorn can pinpoint the location of precious metals and stones within 60 feet of itself."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The xorn makes one Bite attack and three Claw attacks."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 17 (4d6 + 3) Piercing damage."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 8 (1d10 + 3) Slashing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Charge",
        "text": "The xorn moves up to its Speed or Burrow Speed straight toward an enemy it can sense. Zombies"
      }
    ]
  }
];

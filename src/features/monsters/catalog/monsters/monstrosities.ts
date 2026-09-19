import type { MonsterDefinition } from "../monsterTypes";

/**
 * Complete Monstrosity catalog from SRD 5.2.1.
 *
 * Includes the Monstrosities in the main monster stat-block section as well
 * as Flying Snake and Giant Vulture from the SRD Animals appendix.
 *
 * For the five lycanthrope stat blocks, SRD 5.2.1 specifies
 * "Medium or Small Monstrosity (Lycanthrope)". MonsterDefinition currently
 * accepts only one MonsterSize, so `size` is normalized to "Medium".
 *
 * This work includes material from the System Reference Document 5.2.1
 * ("SRD 5.2.1") by Wizards of the Coast LLC, available at
 * https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the
 * Creative Commons Attribution 4.0 International License, available at
 * https://creativecommons.org/licenses/by/4.0/legalcode.
 */

export const monstrosities: MonsterDefinition[] = [
  {
    "id": "axe-beak",
    "name": "Axe Beak",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 11,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 19,
    "hitDice": "3d10 + 3",
    "speed": {
      "walk": 50
    },
    "stats": {
      "str": 14,
      "dex": 12,
      "con": 12,
      "int": 2,
      "wis": 10,
      "cha": 5
    },
    "senses": {
      "passivePerception": 10
    },
    "languages": [],
    "challengeRating": "1/4",
    "xp": 50,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Beak",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 6 (1d8 + 2) Slashing damage. Azer"
      }
    ]
  },
  {
    "id": "basilisk",
    "name": "Basilisk",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Unaligned",
    "armorClass": 15,
    "initiative": {
      "modifier": -1,
      "score": 9
    },
    "hp": 52,
    "hitDice": "8d8 + 16",
    "speed": {
      "walk": 20
    },
    "stats": {
      "str": 16,
      "dex": 8,
      "con": 15,
      "int": 2,
      "wis": 8,
      "cha": 7
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 9
    },
    "languages": [],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Piercing damage plus 7 (2d6) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Petrifying Gaze (Recharge 4–6)",
        "text": "Constitution Saving Throw: DC 12, each creature in a 30-foot Cone. If the basilisk sees its reflection in the Cone, the basilisk must make this save. First Failure: The target has the Restrained condition and repeats the save at the end of its next turn if it is still Restrained, ending the effect on itself on a success. Second Failure: The target has the Petrified condition instead of the Restrained condition. Bearded Devil"
      }
    ]
  },
  {
    "id": "behir",
    "name": "Behir",
    "type": "Monstrosity",
    "size": "Huge",
    "alignment": "Neutral Evil",
    "armorClass": 17,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 168,
    "hitDice": "16d12 + 64",
    "speed": {
      "walk": 50,
      "climb": 50
    },
    "stats": {
      "str": 23,
      "dex": 16,
      "con": 18,
      "int": 7,
      "wis": 14,
      "cha": 12
    },
    "skills": {
      "Perception": 6,
      "Stealth": 7
    },
    "damageImmunities": [
      "Lightning"
    ],
    "senses": {
      "darkvision": 90,
      "passivePerception": 16
    },
    "languages": [
      "Draconic"
    ],
    "challengeRating": "11",
    "xp": 7200,
    "proficiencyBonus": 4,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The behir makes one Bite attack and uses Constrict."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +10, reach 10 ft. Hit: 19 (2d12 + 6) Piercing damage plus 11 (2d10) Lightning damage."
      },
      {
        "name": "Constrict",
        "text": "Strength Saving Throw: DC 18, one Large or smaller creature the behir can see within 5 feet. Failure: 28 (5d8 + 6) Bludgeoning damage. The target has the Grappled condition (escape DC 16), and it has the Restrained condition until the grapple ends."
      },
      {
        "name": "Lightning Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 16, each creature in a 90-foot-long, 5-footwide Line. Failure: 66 (12d10) Lightning damage. Success: Half damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Swallow",
        "text": "Dexterity Saving Throw: DC 18, one Large or smaller creature Grappled by the behir (the behir can have only one creature swallowed at a time). Failure: The behir swallows the target, which is no longer Grappled. While swallowed, a creature has the Blinded and Restrained conditions, has Total Cover against attacks and other effects outside the behir, and takes 21 (6d6) Acid damage at the start of each of the behir’s turns. If the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constitution saving throw at the end of that turn or regurgitate the creature, which falls in a space within 10 feet of the behir and has the Prone condition. If the behir dies, a swallowed creature is no longer Restrained and can escape from the corpse by using 15 feet of movement, exiting Prone. Berserker"
      }
    ]
  },
  {
    "id": "bulette",
    "name": "Bulette",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 17,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 94,
    "hitDice": "9d10 + 45",
    "speed": {
      "walk": 40,
      "burrow": 40
    },
    "stats": {
      "str": 19,
      "dex": 11,
      "con": 21,
      "int": 2,
      "wis": 10,
      "cha": 5
    },
    "skills": {
      "Perception": 6
    },
    "senses": {
      "darkvision": 60,
      "tremorsense": 120,
      "passivePerception": 16
    },
    "languages": [],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The bulette makes two Bite attacks."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 17 (2d12 + 4) Piercing damage."
      },
      {
        "name": "Deadly Leap",
        "text": "The bulette spends 5 feet of movement to jump to a space within 15 feet that contains one or more Large or smaller creatures. Dexterity Saving Throw: DC 15, each creature in the bulette’s destination space. Failure: 19 (3d12) Bludgeoning damage, and the target has the Prone condition. Success: Half damage, and the target is pushed 5 feet straight away from the bulette."
      }
    ],
    "bonusActions": [
      {
        "name": "Leap",
        "text": "The bulette jumps up to 30 feet by spending 10 feet of movement. Centaur"
      }
    ]
  },
  {
    "id": "chimera",
    "name": "Chimera",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 14,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 114,
    "hitDice": "12d10 + 48",
    "speed": {
      "walk": 30,
      "fly": 60
    },
    "stats": {
      "str": 19,
      "dex": 11,
      "con": 19,
      "int": 3,
      "wis": 14,
      "cha": 10
    },
    "skills": {
      "Perception": 8
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 18
    },
    "languages": [
      "Understands Draconic but can’t speak"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The chimera makes one Ram attack, one Bite attack, and one Claw attack. It can replace the Claw attack with a use of Fire Breath if available."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 11 (2d6 + 4) Piercing damage, or 18 (4d6 + 4) Piercing damage if the chimera had Advantage on the attack roll."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 7 (1d6 + 4) Slashing damage."
      },
      {
        "name": "Ram",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 10 (1d12 + 4) Bludgeoning damage. If the target is a Medium or smaller creature, it has the Prone condition."
      },
      {
        "name": "Fire Breath (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 15, each creature in a 15-foot Cone. Failure: 31 (7d8) Fire damage. Success: Half damage. Chuul"
      }
    ]
  },
  {
    "id": "cockatrice",
    "name": "Cockatrice",
    "type": "Monstrosity",
    "size": "Small",
    "alignment": "Unaligned",
    "armorClass": 11,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 22,
    "hitDice": "5d6 + 5",
    "speed": {
      "walk": 20,
      "fly": 40
    },
    "stats": {
      "str": 6,
      "dex": 12,
      "con": 12,
      "int": 2,
      "wis": 13,
      "cha": 5
    },
    "conditionImmunities": [
      "Petrified"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 11
    },
    "languages": [],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Petrifying Bite",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 3 (1d4 + 1) Piercing damage. If the target is a creature, it is subjected to the following effect. Constitution Saving Throw: DC 11. First Failure: The target has the Restrained condition. The target repeats the save at the end of its next turn if it is still Restrained, ending the effect on itself on a success. Second Failure: The target has the Petrified condition, instead of the Restrained condition, for 24 hours. Commoner"
      }
    ]
  },
  {
    "id": "death-dog",
    "name": "Death Dog",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Neutral Evil",
    "armorClass": 12,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 39,
    "hitDice": "6d8 + 12",
    "speed": {
      "walk": 40
    },
    "stats": {
      "str": 15,
      "dex": 14,
      "con": 14,
      "int": 3,
      "wis": 13,
      "cha": 6
    },
    "skills": {
      "Perception": 5,
      "Stealth": 4
    },
    "conditionImmunities": [
      "Blinded",
      "Charmed",
      "Deafened",
      "Frightened",
      "Stunned",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 120,
      "passivePerception": 15
    },
    "languages": [],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The death dog makes two Bite attacks."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 4 (1d4 + 2) Piercing damage. If the target is a creature, it is subjected to the following effect. Constitution Saving Throw: DC 12. First Failure: The target has the Poisoned condition. While Poisoned, the target’s Hit Point maximum doesn’t return to normal when finishing a Long Rest, and it repeats the save every 24 hours that elapse, ending the effect on itself on a success. Subsequent Failures: The Poisoned target’s Hit Point maximum decreases by 5 (1d10). Deva"
      }
    ]
  },
  {
    "id": "doppelganger",
    "name": "Doppelganger",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 14,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 52,
    "hitDice": "8d8 + 16",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 11,
      "dex": 18,
      "con": 14,
      "int": 11,
      "wis": 12,
      "cha": 14
    },
    "skills": {
      "Deception": 6,
      "Insight": 3
    },
    "conditionImmunities": [
      "Charmed"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 11
    },
    "languages": [
      "Common plus three other languages"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The doppelganger makes two Slam attacks and uses Unsettling Visage if available."
      },
      {
        "name": "Slam",
        "text": "Melee Attack Roll: +6 (with Advantage during the first round of each combat), reach 5 ft. Hit: 11 (2d6 + 4) Bludgeoning damage."
      },
      {
        "name": "Read Thoughts",
        "text": "The doppelganger casts Detect Thoughts, requiring no spell components and using Charisma as the spellcasting ability (spell save DC 12)."
      },
      {
        "name": "Unsettling Visage (Recharge 6)",
        "text": "Wisdom Saving Throw: DC 12, each creature in a 15-foot Emanation originating from the doppelganger that can see the doppelganger. Failure: The target has the Frightened condition and repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The doppelganger shape-shifts into a Medium or Small Humanoid, or it returns to its true form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. Dragon Turtle"
      }
    ]
  },
  {
    "id": "drider",
    "name": "Drider",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 19,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 123,
    "hitDice": "13d10 + 52",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 16,
      "dex": 19,
      "con": 18,
      "int": 13,
      "wis": 16,
      "cha": 12
    },
    "skills": {
      "Perception": 6,
      "Stealth": 10
    },
    "senses": {
      "darkvision": 120,
      "passivePerception": 16
    },
    "languages": [
      "Elvish",
      "Undercommon"
    ],
    "challengeRating": "6",
    "xp": 2300,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Spider Climb",
        "text": "The drider can climb difficult surfaces, including along ceilings, without needing to make an ability check."
      },
      {
        "name": "Sunlight Sensitivity",
        "text": "While in sunlight, the drider has Disadvantage on ability checks and attack rolls."
      },
      {
        "name": "Web Walker",
        "text": "The drider ignores movement restrictions caused by webs, and the drider knows the location of any other creature in contact with the same web."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The drider makes three attacks, using Foreleg or Poison Burst in any combination."
      },
      {
        "name": "Foreleg",
        "text": "Melee Attack Roll: +7, reach 10 ft. Hit: 13 (2d8 + 4) Piercing damage."
      },
      {
        "name": "Poison Burst",
        "text": "Ranged Attack Roll: +6, range 120 ft. Hit: 13 (3d6 + 3) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Magic of the Spider Queen (Recharge 5–6)",
        "text": "The drider casts Darkness, Faerie Fire, or Web, requiring no Material components and using Wisdom as the spellcasting ability (spell save DC 14). Druid"
      }
    ]
  },
  {
    "id": "ettercap",
    "name": "Ettercap",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Neutral Evil",
    "armorClass": 13,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 44,
    "hitDice": "8d8 + 8",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 14,
      "dex": 15,
      "con": 13,
      "int": 7,
      "wis": 12,
      "cha": 8
    },
    "skills": {
      "Perception": 3,
      "Stealth": 4,
      "Survival": 3
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 13
    },
    "languages": [],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Spider Climb",
        "text": "The ettercap can climb difficult surfaces, including along ceilings, without needing to make an ability check."
      },
      {
        "name": "Web Walker",
        "text": "The ettercap ignores movement restrictions caused by webs, and the ettercap knows the location of any other creature in contact with the same web."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The ettercap makes one Bite attack and one Claw attack."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Piercing damage plus 2 (1d4) Poison damage, and the target has the Poisoned condition until the start of the ettercap’s next turn."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (2d4 + 2) Slashing damage."
      },
      {
        "name": "Web Strand (Recharge 5–6)",
        "text": "Dexterity Saving Throw: DC 12, one Large or smaller creature the ettercap can see within 30 feet. Failure: The target has the Restrained condition until the web is destroyed (AC 10; HP 5; Vulnerability to Fire damage; Immunity to Bludgeoning, Poison, and Psychic damage)."
      }
    ],
    "bonusActions": [
      {
        "name": "Reel",
        "text": "The ettercap pulls one creature within 30 feet of itself that is Restrained by its Web Strand up to 25 feet straight toward itself. Ettin"
      }
    ]
  },
  {
    "id": "flying-snake",
    "name": "Flying Snake",
    "type": "Monstrosity",
    "size": "Tiny",
    "alignment": "Unaligned",
    "armorClass": 14,
    "hp": 5,
    "hitDice": "2d4",
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
      "str": 4,
      "dex": 15,
      "con": 11,
      "int": 2,
      "wis": 12,
      "cha": 5
    },
    "senses": {
      "blindsight": 10,
      "passivePerception": 11
    },
    "languages": [],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Flyby",
        "text": "The snake doesn’t provoke an Opportunity Attack when it flies out of an enemy’s reach."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 1 Piercing damage plus 5 (2d4) Poison damage."
      }
    ]
  },
  {
    "id": "giant-vulture",
    "name": "Giant Vulture",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Neutral Evil",
    "armorClass": 10,
    "hp": 25,
    "hitDice": "3d10 + 9",
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "speed": {
      "walk": 10,
      "fly": 60
    },
    "stats": {
      "str": 15,
      "dex": 10,
      "con": 16,
      "int": 6,
      "wis": 12,
      "cha": 7
    },
    "skills": {
      "Perception": 3
    },
    "damageResistances": [
      "Necrotic"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 13
    },
    "languages": [
      "Understands Common but can’t speak"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The vulture has Advantage on an attack roll against a creature if at least one of the vulture’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Gouge",
        "text": "Melee Attack Roll: +4, reach 5 ft. Hit: 9 (2d6 + 2) Piercing damage, and the target has the Poisoned condition until the end of its next turn."
      }
    ]
  },
  {
    "id": "griffon",
    "name": "Griffon",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 12,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 59,
    "hitDice": "7d10 + 21",
    "speed": {
      "walk": 30,
      "fly": 80
    },
    "stats": {
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 2,
      "wis": 13,
      "cha": 8
    },
    "skills": {
      "Perception": 5
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 15
    },
    "languages": [],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The griffon makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 8 (1d8 + 4) Piercing damage. If the target is a Medium or smaller creature, it has the Grappled condition (escape DC 14) from both of the griffon’s front claws. Grimlock"
      }
    ]
  },
  {
    "id": "harpy",
    "name": "Harpy",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Chaotic Evil",
    "armorClass": 11,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 38,
    "hitDice": "7d8 + 7",
    "speed": {
      "walk": 20,
      "fly": 40
    },
    "stats": {
      "str": 12,
      "dex": 13,
      "con": 12,
      "int": 7,
      "wis": 10,
      "cha": 13
    },
    "senses": {
      "passivePerception": 10
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 6 (2d4 + 1) Slashing damage."
      },
      {
        "name": "Luring Song",
        "text": "The harpy sings a magical melody, which lasts until the harpy’s Concentration ends on it. Wisdom Saving Throw: DC 11, each Humanoid and Giant in a 300-foot Emanation originating from the harpy when the song starts. Failure: The target has the Charmed condition until the song ends and repeats the save at the end of each of its turns. While Charmed, the target has the Incapacitated condition and ignores the Luring Song of other harpies. If the target is more than 5 feet from the harpy, the target moves on its turn toward the harpy by the most direct route, trying to get within 5 feet of the harpy. It doesn’t avoid Opportunity Attacks; however, before moving into damaging terrain (such as lava or a pit) and whenever it takes damage from a source other than the harpy, the target repeats the save. Success: The target is immune to this harpy’s Luring Song for 24 hours. Hell Hound"
      }
    ]
  },
  {
    "id": "hippogriff",
    "name": "Hippogriff",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 11,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 26,
    "hitDice": "4d10 + 4",
    "speed": {
      "walk": 40,
      "fly": 60
    },
    "stats": {
      "str": 17,
      "dex": 13,
      "con": 13,
      "int": 2,
      "wis": 12,
      "cha": 8
    },
    "skills": {
      "Perception": 5
    },
    "senses": {
      "passivePerception": 15
    },
    "languages": [],
    "challengeRating": "1",
    "xp": 200,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Flyby",
        "text": "The hippogriff doesn’t provoke an Opportunity Attack when it flies out of an enemy’s reach."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The hippogriff makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Slashing damage. Hobgoblins"
      }
    ]
  },
  {
    "id": "hydra",
    "name": "Hydra",
    "type": "Monstrosity",
    "size": "Huge",
    "alignment": "Unaligned",
    "armorClass": 15,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 184,
    "hitDice": "16d12 + 80",
    "speed": {
      "walk": 40,
      "swim": 40
    },
    "stats": {
      "str": 20,
      "dex": 12,
      "con": 20,
      "int": 2,
      "wis": 10,
      "cha": 7
    },
    "skills": {
      "Perception": 6
    },
    "conditionImmunities": [
      "Blinded",
      "Charmed",
      "Deafened",
      "Frightened",
      "Stunned",
      "Unconscious"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 16
    },
    "languages": [],
    "challengeRating": "8",
    "xp": 3900,
    "proficiencyBonus": 3,
    "traits": [
      {
        "name": "Hold Breath",
        "text": "The hydra can hold its breath for 1 hour."
      },
      {
        "name": "Multiple Heads",
        "text": "The hydra has five heads. Whenever the hydra takes 25 damage or more on a single turn, one of its heads dies. The hydra dies if all its heads are dead. At the end of each of its turns when it has at least one living head, the hydra grows two heads for each of its heads that died since its last turn, unless it has taken Fire damage since its last turn. The hydra regains 20 Hit Points when it grows new heads."
      },
      {
        "name": "Reactive Heads",
        "text": "For each head the hydra has beyond one, it gets an extra Reaction that can be used only for Opportunity Attacks."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The hydra makes as many Bite attacks as it has heads."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +8, reach 10 ft. Hit: 10 (1d10 + 5) Piercing damage. Ice Devil"
      }
    ]
  },
  {
    "id": "kraken",
    "name": "Kraken",
    "type": "Monstrosity",
    "size": "Gargantuan",
    "subtype": "Titan",
    "alignment": "Chaotic Evil",
    "armorClass": 18,
    "initiative": {
      "modifier": 14,
      "score": 24
    },
    "hp": 481,
    "hitDice": "26d20 + 208",
    "speed": {
      "walk": 30,
      "swim": 120
    },
    "stats": {
      "str": 30,
      "dex": 11,
      "con": 26,
      "int": 22,
      "wis": 18,
      "cha": 20
    },
    "savingThrows": {
      "str": 17,
      "dex": 7,
      "con": 15,
      "wis": 11
    },
    "skills": {
      "History": 13,
      "Perception": 11
    },
    "damageImmunities": [
      "Cold",
      "Lightning"
    ],
    "conditionImmunities": [
      "Frightened",
      "Grappled",
      "Paralyzed",
      "Restrained"
    ],
    "senses": {
      "truesight": 120,
      "passivePerception": 21
    },
    "languages": [
      "Understands Abyssal",
      "Celestial",
      "Infernal",
      "and Primordial but can’t speak; telepathy 120 ft."
    ],
    "traits": [
      {
        "name": "Amphibious",
        "text": "The kraken can breathe air and water."
      },
      {
        "name": "Legendary Resistance (4/Day, or 5/Day in Lair)",
        "text": "If the kraken fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Siege Monster",
        "text": "The kraken deals double damage to objects and structures."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The kraken makes two Tentacle attacks and uses Fling, Lightning Strike, or Swallow."
      },
      {
        "name": "Tentacle",
        "text": "Melee Attack Roll: +17, reach 30 ft. Hit: 24 (4d6 + 10) Bludgeoning damage. The target has the Grappled condition (escape DC 20) from one of ten tentacles, and it has the Restrained condition until the grapple ends."
      },
      {
        "name": "Fling",
        "text": "The kraken throws a Large or smaller creature Grappled by it to a space it can see within 60 feet of itself that isn’t in the air. Dexterity Saving Throw: DC 25, the creature thrown and each creature in the destination space. Failure: 18 (4d8) Bludgeoning damage, and the target has the Prone condition. Success: Half damage only."
      },
      {
        "name": "Lightning Strike",
        "text": "Dexterity Saving Throw: DC 23, one creature the kraken can see within 120 feet. Failure: 33 (6d10) Lightning damage. Success: Half damage."
      },
      {
        "name": "Swallow",
        "text": "Dexterity Saving Throw: DC 25, one creature Grappled by the kraken (it can have up to four creatures swallowed at a time). Failure: 23 (3d8 + 10) Piercing damage. If the target is Large or smaller, it is swallowed and no longer Grappled. A swallowed creature has the Restrained condition, has Total Cover against attacks and other effects outside the kraken, and takes 24 (7d6) Acid damage at the start of each of its turns. If the kraken takes 50 damage or more on a single turn from a creature inside it, the kraken must succeed on a DC 25 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, each of which falls in a space within 10 feet of the kraken with the Prone condition. If the kraken dies, any swallowed creature no longer has the Restrained condition and can escape from the corpse using 15 feet of movement, exiting Prone."
      }
    ],
    "legendaryActions": [
      {
        "name": "Storm Bolt",
        "text": "The kraken uses Lightning Strike."
      },
      {
        "name": "Toxic Ink",
        "text": "Constitution Saving Throw: DC 23, each creature in a 15-foot Emanation originating from the kraken while it is underwater. Failure: The target has the Blinded and Poisoned conditions until the end of the kraken’s next turn. The kraken then moves up to its Speed. Failure or Success: The kraken can’t take this action again until the start of its next turn. Lamia"
      }
    ],
    "challengeRating": "23",
    "xp": 50000,
    "proficiencyBonus": 7
  },
  {
    "id": "manticore",
    "name": "Manticore",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Lawful Evil",
    "armorClass": 14,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 68,
    "hitDice": "8d10 + 24",
    "speed": {
      "walk": 30,
      "fly": 50
    },
    "stats": {
      "str": 17,
      "dex": 16,
      "con": 17,
      "int": 7,
      "wis": 12,
      "cha": 8
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 11
    },
    "languages": [
      "Common"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The manticore makes three attacks, using Rend or Tail Spike in any combination."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Slashing damage."
      },
      {
        "name": "Tail Spike",
        "text": "Ranged Attack Roll: +5, range 100/200 ft. Hit: 7 (1d8 + 3) Piercing damage. Marilith"
      }
    ]
  },
  {
    "id": "medusa",
    "name": "Medusa",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Lawful Evil",
    "armorClass": 15,
    "initiative": {
      "modifier": 6,
      "score": 16
    },
    "hp": 127,
    "hitDice": "17d8 + 51",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 10,
      "dex": 17,
      "con": 16,
      "int": 12,
      "wis": 13,
      "cha": 15
    },
    "savingThrows": {
      "wis": 4
    },
    "skills": {
      "Deception": 5,
      "Perception": 4,
      "Stealth": 6
    },
    "senses": {
      "darkvision": 150,
      "passivePerception": 14
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
        "text": "The medusa makes two Claw attacks and one Snake Hair attack, or it makes three Poison Ray attacks."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Snake Hair",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 5 (1d4 + 3) Piercing damage plus 14 (4d6) Poison damage."
      },
      {
        "name": "Poison Ray",
        "text": "Ranged Attack Roll: +5, range 150 ft. Hit: 11 (2d8 + 2) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Petrifying Gaze (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 13, each creature in a 30-foot Cone. If the medusa sees its reflection in the Cone, the medusa must make this save. First Failure: The target has the Restrained condition and repeats the save at the end of its next turn if it is still Restrained, ending the effect on itself on a success. Second Failure: The target has the Petrified condition instead of the Restrained condition. Mephits"
      }
    ]
  },
  {
    "id": "merrow",
    "name": "Merrow",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 13,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 45,
    "hitDice": "6d10 + 12",
    "speed": {
      "walk": 10,
      "swim": 40
    },
    "stats": {
      "str": 18,
      "dex": 15,
      "con": 15,
      "int": 8,
      "wis": 10,
      "cha": 9
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [
      "Abyssal",
      "Primordial (Aquan)"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Amphibious",
        "text": "The merrow can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The merrow makes two attacks, using Bite, Claw, or Harpoon in any combination."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 6 (1d4 + 4) Piercing damage, and the target has the Poisoned condition until the end of the merrow’s next turn."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 9 (2d4 + 4) Slashing damage."
      },
      {
        "name": "Harpoon",
        "text": "Melee or Ranged Attack Roll: +6, reach 5 ft. or range 20/60 ft. Hit: 11 (2d6 + 4) Piercing damage. If the target is a Large or smaller creature, the merrow pulls the target up to 15 feet straight toward itself. Mimic"
      }
    ]
  },
  {
    "id": "mimic",
    "name": "Mimic",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 58,
    "hitDice": "9d8 + 18",
    "speed": {
      "walk": 20
    },
    "stats": {
      "str": 17,
      "dex": 12,
      "con": 15,
      "int": 5,
      "wis": 13,
      "cha": 8
    },
    "skills": {
      "Stealth": 5
    },
    "damageImmunities": [
      "Acid"
    ],
    "conditionImmunities": [
      "Prone"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 11
    },
    "languages": [],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Adhesive (Object Form Only)",
        "text": "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic has the Grappled condition (escape DC 13). Ability checks made to escape this grapple have Disadvantage."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +5 (with Advantage if the target is Grappled by the mimic), reach 5 ft. Hit: 7 (1d8 + 3) Piercing damage—or 12 (2d8 + 3) Piercing damage if the target is Grappled by the mimic—plus 4 (1d8) Acid damage."
      },
      {
        "name": "Pseudopod",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Bludgeoning damage plus 4 (1d8) Acid damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 13). Ability checks made to escape this grapple have Disadvantage."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The mimic shape-shifts to resemble a Medium or Small object while retaining its game statistics, or it returns to its true blob form. Any equipment it is wearing or carrying isn’t transformed. Minotaur of Baphomet"
      }
    ]
  },
  {
    "id": "minotaur-of-baphomet",
    "name": "Minotaur of Baphomet",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Chaotic Evil",
    "armorClass": 14,
    "initiative": {
      "modifier": 0,
      "score": 10
    },
    "hp": 85,
    "hitDice": "10d10 + 30",
    "speed": {
      "walk": 40
    },
    "stats": {
      "str": 18,
      "dex": 11,
      "con": 16,
      "int": 6,
      "wis": 16,
      "cha": 9
    },
    "skills": {
      "Perception": 7,
      "Survival": 7
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 17
    },
    "languages": [
      "Abyssal"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Abyssal Glaive",
        "text": "Melee Attack Roll: +6, reach 10 ft. Hit: 10 (1d12 + 4) Slashing damage plus 10 (3d6) Necrotic damage."
      },
      {
        "name": "Gore (Recharge 5–6)",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 18 (4d6 + 4) Piercing damage. If the target is a Large or smaller creature and the minotaur moved 10+ feet straight toward it immediately before the hit, the target takes an extra 10 (3d6) Piercing damage and has the Prone condition. Mummies"
      }
    ]
  },
  {
    "id": "owlbear",
    "name": "Owlbear",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 13,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 59,
    "hitDice": "7d10 + 21",
    "speed": {
      "walk": 40,
      "climb": 40
    },
    "stats": {
      "str": 20,
      "dex": 12,
      "con": 17,
      "int": 3,
      "wis": 12,
      "cha": 7
    },
    "skills": {
      "Perception": 5
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 15
    },
    "languages": [],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The owlbear makes two Rend attacks."
      },
      {
        "name": "Rend",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 14 (2d8 + 5) Slashing damage. Pegasus"
      }
    ]
  },
  {
    "id": "phase-spider",
    "name": "Phase Spider",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Unaligned",
    "armorClass": 14,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 45,
    "hitDice": "7d10 + 7",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 15,
      "dex": 16,
      "con": 12,
      "int": 6,
      "wis": 10,
      "cha": 6
    },
    "skills": {
      "Stealth": 7
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 10
    },
    "languages": [],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Ethereal Sight",
        "text": "The spider can see 60 feet into the Ethereal Plane while on the Material Plane and vice versa."
      },
      {
        "name": "Spider Climb",
        "text": "The spider can climb difficult surfaces, including along ceilings, without needing to make an ability check."
      },
      {
        "name": "Web Walker",
        "text": "The spider ignores movement restrictions caused by webs, and the spider knows the location of any other creature in contact with the same web."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The spider makes two Bite attacks."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (1d10 + 3) Piercing damage plus 9 (2d8) Poison damage. If this damage reduces the target to 0 Hit Points, the target becomes Stable, and it has the Poisoned condition for 1 hour. While Poisoned, the target also has the Paralyzed condition."
      }
    ],
    "bonusActions": [
      {
        "name": "Ethereal Jaunt",
        "text": "The spider teleports from the Material Plane to the Ethereal Plane or vice versa. Pirates"
      }
    ]
  },
  {
    "id": "purple-worm",
    "name": "Purple Worm",
    "type": "Monstrosity",
    "size": "Gargantuan",
    "alignment": "Unaligned",
    "armorClass": 18,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 247,
    "hitDice": "15d20 + 90",
    "speed": {
      "walk": 50,
      "burrow": 50
    },
    "stats": {
      "str": 28,
      "dex": 7,
      "con": 22,
      "int": 1,
      "wis": 8,
      "cha": 4
    },
    "savingThrows": {
      "con": 11,
      "wis": 4
    },
    "senses": {
      "blindsight": 30,
      "tremorsense": 60,
      "passivePerception": 9
    },
    "languages": [],
    "challengeRating": "15",
    "xp": 13000,
    "proficiencyBonus": 5,
    "traits": [
      {
        "name": "Tunneler",
        "text": "The worm can burrow through solid rock at half its Burrow Speed and leaves a 10-foot-diameter tunnel in its wake."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The worm makes one Bite attack and one Tail Stinger attack."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +14, reach 10 ft. Hit: 22 (3d8 + 9) Piercing damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 19), and it has the Restrained condition until the grapple ends."
      },
      {
        "name": "Tail Stinger",
        "text": "Melee Attack Roll: +14, reach 10 ft. Hit: 16 (2d6 + 9) Piercing damage plus 35 (10d6) Poison damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Swallow",
        "text": "Strength Saving Throw: DC 19, one Large or smaller creature Grappled by the worm (it can have up to three creatures swallowed at a time). Failure: The target is swallowed by the worm, and the Grappled condition ends. A swallowed creature has the Blinded and Restrained conditions, has Total Cover against attacks and other effects outside the worm, and takes 17 (5d6) Acid damage at the start of each of the worm’s turns. If the worm takes 30 damage or more on a single turn from a creature inside it, the worm must succeed on a DC 21 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, each of which falls in a space within 5 feet of the worm and has the Prone condition. If the worm dies, any swallowed creature no longer has the Restrained condition and can escape from the corpse using 20 feet of movement, exiting Prone. Quasit"
      }
    ]
  },
  {
    "id": "remorhaz",
    "name": "Remorhaz",
    "type": "Monstrosity",
    "size": "Huge",
    "alignment": "Unaligned",
    "armorClass": 17,
    "initiative": {
      "modifier": 5,
      "score": 15
    },
    "hp": 195,
    "hitDice": "17d12 + 85",
    "speed": {
      "walk": 40,
      "burrow": 30
    },
    "stats": {
      "str": 24,
      "dex": 13,
      "con": 21,
      "int": 4,
      "wis": 10,
      "cha": 5
    },
    "damageImmunities": [
      "Cold",
      "Fire"
    ],
    "senses": {
      "darkvision": 60,
      "tremorsense": 60,
      "passivePerception": 10
    },
    "languages": [],
    "challengeRating": "11",
    "xp": 7200,
    "proficiencyBonus": 4,
    "traits": [
      {
        "name": "Heat Aura",
        "text": "At the end of each of the remorhaz’s turns, each creature in a 5-foot Emanation originating from the remorhaz takes 16 (3d10) Fire damage."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +11, reach 10 ft. Hit: 18 (2d10 + 7) Piercing damage plus 14 (4d6) Fire damage. If the target is a Large or smaller creature, it has the Grappled condition (escape DC 17), and it has the Restrained condition until the grapple ends."
      }
    ],
    "bonusActions": [
      {
        "name": "Swallow",
        "text": "Strength Saving Throw: DC 19, one Large or smaller creature Grappled by the remorhaz (it can have up to two creatures swallowed at a time). Failure: The target is swallowed by the remorhaz, and the Grappled condition ends. A swallowed creature has the Blinded and Restrained conditions, it has Total Cover against attacks and other effects outside the remorhaz, and it takes 10 (3d6) Acid damage plus 10 (3d6) Fire damage at the start of each of the remorhaz’s turns. If the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, each of which falls in a space within 5 feet of the remorhaz and has the Prone condition. If the remorhaz dies, any swallowed creature no longer has the Restrained condition and can escape from the corpse by using 15 feet of movement, exiting Prone. Roc"
      }
    ]
  },
  {
    "id": "roc",
    "name": "Roc",
    "type": "Monstrosity",
    "size": "Gargantuan",
    "alignment": "Unaligned",
    "armorClass": 15,
    "initiative": {
      "modifier": 8,
      "score": 18
    },
    "hp": 248,
    "hitDice": "16d20 + 80",
    "speed": {
      "walk": 20,
      "fly": 120
    },
    "stats": {
      "str": 28,
      "dex": 10,
      "con": 20,
      "int": 3,
      "wis": 10,
      "cha": 9
    },
    "savingThrows": {
      "dex": 4,
      "wis": 4
    },
    "skills": {
      "Perception": 8
    },
    "senses": {
      "passivePerception": 18
    },
    "languages": [],
    "challengeRating": "11",
    "xp": 7200,
    "proficiencyBonus": 4,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The roc makes two Beak attacks. It can replace one attack with a Talons attack."
      },
      {
        "name": "Beak",
        "text": "Melee Attack Roll: +13, reach 10 ft. Hit: 28 (3d12 + 9) Piercing damage."
      },
      {
        "name": "Talons",
        "text": "Melee Attack Roll: +13, reach 5 ft. Hit: 23 (4d6 + 9) Slashing damage. If the target is a Huge or smaller creature, it has the Grappled condition (escape DC 19) from both talons, and it has the Restrained condition until the grapple ends."
      }
    ],
    "bonusActions": [
      {
        "name": "Swoop (Recharge 5–6)",
        "text": "If the roc has a creature Grappled, the roc flies up to half its Fly Speed without provoking Opportunity Attacks and drops that creature. Roper"
      }
    ]
  },
  {
    "id": "rust-monster",
    "name": "Rust Monster",
    "type": "Monstrosity",
    "size": "Medium",
    "alignment": "Unaligned",
    "armorClass": 14,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 33,
    "hitDice": "6d8 + 6",
    "speed": {
      "walk": 40
    },
    "stats": {
      "str": 13,
      "dex": 12,
      "con": 13,
      "int": 2,
      "wis": 13,
      "cha": 6
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 11
    },
    "languages": [],
    "challengeRating": "1/2",
    "xp": 100,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Iron Scent",
        "text": "The rust monster can pinpoint the location of ferrous metal within 30 feet of itself."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The rust monster makes one Bite attack and uses Antennae twice."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +3, reach 5 ft. Hit: 5 (1d8 + 1) Piercing damage."
      },
      {
        "name": "Antennae",
        "text": "The rust monster targets one nonmagical metal object—armor or a weapon—worn or carried by a creature within 5 feet of itself. Dexterity Saving Throw: DC 11, the creature with the object. Failure: The object takes a −1 penalty to the AC it offers (armor) or to its attack rolls (weapon). Armor is destroyed if the penalty reduces its AC to 10, and a weapon is destroyed if its penalty reaches −5. The penalty can be removed by casting the Mending spell on the armor or weapon."
      },
      {
        "name": "Destroy Metal",
        "text": "The rust monster touches a nonmagical metal object within 5 feet of itself that isn’t being worn or carried. The touch destroys a 1-foot Cube of the object."
      }
    ],
    "reactions": [
      {
        "name": "Reflexive Antennae",
        "text": "Trigger: An attack roll hits the rust monster. Response: The rust monster uses Antennae. Sahuagin"
      }
    ]
  },
  {
    "id": "stirge",
    "name": "Stirge",
    "type": "Monstrosity",
    "size": "Tiny",
    "alignment": "Unaligned",
    "armorClass": 13,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 5,
    "hitDice": "2d4",
    "speed": {
      "walk": 10,
      "fly": 40
    },
    "stats": {
      "str": 4,
      "dex": 16,
      "con": 11,
      "int": 2,
      "wis": 8,
      "cha": 6
    },
    "senses": {
      "darkvision": 60,
      "passivePerception": 9
    },
    "languages": [],
    "challengeRating": "1/8",
    "xp": 25,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Proboscis",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 6 (1d6 + 3) Piercing damage, and the stirge attaches to the target. While attached, the stirge can’t make Proboscis attacks, and the target takes 5 (2d4) Necrotic damage at the start of each of the stirge’s turns. The stirge can detach itself by spending 5 feet of its movement. The target or a creature within 5 feet of it can detach the stirge as an action. Stone Giant"
      }
    ]
  },
  {
    "id": "tarrasque",
    "name": "Tarrasque",
    "type": "Monstrosity",
    "size": "Gargantuan",
    "subtype": "Titan",
    "alignment": "Unaligned",
    "armorClass": 25,
    "initiative": {
      "modifier": 18,
      "score": 28
    },
    "hp": 697,
    "hitDice": "34d20 + 340",
    "speed": {
      "walk": 60,
      "burrow": 40,
      "climb": 60
    },
    "stats": {
      "str": 30,
      "dex": 11,
      "con": 30,
      "int": 3,
      "wis": 11,
      "cha": 11
    },
    "savingThrows": {
      "dex": 9,
      "int": 5,
      "wis": 9,
      "cha": 9
    },
    "skills": {
      "Perception": 9
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
      "Charmed",
      "Deafened",
      "Frightened",
      "Paralyzed",
      "Poisoned"
    ],
    "senses": {
      "blindsight": 120,
      "passivePerception": 19
    },
    "languages": [],
    "challengeRating": "30",
    "xp": 155000,
    "proficiencyBonus": 9,
    "traits": [
      {
        "name": "Legendary Resistance (6/Day)",
        "text": "If the tarrasque fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Magic Resistance",
        "text": "The tarrasque has Advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Reflective Carapace",
        "text": "If the tarrasque is targeted by a Magic Missile spell or a spell that requires a ranged attack roll, roll 1d6. On a 1–5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected and reflects the spell, turning the caster into the target."
      },
      {
        "name": "Siege Monster",
        "text": "The tarrasque deals double damage to objects and structures."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The tarrasque makes one Bite attack and three other attacks, using Claw or Tail in any combination."
      },
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +19, reach 15 ft. Hit: 36 (4d12 + 10) Piercing damage, and the target has the Grappled condition (escape DC 20). Until the grapple ends, the target has the Restrained condition and can’t teleport."
      },
      {
        "name": "Claw",
        "text": "Melee Attack Roll: +19, reach 15 ft. Hit: 28 (4d8 + 10) Slashing damage."
      },
      {
        "name": "Tail",
        "text": "Melee Attack Roll: +19, reach 30 ft. Hit: 23 (3d8 + 10) Bludgeoning damage. If the target is a Huge or smaller creature, it has the Prone condition."
      },
      {
        "name": "Thunderous Bellow (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 27, each creature and each object that isn’t being worn or carried in a 150-foot Cone. Failure: 78 (12d12) Thunder damage, and the target has the Deafened and Frightened conditions until the end of its next turn. Success: Half damage only."
      }
    ],
    "bonusActions": [
      {
        "name": "Swallow",
        "text": "Strength Saving Throw: DC 27, one Large or smaller creature Grappled by the tarrasque (it can have up to six creatures swallowed at a time). Failure: The target is swallowed, and the Grappled condition ends. A swallowed creature has the Blinded and Restrained conditions and can’t teleport, it has Total Cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) Acid damage at the start of each of the tarrasque’s turns. If the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, each of which falls in a space within 10 feet of the tarrasque and has the Prone condition. If the tarrasque dies, any swallowed creature no longer has the Restrained condition and can escape from the corpse using 20 feet of movement, exiting Prone."
      }
    ],
    "legendaryActions": [
      {
        "name": "Onslaught",
        "text": "The tarrasque moves up to half its Speed, and it makes one Claw or Tail attack."
      },
      {
        "name": "World-Shaking Movement",
        "text": "The tarrasque moves up to its Speed. At the end of this movement, the tarrasque creates an instantaneous shock wave in a 60-foot Emanation originating from itself. Creatures in that area lose Concentration and, if Medium or smaller, have the Prone condition. The tarrasque can’t take this action again until the start of its next turn. Toughs"
      }
    ]
  },
  {
    "id": "werebear",
    "name": "Werebear",
    "type": "Monstrosity",
    "size": "Medium",
    "subtype": "Lycanthrope",
    "alignment": "Neutral Good",
    "armorClass": 15,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 135,
    "hitDice": "18d8 + 54",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 11,
      "wis": 12,
      "cha": 12
    },
    "skills": {
      "Perception": 7
    },
    "gear": [
      "Handaxes (4)"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 17
    },
    "languages": [
      "Common (can’t speak in bear form)"
    ],
    "challengeRating": "5",
    "xp": 1800,
    "proficiencyBonus": 3,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The werebear makes two attacks, using Handaxe or Rend in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Bite (Bear or Hybrid Form Only)",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 17 (2d12 + 4) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 14. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Werebear under the GM’s control and has 10 Hit Points. Success: The target is immune to this werebear’s curse for 24 hours."
      },
      {
        "name": "Handaxe (Humanoid or Hybrid Form Only)",
        "text": "Melee or Ranged Attack Roll: +7, reach 5 ft or range 20/60 ft. Hit: 14 (3d6 + 4) Slashing damage."
      },
      {
        "name": "Rend (Bear or Hybrid Form Only)",
        "text": "Melee Attack Roll: +7, reach 5 ft. Hit: 13 (2d8 + 4) Slashing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The werebear shape-shifts into a Large bear-humanoid hybrid form or a Large bear, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. Wereboar"
      }
    ]
  },
  {
    "id": "wereboar",
    "name": "Wereboar",
    "type": "Monstrosity",
    "size": "Medium",
    "subtype": "Lycanthrope",
    "alignment": "Neutral Evil",
    "armorClass": 15,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 97,
    "hitDice": "15d8 + 30",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 10,
      "wis": 11,
      "cha": 8
    },
    "skills": {
      "Perception": 2
    },
    "gear": [
      "Javelins (6)"
    ],
    "senses": {
      "passivePerception": 12
    },
    "languages": [
      "Common (can’t speak in boar form)"
    ],
    "challengeRating": "4",
    "xp": 1100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The wereboar makes two attacks, using Javelin or Tusk in any combination. It can replace one attack with a Gore attack."
      },
      {
        "name": "Gore (Boar or Hybrid Form Only)",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 12. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Wereboar under the GM’s control and has 10 Hit Points. Success: The target is immune to this wereboar’s curse for 24 hours."
      },
      {
        "name": "Javelin (Humanoid or Hybrid Form Only)",
        "text": "Melee or Ranged Attack Roll: +5, reach 5 ft. or range 30/120 ft. Hit: 13 (3d6 + 3) Piercing damage."
      },
      {
        "name": "Tusk (Boar or Hybrid Form Only)",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Piercing damage. If the target is a Medium or smaller creature and the wereboar moved 20+ feet straight toward it immediately before the hit, the target takes an extra 7 (2d6) Piercing damage and has the Prone condition."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The wereboar shape-shifts into a Medium boar-humanoid hybrid or a Small boar, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. Wererat"
      }
    ]
  },
  {
    "id": "wererat",
    "name": "Wererat",
    "type": "Monstrosity",
    "size": "Medium",
    "subtype": "Lycanthrope",
    "alignment": "Lawful Evil",
    "armorClass": 13,
    "initiative": {
      "modifier": 3,
      "score": 13
    },
    "hp": 60,
    "hitDice": "11d8 + 11",
    "speed": {
      "walk": 30,
      "climb": 30
    },
    "stats": {
      "str": 10,
      "dex": 16,
      "con": 12,
      "int": 11,
      "wis": 10,
      "cha": 8
    },
    "skills": {
      "Perception": 4,
      "Stealth": 5
    },
    "gear": [
      "Hand Crossbow"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Common (can’t speak in rat form)"
    ],
    "challengeRating": "2",
    "xp": 450,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The wererat makes two attacks, using Scratch or Hand Crossbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Bite (Rat or Hybrid Form Only)",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (2d4 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 11. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Wererat under the GM’s control and has 10 Hit Points. Success: The target is immune to this wererat’s curse for 24 hours."
      },
      {
        "name": "Scratch",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 6 (1d6 + 3) Slashing damage. Hand Crossbow (Humanoid or Hybrid Form Only). Ranged Attack Roll: +5, range 30/120 ft. Hit: 6 (1d6 + 3) Piercing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The wererat shape-shifts into a Medium rat-humanoid hybrid or a Small rat, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. Weretiger"
      }
    ]
  },
  {
    "id": "weretiger",
    "name": "Weretiger",
    "type": "Monstrosity",
    "size": "Medium",
    "subtype": "Lycanthrope",
    "alignment": "Neutral",
    "armorClass": 12,
    "initiative": {
      "modifier": 2,
      "score": 12
    },
    "hp": 120,
    "hitDice": "16d8 + 48",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 17,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 11
    },
    "skills": {
      "Perception": 5,
      "Stealth": 4
    },
    "gear": [
      "Longbow"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 15
    },
    "languages": [
      "Common (can’t speak in tiger form)"
    ],
    "challengeRating": "4",
    "xp": 1100,
    "proficiencyBonus": 2,
    "actions": [
      {
        "name": "Multiattack",
        "text": "The weretiger makes two attacks, using Scratch or Longbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Bite (Tiger or Hybrid Form Only)",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 13. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Weretiger under the GM’s control and has 10 Hit Points. Success: The target is immune to this weretiger’s curse for 24 hours."
      },
      {
        "name": "Scratch",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Longbow (Humanoid or Hybrid Form Only)",
        "text": "Ranged Attack Roll: +4, range 150/600 ft. Hit: 11 (2d8 + 2) Piercing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Prowl (Tiger or Hybrid Form Only)",
        "text": "The weretiger moves up to its Speed without provoking Opportunity"
      },
      {
        "name": "Attacks",
        "text": "At the end of this movement, the weretiger can take the Hide action."
      },
      {
        "name": "Shape-Shift",
        "text": "The weretiger shape-shifts into a Large tiger-humanoid hybrid or a Large tiger, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. Werewolf"
      }
    ]
  },
  {
    "id": "werewolf",
    "name": "Werewolf",
    "type": "Monstrosity",
    "size": "Medium",
    "subtype": "Lycanthrope",
    "alignment": "Chaotic Evil",
    "armorClass": 15,
    "initiative": {
      "modifier": 4,
      "score": 14
    },
    "hp": 71,
    "hitDice": "11d8 + 22",
    "speed": {
      "walk": 30
    },
    "stats": {
      "str": 16,
      "dex": 14,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10
    },
    "skills": {
      "Perception": 4,
      "Stealth": 4
    },
    "gear": [
      "Longbow"
    ],
    "senses": {
      "darkvision": 60,
      "passivePerception": 14
    },
    "languages": [
      "Common (can’t speak in wolf form)"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The werewolf has Advantage on an attack roll against a creature if at least one of the werewolf’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "text": "The werewolf makes two attacks, using Scratch or Longbow in any combination. It can replace one attack with a Bite attack."
      },
      {
        "name": "Bite (Wolf or Hybrid Form Only)",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 12 (2d8 + 3) Piercing damage. If the target is a Humanoid, it is subjected to the following effect. Constitution Saving Throw: DC 12. Failure: The target is cursed. If the cursed target drops to 0 Hit Points, it instead becomes a Werewolf under the GM’s control and has 10 Hit Points. Success: The target is immune to this werewolf’s curse for 24 hours."
      },
      {
        "name": "Scratch",
        "text": "Melee Attack Roll: +5, reach 5 ft. Hit: 10 (2d6 + 3) Slashing damage."
      },
      {
        "name": "Longbow (Humanoid or Hybrid Form Only)",
        "text": "Ranged Attack Roll: +4, range 150/600 ft. Hit: 11 (2d8 + 2) Piercing damage."
      }
    ],
    "bonusActions": [
      {
        "name": "Shape-Shift",
        "text": "The werewolf shape-shifts into a Large wolf-humanoid hybrid or a Medium wolf, or it returns to its true humanoid form. Its game statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn’t transformed. White Dragons"
      }
    ]
  },
  {
    "id": "winter-wolf",
    "name": "Winter Wolf",
    "type": "Monstrosity",
    "size": "Large",
    "alignment": "Neutral Evil",
    "armorClass": 13,
    "initiative": {
      "modifier": 1,
      "score": 11
    },
    "hp": 75,
    "hitDice": "10d10 + 20",
    "speed": {
      "walk": 50
    },
    "stats": {
      "str": 18,
      "dex": 13,
      "con": 14,
      "int": 7,
      "wis": 12,
      "cha": 8
    },
    "skills": {
      "Perception": 5,
      "Stealth": 5
    },
    "damageImmunities": [
      "Cold"
    ],
    "senses": {
      "passivePerception": 15
    },
    "languages": [
      "Common",
      "Giant"
    ],
    "challengeRating": "3",
    "xp": 700,
    "proficiencyBonus": 2,
    "traits": [
      {
        "name": "Pack Tactics",
        "text": "The wolf has Advantage on an attack roll against a creature if at least one of the wolf’s allies is within 5 feet of the creature and the ally doesn’t have the Incapacitated condition."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "text": "Melee Attack Roll: +6, reach 5 ft. Hit: 11 (2d6 + 4) Piercing damage. If the target is a Large or smaller creature, it has the Prone condition."
      },
      {
        "name": "Cold Breath (Recharge 5–6)",
        "text": "Constitution Saving Throw: DC 12, each creature in a 15-foot Cone. Failure: 18 (4d8) Cold damage. Success: Half damage. Worg"
      }
    ]
  }
];

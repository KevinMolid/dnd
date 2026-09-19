import type { MonsterDefinition } from "./monsterTypes";

/**
 * Retained legacy/non-SRD monsters.
 *
 * These are intentionally NOT part of the SRD 5.2.1 completeness count.
 * They remain available to avoid removing monsters already used by campaigns.
 */
export const legacyMonsters: MonsterDefinition[] = [
{
      id: "banshee",
      name: "Banshee",
      type: "Undead",
      size: "Medium",
      alignment: "Chaotic Evil",
      img: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b65ca996-4dfe-4693-8f17-c28fc651fbc5/dlg88ks-9380a189-1bab-437d-bbd7-0fae12055e57.jpg/v1/fill/w_800,h_437,q_75,strp/dd_fantasy_creatures_35___banshee___dnd_by_fantasy_vault_dlg88ks-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9iNjVjYTk5Ni00ZGZlLTQ2OTMtOGYxNy1jMjhmYzY1MWZiYzUvZGxnODhrcy05MzgwYTE4OS0xYmFiLTQzN2QtYmJkNy0wZmFlMTIwNTVlNTcuanBnIiwiaGVpZ2h0IjoiPD00MzciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLndhdGVybWFyayJdLCJ3bWsiOnsicGF0aCI6Ii93bS9iNjVjYTk5Ni00ZGZlLTQ2OTMtOGYxNy1jMjhmYzY1MWZiYzUvZmFudGFzeS12YXVsdC00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.t-ZAgAhy9XZ7RzgG0yrapCJ1wFKLUVhLGKp-F4tk248",
      armorClass: 12,
      hp: 58,
      speed: { fly: 40, hover: true },
      stats: {
        str: 1,
        dex: 14,
        con: 10,
        int: 12,
        wis: 11,
        cha: 17,
      },
      senses: { darkvision: 60, passivePerception: 10 },
      languages: ["Common", "Elvish"],
      challengeRating: "4",
      xp: 1100,
      proficiencyBonus: 2,
      traits: [
        {
          name: "Detect Life",
          text: "The banshee can magically sense the presence of creatures up to 5 miles away that aren’t undead or constructs. She knows the general direction they’re in but not their exact locations.",
        },
        {
          name: "Incorporeal Movement",
          text: "The banshee can move through other creatures and objects as if they were difficult terrain. She takes 5 (1d10) force damage if she ends her turn inside an object.",
        },
      ],
      actions: [
        {
          name: "Corrupting Touch",
          text: "Melee Spell Attack: +4 to hit, reach 5 ft., one target. Hit: 12 (3d6 + 2) necrotic damage.",
        },
        {
          name: "Horrifying Visage",
          text: "Each non-undead creature within 60 feet of the banshee that can see her must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. A frightened target can repeat the saving throw at the end of each of its turns, with disadvantage if the banshee is within line of sight, ending the effect on itself on a success. If a target’s saving throw is successful or the effect ends for it, the target is immune to the banshee’s Horrifying Visage for the next 24 hours.",
        },
        {
          name: "Wail (1/Day)",
          text: "The banshee releases a mournful wail, provided that she isn’t in sunlight. This wail has no effect on constructs and undead. All other creatures within 30 feet of her that can hear her must make a DC 13 Constitution saving throw. On a failure, a creature drops to 0 hit points. On a success, a creature takes 10 (3d6) psychic damage.",
        },
      ],
    },
{
    id: "nothic",
    name: "Nothic",
    type: "Aberration",
    size: "Medium",
    alignment: "Neutral Evil",
    img: "https://files.d20.io/images/424035419/FcHd6uUNsi7DO7vulKUufg/original.png",
    armorClass: 15,
    hp: 45,
    hitDice: "6d8 + 18",
    initiative: { modifier: 3, score: 13 },
    speed: { walk: 30 },
    stats: { str: 14, dex: 16, con: 16, int: 13, wis: 10, cha: 8 },
    skills: { "Arcana": 3, "Insight": 4, "Perception": 4, "Stealth": 5 },
    senses: { truesight: 120, passivePerception: 14 },
    languages: ["Undercommon"],
    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,
    habitat: ["Underdark"],
    treasure: ["Arcana"],
    actions: [
      {
        name: "Multiattack",
        text: "The nothic makes two Claw attacks.",
      },
      {
        name: "Claw",
        text: "Melee Attack Roll: +5, reach 5 ft. Hit: 8 (1d10 + 3) Slashing damage.",
      },
      {
        name: "Rotting Gaze",
        text: "Constitution Saving Throw: DC 13, one creature the nothic can see within 120 feet. Failure: 17 (5d6) Necrotic damage. Success: Half damage.",
      },
    ],
    bonusActions: [
      {
        name: "Weird Insight (Recharge 6)",
        text: "Wisdom Saving Throw: DC 14, one creature the nothic can see within 120 feet. Failure: The nothic magically learns one fact or secret about the target.",
      },
    ],
  },
{
      id: "spectator",
      name: "Spectator",
      type: "Aberration",
      size: "Medium",
      alignment: "Lawful Neutral",
      img: "https://www.dndbeyond.com/attachments/10/790/332326_spectatorinroom_lilyabdullina.jpg",
      armorClass: 14,
      armorClassNotes: "Natural Armor",
      hp: 39,
      speed: {  },
      stats: {
        str: 8,
        dex: 14,
        con: 14,
        int: 13,
        wis: 14,
        cha: 11,
      },
      senses: { darkvision: 120, passivePerception: 12 },
      languages: ["Deep Speech", "Undercommon"],
      challengeRating: "3",
      xp: 700,
      proficiencyBonus: 2,
      traits: [
        {
          name: "Hover",
          text: "The spectator can hover.",
        },
      ],
      actions: [
        {
          name: "Bite",
          text: "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 2 (1d6 − 1) piercing damage.",
        },
        {
          name: "Eye Rays",
          text: "The spectator uses two of the following eye rays at random (reroll duplicates), choosing one or two targets it can see within 90 feet:",
        },
        {
          name: "Confusion Ray",
          text: "The target must succeed on a DC 13 Wisdom saving throw or become confused for 1 minute.",
        },
        {
          name: "Paralyzing Ray",
          text: "The target must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute.",
        },
        {
          name: "Fear Ray",
          text: "The target must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute.",
        },
        {
          name: "Wounding Ray",
          text: "The target must make a DC 13 Constitution saving throw, taking 16 (3d10) necrotic damage on a failed save, or half as much on a success.",
        },
      ],
    },
{
      id: "flameskull",
      name: "Flameskull",
      type: "Undead",
      size: "Tiny",
      alignment: "Neutral Evil",
      img: "https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/flameskull.jpg?w=1600&h=900&fit=crop",
      armorClass: 13,
      hp: 40,
      speed: {  },
      stats: {
        str: 1,
        dex: 17,
        con: 14,
        int: 16,
        wis: 10,
        cha: 11,
      },
      skills: { "Arcana": 5, "Perception": 2 },
      senses: { darkvision: 60, passivePerception: 12 },
      languages: ["Common"],
      challengeRating: "4",
      xp: 1100,
      proficiencyBonus: 2,
      traits: [
        {
          name: "Illumination",
          text: "The flameskull sheds either dim light in a 15-foot radius or bright light in a 15-foot radius and dim light for an additional 15 feet. It can switch between the options as a bonus action.",
        },
        {
          name: "Rejuvenation",
          text: "If the flameskull is destroyed, it regains all its hit points in 1 hour unless holy water is sprinkled on its remains or a dispel magic or remove curse spell is cast on them.",
        },
      ],
      actions: [
        {
          name: "Multiattack",
          text: "The flameskull uses Fire Ray twice.",
        },
        {
          name: "Fire Ray",
          text: "Ranged Spell Attack: +5 to hit, range 30 ft., one target. Hit: 10 (3d6) fire damage.",
        },
        {
          name: "Spellcasting",
          text: "The flameskull is a 5th-level spellcaster (spell save DC 13, +5 to hit with spell attacks). It requires no material components and has the following spells prepared:",
        },
        {
          name: "Cantrips (at will)",
          text: "mage hand",
        },
        {
          name: "1st level (3 slots)",
          text: "magic missile, shield",
        },
        {
          name: "2nd level (2 slots)",
          text: "blur",
        },
        {
          name: "3rd level (1 slot)",
          text: "fireball",
        },
      ],
    },
{
      id: "twig-blight",
      name: "Twig Blight",
      type: "Plant",
      size: "Small",
      alignment: "Neutral Evil",
      img: "https://dungeonsolvers.com/wp-content/uploads/2024/06/artis0602_35038_best_and_powerful_pictures_of_The_Writhing_Thor_28c2d2e0-4bec-4bb4-8b2c-09a1bc6c54af.webp",
      armorClass: 13,
      armorClassNotes: "Natural Armor",
      hp: 4,
      speed: { walk: 20 },
      stats: {
        str: 6,
        dex: 13,
        con: 12,
        int: 4,
        wis: 8,
        cha: 3,
      },
      skills: { "Stealth": 3 },
      senses: { blindsight: 60, passivePerception: 9, notes: "Blind beyond this radius" },
      languages: [],
      challengeRating: "1/8",
      xp: 25,
      proficiencyBonus: 2,
      traits: [
        {
          name: "False Appearance",
          text: "While the blight remains motionless, it is indistinguishable from a dead shrub.",
        },
      ],
      actions: [
        {
          name: "Claws",
          text: "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) slashing damage.",
        },
      ],
    },
{
    id: "carrion-crawler",
    name: "Carrion Crawler",
    type: "Monstrosity",
    size: "Large",
    alignment: "Unaligned",
    img: "https://dmdave.com/wp-content/uploads/2018/10/greater-carrion-crawler.jpg",
    armorClass: 13,
    hp: 51,
    hitDice: "6d10 + 18",
    initiative: { modifier: 1, score: 11 },
    speed: { walk: 30, climb: 30 },
    stats: { str: 14, dex: 13, con: 16, int: 1, wis: 12, cha: 5 },
    skills: { "Perception": 5 },
    senses: { darkvision: 60, passivePerception: 15 },
    languages: [],
    challengeRating: "2",
    xp: 450,
    proficiencyBonus: 2,
    habitat: ["Underdark", "Urban"],
    treasure: [],
    traits: [
      {
        name: "Spider Climb",
        text: "The carrion crawler can climb difficult surfaces, including along ceilings, without needing to make an ability check.",
      },
    ],
    actions: [
      {
        name: "Multiattack",
        text: "The carrion crawler uses Paralyzing Tentacles and makes one Bite attack.",
      },
      {
        name: "Bite",
        text: "Melee Attack Roll: +4, reach 5 ft. Hit: 7 (2d4 + 2) Piercing damage plus 3 (1d6) Poison damage.",
      },
      {
        name: "Paralyzing Tentacles",
        text: "Constitution Saving Throw: DC 12, one creature the carrion crawler can see within 10 feet. Failure: The target has the Poisoned condition and repeats the save at the end of each of its turns, ending the effect on itself on a success. After 1 minute, it succeeds automatically. While Poisoned, the target has the Paralyzed condition.",
      },
    ],
  }
];

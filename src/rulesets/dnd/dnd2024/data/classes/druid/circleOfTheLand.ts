import type { CharacterSubclass } from "../../../types";

export const circleOfTheLand: CharacterSubclass = {
  id: "circle-of-the-land",
  name: "Circle of the Land",
  classId: "druid",
  description:
    "The Circle of the Land comprises mystics and sages who safeguard ancient knowledge and rites, drawing power from the natural world and the terrain they protect.",

  featuresByLevel: {
    3: [
      {
        id: "circle-of-the-land-spells",
        name: "Circle of the Land Spells",
        level: 3,
        description:
          "Whenever you finish a Long Rest, choose one type of land: arid, polar, temperate, or tropical. You have the spells listed for that land type and your Druid level or lower prepared.",
        notes: [
          "Arid Land — Level 3: Blur, Burning Hands, Fire Bolt",
          "Arid Land — Level 5: Fireball",
          "Arid Land — Level 7: Blight",
          "Arid Land — Level 9: Wall of Stone",
          "Polar Land — Level 3: Fog Cloud, Hold Person, Ray of Frost",
          "Polar Land — Level 5: Sleet Storm",
          "Polar Land — Level 7: Ice Storm",
          "Polar Land — Level 9: Cone of Cold",
          "Temperate Land — Level 3: Misty Step, Shocking Grasp, Sleep",
          "Temperate Land — Level 5: Lightning Bolt",
          "Temperate Land — Level 7: Freedom of Movement",
          "Temperate Land — Level 9: Tree Stride",
          "Tropical Land — Level 3: Acid Splash, Ray of Sickness, Web",
          "Tropical Land — Level 5: Stinking Cloud",
          "Tropical Land — Level 7: Polymorph",
          "Tropical Land — Level 9: Insect Plague",
          "You choose the land type whenever you finish a Long Rest.",
        ],
      },
      {
        id: "lands-aid",
        name: "Land’s Aid",
        level: 3,
        activation: "action",
        description:
          "As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet of yourself. Flowers and vines appear in a 10-foot-radius Sphere centered on that point.",
        notes: [
          "Each creature of your choice in the Sphere must make a Constitution saving throw against your spell save DC.",
          "A target takes 2d6 Necrotic damage on a failed save, or half as much on a successful one.",
          "One creature of your choice in the area regains 2d6 Hit Points.",
          "The damage and healing increase by 1d6 when you reach Druid levels 10 (3d6) and 14 (4d6).",
        ],
      },
    ],
    6: [
      {
        id: "natural-recovery",
        name: "Natural Recovery",
        level: 6,
        description:
          "You can channel natural power to recover spells and cast one of your Circle Spells without spending a spell slot.",
        notes: [
          "You can cast one of the level 1+ spells that you have prepared from your Circle Spells feature without expending a spell slot.",
          "Once you do so, you must finish a Long Rest before you can do so again.",
          "When you finish a Short Rest, you can choose expended spell slots to recover.",
          "The spell slots can have a combined level equal to or less than half your Druid level (round up), and none of them can be level 6+.",
          "For example, if you are a level 6 Druid, you can recover up to three levels’ worth of spell slots.",
          "Once you recover spell slots with this feature, you can’t do so again until you finish a Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: { type: "fixed", value: 1 },
          recharge: "long-rest",
        },
      },
    ],
    10: [
      {
        id: "natures-ward",
        name: "Nature’s Ward",
        level: 10,
        description:
          "You are immune to the Poisoned condition, and you gain resistance based on your current land choice from Circle Spells.",
        notes: [
          "Arid: Fire resistance",
          "Polar: Cold resistance",
          "Temperate: Lightning resistance",
          "Tropical: Poison resistance",
        ],
      },
    ],
    14: [
      {
        id: "natures-sanctuary",
        name: "Nature’s Sanctuary",
        level: 14,
        activation: "action",
        description:
          "As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube on the ground within 120 feet of yourself.",
        notes: [
          "The area lasts for 1 minute or until you have the Incapacitated condition or die.",
          "You and your allies have Half Cover while in that area.",
          "You and your allies there also gain the current resistance from your Nature’s Ward while there.",
          "As a Bonus Action, you can move the Cube up to 60 feet to ground within 120 feet of yourself.",
        ],
      },
    ],
  },
};
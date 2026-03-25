import type { CharacterSubclass } from "../../../types";

export const warDomain: CharacterSubclass = {
  id: "war-domain",
  name: "War Domain",
  classId: "cleric",
  description:
    "The War Domain excels in battle, inspiring others to fight the good fight or offering acts of violence as prayers. Clerics of this domain channel divine power into valor, martial prowess, and the destruction of their foes.",

  featuresByLevel: {
    3: [
      {
        id: "guided-strike",
        name: "Guided Strike",
        level: 3,
        description:
          "When you or a creature within 30 feet of you misses with an attack roll, you can expend one use of your Channel Divinity to give that roll a +10 bonus, potentially causing it to hit.",
        notes: [
          "When you use this feature to benefit another creature’s attack roll, you must take a Reaction to do so.",
        ],
      },
      {
        id: "war-domain-spells",
        name: "War Domain Spells",
        level: 3,
        description:
          "Your connection to this divine domain ensures you always have certain spells prepared when you reach specific Cleric levels.",
        notes: [
          "Level 3: Guiding Bolt, Magic Weapon, Shield of Faith, Spiritual Weapon",
          "Level 5: Crusader’s Mantle, Spirit Guardians",
          "Level 7: Fire Shield, Freedom of Movement",
          "Level 9: Hold Monster, Steel Wind Strike",
          "These spells are always prepared and don’t count against the number of spells you can prepare.",
        ],
      },
      {
        id: "war-priest",
        name: "War Priest",
        level: 3,
        activation: "bonus-action",
        description:
          "As a Bonus Action, you can make one attack with a weapon or an Unarmed Strike.",
        notes: [
          "You can use this Bonus Action a number of times equal to your Wisdom modifier.",
          "Minimum of once.",
          "You regain all expended uses when you finish a Short or Long Rest.",
        ],
        usage: {
          type: "limited",
          uses: {
            type: "ability-modifier",
            ability: "wis",
          },
          recharge: "short-rest",
        },
      },
    ],
    6: [
      {
        id: "wars-blessing",
        name: "War’s Blessing",
        level: 6,
        description:
          "You can expend a use of your Channel Divinity to cast Shield of Faith or Spiritual Weapon rather than expend a spell slot.",
        notes: [
          "When you cast either spell in this way, the spell doesn’t require Concentration.",
          "Instead the spell lasts for 1 minute.",
          "The spell ends early if you cast that spell again, have the Incapacitated condition, or die.",
        ],
      },
    ],
    17: [
      {
        id: "avatar-of-battle",
        name: "Avatar of Battle",
        level: 17,
        description:
          "You gain Resistance to Bludgeoning, Piercing, and Slashing damage.",
      },
    ],
  },
};
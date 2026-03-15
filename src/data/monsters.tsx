import type { StatBlockProps } from "../components/StatBlock";
import type { MonsterType } from "../components/StatBlock";

import Lhupo from "/Monsters/Lhupo.png";
import Yegg from "/Monsters/Yegg.png";
import Snarl from "/Monsters/Snarl.png";

export const monsterTypes: MonsterType[] = [
  "Aberration",
  "Beast",
  "Celestial",
  "Construct",
  "Dragon",
  "Elemental",
  "Fey",
  "Fiend",
  "Giant",
  "Humanoid",
  "Monstrosity",
  "Ooze",
  "Plant",
  "Undead",
];

export const monsters: StatBlockProps[] = [
  {
    name: "Bugbear",
    type: "Humanoid",
    description: "Medium Humanoid (Goblinoid), Chaotic Evil",
    img: "https://www.dndbeyond.com/avatars/thumbnails/47144/717/1000/1000/638742157685478339.png",
    AC: "16 (Hide Armor, Shield)",
    HP: 27,
    speed: 30,
    stats: {
      Str: 15,
      Dex: 14,
      Con: 13,
      Int: 8,
      Wis: 11,
      Cha: 9,
    },
    skills: "Stealth +6, Survival +2",
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common, Goblin",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Brute.</strong> A melee weapon deals one extra die of its
          damage when the bugbear hits with it (included in the attack).
        </p>

        <p>
          <strong>Surprise Attack.</strong> If the bugbear surprises a creature
          and hits it with an attack during the first round of combat, the
          target takes an extra 7 (2d6) damage from the attack.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Morningstar.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 11 (2d8 + 2) piercing damage.
        </p>

        <p className="mb-2">
          <strong>Javelin (Melee).</strong> <em>Melee Weapon Attack:</em> +4 to
          hit, reach 5 ft., one target. <em>Hit:</em> 9 (2d6 + 2) piercing
          damage.
        </p>

        <p>
          <strong>Javelin (Ranged).</strong> <em>Ranged Weapon Attack:</em> +4
          to hit, range 30/120 ft., one target. <em>Hit:</em> 5 (1d6 + 2)
          piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Goblin",
    type: "Humanoid",
    description: "Small Humanoid (Goblinoid), Neutral Evil",
    img: "https://www.aidedd.org/dnd/images/goblin.jpg",
    AC: "15 (Leather Armor, Shield)",
    HP: 7,
    speed: 30,
    stats: {
      Str: 8,
      Dex: 14,
      Con: 10,
      Int: 10,
      Wis: 8,
      Cha: 8,
    },
    skills: "Stealth +6",
    senses: "Darkvision 60 ft., passive Perception 9",
    language: "Common, Goblin",
    CR: "1/4 (XP 50)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) slashing damage.
        </p>

        <p>
          <strong>Shortbow.</strong> <em>Ranged Weapon Attack:</em> +4 to hit,
          range 80/320 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing
          damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Nimble Escape.</strong> The goblin can take the{" "}
          <em>Disengage</em> or <em>Hide</em> action as a bonus action on each
          of its turns.
        </p>
      </>
    ),
  },
  {
    name: "Yegg",
    type: "Humanoid",
    description: "Small Humanoid (Goblinoid), Neutral Evil",
    img: Yegg,
    AC: "15 (Leather Armor, Shield)",
    HP: 12,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 14,
      Con: 12,
      Int: 10,
      Wis: 8,
      Cha: 10,
    },
    skills: "Stealth +6, Intimidation +2",
    senses: "Darkvision 60 ft., passive Perception 9",
    language: "Common, Goblin",
    CR: "1/4 (XP 50)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) slashing damage.
        </p>

        <p>
          <strong>Meat Cleaver.</strong> <em>Melee Weapon Attack:</em> +4 to
          hit, reach 5 ft., one target. <em>Hit:</em> 6 (1d8 + 2) slashing
          damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p className="mb-2">
          <strong>Nimble Escape.</strong> Yegg can take the <em>Disengage</em>{" "}
          or <em>Hide</em> action as a bonus action on each of its turns.
        </p>

        <p>
          <strong>Kitchen Tyrant.</strong> Yegg shouts abuse at a goblin ally he
          can see within 30 ft. That goblin gains advantage on its next attack
          roll before the end of its next turn.
        </p>
      </>
    ),
  },
  {
    name: "Lhupo",
    type: "Humanoid",
    description: "Small Humanoid (Goblinoid), Neutral Evil",
    img: Lhupo,
    AC: "15 (Leather Armor, Shield)",
    HP: 12,
    speed: 30,
    stats: {
      Str: 8,
      Dex: 14,
      Con: 12,
      Int: 10,
      Wis: 12,
      Cha: 10,
    },
    skills: "Stealth +6, Religion +3, Deception +2",
    senses: "Darkvision 60 ft., passive Perception 11",
    language: "Common, Goblin",
    CR: "1/4 (XP 50)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Ritual Dagger.</strong> <em>Melee Weapon Attack:</em> +4 to
          hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d4 + 2) piercing
          damage.
        </p>

        <p>
          <strong>Shortbow.</strong> <em>Ranged Weapon Attack:</em> +4 to hit,
          range 80/320 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing
          damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p className="mb-2">
          <strong>Nimble Escape.</strong> Lhupo can take the <em>Disengage</em>{" "}
          or <em>Hide</em> action as a bonus action on each of its turns.
        </p>

        <p>
          <strong>Blessing of Maglubiyet (Recharge 5–6).</strong> Lhupo shrieks
          a prayer to Maglubiyet. One goblin ally within 30 ft. gains advantage
          on its next attack roll before the end of its next turn.
        </p>
      </>
    ),
    reactions: (
      <>
        <p>
          <strong>Protect the Prophet.</strong> When Lhupo is hit by an attack
          while within 5 ft. of a goblin ally, that goblin can become the target
          instead.
        </p>
      </>
    ),
  },
  {
    name: "Hobgoblin",
    type: "Humanoid",
    description: "Medium Humanoid (Goblinoid), Lawful Evil",
    img: "https://www.belloflostsouls.net/wp-content/uploads/2023/07/hobgoblin-feat.jpg",
    AC: "18 (Chain Mail, Shield)",
    HP: 11,
    speed: 30,
    stats: {
      Str: 13,
      Dex: 12,
      Con: 12,
      Int: 10,
      Wis: 10,
      Cha: 9,
    },
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common, Goblin",
    CR: "1/2 (XP 100)",
    traits: (
      <>
        <p>
          <strong>Martial Advantage.</strong> Once per turn, the hobgoblin can
          deal an extra 7 (2d6) damage to a creature it hits with a weapon
          attack if that creature is within 5 ft. of an ally of the hobgoblin
          that isn't incapacitated.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Longsword (Two-Handed).</strong> <em>Melee Weapon Attack:</em>{" "}
          +3 to hit, reach 5 ft., one target. <em>Hit:</em> 6 (1d10 + 1)
          slashing damage.
        </p>

        <p className="mb-2">
          <strong>Longsword (One-Handed).</strong> <em>Melee Weapon Attack:</em>{" "}
          +3 to hit, reach 5 ft., one target. <em>Hit:</em> 5 (1d8 + 1) slashing
          damage.
        </p>

        <p>
          <strong>Longbow.</strong> <em>Ranged Weapon Attack:</em> +3 to hit,
          range 150/600 ft., one target. <em>Hit:</em> 5 (1d8 + 1) piercing
          damage.
        </p>
      </>
    ),
  },
  {
    name: "Iarno Albrek",
    type: "Humanoid",
    description: "Medium Humanoid (Human, Wizard), Lawful Evil",
    img: "https://static.wikia.nocookie.net/rysarian/images/f/fa/Redwizard.jpg/revision/latest/smart/width/386/height/259?cb=20170422184717",
    AC: "12 (16 with mage armor and staff of defense)",
    HP: 22,
    speed: 30,
    stats: {
      Str: 9,
      Dex: 14,
      Con: 11,
      Int: 17,
      Wis: 12,
      Cha: 11,
    },
    skills: "Arcana +5, History +5",
    senses: "Passive Perception 11",
    language: "Common, Draconic, Dwarvish, Elvish",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p>
          <strong>Special Equipment.</strong> Glasstaff wields a staff of
          defense. With the staff in hand, he can use an action to cast the{" "}
          <em>mage armor</em> spell and use his reaction to cast the{" "}
          <em>shield</em> spell.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> Glasstaff makes two Shocking Burst
          attacks.
        </p>

        <p className="mb-2">
          <strong>Shocking Burst.</strong>{" "}
          <em>Melee or Ranged Spell Attack:</em> +5 to hit, reach 5 ft. or range
          120 ft., one target. <em>Hit:</em> 6 (1d6 + 3) lightning damage.
        </p>

        <p className="mb-2">
          <strong>Spellcasting.</strong> Glasstaff casts one of the following
          spells, requiring no material components and using Intelligence as his
          spellcasting ability (spell save DC 13):
        </p>

        <p className="mb-1 ml-4">
          <strong>At will:</strong> light, mage hand
        </p>

        <p className="ml-4">
          <strong>1/day each:</strong> charm person, hold person, magic missile
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Teleport (2/Day).</strong> Glasstaff magically teleports,
          along with any equipment he is wearing or carrying, up to 30 feet to
          an unoccupied space he can see.
        </p>
      </>
    ),
  },
  {
    name: 'Nezzar "Den sorte edderkoppen"',
    type: "Humanoid",
    description: "Medium Humanoid (Elf), Neutral Evil",
    img: "https://static.wikia.nocookie.net/dnd-angel-grove/images/0/07/Black_Spider_-_Nezzaria_Yauntyrr.jpg/revision/latest?cb=20160723130647",
    AC: "11 (14 with mage armor)",
    HP: 27,
    speed: 30,
    stats: {
      Str: 9,
      Dex: 13,
      Con: 10,
      Int: 16,
      Wis: 14,
      Cha: 13,
    },
    skills: "Arcana +5, Perception +4, Stealth +3",
    senses: "Darkvision 120 ft.",
    language: "Elvish, Undercommon",
    CR: "2 (XP 450)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Saving Throws.</strong> Int +5, Wis +4
        </p>

        <p className="mb-2">
          <strong>Special Equipment.</strong> Nezznar has a spider staff.
        </p>

        <p className="mb-2">
          <strong>Fey Ancestry.</strong> Nezznar has advantage on saving throws
          against being charmed, and magic can’t put him to sleep.
        </p>

        <p className="mb-2">
          <strong>Sunlight Sensitivity.</strong> Nezznar has disadvantage on
          attack rolls when he or his target is in sunlight.
        </p>

        <p className="mb-2">
          <strong>Innate Spellcasting.</strong> Nezznar can innately cast the
          following spells, requiring no material components:
        </p>

        <p className="mb-1 ml-4">
          <strong>At will:</strong> dancing lights
        </p>

        <p className="mb-2 ml-4">
          <strong>1/day each:</strong> darkness, faerie fire (save DC 12)
        </p>

        <p className="mb-2">
          <strong>Spellcasting.</strong> Nezznar is a 4th-level spellcaster who
          uses Intelligence as his spellcasting ability (spell save DC 13; +5 to
          hit with spell attacks). Nezznar has the following spells prepared
          from the wizard spell list:
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips (at will):</strong> mage hand, ray of frost, shocking
          grasp
        </p>

        <p className="mb-1 ml-4">
          <strong>1st Level (4 slots):</strong> mage armor, magic missile,
          shield
        </p>

        <p className="ml-4">
          <strong>2nd Level (3 slots):</strong> invisibility, suggestion
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Spider Staff.</strong> <em>Melee Weapon Attack:</em> +1 to
          hit, reach 5 ft., one target. <em>Hit:</em> 2 (1d6 - 1) bludgeoning
          damage plus 3 (1d6) poison damage.
        </p>
      </>
    ),
  },
  {
    name: "Nothic",
    type: "Aberration",
    description: "Medium Aberration, Neutral Evil",
    img: "https://files.d20.io/images/424035419/FcHd6uUNsi7DO7vulKUufg/original.png",
    AC: "15",
    HP: 45,
    speed: 30,
    stats: {
      Str: 14,
      Dex: 16,
      Con: 16,
      Int: 13,
      Wis: 10,
      Cha: 8,
    },
    skills: "Arcana +3, Insight +4, Perception +4, Stealth +5",
    senses: "Truesight 120 ft., passive Perception 14",
    language: "Undercommon",
    CR: "2 (XP 450)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Saving Throws.</strong> Str +2, Dex +3, Con +3, Int +1, Wis
          +0, Cha -1
        </p>
        <p className="mb-2">
          <strong>Habitat.</strong> Underdark
        </p>
        <p>
          <strong>Treasure.</strong> Arcana
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The nothic makes two Claw attacks.
        </p>

        <p className="mb-2">
          <strong>Claw.</strong> <em>Melee Weapon Attack:</em> +5 to hit, reach
          5 ft., one target. <em>Hit:</em> 8 (1d10 + 3) slashing damage.
        </p>

        <p>
          <strong>Rotting Gaze.</strong> <em>Constitution Saving Throw:</em> DC
          13, one creature the nothic can see within 120 feet. <em>Failure:</em>{" "}
          17 (5d6) necrotic damage. <em>Success:</em> Half damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Weird Insight (Recharge 6).</strong>{" "}
          <em>Wisdom Saving Throw:</em> DC 14, one creature the nothic can see
          within 120 feet. <em>Failure:</em> The nothic magically learns one
          fact or secret about the target.
        </p>
      </>
    ),
  },
  {
    name: "Redbrand Ruffian",
    type: "Humanoid",
    description: "Medium Humanoid (Human), Neutral Evil",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/2/28/Redbrand-ruffians.webp/revision/latest?cb=20231001232349https://static.wikia.nocookie.net/ian-melbourne-dnd/images/1/1c/Redbrand_Ruffian.png/revision/latest?cb=20180815091506https://www.aidedd.org/dnd/images/bandit.jpg",
    AC: "14 (Studded Leather Armor)",
    HP: 16,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 14,
      Con: 12,
      Int: 9,
      Wis: 9,
      Cha: 11,
    },
    skills: "Intimidation +2",
    language: "Common",
    CR: "1/2 (XP 100)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The ruffian makes two melee attacks.
        </p>

        <p>
          <strong>Shortsword.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Klarg",
    type: "Humanoid",
    description: "Medium Humanoid (Goblinoid), Chaotic Evil",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/f/fa/Klarg-et-al.webp/revision/latest?cb=20231001230817",
    AC: "16 (Hide Armor, Shield)",
    HP: 27,
    speed: 30,
    stats: {
      Str: 15,
      Dex: 14,
      Con: 13,
      Int: 8,
      Wis: 11,
      Cha: 9,
    },
    skills: "Stealth +6, Survival +2",
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common, Goblin",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Brute.</strong> A melee weapon deals one extra die of its
          damage when Klarg hits with it (included in the attack).
        </p>

        <p>
          <strong>Surprise Attack.</strong> If Klarg surprises a creature and
          hits it with an attack during the first round of combat, the target
          takes an extra 7 (2d6) damage from the attack.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Morningstar.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 11 (2d8 + 2) piercing damage.
        </p>

        <p className="mb-2">
          <strong>Javelin (Melee).</strong> <em>Melee Weapon Attack:</em> +4 to
          hit, reach 5 ft., one target. <em>Hit:</em> 9 (2d6 + 2) piercing
          damage.
        </p>

        <p>
          <strong>Javelin (Ranged).</strong> <em>Ranged Weapon Attack:</em> +4
          to hit, range 30/120 ft., one target. <em>Hit:</em> 5 (1d6 + 2)
          piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Wolf",
    type: "Beast",
    description: "Medium Beast, Unaligned",
    img: "data:image/jpeg;base64,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",
    AC: "13 (Natural Armor)",
    HP: 11,
    speed: 40,
    stats: {
      Str: 12,
      Dex: 15,
      Con: 12,
      Int: 3,
      Wis: 12,
      Cha: 6,
    },
    skills: "Perception +3, Stealth +4",
    senses: "Passive Perception 13",
    language: "-",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p>
          <strong>Keen Hearing and Smell.</strong> The wolf has advantage on
          Wisdom (Perception) checks that rely on hearing or smell.
        </p>

        <p>
          <strong>Pack Tactics.</strong> The wolf has advantage on an attack
          roll against a creature if at least one of the wolf's allies is within
          5 ft. of the creature and the ally isn't incapacitated.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach
          5 ft., one target. <em>Hit:</em> 7 (2d4 + 2) piercing damage. If the
          target is a creature, it must succeed on a DC 11 Strength saving throw
          or be knocked prone.
        </p>
      </>
    ),
  },
  {
    name: "Giant Spider",
    type: "Beast",
    description: "Large Beast, Unaligned",
    img: "https://angrygolem-games.com/wp-content/uploads/2023/09/Giant-Wolf-Spider.webp",
    AC: "14 (Natural Armor)",
    HP: 26,
    speed: 30,
    stats: {
      Str: 14,
      Dex: 16,
      Con: 12,
      Int: 2,
      Wis: 11,
      Cha: 4,
    },
    skills: "Stealth +7",
    senses: "Blindsight 10 ft., Darkvision 60 ft., passive Perception 10",
    language: "-",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Spider Climb.</strong> The spider can climb difficult
          surfaces, including upside down on ceilings, without needing to make
          an ability check.
        </p>

        <p>
          <strong>Web Sense.</strong> While in contact with a web, the spider
          knows the exact location of any other creature in contact with the
          same web.
        </p>

        <p>
          <strong>Web Walker.</strong> The spider ignores movement restrictions
          caused by webbing.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +5 to hit, reach
          5 ft., one creature. <em>Hit:</em> 7 (1d8 + 3) piercing damage, and
          the target must make a DC 11 Constitution saving throw, taking 9 (2d8)
          poison damage on a failed save, or half as much on a successful one.
          If the poison damage reduces the target to 0 hit points, the target is
          stable but poisoned for 1 hour, even after regaining hit points, and
          is paralyzed while poisoned in this way.
        </p>

        <p>
          <strong>Web (Recharge 5–6).</strong> <em>Ranged Weapon Attack:</em> +5
          to hit, range 30/60 ft., one creature. <em>Hit:</em> The target is
          restrained by webbing. As an action, the restrained target can make a
          DC 12 Strength check, bursting the webbing on a success. The webbing
          can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire
          damage; immunity to bludgeoning, poison, and psychic damage).
        </p>
      </>
    ),
  },
  {
    name: "Goblin Boss (Yeemik)",
    type: "Humanoid",
    description: "Small Humanoid (Goblinoid), Neutral Evil",
    img: "https://www.worldanvil.com/uploads/images/0ffc042c22d02cb1988052c9ff689a4f.jpg",
    AC: "17 (Chain Shirt, Shield)",
    HP: 21,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 14,
      Con: 10,
      Int: 10,
      Wis: 8,
      Cha: 10,
    },
    senses: "Darkvision 60 ft., passive Perception 9",
    language: "Common, Goblin",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p>
          <strong>Nimble Escape.</strong> The goblin boss can take the{" "}
          <em>Disengage</em> or <em>Hide</em> action as a bonus action on each
          of its turns.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The goblin boss makes two attacks with
          its scimitar.
        </p>

        <p className="mb-2">
          <strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) slashing damage.
        </p>

        <p>
          <strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +4
          to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 5
          (1d6 + 2) piercing damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Redirect Attack.</strong> When a creature the goblin boss can
          see targets it with an attack, the goblin boss chooses another goblin
          within 5 feet of it. The two goblins swap places, and the chosen
          goblin becomes the target instead.
        </p>
      </>
    ),
  },
  {
    name: "Skeleton",
    type: "Undead",
    description: "Medium Undead, Lawful Evil",
    img: "https://www.belloflostsouls.net/wp-content/uploads/2022/09/skeleton-header-image-e1663959536234.jpg",
    AC: "13 (Armor Scraps)",
    HP: 13,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 14,
      Con: 15,
      Int: 6,
      Wis: 8,
      Cha: 5,
    },
    senses: "Darkvision 60 ft., passive Perception 9",
    language: "Understands the languages it knew in life but can't speak",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p>
          <strong>Damage Vulnerabilities.</strong> Bludgeoning.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Shortsword.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.
        </p>

        <p>
          <strong>Shortbow.</strong> <em>Ranged Weapon Attack:</em> +4 to hit,
          range 80/320 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing
          damage.
        </p>
      </>
    ),
  },
  {
    name: "Doppelganger",
    type: "Monstrosity",
    description: "Medium Monstrosity (Shapechanger), Neutral",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOgPWDyieDsAzUvdjlNOYLPbbis1Q3j6AubQ&shttps://www.dndbeyond.com/avatars/thumbnails/16/428/1000/1000/636376314975406467.jpeg",
    AC: "14",
    HP: 52,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 18,
      Con: 14,
      Int: 11,
      Wis: 12,
      Cha: 14,
    },
    skills: "Deception +6, Insight +3",
    senses: "Darkvision 60 ft., passive Perception 11",
    language: "Common",
    CR: "3 (XP 700)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Shapechanger.</strong> The doppelganger can use its action to
          polymorph into a Small or Medium humanoid it has seen, or back into
          its true form. Its statistics, other than its size, are the same in
          each form. Any equipment it is wearing or carrying isn't transformed.
          It reverts to its true form if it dies.
        </p>

        <p>
          <strong>Ambusher.</strong> In the first round of combat, the
          doppelganger has advantage on attack rolls against any creature it
          surprised.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The doppelganger makes two melee
          attacks.
        </p>

        <p className="mb-2">
          <strong>Slam.</strong> <em>Melee Weapon Attack:</em> +6 to hit, reach
          5 ft., one target. <em>Hit:</em> 7 (1d6 + 4) bludgeoning damage.
        </p>

        <p>
          <strong>Read Thoughts.</strong> The doppelganger magically reads the
          surface thoughts of one creature within 60 feet of it. The effect can
          penetrate barriers but 3 feet of wood or dirt, 2 feet of stone, 2
          inches of metal, or a thin sheet of lead blocks it. While the target
          is in range, the doppelganger can continue reading its thoughts as
          long as the doppelganger's concentration isn't broken (as if
          concentrating on a spell). While reading the target's mind, the
          doppelganger has advantage on Wisdom (Insight) and Charisma
          (Deception, Intimidation, and Persuasion) checks against the target.
        </p>
      </>
    ),
  },
  {
    name: "Grick",
    type: "Monstrosity",
    description: "Medium Monstrosity, Neutral",
    img: "https://static0.thegamerimages.com/wordpress/wp-content/uploads/2025/02/copy-of-untitled-2025-02-27t114454-528.jpg?q=49&fit=crop&w=825&dpr=2",
    AC: "14 (Natural Armor)",
    HP: 27,
    speed: "30 ft., climb 30 ft.",
    stats: {
      Str: 14,
      Dex: 14,
      Con: 11,
      Int: 3,
      Wis: 14,
      Cha: 5,
    },
    senses: "Darkvision 60 ft., passive Perception 12",
    language: "—",
    CR: "2 (XP 450)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Damage Resistances.</strong> Bludgeoning, piercing, and
          slashing from nonmagical attacks.
        </p>

        <p>
          <strong>Stone Camouflage.</strong> The grick has advantage on
          Dexterity (Stealth) checks made to hide in rocky terrain.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The grick makes one attack with its
          tentacles. If that attack hits, the grick can make one beak attack
          against the same target.
        </p>

        <p className="mb-2">
          <strong>Tentacles.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 9 (2d6 + 2) slashing damage.
        </p>

        <p>
          <strong>Beak.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach
          5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Zombie",
    type: "Undead",
    description: "Medium Undead, Neutral Evil",
    img: "https://images.squarespace-cdn.com/content/v1/5dadaf88e03a4e6bb69307dd/1617289354531-B91NQJTNV3JTEC4E2IWO/d4b25f1a2cd491d1bd7bbdcd1b237859.jpg?format=1000w",
    AC: "8",
    HP: 22,
    speed: 20,
    stats: {
      Str: 13,
      Dex: 6,
      Con: 16,
      Int: 3,
      Wis: 6,
      Cha: 5,
    },
    senses: "Darkvision 60 ft., passive Perception 8",
    language: "Understands the languages it knew in life but can't speak",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p>
          <strong>Undead Fortitude.</strong> If damage reduces the zombie to 0
          hit points, it must make a Constitution saving throw with a DC of 5 +
          the damage taken, unless the damage is radiant or from a critical hit.
          On a success, the zombie drops to 1 hit point instead.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Slam.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) bludgeoning damage.
        </p>
      </>
    ),
  },
  {
    name: "Orc",
    type: "Humanoid",
    description: "Medium Humanoid (Orc), Chaotic Evil",
    img: "https://thinkchristian-website.imgix.net/articleImages/2022/TC-DD-2022-craft.jpeg?auto=format%2Ccompress&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=500&ixlib=php-1.1.0&q=80&w=800&s=a7b9ab23e95c0cb7f9b0ad2f3fd603fb",
    AC: "13 (Hide Armor)",
    HP: 15,
    speed: 30,
    stats: {
      Str: 16,
      Dex: 12,
      Con: 16,
      Int: 7,
      Wis: 11,
      Cha: 10,
    },
    skills: "Intimidation +2",
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common, Orc",
    CR: "1/2 (XP 100)",
    traits: (
      <>
        <p>
          <strong>Aggressive.</strong> As a bonus action, the orc can move up to
          its speed toward a hostile creature that it can see.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Greataxe.</strong> <em>Melee Weapon Attack:</em> +5 to hit,
          reach 5 ft., one target. <em>Hit:</em> 9 (1d12 + 3) slashing damage.
        </p>

        <p>
          <strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +5
          to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 6
          (1d6 + 3) piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Brughor Axe-Biter",
    type: "Humanoid",
    description: "Medium Humanoid (Orc), Chaotic Evil",
    img: "/Monsters/BrughorAxeBiter.png",
    AC: "13 (Hide Armor)",
    HP: 30,
    speed: 30,
    stats: {
      Str: 16,
      Dex: 12,
      Con: 16,
      Int: 7,
      Wis: 11,
      Cha: 12,
    },
    skills: "Intimidation +3",
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common, Orc",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Aggressive.</strong> As a bonus action, Brughor can move up to
          his speed toward a hostile creature that he can see.
        </p>

        <p>
          <strong>Battle Leader.</strong> Allied orcs within 30 ft. of Brughor
          that can hear him have advantage on saving throws against being
          frightened.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Greataxe.</strong> <em>Melee Weapon Attack:</em> +5 to hit,
          reach 5 ft., one target. <em>Hit:</em> 9 (1d12 + 3) slashing damage.
        </p>

        <p>
          <strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +5
          to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 6
          (1d6 + 3) piercing damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Command the Raid (Recharge 5–6).</strong> Brughor bellows an
          order to one allied orc within 30 ft. that can hear him. That creature
          can use its reaction to move up to half its speed or make one weapon
          attack.
        </p>
      </>
    ),
  },
  {
    name: "Young Green Dragon",
    type: "Dragon",
    description: "Large Dragon, Lawful Evil",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/8/84/VenomFang.jpg/revision/latest?cb=20191007180410https://www.dndbeyond.com/avatars/thumbnails/16/431/1000/1000/636376315040015885.jpeg",
    AC: "18 (Natural Armor)",
    HP: 136,
    speed: 40,
    stats: {
      Str: 19,
      Dex: 12,
      Con: 17,
      Int: 16,
      Wis: 13,
      Cha: 15,
    },
    skills: "Deception +6, Insight +4, Perception +7, Stealth +4",
    senses: "Blindsight 30 ft., Darkvision 120 ft., passive Perception 17",
    language: "Common, Draconic",
    CR: "8 (XP 3900)",
    traits: (
      <>
        <p>
          <strong>Amphibious.</strong> The dragon can breathe air and water.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The dragon makes three attacks: one with
          its bite and two with its claws.
        </p>

        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          10 ft., one target. <em>Hit:</em> 15 (2d10 + 4) piercing damage plus 7
          (2d6) poison damage.
        </p>

        <p className="mb-2">
          <strong>Claw.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          5 ft., one target. <em>Hit:</em> 11 (2d6 + 4) slashing damage.
        </p>

        <p>
          <strong>Poison Breath (Recharge 5–6).</strong> The dragon exhales
          poisonous gas in a 30-foot cone. Each creature in that area must make
          a DC 15 Constitution saving throw, taking 42 (12d6) poison damage on a
          failed save, or half as much on a successful one.
        </p>
      </>
    ),
  },
  {
    name: "Venomfang",
    type: "Dragon",
    description: "Large Dragon, Lawful Evil",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/8/84/VenomFang.jpg/revision/latest?cb=20191007180410https://www.dndbeyond.com/avatars/thumbnails/16/431/1000/1000/636376315040015885.jpeg",
    AC: "18 (Natural Armor)",
    HP: 136,
    speed: 40,
    stats: {
      Str: 19,
      Dex: 12,
      Con: 17,
      Int: 16,
      Wis: 13,
      Cha: 15,
    },
    skills: "Deception +6, Insight +4, Perception +7, Stealth +4",
    senses: "Blindsight 30 ft., Darkvision 120 ft., passive Perception 17",
    language: "Common, Draconic",
    CR: "8 (XP 3900)",
    traits: (
      <>
        <p>
          <strong>Amphibious.</strong> The dragon can breathe air and water.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The dragon makes three attacks: one with
          its bite and two with its claws.
        </p>

        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          10 ft., one target. <em>Hit:</em> 15 (2d10 + 4) piercing damage plus 7
          (2d6) poison damage.
        </p>

        <p className="mb-2">
          <strong>Claw.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          5 ft., one target. <em>Hit:</em> 11 (2d6 + 4) slashing damage.
        </p>

        <p>
          <strong>Poison Breath (Recharge 5–6).</strong> The dragon exhales
          poisonous gas in a 30-foot cone. Each creature in that area must make
          a DC 15 Constitution saving throw, taking 42 (12d6) poison damage on a
          failed save, or half as much on a successful one.
        </p>
      </>
    ),
  },
  {
    name: "Ghoul",
    type: "Undead",
    description: "Medium Undead, Chaotic Evil",
    img: "https://www.dndbeyond.com/avatars/thumbnails/47138/842/1000/1000/638741964088762348.png",
    AC: "12",
    HP: 22,
    speed: 30,
    stats: {
      Str: 13,
      Dex: 15,
      Con: 10,
      Int: 7,
      Wis: 10,
      Cha: 6,
    },
    senses: "Darkvision 60 ft., passive Perception 10",
    language: "Common",
    CR: "1 (XP 200)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +2 to hit, reach
          5 ft., one creature. <em>Hit:</em> 9 (2d6 + 2) piercing damage.
        </p>

        <p>
          <strong>Claws.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach
          5 ft., one target. <em>Hit:</em> 7 (2d4 + 2) slashing damage. If the
          target is a creature other than an elf or undead, it must succeed on a
          DC 10 Constitution saving throw or be paralyzed for 1 minute. The
          target can repeat the saving throw at the end of each of its turns,
          ending the effect on itself on a success.
        </p>
      </>
    ),
  },
  {
    name: "Spectator",
    type: "Aberration",
    description: "Medium Aberration, Lawful Neutral",
    img: "https://www.dndbeyond.com/attachments/10/790/332326_spectatorinroom_lilyabdullina.jpg",
    AC: "14 (Natural Armor)",
    HP: 39,
    speed: 0,
    stats: {
      Str: 8,
      Dex: 14,
      Con: 14,
      Int: 13,
      Wis: 14,
      Cha: 11,
    },
    senses: "Darkvision 120 ft., passive Perception 12",
    language: "Deep Speech, Undercommon",
    CR: "3 (XP 700)",
    traits: (
      <>
        <p>
          <strong>Hover.</strong> The spectator can hover.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +1 to hit, reach
          5 ft., one target. <em>Hit:</em> 2 (1d6 − 1) piercing damage.
        </p>

        <p>
          <strong>Eye Rays.</strong> The spectator uses two of the following eye
          rays at random (reroll duplicates), choosing one or two targets it can
          see within 90 feet:
        </p>

        <p className="ml-4">
          <strong>Confusion Ray.</strong> The target must succeed on a DC 13
          Wisdom saving throw or become confused for 1 minute.
        </p>

        <p className="ml-4">
          <strong>Paralyzing Ray.</strong> The target must succeed on a DC 13
          Constitution saving throw or be paralyzed for 1 minute.
        </p>

        <p className="ml-4">
          <strong>Fear Ray.</strong> The target must succeed on a DC 13 Wisdom
          saving throw or be frightened for 1 minute.
        </p>

        <p className="ml-4">
          <strong>Wounding Ray.</strong> The target must make a DC 13
          Constitution saving throw, taking 16 (3d10) necrotic damage on a
          failed save, or half as much on a success.
        </p>
      </>
    ),
  },
  {
    name: "Flameskull",
    type: "Undead",
    description: "Tiny Undead, Neutral Evil",
    img: "https://static0.thegamerimages.com/wordpress/wp-content/uploads/2024/04/flameskull.jpg?w=1600&h=900&fit=crop",
    AC: "13",
    HP: 40,
    speed: 0,
    stats: {
      Str: 1,
      Dex: 17,
      Con: 14,
      Int: 16,
      Wis: 10,
      Cha: 11,
    },
    skills: "Arcana +5, Perception +2",
    senses: "Darkvision 60 ft., passive Perception 12",
    language: "Common",
    CR: "4 (XP 1100)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Illumination.</strong> The flameskull sheds either dim light
          in a 15-foot radius or bright light in a 15-foot radius and dim light
          for an additional 15 feet. It can switch between the options as a
          bonus action.
        </p>

        <p>
          <strong>Rejuvenation.</strong> If the flameskull is destroyed, it
          regains all its hit points in 1 hour unless holy water is sprinkled on
          its remains or a <em>dispel magic</em> or <em>remove curse</em> spell
          is cast on them.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The flameskull uses Fire Ray twice.
        </p>

        <p className="mb-2">
          <strong>Fire Ray.</strong> <em>Ranged Spell Attack:</em> +5 to hit,
          range 30 ft., one target. <em>Hit:</em> 10 (3d6) fire damage.
        </p>

        <p>
          <strong>Spellcasting.</strong> The flameskull is a 5th-level
          spellcaster (spell save DC 13, +5 to hit with spell attacks). It
          requires no material components and has the following spells prepared:
        </p>

        <p className="ml-4">
          <strong>Cantrips (at will):</strong> mage hand
        </p>

        <p className="ml-4">
          <strong>1st level (3 slots):</strong> magic missile, shield
        </p>

        <p className="ml-4">
          <strong>2nd level (2 slots):</strong> blur
        </p>

        <p className="ml-4">
          <strong>3rd level (1 slot):</strong> fireball
        </p>
      </>
    ),
  },
  {
    name: "Wraith",
    type: "Undead",
    description: "Medium Undead, Neutral Evil",
    img: "https://i.ytimg.com/vi/FpqAtMGIPeU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA4eF4PG55906reOrf0_upmSfRKBg",
    AC: "13",
    HP: 67,
    speed: 0,
    stats: {
      Str: 6,
      Dex: 16,
      Con: 16,
      Int: 12,
      Wis: 14,
      Cha: 15,
    },
    senses: "Darkvision 60 ft., passive Perception 12",
    language: "The languages it knew in life",
    CR: "5 (XP 1800)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Incorporeal Movement.</strong> The wraith can move through
          other creatures and objects as if they were difficult terrain. It
          takes 5 (1d10) force damage if it ends its turn inside an object.
        </p>

        <p>
          <strong>Sunlight Sensitivity.</strong> While in sunlight, the wraith
          has disadvantage on attack rolls, as well as on Wisdom (Perception)
          checks that rely on sight.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Life Drain.</strong> <em>Melee Weapon Attack:</em> +6 to hit,
          reach 5 ft., one creature. <em>Hit:</em> 21 (4d8 + 3) necrotic damage.
          The target must succeed on a DC 14 Constitution saving throw or its
          hit point maximum is reduced by an amount equal to the damage taken.
          This reduction lasts until the target finishes a long rest. The target
          dies if this effect reduces its hit point maximum to 0.
        </p>

        <p>
          <strong>Create Specter.</strong> The wraith targets a humanoid within
          10 feet of it that has been dead for no longer than 1 minute and died
          violently. The target's spirit rises as a specter under the wraith's
          control.
        </p>
      </>
    ),
  },
  {
    name: "Ogre",
    type: "Giant",
    description: "Large Giant, Chaotic Evil",
    img: "https://www.aidedd.org/monster/img/ogre.jpg",
    AC: "11 (Hide Armor)",
    HP: 59,
    speed: 40,
    stats: {
      Str: 19,
      Dex: 8,
      Con: 16,
      Int: 5,
      Wis: 7,
      Cha: 7,
    },
    senses: "Darkvision 60 ft., passive Perception 8",
    language: "Common, Giant",
    CR: "2 (XP 450)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Greatclub.</strong> <em>Melee Weapon Attack:</em> +6 to hit,
          reach 5 ft., one target. <em>Hit:</em> 13 (2d8 + 4) bludgeoning
          damage.
        </p>

        <p>
          <strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +6
          to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 11
          (2d6 + 4) piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Twig Blight",
    type: "Plant",
    description: "Small Plant, Neutral Evil",
    img: "https://dungeonsolvers.com/wp-content/uploads/2024/06/artis0602_35038_best_and_powerful_pictures_of_The_Writhing_Thor_28c2d2e0-4bec-4bb4-8b2c-09a1bc6c54af.webp",
    AC: "13 (Natural Armor)",
    HP: 4,
    speed: 20,
    stats: {
      Str: 6,
      Dex: 13,
      Con: 12,
      Int: 4,
      Wis: 8,
      Cha: 3,
    },
    skills: "Stealth +3",
    senses:
      "Blindsight 60 ft. (blind beyond this radius), passive Perception 9",
    language: "—",
    CR: "1/8 (XP 25)",
    traits: (
      <>
        <p>
          <strong>False Appearance.</strong> While the blight remains
          motionless, it is indistinguishable from a dead shrub.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Claws.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 3 (1d4 + 1) slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Ash Zombie",
    type: "Undead",
    description: "Medium Undead, Neutral Evil",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/8/84/Ash-zombie.webp/revision/latest?cb=20231002214113https://www.dndbeyond.com/avatars/thumbnails/16/452/1000/1000/636376315448564641.jpeg",
    AC: "8",
    HP: 22,
    speed: 20,
    stats: {
      Str: 13,
      Dex: 6,
      Con: 16,
      Int: 3,
      Wis: 6,
      Cha: 5,
    },
    senses: "Darkvision 60 ft., passive Perception 8",
    language: "Understands the languages it knew in life but can't speak",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Ash Puff.</strong> When the ash zombie drops to 0 hit points,
          it explodes into a cloud of ash. Each creature within 10 feet of it
          must succeed on a DC 10 Constitution saving throw or be blinded until
          the end of the creature's next turn.
        </p>

        <p>
          <strong>Undead Fortitude.</strong> If damage reduces the zombie to 0
          hit points, it must make a Constitution saving throw with a DC of 5 +
          the damage taken, unless the damage is radiant or from a critical hit.
          On a success, the zombie drops to 1 hit point instead.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Slam.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) bludgeoning damage.
        </p>
      </>
    ),
  },
  {
    name: "Cultist",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Neutral Evil",
    img: "https://dungeonsolvers.com/wp-content/uploads/2024/03/artis0602_35038_Cultist_organizations_in_your_DD_campaign_can_s_566d47ad-786c-425f-af26-c0eaf2b34e5e.webp",
    AC: "12 (Leather Armor)",
    HP: 9,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 12,
      Con: 10,
      Int: 10,
      Wis: 11,
      Cha: 10,
    },
    skills: "Deception +2, Religion +2",
    senses: "Passive Perception 10",
    language: "Any one language (usually Common)",
    CR: "1/8 (XP 25)",
    traits: (
      <>
        <p>
          <strong>Dark Devotion.</strong> The cultist has advantage on saving
          throws against being charmed or frightened.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +3 to hit,
          reach 5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Commoner",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Alignment",
    img: "",
    AC: "10",
    HP: 4,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 10,
      Con: 10,
      Int: 10,
      Wis: 10,
      Cha: 10,
    },
    senses: "Passive Perception 10",
    language: "Any (usually Common)",
    CR: "0 (XP 10)",
    actions: (
      <>
        <p>
          <strong>Club.</strong> <em>Melee Weapon Attack:</em> +2 to hit, reach
          5 ft., one target. <em>Hit:</em> 2 (1d4) bludgeoning damage.
        </p>
      </>
    ),
  },
  {
    name: "Guard",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Alignment",
    img: "",
    AC: "16 (Chain Shirt, Shield)",
    HP: 11,
    speed: 30,
    stats: {
      Str: 13,
      Dex: 12,
      Con: 12,
      Int: 10,
      Wis: 11,
      Cha: 10,
    },
    senses: "Passive Perception 10",
    language: "Any (usually Common)",
    CR: "1/8 (XP 25)",
    actions: (
      <>
        <p>
          <strong>Spear.</strong> <em>Melee or Ranged Weapon Attack:</em> +3 to
          hit, reach 5 ft. or range 20/60 ft., one target. <em>Hit:</em> 4 (1d6
          + 1) piercing damage, or 5 (1d8 + 1) piercing damage if used with two
          hands to make a melee attack.
        </p>
      </>
    ),
  },
  {
    name: "Mastiff",
    type: "Beast",
    description: "Medium Beast, Unaligned",
    img: "",
    AC: "12",
    HP: 5,
    speed: 40,
    stats: {
      Str: 13,
      Dex: 14,
      Con: 12,
      Int: 3,
      Wis: 12,
      Cha: 7,
    },
    skills: "Perception +3",
    senses: "Passive Perception 13",
    CR: "1/8 (XP 25)",
    traits: (
      <>
        <p>
          <strong>Keen Hearing and Smell.</strong> The mastiff has advantage on
          Wisdom (Perception) checks that rely on hearing or smell.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) piercing damage. If the
          target is a creature, it must succeed on a DC 11 Strength saving throw
          or be knocked prone.
        </p>
      </>
    ),
  },
  {
    name: "Bandit",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Non-Lawful Alignment",
    img: "",
    AC: "12 (Leather Armor)",
    HP: 11,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 12,
      Con: 12,
      Int: 10,
      Wis: 10,
      Cha: 10,
    },
    senses: "Passive Perception 10",
    language: "Any one language (usually Common)",
    CR: "1/8 (XP 25)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Scimitar.</strong> <em>Melee Weapon Attack:</em> +3 to hit,
          reach 5 ft., one target. <em>Hit:</em> 4 (1d6 + 1) slashing damage.
        </p>

        <p>
          <strong>Light Crossbow.</strong> <em>Ranged Weapon Attack:</em> +3 to
          hit, range 80/320 ft., one target. <em>Hit:</em> 5 (1d8 + 1) piercing
          damage.
        </p>
      </>
    ),
  },
  {
    name: "Thug",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Non-Good Alignment",
    img: "",
    AC: "11 (Leather Armor)",
    HP: 32,
    speed: 30,
    stats: {
      Str: 15,
      Dex: 11,
      Con: 14,
      Int: 10,
      Wis: 10,
      Cha: 11,
    },
    skills: "Intimidation +2",
    senses: "Passive Perception 10",
    language: "Any one language (usually Common)",
    CR: "1/2 (XP 100)",
    traits: (
      <>
        <p>
          <strong>Pack Tactics.</strong> The thug has advantage on an attack
          roll against a creature if at least one of the thug's allies is within
          5 ft. of the creature and the ally isn't incapacitated.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The thug makes two melee attacks.
        </p>

        <p className="mb-2">
          <strong>Mace.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach
          5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) bludgeoning damage.
        </p>

        <p>
          <strong>Heavy Crossbow.</strong> <em>Ranged Weapon Attack:</em> +2 to
          hit, range 100/400 ft., one target. <em>Hit:</em> 5 (1d10) piercing
          damage.
        </p>
      </>
    ),
  },
  {
    name: "Scout",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Alignment",
    img: "",
    AC: "13 (Leather Armor)",
    HP: 16,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 14,
      Con: 12,
      Int: 11,
      Wis: 13,
      Cha: 11,
    },
    skills: "Nature +4, Perception +5, Stealth +6, Survival +5",
    senses: "Passive Perception 15",
    language: "Any one language (usually Common)",
    CR: "1/2 (XP 100)",
    traits: (
      <>
        <p>
          <strong>Keen Hearing and Sight.</strong> The scout has advantage on
          Wisdom (Perception) checks that rely on hearing or sight.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The scout makes two melee attacks or two
          ranged attacks.
        </p>

        <p className="mb-2">
          <strong>Shortsword.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.
        </p>

        <p>
          <strong>Longbow.</strong> <em>Ranged Weapon Attack:</em> +4 to hit,
          range 150/600 ft., one target. <em>Hit:</em> 6 (1d8 + 2) piercing
          damage.
        </p>
      </>
    ),
  },
  {
    name: "Veteran",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Alignment",
    img: "",
    AC: "17 (Splint)",
    HP: 58,
    speed: 30,
    stats: {
      Str: 16,
      Dex: 13,
      Con: 14,
      Int: 10,
      Wis: 11,
      Cha: 10,
    },
    skills: "Athletics +5, Perception +2",
    senses: "Passive Perception 12",
    language: "Any one language (usually Common)",
    CR: "3 (XP 700)",
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The veteran makes two longsword attacks.
          If it has a shortsword drawn, it can also make a shortsword attack.
        </p>

        <p className="mb-2">
          <strong>Longsword.</strong> <em>Melee Weapon Attack:</em> +5 to hit,
          reach 5 ft., one target. <em>Hit:</em> 7 (1d8 + 3) slashing damage, or
          8 (1d10 + 3) slashing damage if used with two hands to make a melee
          attack.
        </p>

        <p className="mb-2">
          <strong>Shortsword.</strong> <em>Melee Weapon Attack:</em> +5 to hit,
          reach 5 ft., one target. <em>Hit:</em> 6 (1d6 + 3) piercing damage.
        </p>

        <p>
          <strong>Heavy Crossbow.</strong> <em>Ranged Weapon Attack:</em> +3 to
          hit, range 100/400 ft., one target. <em>Hit:</em> 6 (1d10 + 1)
          piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Acolyte",
    type: "Humanoid",
    description: "Medium Humanoid (Any Race), Any Alignment",
    img: "",
    AC: "10",
    HP: 9,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 10,
      Con: 10,
      Int: 10,
      Wis: 14,
      Cha: 11,
    },
    skills: "Medicine +4, Religion +2",
    senses: "Passive Perception 12",
    language: "Any one language (usually Common)",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p>
          <strong>Spellcasting.</strong> The acolyte is a 1st-level spellcaster.
          Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with
          spell attacks). It has the following cleric spells prepared:
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips (at will):</strong> light, sacred flame, thaumaturgy
        </p>

        <p className="ml-4">
          <strong>1st level (3 slots):</strong> bless, cure wounds, sanctuary
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Club.</strong> <em>Melee Weapon Attack:</em> +2 to hit, reach
          5 ft., one target. <em>Hit:</em> 2 (1d4) bludgeoning damage.
        </p>
      </>
    ),
  },
  {
    name: "Sildar Hallwinter",
    type: "Humanoid",
    description: "Medium Humanoid (Human), Lawful Good",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/4/4b/Sildar-hallwinter.webp/revision/latest?cb=20230930202940",
    AC: "16 (Chain Shirt, Shield)",
    HP: 27,
    speed: 30,
    stats: {
      Str: 14,
      Dex: 12,
      Con: 14,
      Int: 11,
      Wis: 13,
      Cha: 13,
    },
    skills: "Athletics +4, Insight +3, Perception +3, Persuasion +3",
    senses: "Passive Perception 13",
    language: "Common",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Brave.</strong> Sildar has advantage on saving throws against
          being frightened.
        </p>

        <p>
          <strong>Protector.</strong> When a creature Sildar can see attacks a
          target other than him within 5 ft. of him, Sildar can impose
          disadvantage on the attack roll if he is wielding a shield.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> Sildar makes two longsword attacks.
        </p>

        <p className="mb-2">
          <strong>Longsword.</strong> <em>Melee Weapon Attack:</em> +4 to hit,
          reach 5 ft., one target. <em>Hit:</em> 6 (1d8 + 2) slashing damage, or
          7 (1d10 + 2) slashing damage if used with two hands.
        </p>

        <p>
          <strong>Light Crossbow.</strong> <em>Ranged Weapon Attack:</em> +3 to
          hit, range 80/320 ft., one target. <em>Hit:</em> 5 (1d8 + 1) piercing
          damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Second Wind (1/Short Rest).</strong> Sildar regains 7 (1d10 +
          2) hit points.
        </p>
      </>
    ),
  },
  {
    name: "Owlbear",
    type: "Monstrosity",
    description: "Large Monstrosity, Unaligned",
    img: "https://static.wikia.nocookie.net/forgottenrealms/images/6/60/Owlbear_AFR.jpg/revision/latest?cb=20210702071532",
    AC: "13 (Natural Armor)",
    HP: 59,
    speed: 40,
    stats: {
      Str: 20,
      Dex: 12,
      Con: 17,
      Int: 3,
      Wis: 12,
      Cha: 7,
    },
    skills: "Perception +3",
    senses: "Darkvision 60 ft., Passive Perception 13",
    CR: "3 (XP 700)",
    traits: (
      <>
        <p>
          <strong>Keen Sight and Smell.</strong> The owlbear has advantage on
          Wisdom (Perception) checks that rely on sight or smell.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The owlbear makes two attacks: one with
          its beak and one with its claws.
        </p>

        <p className="mb-2">
          <strong>Beak.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          5 ft., one target. <em>Hit:</em> 10 (1d10 + 5) piercing damage.
        </p>

        <p>
          <strong>Claws.</strong> <em>Melee Weapon Attack:</em> +7 to hit, reach
          5 ft., one target. <em>Hit:</em> 14 (2d8 + 5) slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Black Bear",
    type: "Beast",
    description: "Medium Beast, Unaligned",
    img: "https://dungeonsolvers.com/wp-content/uploads/2024/12/artis0602_35038_In_Dungeons__Dragons_5th_Edition_the_black_bear_08e8333d-bb15-4b69-8e43-1ed01ee27f1e.webp",
    AC: "11 (Natural Armor)",
    HP: 19,
    speed: "40 ft., climb 30 ft.",
    stats: {
      Str: 15,
      Dex: 10,
      Con: 14,
      Int: 2,
      Wis: 12,
      Cha: 7,
    },
    skills: "Perception +3",
    senses: "Passive Perception 13",
    CR: "1/2 (XP 100)",
    traits: (
      <>
        <p>
          <strong>Keen Smell.</strong> The bear has advantage on Wisdom
          (Perception) checks that rely on smell.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The bear makes two attacks: one with its
          bite and one with its claws.
        </p>

        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 5 (1d6 + 2) piercing damage.
        </p>

        <p>
          <strong>Claws.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one target. <em>Hit:</em> 7 (2d4 + 2) slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Brown Bear",
    type: "Beast",
    description: "Large Beast, Unaligned",
    img: "https://static.wikia.nocookie.net/mythgate5884/images/2/25/Runebear1.jpg/revision/latest/thumbnail/width/360/height/360?cb=20230618031258",
    AC: "11 (Natural Armor)",
    HP: 34,
    speed: "40 ft., climb 30 ft.",
    stats: {
      Str: 19,
      Dex: 10,
      Con: 16,
      Int: 2,
      Wis: 13,
      Cha: 7,
    },
    skills: "Perception +3",
    senses: "Passive Perception 13",
    CR: "1 (XP 200)",
    traits: (
      <>
        <p>
          <strong>Keen Smell.</strong> The bear has advantage on Wisdom
          (Perception) checks that rely on smell.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> The bear makes two attacks: one with its
          bite and one with its claws.
        </p>

        <p className="mb-2">
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +5 to hit, reach
          5 ft., one target. <em>Hit:</em> 8 (1d8 + 4) piercing damage.
        </p>

        <p>
          <strong>Claws.</strong> <em>Melee Weapon Attack:</em> +5 to hit, reach
          5 ft., one target. <em>Hit:</em> 11 (2d6 + 4) slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Giant Wolf Spider",
    type: "Beast",
    description: "Medium Beast, Unaligned",
    img: "https://www.worldanvil.com/uploads/images/ea971ed87cae07e3f04746fc4de84595.jpg",
    AC: "13",
    HP: 11,
    speed: "40 ft., climb 40 ft.",
    stats: {
      Str: 12,
      Dex: 16,
      Con: 13,
      Int: 3,
      Wis: 12,
      Cha: 4,
    },
    skills: "Perception +3, Stealth +7",
    senses: "Blindsight 10 ft., Darkvision 60 ft., Passive Perception 13",
    CR: "1/4 (XP 50)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Spider Climb.</strong> The spider can climb difficult
          surfaces, including upside down on ceilings, without needing to make
          an ability check.
        </p>

        <p className="mb-2">
          <strong>Web Sense.</strong> While in contact with a web, the spider
          knows the exact location of any other creature in contact with the
          same web.
        </p>

        <p>
          <strong>Web Walker.</strong> The spider ignores movement restrictions
          caused by webbing.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +3 to hit, reach
          5 ft., one creature. <em>Hit:</em> 4 (1d6 + 1) piercing damage, and
          the target must make a DC 11 Constitution saving throw, taking 7 (2d6)
          poison damage on a failed save, or half as much on a successful one.
          If the poison damage reduces the target to 0 hit points, the target is
          stable but poisoned for 1 hour, even after regaining hit points, and
          is paralyzed while poisoned in this way.
        </p>
      </>
    ),
  },
  {
    name: "King Grol",
    type: "Humanoid",
    description: "Medium Humanoid (Goblinoid), Neutral Evil",
    img: "https://static.wikia.nocookie.net/the-hanged-three/images/0/09/King_Grol.jpg/revision/latest?cb=20170825204945",
    AC: "17 (Hide Armor, Shield)",
    HP: 45,
    speed: 30,
    stats: {
      Str: 17,
      Dex: 14,
      Con: 14,
      Int: 10,
      Wis: 11,
      Cha: 12,
    },
    skills: "Intimidation +3, Perception +2, Stealth +6",
    senses: "Darkvision 60 ft., Passive Perception 12",
    language: "Common, Goblin",
    CR: "2 (XP 450)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Brute.</strong> A melee weapon deals one extra die of its
          damage when King Grol hits with it (included in the attack).
        </p>

        <p>
          <strong>Surprise Attack.</strong> If King Grol surprises a creature
          and hits it with an attack during the first round of combat, the
          target takes an extra 7 (2d6) damage from the attack.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Morningstar.</strong> <em>Melee Weapon Attack:</em> +5 to hit,
          reach 5 ft., one target. <em>Hit:</em> 12 (2d8 + 3) piercing damage.
        </p>

        <p>
          <strong>Javelin.</strong> <em>Melee or Ranged Weapon Attack:</em> +5
          to hit, reach 5 ft. or range 30/120 ft., one target. <em>Hit:</em> 6
          (1d6 + 3) piercing damage.
        </p>
      </>
    ),
  },
  {
    name: "Snarl",
    type: "Beast",
    description: "Medium Beast, Unaligned",
    img: Snarl,
    AC: "13 (Natural Armor)",
    HP: 18,
    speed: 40,
    stats: {
      Str: 12,
      Dex: 15,
      Con: 12,
      Int: 3,
      Wis: 12,
      Cha: 6,
    },
    skills: "Perception +3, Stealth +4",
    senses: "Passive Perception 13",
    language: "-",
    CR: "1/4 (XP 50)",
    actions: (
      <>
        <p>
          <strong>Bite.</strong> <em>Melee Weapon Attack:</em> +4 to hit, reach
          5 ft., one target. <em>Hit:</em> 7 (2d4 + 2) piercing damage. If the
          target is a creature, it must succeed on a{" "}
          <strong>DC 11 Strength saving throw</strong> or be knocked{" "}
          <strong>prone</strong>.
        </p>
      </>
    ),
    traits: (
      <>
        <p>
          <strong>Keen Hearing and Smell.</strong> Snarl has advantage on Wisdom
          (Perception) checks that rely on hearing or smell.
        </p>

        <p>
          <strong>Pack Tactics.</strong> Snarl has advantage on an attack roll
          against a creature if at least one of Snarl’s allies is within 5 ft.
          of the creature and the ally isn’t incapacitated.
        </p>
      </>
    ),
  },
  {
    name: "Vyerith",
    type: "Monstrosity",
    description: "Medium Monstrosity (Shapechanger), Neutral",
    img: "/Monsters/Vyerith.png",
    AC: "14",
    HP: 52,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 18,
      Con: 14,
      Int: 11,
      Wis: 12,
      Cha: 14,
    },
    skills: "Deception +6, Insight +3",
    senses: "Darkvision 60 ft., passive Perception 11",
    language: "Common",
    CR: "3 (XP 700)",
    traits: (
      <>
        <p>
          <strong>Shapechanger.</strong> Vyerith can use her action to polymorph
          into a Small or Medium humanoid she has seen, or back into her true
          form. Her statistics remain the same in each form.
        </p>

        <p>
          <strong>Ambusher.</strong> In the first round of combat, Vyerith has
          advantage on attack rolls against any creature she surprised.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Multiattack.</strong> Vyerith makes two melee attacks.
        </p>

        <p className="mb-2">
          <strong>Slam.</strong> <em>Melee Weapon Attack:</em> +6 to hit, reach
          5 ft., one target. <em>Hit:</em> 6 (1d6 + 3) bludgeoning damage.
        </p>

        <p>
          <strong>Read Thoughts.</strong> Vyerith magically reads the surface
          thoughts of one creature within 60 ft. of her. While reading the
          target’s mind, she has advantage on Insight, Deception, and
          Intimidation checks against that creature.
        </p>
      </>
    ),
  },
  {
    name: "Hamun Kost",
    type: "Humanoid",
    description: "Medium Humanoid (Human), Neutral Evil",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy-2qM8MEEOH_5bQ0wjiaAbxizb5JswqMDXQ&s",
    AC: "12 (15 with mage armor)",
    HP: 27,
    speed: 30,
    stats: {
      Str: 9,
      Dex: 14,
      Con: 12,
      Int: 16,
      Wis: 13,
      Cha: 11,
    },
    skills: "Arcana +5, History +5, Religion +5",
    senses: "Passive Perception 11",
    language: "Common, Draconic",
    CR: "3 (XP 700)",
    traits: (
      <>
        <p>
          <strong>Spellcasting.</strong> Hamun Kost is a 5th-level spellcaster
          who uses Intelligence as his spellcasting ability (spell save DC 13,
          +5 to hit with spell attacks). He has the following wizard spells
          prepared:
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips (at will):</strong> chill touch, light, mage hand,
          ray of frost
        </p>

        <p className="mb-1 ml-4">
          <strong>1st level (4 slots):</strong> mage armor, magic missile,
          shield
        </p>

        <p className="mb-1 ml-4">
          <strong>2nd level (3 slots):</strong> ray of enfeeblement, mirror
          image, misty step
        </p>

        <p className="ml-4">
          <strong>3rd level (2 slots):</strong> animate dead, fireball
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Quarterstaff.</strong> <em>Melee Weapon Attack:</em> +1 to
          hit, reach 5 ft., one target. <em>Hit:</em> 2 (1d6 - 1) bludgeoning
          damage.
        </p>

        <p>
          <strong>Chill Touch.</strong> <em>Ranged Spell Attack:</em> +5 to hit,
          range 120 ft., one target. <em>Hit:</em> 9 (2d8) necrotic damage, and
          the target can’t regain hit points until the start of Hamun Kost’s
          next turn.
        </p>
      </>
    ),
  },
  {
    name: "Reidoth",
    type: "Humanoid",
    description: "Medium Humanoid (Human), Neutral Good",
    img: "https://i.redd.it/pkf9aumn5gib1.png",
    AC: "11 (14 with barkskin)",
    HP: 22,
    speed: 30,
    stats: {
      Str: 10,
      Dex: 12,
      Con: 13,
      Int: 12,
      Wis: 16,
      Cha: 11,
    },
    skills: "Medicine +5, Nature +3, Perception +5, Survival +5",
    senses: "Passive Perception 15",
    language: "Common, Druidic, Elvish",
    CR: "2 (XP 450)",
    traits: (
      <>
        <p>
          <strong>Spellcasting.</strong> Reidoth is a 4th-level spellcaster who
          uses Wisdom as his spellcasting ability (spell save DC 13, +5 to hit
          with spell attacks). He has the following druid spells prepared:
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips (at will):</strong> druidcraft, produce flame,
          shillelagh
        </p>

        <p className="mb-1 ml-4">
          <strong>1st level (4 slots):</strong> cure wounds, entangle, faerie
          fire, thunderwave
        </p>

        <p className="ml-4">
          <strong>2nd level (3 slots):</strong> barkskin, flaming sphere, lesser
          restoration
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Quarterstaff.</strong> <em>Melee Weapon Attack:</em> +2 to
          hit, reach 5 ft., one target. <em>Hit:</em> 3 (1d6) bludgeoning
          damage.
        </p>

        <p>
          <strong>Produce Flame.</strong> <em>Ranged Spell Attack:</em> +5 to
          hit, range 30 ft., one target. <em>Hit:</em> 7 (2d6) fire damage.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Healing Word.</strong> Reidoth speaks a brief word of magic to
          restore vitality to a creature he can see within 60 feet.
        </p>
      </>
    ),
  },
  {
    name: "Gundren Rockseeker",
    type: "Humanoid",
    description: "Medium Humanoid (Dwarf), Neutral Good",
    img: "https://crossroadsofeternity.wordpress.com/wp-content/uploads/2015/08/gundren.jpg",
    AC: "11",
    HP: 9,
    speed: 25,
    stats: {
      Str: 10,
      Dex: 10,
      Con: 12,
      Int: 12,
      Wis: 11,
      Cha: 13,
    },
    skills: "History +3, Insight +2, Persuasion +3",
    senses: "Darkvision 60 ft., Passive Perception 10",
    language: "Common, Dwarvish",
    CR: "0 (XP 10)",
    traits: (
      <>
        <p className="mb-2">
          <strong>Dwarven Resilience.</strong> Gundren has advantage on saving
          throws against poison, and he has resistance to poison damage.
        </p>

        <p>
          <strong>Helpful Merchant.</strong> Gundren has advantage on Charisma
          (Persuasion) checks made to negotiate, reassure, or rally allies.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Pick Hammer.</strong> <em>Melee Weapon Attack:</em> +2 to hit,
          reach 5 ft., one target. <em>Hit:</em> 3 (1d6) piercing damage.
        </p>
      </>
    ),
  },
];

import type { StatBlockProps } from "../components/StatBlock";

export type PlayerEquipment = {
  armor: string | null;
  shield: string | null;
  mainHand: string | null;
  offHand: string | null;
  bothHands: string | null;
  ring1: string | null;
  ring2: string | null;
  boots: string | null;
  gloves: string | null;
  staff: string | null;
  wand: string | null;
};

export type PlayerCharacter = StatBlockProps & {
  inventory: string[];
  equipment: PlayerEquipment;
};

export const emptyEquipment: PlayerEquipment = {
  armor: null,
  shield: null,
  mainHand: null,
  offHand: null,
  bothHands: null,
  ring1: null,
  ring2: null,
  boots: null,
  gloves: null,
  staff: null,
  wand: null,
};
export const players: PlayerCharacter[] = [
  {
    name: "Atiram",
    type: "Humanoid",
    description: "Level 2 Asmodeus Tiefling Rogue, Criminal",
    img: "AtiramAvatar.png",
    AC: "15",
    HP: 17,
    speed: 30,
    stats: {
      Str: 11,
      Dex: 18,
      Con: 13,
      Int: 14,
      Wis: 12,
      Cha: 15,
    },
    skills:
      "Proficiency bonus: +2, Proficiencies: Thieves tools, Gaming set, Light armor, simple weapons, hand crossbows, longswords, rapiers, shortswords",
    senses: "Passive wisdom (Perception) 11, Darkvision",
    language: "Common, Infernal",
    CR: "Player Character",
    inventory: [],
    equipment: { ...emptyEquipment },
    traits: (
      <>
        <p>
          <strong>Hellish Resistance.</strong> You have resistance to fire
          damage.
        </p>
        <p>
          <strong>Infernal Legacy.</strong> You know the Thaumaturgy cantrip.
          Once you reach 3rd level, you can cast the Hellish Rebuke spell once
          as a 2nd-level spell. Once you reach 5th level, you can also cast the
          Darkness spell once. You must finish a long rest to cast these spells
          again with this trait. Charisma is your spellcasting ability for these
          spells.
        </p>
        <p>
          <strong>Criminal Contact.</strong> You have a reliable and trustworthy
          contact who acts as your liaison to a network of other criminals. You
          know how to get messages to and from your contact, even over great
          distances; specifically, you know the local messengers, corrupt
          caravan masters, and seedy sailors who can deliver messages for you.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Sneak Attack.</strong> Once per turn, you can deal an extra
          1d6 damage to one creature you hit with an attack if you have
          advantage on the attack roll. The attack must use a finesse or a
          ranged weapon.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Cunning Action.</strong> You can <em>Dash</em>,{" "}
          <em>Dissengage</em> or <em>Hide</em> as a bonus action on each of your
          turns.
        </p>
      </>
    ),
  },
  {
    name: "Balasar",
    type: "Humanoid",
    description: "Level 2 Dragonborn Barbarian, Soldier",
    img: "BalasarAvatar.png",
    AC: "13",
    HP: 24,
    speed: 30,
    stats: {
      Str: 17,
      Dex: 13,
      Con: 15,
      Int: 10,
      Wis: 12,
      Cha: 13,
    },
    skills:
      "Proficiency bonus: +2, Proficiencies: Vehicles (land), Medium armor, shields, simple weapons, martial weapons, bone dice.",
    senses: "Passive wisdom (Perception) 13",
    language: "Common, Draconic",
    CR: "Player Character",
    inventory: [],
    equipment: { ...emptyEquipment },
    traits: (
      <>
        <p>
          <strong>Draconic Ancestry (Bronze).</strong> You have resistance to
          lightning damage.
        </p>
        <p>
          <strong>Danger Sense.</strong> You have advantage on Dexterity saving
          throws against effects that you can see, such as traps and spells. To
          gain this benefit, you can't be blinded, deafened, or incapacitated.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Breath weapon.</strong> 5 by 30 ft. line (DEX save). DC = 8 +
          CON + Proficiency bonus. 2d6 lightning damage (half on save).
        </p>
        <p>
          <strong>Reckless Attack.</strong> When you make your first attack on
          your turn, you can decide to attack recklessly. Doing so gives you
          advantage on melee weapon attack rolls using Strength during this
          turn, but attack rolls against you have advantage until your next
          turn.
        </p>
      </>
    ),
    bonusActions: (
      <>
        <p>
          <strong>Rage.</strong> You gain advantage on STR saving throws. You
          gain +2 to damage rolls. You gain resistance to bludgeoning, piercing
          and slashing damage.
        </p>
      </>
    ),
  },
  {
    name: "Lia Nailo",
    type: "Humanoid",
    description: "Level 2 Forest Elf Druid, Outlander",
    img: "LiaAvatar.png",
    AC: "14",
    HP: 13,
    speed: 35,
    stats: {
      Str: 11,
      Dex: 16,
      Con: 12,
      Int: 14,
      Wis: 17,
      Cha: 11,
    },
    skills:
      "Proficiency bonus: +2, Proficiencies: Longswords, shortswords, longbows, shortbows, clubs, daggers, darts, javelins, maces, slings, quarterstaffs, scimitars, sickles, medium armor.",
    senses: "Passive wisdom (Perception) 15, Darkvision",
    language: "Common, Elvish, Dwarven, Druidic",
    CR: "Player Character",
    inventory: [],
    equipment: { ...emptyEquipment },
    traits: (
      <>
        <p>
          <strong>Fey Ancestry.</strong> You have advantage on saving throws
          against being charmed, and magic can’t put you to sleep.
        </p>
        <p>
          <strong>Mask of the Wild.</strong> You can attempt to hide even when
          you are only lightly obscured by foliage, heavy rain, falling snow,
          mist, and other natural phenomena.
        </p>
        <p>
          <strong>Wanderer.</strong> You have an excellent memory for maps and
          geography, and you can always recall the general layout of terrain,
          settlements, and other features around you. In addition, you can find
          food and fresh water for yourself and up to five other people each
          day, provided that the land offers berries, small game, water, and so
          forth.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Wild Shape.</strong> You can use your action to magically
          assume the shape of a beast that you have seen before. You can use
          this feature twice. You regain expended uses when you finish a short
          or long rest.
        </p>

        <p className="mb-2">
          <strong>Spellcasting.</strong>
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips:</strong> Guidance, Resistance, Eldritch Blast
        </p>

        <p className="ml-4">
          <strong>Level 1 spells:</strong> Create/Destroy water, Goodberry,
          Healing Word
        </p>
      </>
    ),
  },
  {
    name: "Roland",
    type: "Humanoid",
    description: "Level 2 Half-Elf Paladin, Soldier",
    img: "RolandAvatar.png",
    AC: "18",
    HP: 22,
    speed: 30,
    stats: {
      Str: 17,
      Dex: 8,
      Con: 16,
      Int: 12,
      Wis: 7,
      Cha: 18,
    },
    skills:
      "Proficiency bonus: +2, Proficiencies: Vehicles (land), all armor, shields, simple weapons, martial weapons",
    senses: "Passive wisdom (Perception) 8, Darkvision",
    language: "Common, Elvish, Orcish",
    CR: "Player Character",
    inventory: [],
    equipment: { ...emptyEquipment },
    traits: (
      <>
        <p>
          <strong>Fey Ancestry.</strong> You have advantage on saving throws
          against being charmed, and magic can’t put you to sleep.
        </p>
        <p>
          <strong>Fighting Style - Protection.</strong> When a creature you can
          see attacks a target other than you that is within 5 feet of you, you
          can use your reaction to impose disadvantage on the attack roll. You
          must be wielding a shield.
        </p>
      </>
    ),
    actions: (
      <>
        <p>
          <strong>Divine Sense.</strong> Until the end of your next turn, you
          know the location of any celestial, fiend, or undead within 60 feet of
          you that is not behind total cover. You know the type of any being
          whose presence you sense, but not its identity . Within the same
          radius, you also detect the presence of any place or object that has
          been consecrated or desecrated, as with the hallow spell. You can use
          this feature a number of times equal to 1 + your Charisma modifier.
          When you finish a long rest, you regain all expended uses.
        </p>
        <p>
          <strong>Lay on Hands.</strong> Your blessed touch can heal wounds. You
          have a pool of healing power that replenishes when you take a long
          rest. With that pool, you can restore a total number of hit points
          equal to your paladin level x 5. As an action, you can touch a
          creature and draw power from the pool to restore a number of hit
          points to that creature, up to the maximum amount remaining in your
          pool. Alternatively, you can expend 5 hit points from your pool of
          healing to cure the target of one disease or neutralize one poison
          affecting it. You can cure multiple diseases and neutralize multiple
          poisons with a single use of Lay on Hands, expending hit points
          separately for each one. This feature has no effect on undead and
          constructs.
        </p>
      </>
    ),
  },
  {
    name: "Lûthien Tinúviel",
    type: "Humanoid",
    description: "Level 1 High Elf Bard, Entertainer",
    img: "LuthienAvatar.png",
    AC: "12",
    HP: 13,
    speed: 30,
    stats: {
      Str: 9,
      Dex: 14,
      Con: 11,
      Int: 13,
      Wis: 12,
      Cha: 17,
    },
    skills:
      "Proficiency bonus: +2, Proficiencies: Longsowrds, shortswords, longbows, shortbows, disguise kit, forgery kit, light armor, simple weapons, pan flute, bagpipes, lute",
    senses: "Passive wisdom (Perception) 13, Darkvision",
    language: "Common, Elvish",
    CR: "Player Character",
    inventory: [],
    equipment: { ...emptyEquipment },
    traits: (
      <>
        <p>
          <strong>Fey Ancestry.</strong> You have advantage on saving throws
          against being charmed, and magic can’t put you to sleep.
        </p>
        <p>
          <strong>Trance.</strong> Elves don’t need to sleep. Instead, they
          meditate deeply, remaining semiconscious, for 4 hours a day.
        </p>
        <p>
          <strong>Jack of All Trades.</strong> You can add half your proficiency
          bonus, rounded down, to any ability check you make that doesn't
          already include your proficiency bonus.
        </p>
      </>
    ),
    actions: (
      <>
        <p className="mb-2">
          <strong>Spellcasting.</strong>
        </p>

        <p className="mb-1 ml-4">
          <strong>Cantrips:</strong> Minor Illusion, Vicious Mockery
        </p>

        <p className="ml-4">
          <strong>Level 1 spells:</strong> Disguise Self, Charm Person, Cure
          Wounds
        </p>
      </>
    ),
  },
];

import type { Spell } from "../../types";

export const spells: Spell[] = [
  {
    id: "acid-splash",
    name: "Acid Splash",
    level: 0,
    school: "Evocation",
    castingTime: "Action",
    range: "60 feet",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["Sorcerer", "Wizard"],
    description:
      "You create a burst of acid at a point you can see within range. Creatures in a 5-foot-radius sphere centered on that point must make a Dexterity saving throw or take 1d6 Acid damage.",
    cantripUpgrade:
      "The damage increases at higher character levels: 2d6 at level 5, 3d6 at level 11, and 4d6 at level 17.",
  },
  {
    id: "aid",
    name: "Aid",
    level: 2,
    school: "Abjuration",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S, M (a strip of white cloth)",
    duration: "8 hours",
    classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"],
    description:
      "Choose up to three creatures within range. For the duration, each target’s Hit Point maximum increases by 5, and its current Hit Points also increase by 5.",
    higherLevel:
      "When cast with a higher-level spell slot, each target’s Hit Point maximum and current Hit Points increase by an additional 5 for each slot level above 2.",
  },
  {
    id: "alarm",
    name: "Alarm",
    level: 1,
    school: "Abjuration",
    ritual: true,
    castingTime: "1 minute or Ritual",
    range: "30 feet",
    components: "V, S, M (a bell and silver wire)",
    duration: "8 hours",
    classes: ["Ranger", "Wizard"],
    description:
      "You ward a door, window, or area no larger than a 20-foot Cube against intrusion. Until the spell ends, an alert is triggered whenever a creature touches or enters the warded area. When you cast the spell, you choose which creatures won’t trigger it, and whether the alarm is audible or mental.",
    higherLevel:
      "Audible Alarm: the spell produces the sound of a handbell within 60 feet of the warded area. Mental Alarm: you receive a mental alert if you are within 1 mile of the warded area, and the alert can wake you if you are asleep.",
  },
  {
    id: "alter-self",
    name: "Alter Self",
    level: 2,
    school: "Transmutation",
    concentration: true,
    castingTime: "Action",
    range: "Self",
    components: "V, S",
    duration: "Concentration, up to 1 hour",
    classes: ["Sorcerer", "Wizard"],
    description:
      "You magically alter your body and choose one of the following options for the duration. While the spell lasts, you can take a Magic action to switch to a different option.",
    options: [
      {
        name: "Aquatic Adaptation",
        text:
          "You grow gills and webbing between your fingers. You can breathe underwater and gain a Swim Speed equal to your Speed.",
      },
      {
        name: "Change Appearance",
        text:
          "You reshape your appearance, including height, weight, facial features, voice, hair, coloration, and other distinguishing traits. You can make yourself look like another member of your species, but your game statistics do not change. You cannot appear as a creature of a different size, and your basic body shape must remain the same. For the duration, you can take a Magic action to change your appearance again.",
      },
      {
        name: "Natural Weapons",
        text:
          "You grow claws, fangs, horns, or hooves. Your Unarmed Strikes with the new growth deal 1d6 damage of the appropriate type instead of the normal damage for an Unarmed Strike, and you use your spellcasting ability modifier for the attack and damage rolls instead of Strength.",
      },
    ],
  },
  {
    id: "animal-friendship",
    name: "Animal Friendship",
    level: 1,
    school: "Enchantment",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S, M (a morsel of food)",
    duration: "24 hours",
    classes: ["Bard", "Druid", "Ranger"],
    description:
      "Target a Beast you can see within range. It must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spell ends.",
    higherLevel:
      "When cast with a higher-level spell slot, you can target one additional Beast for each slot level above 1.",
  },
  {
    id: "animal-messenger",
    name: "Animal Messenger",
    level: 2,
    school: "Enchantment",
    ritual: true,
    castingTime: "Action or Ritual",
    range: "30 feet",
    components: "V, S, M (a morsel of food)",
    duration: "24 hours",
    classes: ["Bard", "Druid", "Ranger"],
    description:
      "A Tiny Beast you can see within range must succeed on a Charisma saving throw or attempt to deliver a message for you (it automatically succeeds if its Challenge Rating is 0). You specify a location you have visited and a recipient matching a general description. You can also communicate a message of up to twenty-five words.",
    details:
      "The Beast travels toward the destination for the duration, covering about 25 miles per 24 hours (or 50 miles if it can fly). When it arrives, it delivers your message, mimicking your communication. If it does not reach the destination before the spell ends, the message is lost and the Beast returns to where you cast the spell.",
    higherLevel:
      "When cast with a higher-level spell slot, the duration increases by 48 hours for each slot level above 2.",
  },
  {
    id: "animal-shapes",
    name: "Animal Shapes",
    level: 8,
    school: "Transmutation",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S",
    duration: "24 hours",
    classes: ["Druid"],
    description:
      "Choose any number of willing creatures you can see within range. Each target transforms into a Large or smaller Beast of your choice with a Challenge Rating of 4 or lower. You can choose a different form for each target, and you can use a Magic action on later turns to transform them again.",
    details:
      "Each target uses the Beast form’s statistics but retains its creature type, Hit Points, Hit Dice, alignment, ability to communicate, and Intelligence, Wisdom, and Charisma scores. Its actions are limited by the Beast form, and it cannot cast spells. Equipment merges into the new form and cannot be used.",
    effects:
      "Each target gains Temporary Hit Points equal to the Beast’s Hit Points. The transformation lasts for the duration, until those Temporary Hit Points are reduced to 0, or until the target leaves the form as a Bonus Action.",
  },
  {
    id: "animate-dead",
    name: "Animate Dead",
    level: 3,
    school: "Necromancy",
    castingTime: "1 minute",
    range: "10 feet",
    components: "V, S, M (a drop of blood, a piece of flesh, and a pinch of bone dust)",
    duration: "Instantaneous",
    classes: ["Cleric", "Wizard"],
    description:
      "Choose a pile of bones or a corpse of a Medium or Small Humanoid within range. The target becomes an Undead creature: a Skeleton if you chose bones or a Zombie if you chose a corpse.",
    details:
      "On each of your turns, you can take a Bonus Action to mentally command any creature you made with this spell if the creature is within 60 feet of you. If you control multiple creatures with this spell, you can command any of them at the same time, issuing the same command to each one. You decide what action the creature takes and where it moves on its next turn, or you can give a general command, such as guarding a chamber or corridor. If you give no command, the creature takes the Dodge action and moves only to avoid harm. Once given an order, the creature continues to follow it until its task is complete.",
    effects:
      "The creature remains under your control for 24 hours, after which it stops obeying any command you gave it. To maintain control for another 24 hours, you must cast this spell on the creature again before the current 24-hour period ends. This use of the spell reasserts control over up to four creatures you have animated with this spell rather than animating a new creature.",
    higherLevel:
      "When cast with a higher-level spell slot, you animate or reassert control over two additional Undead creatures for each slot level above 3. Each creature must come from a different corpse or pile of bones.",
  },
  {
    id: "animate-objects",
    name: "Animate Objects",
    level: 5,
    school: "Transmutation",
    concentration: true,
    castingTime: "Action",
    range: "120 feet",
    components: "V, S",
    duration: "Concentration, up to 1 minute",
    classes: ["Bard", "Sorcerer", "Wizard"],
    description:
      "You animate nonmagical objects within range that are not being worn or carried, are not fixed to a surface, and are not Gargantuan. The maximum number of objects equals your spellcasting ability modifier. A Medium or smaller object counts as one object, a Large object counts as two, and a Huge object counts as three.",
    details:
      "Each object becomes a Construct with the Animated Object stat block and is under your control until the spell ends or it drops to 0 Hit Points. The creatures are allies to you and your companions. In combat, they share your Initiative and act immediately after your turn.",
    control:
      "Until the spell ends, you can take a Bonus Action to mentally command any creature created by this spell if it is within 500 feet of you. If you control multiple creatures, you can command them all at once with the same command. If no command is given, the creature takes the Dodge action and moves only to avoid harm. When a creature drops to 0 Hit Points, it returns to its object form.",
    statBlock: {
      name: "Animated Object",
      size: "Huge or Smaller Construct",
      ac: 15,
      hp: {
        mediumOrSmaller: 10,
        large: 20,
        huge: 40,
      },
      speed: "30 ft.",
      abilities: {
        str: 16,
        dex: 10,
        con: 10,
        int: 3,
        wis: 3,
        cha: 1,
      },
      immunities:
        "Poison, Psychic; Charmed, Exhaustion, Frightened, Paralyzed, Petrified, Poisoned",
      senses: "Blindsight 30 ft., Passive Perception 6",
      languages: "Understands the languages you know",
      cr: "None (PB equals your Proficiency Bonus)",
      action:
        "Slam. Melee Attack Roll: Bonus equals your spell attack modifier, reach 5 ft. Hit: Force damage equal to 1d4 + 3 (Medium or smaller), 2d6 + 3 (Large), or 2d12 + 3 (Huge) + your spellcasting ability modifier.",
    },
    higherLevel:
      "When cast with a higher-level spell slot, the Slam damage increases by 1d4 (Medium or smaller), 1d6 (Large), or 1d12 (Huge) for each slot level above 5.",
  },
  {
    id: "antilife-shell",
    name: "Antilife Shell",
    level: 5,
    school: "Abjuration",
    concentration: true,
    castingTime: "Action",
    range: "Self",
    components: "V, S",
    duration: "Concentration, up to 1 hour",
    classes: ["Druid"],
    description:
      "An aura extends from you in a 10-foot emanation for the duration. The aura prevents creatures other than Constructs and Undead from passing through or reaching through it.",
    details:
      "Affected creatures can still cast spells or make attacks with ranged or reach weapons through the barrier.",
    effects:
      "If you move so that an affected creature is forced to pass through the barrier, the spell ends.",
  },
  {
    id: "antimagic-field",
    name: "Antimagic Field",
    level: 8,
    school: "Abjuration",
    concentration: true,
    castingTime: "Action",
    range: "Self",
    components: "V, S, M (iron filings)",
    duration: "Concentration, up to 1 hour",
    classes: ["Cleric", "Wizard"],
    description:
      "An aura of antimagic surrounds you in a 10-foot emanation. Within the area, magic is suppressed and cannot function normally.",
    details:
      "Creatures cannot cast spells, take Magic actions, or create magical effects inside the aura. Magical effects cannot target or affect anything inside it, and magical item properties do not function there. Areas created by spells or magic cannot extend into the aura, and teleportation or planar travel cannot be used to enter or leave it. Portals close temporarily while inside the aura.",
    effects:
      "Ongoing spells are suppressed while in the area (though their durations continue to pass). Effects created by Artifacts or deities are exceptions and still function.",
    higherLevel:
      "Dispel Magic has no effect on this aura, and multiple Antimagic Field spells do not cancel each other out.",
  },
  { id: "antipathy-sympathy", name: "Antipathy/Sympathy", level: 8, school: "Enchantment" },
{
    id: "arcane-lock",
    name: "Arcane Lock",
    level: 2,
    school: "Abjuration",
    castingTime: "Action",
    range: "Touch",
    components:
      "V, S, M (gold dust worth 25+ GP, which the spell consumes)",
    duration: "Until dispelled",
    classes: ["wizard"],
    description:
      "You touch a closed door, window, gate, container, or hatch and magically lock it for the duration.",
    effects:
      "This lock can't be unlocked by any nonmagical means.",
    control:
      "You and any creatures you designate when you cast the spell can open and close the object despite the lock.",
    special:
      "You can also set a password that, when spoken within 5 feet of the object, unlocks it for 1 minute.",
  },
    { id: "arcane-vigor", name: "Arcane Vigor", level: 2, school: "Abjuration" },
  { id: "astral-projection", name: "Astral Projection", level: 9, school: "Necromancy" },
{
    id: "augury",
    name: "Augury",
    level: 2,
    school: "Divination",
    ritual: true,
    castingTime: "1 minute",
    range: "Self",
    components:
      "V, S, M (specially marked sticks, bones, cards, or other divinatory tokens worth 25+ GP)",
    duration: "Instantaneous",
    classes: ["cleric", "druid", "wizard"],
    description:
      "You receive an omen from an otherworldly entity about the results of a course of action that you plan to take within the next 30 minutes.",
    options: [
      { name: "Weal", text: "Good results" },
      { name: "Woe", text: "Bad results" },
      { name: "Weal and Woe", text: "Both good and bad results" },
      { name: "Indifference", text: "Neither good nor bad results" },
    ],
    limitations:
      "The spell doesn't account for circumstances, such as other spells, that might change the results.",
    special:
      "If you cast the spell more than once before finishing a Long Rest, there is a cumulative 25% chance for each casting after the first that you get no answer.",
  },
    { id: "aura-of-life", name: "Aura of Life", level: 4, school: "Abjuration", concentration: true },
  { id: "aura-of-purity", name: "Aura of Purity", level: 4, school: "Abjuration", concentration: true },
{
    id: "aura-of-vitality",
    name: "Aura of Vitality",
    level: 3,
    school: "Abjuration",
    concentration: true,
    castingTime: "Action",
    range: "Self",
    components: "V",
    duration: "Concentration, up to 1 minute",
    classes: ["cleric", "druid", "paladin"],
    description:
      "An aura radiates from you in a 30-foot emanation for the duration.",
    effects:
      "When you create the aura and at the start of each of your turns while it persists, you can restore 2d6 Hit Points to one creature in it.",
  },
    { id: "awaken", name: "Awaken", level: 5, school: "Transmutation" },
  {
    id: "bane",
    name: "Bane",
    level: 1,
    school: "Enchantment",
    concentration: true,
    castingTime: "Action",
    range: "30 feet",
    components: "V, S, M (a drop of blood)",
    duration: "Concentration, up to 1 minute",
    classes: ["bard", "cleric", "warlock"],
    description:
      "Up to three creatures of your choice that you can see within range must each make a Charisma saving throw.",
    savingThrows: "Charisma",
    penalties:
      "Whenever a target that fails this save makes an attack roll or a saving throw before the spell ends, the target must subtract 1d4 from the attack roll or save.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 1.",
  },

  { id: "banishment", name: "Banishment", level: 4, school: "Abjuration", concentration: true },
  { id: "banishing-smite", name: "Banishing Smite", level: 5, school: "Conjuration", concentration: true },
{
    id: "barkskin",
    name: "Barkskin",
    level: 2,
    school: "Transmutation",
    castingTime: "Bonus Action",
    range: "Touch",
    components: "V, S, M (a handful of bark)",
    duration: "1 hour",
    classes: ["druid", "ranger"],
    description:
      "You touch a willing creature. Until the spell ends, the target's skin assumes a bark-like appearance, and the target has an Armor Class of 17 if its AC is lower than that.",
    benefits: "The target has an Armor Class of 17 if its AC is lower than that.",
  },
{
    id: "beacon-of-hope",
    name: "Beacon of Hope",
    level: 3,
    school: "Abjuration",
    concentration: true,
    castingTime: "Action",
    range: "30 feet",
    components: "V, S",
    duration: "Concentration, up to 1 minute",
    classes: ["cleric"],
    description:
      "Choose any number of creatures within range for the duration.",
    benefits:
      "Each target has Advantage on Wisdom saving throws and Death Saving Throws and regains the maximum number of Hit Points possible from any healing.",
  },
{
    id: "beast-sense",
    name: "Beast Sense",
    level: 2,
    school: "Divination",
    ritual: true,
    concentration: true,
    castingTime: "Action or Ritual",
    range: "Touch",
    components: "S",
    duration: "Concentration, up to 1 hour",
    classes: ["druid", "ranger"],
    description:
      "You touch a willing Beast. For the duration, you can perceive through the Beast's senses as well as your own.",
    benefits:
      "When perceiving through the Beast's senses, you benefit from any special senses it has.",
  },
    { id: "befuddlement", name: "Befuddlement", level: 8, school: "Enchantment" },
  { id: "bestow-curse", name: "Bestow Curse", level: 3, school: "Necromancy", concentration: true },
  { id: "blade-barrier", name: "Blade Barrier", level: 6, school: "Evocation", concentration: true },
  { id: "blade-ward", name: "Blade Ward", level: 0, school: "Abjuration" },
{
  id: "bless",
  name: "Bless",
  level: 1,
  school: "Enchantment",
  concentration: true,
  castingTime: "Action",
  range: "30 feet",
  components: "V, S, M (a Holy Symbol worth 5+ GP)",
  duration: "Concentration, up to 1 minute",
  classes: ["Cleric", "Paladin"],
  description:
    "You bless up to three creatures within range. Whenever a target makes an attack roll or a saving throw before the spell ends, it adds 1d4 to the roll.",
  higherLevel:
    "When cast with a higher-level spell slot, you can target one additional creature for each slot level above 1.",
},
{
    id: "blindness-deafness",
    name: "Blindness/Deafness",
    level: 2,
    school: "Transmutation",
    castingTime: "Action",
    range: "120 feet",
    components: "V",
    duration: "1 minute",
    classes: ["bard", "cleric", "sorcerer", "wizard"],
    description:
      "One creature that you can see within range must succeed on a Constitution saving throw.",
    savingThrows: "Constitution",
    conditions:
      "On a failed save, the target has the Blinded or Deafened condition (your choice) for the duration.",
    endConditions:
      "At the end of each of its turns, the target repeats the save, ending the spell on itself on a success.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 2.",
  },
    { id: "blight", name: "Blight", level: 4, school: "Necromancy" },
  { id: "blinding-smite", name: "Blinding Smite", level: 3, school: "Evocation", concentration: true },
  { id: "blur", name: "Blur", level: 2, school: "Illusion", concentration: true },
{
    id: "burning-hands",
    name: "Burning Hands",
    level: 1,
    school: "Evocation",
    castingTime: "Action",
    range: "Self",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["sorcerer", "wizard"],
    description:
      "A thin sheet of flames shoots forth from you. Each creature in a 15-foot Cone makes a Dexterity saving throw.",
    savingThrows: "Dexterity",
    effects:
      "A creature takes 3d6 Fire damage on a failed save or half as much damage on a successful one.",
    control:
      "Flammable objects in the Cone that aren't being worn or carried start burning.",
    higherLevel:
      "The damage increases by 1d6 for each spell slot level above 1.",
  },
    { id: "call-lightning", name: "Call Lightning", level: 3, school: "Conjuration", concentration: true },
  { id: "calm-emotions", name: "Calm Emotions", level: 2, school: "Enchantment", concentration: true },
  { id: "charm-monster", name: "Charm Monster", level: 4, school: "Enchantment" },
{
  id: "charm-person",
  name: "Charm Person",
  level: 1,
  school: "Enchantment",
  castingTime: "Action",
  range: "30 feet",
  components: "V, S",
  duration: "1 hour",
  classes: ["Bard", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description:
    "One Humanoid you can see within range must make a Wisdom saving throw.",
  effects:
    "The target has Advantage on the save if you or your allies are fighting it. On a failed save, the target has the Charmed condition until the spell ends or until you or your allies damage it.",
  details:
    "The Charmed creature is Friendly to you. When the spell ends, the target knows it was Charmed by you.",
  higherLevel:
    "When cast with a higher-level spell slot, you can target one additional creature for each slot level above 1.",
},
  { id: "chill-touch", name: "Chill Touch", level: 0, school: "Necromancy" },
  { id: "chromatic-orb", name: "Chromatic Orb", level: 1, school: "Evocation" },
  { id: "circle-of-power", name: "Circle of Power", level: 5, school: "Abjuration", concentration: true },
  { id: "clairvoyance", name: "Clairvoyance", level: 3, school: "Divination", concentration: true },
  { id: "cloud-of-daggers", name: "Cloud of Daggers", level: 2, school: "Conjuration", concentration: true },
  { id: "color-spray", name: "Color Spray", level: 1, school: "Illusion" },
{
  id: "command",
  name: "Command",
  level: 1,
  school: "Enchantment",
  castingTime: "Action",
  range: "60 feet",
  components: "V",
  duration: "Instantaneous",
  classes: ["Bard", "Cleric", "Paladin"],
  description:
    "You speak a one-word command to a creature you can see within range. The target must succeed on a Wisdom saving throw or follow the command on its next turn.",
  options: [
    {
      name: "Approach",
      text:
        "The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.",
    },
    {
      name: "Drop",
      text:
        "The target drops whatever it is holding and then ends its turn.",
    },
    {
      name: "Flee",
      text:
        "The target spends its turn moving away from you by the fastest available means.",
    },
    {
      name: "Grovel",
      text:
        "The target has the Prone condition and then ends its turn.",
    },
    {
      name: "Halt",
      text:
        "The target does not move and takes no action or Bonus Action on its turn.",
    },
  ],
  higherLevel:
    "When cast with a higher-level spell slot, you can affect one additional creature for each slot level above 1.",
},
  { id: "commune", name: "Commune", level: 5, school: "Divination", ritual: true },
  { id: "commune-with-nature", name: "Commune with Nature", level: 5, school: "Divination", ritual: true },
{
  id: "compelled-duel",
  name: "Compelled Duel",
  level: 1,
  school: "Enchantment",
  concentration: true,
  castingTime: "Bonus Action",
  range: "30 feet",
  components: "V",
  duration: "Concentration, up to 1 minute",
  classes: ["Paladin"],
  description:
    "You attempt to compel a creature into a duel. One creature you can see within range must make a Wisdom saving throw.",
  effects:
    "On a failed save, the target has Disadvantage on attack rolls against creatures other than you, and it cannot willingly move to a space more than 30 feet away from you.",
  endConditions:
    "The spell ends if you make an attack roll against a creature other than the target, if you cast a spell on an enemy other than the target, if an ally damages the target, or if you end your turn more than 30 feet away from the target.",
},
  { id: "comprehend-languages", name: "Comprehend Languages", level: 1, school: "Divination", ritual: true },
  { id: "confusion", name: "Confusion", level: 4, school: "Enchantment", concentration: true },
  { id: "conjure-animals", name: "Conjure Animals", level: 3, school: "Conjuration", concentration: true },
  { id: "conjure-beings", name: "Conjure Beings", level: 4, school: "Conjuration", concentration: true },
  { id: "conjure-celestial", name: "Conjure Celestial", level: 7, school: "Conjuration", concentration: true },
  { id: "conjure-elemental", name: "Conjure Elemental", level: 5, school: "Conjuration", concentration: true },
  { id: "conjure-fey", name: "Conjure Fey", level: 6, school: "Conjuration", concentration: true },
  { id: "conjure-minor-elementals", name: "Conjure Minor Elementals", level: 4, school: "Conjuration", concentration: true },
  { id: "conjure-woodland-beings", name: "Conjure Woodland Beings", level: 4, school: "Conjuration", concentration: true },
  { id: "cone-of-cold", name: "Cone of Cold", level: 5, school: "Evocation" },
  { id: "contagion", name: "Contagion", level: 5, school: "Necromancy" },
  { id: "continual-flame", name: "Continual Flame", level: 2, school: "Evocation" },
  { id: "control-water", name: "Control Water", level: 4, school: "Transmutation", concentration: true },
  { id: "control-weather", name: "Control Weather", level: 8, school: "Transmutation", concentration: true },
  { id: "create-food-and-water", name: "Create Food and Water", level: 3, school: "Conjuration" },
  {
    id: "create-or-destroy-water",
    name: "Create or Destroy Water",
    level: 1,
    school: "Transmutation",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S, M (a mix of water and sand)",
    duration: "Instantaneous",
    classes: ["cleric", "druid"],
    description: "You do one of the following:",
    options: [
      {
        name: "Create Water",
        text: "You create up to 10 gallons of clean water within range in an open container. Alternatively, the water falls as rain in a 30-foot Cube within range, extinguishing exposed flames there.",
      },
      {
        name: "Destroy Water",
        text: "You destroy up to 10 gallons of water in an open container within range. Alternatively, you destroy fog in a 30-foot Cube within range.",
      },
    ],
    higherLevel:
      "You create or destroy 10 additional gallons of water, or the size of the Cube increases by 5 feet, for each spell slot level above 1.",
  },
    { id: "create-undead", name: "Create Undead", level: 6, school: "Necromancy" },
  { id: "crown-of-madness", name: "Crown of Madness", level: 2, school: "Enchantment", concentration: true },
  { id: "crusaders-mantle", name: "Crusader's Mantle", level: 3, school: "Transmutation", concentration: true },
{
  id: "cure-wounds",
  name: "Cure Wounds",
  level: 1,
  school: "Abjuration",
  castingTime: "Action",
  range: "Touch",
  components: "V, S",
  duration: "Instantaneous",
  classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  description:
    "A creature you touch regains Hit Points equal to 2d8 plus your spellcasting ability modifier.",
  higherLevel:
    "When cast with a higher-level spell slot, the healing increases by 2d8 for each slot level above 1.",
},
{
  id: "dancing-lights",
  name: "Dancing Lights",
  level: 0,
  school: "Illusion",
  concentration: true,
  castingTime: "Action",
  range: "120 feet",
  components: "V, S, M (a bit of phosphorus)",
  duration: "Concentration, up to 1 minute",
  classes: ["Bard", "Sorcerer", "Wizard"],
  description:
    "You create up to four torch-sized lights within range that appear as torches, lanterns, or glowing orbs and hover for the duration. Alternatively, you can combine them into one vaguely humanoid Medium form.",
  effects:
    "Each light sheds Dim Light in a 10-foot radius.",
  control:
    "As a Bonus Action, you can move the lights up to 60 feet to a space within range. A light must remain within 20 feet of another light created by this spell, and a light vanishes if it exceeds the spell’s range.",
},
  { id: "darkness", name: "Darkness", level: 2, school: "Evocation", concentration: true },
  { id: "darkvision", name: "Darkvision", level: 2, school: "Transmutation" },
  { id: "daylight", name: "Daylight", level: 3, school: "Evocation" },
  { id: "death-ward", name: "Death Ward", level: 4, school: "Abjuration" },
  { id: "destructive-wave", name: "Destructive Wave", level: 5, school: "Evocation" },
{
  id: "detect-evil-and-good",
  name: "Detect Evil and Good",
  level: 1,
  school: "Divination",
  concentration: true,
  castingTime: "Action",
  range: "Self",
  components: "V, S",
  duration: "Concentration, up to 10 minutes",
  classes: ["Cleric", "Paladin"],
  description:
    "For the duration, you sense the location of any Aberration, Celestial, Elemental, Fey, Fiend, or Undead within 30 feet of yourself. You also sense whether the Hallow spell is active there, and if so, where.",
  details:
    "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
},
{
  id: "detect-magic",
  name: "Detect Magic",
  level: 1,
  school: "Divination",
  concentration: true,
  ritual: true,
  castingTime: "Action or Ritual",
  range: "Self",
  components: "V, S",
  duration: "Concentration, up to 10 minutes",
  classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger", "Sorcerer", "Warlock", "Wizard"],
  description:
    "For the duration, you sense the presence of magical effects within 30 feet of yourself.",
  details:
    "If you sense such effects, you can take a Magic action to see a faint aura around any visible creature or object in the area that bears magic. If an effect is created by a spell, you learn the spell’s school of magic.",
  limitations:
    "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
},
{
  id: "detect-poison-and-disease",
  name: "Detect Poison and Disease",
  level: 1,
  school: "Divination",
  concentration: true,
  ritual: true,
  castingTime: "Action or Ritual",
  range: "Self",
  components: "V, S, M (a yew leaf)",
  duration: "Concentration, up to 10 minutes",
  classes: ["Cleric", "Druid", "Paladin", "Ranger"],
  description:
    "For the duration, you sense the location of poisons, poisonous creatures, and diseases within 30 feet of yourself.",
  details:
    "You identify the type of poison, creature, or disease in each case.",
  limitations:
    "The spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead.",
},
  { id: "detect-thoughts", name: "Detect Thoughts", level: 2, school: "Divination", concentration: true },
{
    id: "disguise-self",
    name: "Disguise Self",
    level: 1,
    school: "Illusion",
    castingTime: "Action",
    range: "Self",
    components: "V, S",
    duration: "1 hour",
    classes: ["bard", "sorcerer", "wizard"],
    description:
      "You make yourself—including your clothing, armor, weapons, and other belongings on your person—look different until the spell ends.",
    effects:
      "You can seem 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. Otherwise, the extent of the illusion is up to you.",
    limitations:
      "The changes wrought by this spell fail to hold up to physical inspection. For example, objects pass through illusory additions, and creatures touching them feel nothing.",
    detection:
      "To discern that you are disguised, a creature must take the Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC.",
  },
    { id: "dispel-evil-and-good", name: "Dispel Evil and Good", level: 5, school: "Abjuration", concentration: true },
  { id: "dispel-magic", name: "Dispel Magic", level: 3, school: "Abjuration" },
  {
  id: "dissonant-whispers",
  name: "Dissonant Whispers",
  level: 1,
  school: "Enchantment",
  castingTime: "Action",
  range: "60 feet",
  components: "V",
  duration: "Instantaneous",
  classes: ["Bard"],
  description:
    "You whisper a discordant melody into the mind of one creature you can see within range.",
  effects:
    "The target must make a Wisdom saving throw. On a failed save, it takes 3d6 Psychic damage and must immediately use its Reaction, if available, to move as far away from you as possible using the safest route. On a successful save, the target takes half as much damage only.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d6 for each slot level above 1.",
},
  { id: "divination", name: "Divination", level: 4, school: "Divination", ritual: true },
{
  id: "divine-favor",
  name: "Divine Favor",
  level: 1,
  school: "Transmutation",
  castingTime: "Bonus Action",
  range: "Self",
  components: "V, S",
  duration: "1 minute",
  classes: ["Paladin"],
  description:
    "Until the spell ends, your weapon attacks deal an extra 1d4 Radiant damage on a hit.",
},
{
  id: "divine-smite",
  name: "Divine Smite",
  level: 1,
  school: "Evocation",
  castingTime:
    "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike",
  range: "Self",
  components: "V",
  duration: "Instantaneous",
  classes: ["Paladin"],
  description:
    "The target takes an extra 2d8 Radiant damage from the attack.",
  effects:
    "The damage increases by 1d8 if the target is a Fiend or an Undead.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d8 for each slot level above 1.",
},
  { id: "divine-word", name: "Divine Word", level: 7, school: "Evocation" },
  { id: "dominate-beast", name: "Dominate Beast", level: 4, school: "Enchantment", concentration: true },
  { id: "dragons-breath", name: "Dragon's Breath", level: 2, school: "Transmutation", concentration: true },
  { id: "druidcraft", name: "Druidcraft", level: 0, school: "Transmutation" },
  { id: "earthquake", name: "Earthquake", level: 8, school: "Transmutation", concentration: true },
  { id: "elemental-weapon", name: "Elemental Weapon", level: 3, school: "Transmutation", concentration: true },
  { id: "elementalism", name: "Elementalism", level: 0, school: "Transmutation" },
{
  id: "enhance-ability",
  name: "Enhance Ability",
  level: 2,
  school: "Transmutation",
  concentration: true,
  castingTime: "Action",
  range: "Touch",
  components: "V, S, M (fur or a feather)",
  duration: "Concentration, up to 1 hour",
  classes: ["Bard", "Cleric", "Druid", "Ranger", "Sorcerer", "Wizard"],
  description:
    "You touch a creature and choose one ability: Strength, Dexterity, Intelligence, Wisdom, or Charisma.",
  effects:
    "For the duration, the target has Advantage on ability checks using the chosen ability.",
  higherLevel:
    "When cast with a higher-level spell slot, you can target one additional creature for each slot level above 2. You can choose a different ability for each target.",
},
  { id: "enlarge-reduce", name: "Enlarge/Reduce", level: 2, school: "Transmutation", concentration: true },
{
  id: "entangle",
  name: "Entangle",
  level: 1,
  school: "Conjuration",
  concentration: true,
  castingTime: "Action",
  range: "90 feet",
  components: "V, S",
  duration: "Concentration, up to 1 minute",
  classes: ["Druid", "Ranger"],
  description:
    "Grasping plants sprout from the ground in a 20-foot square within range. The area becomes Difficult Terrain for the duration.",
  effects:
    "Each creature in the area when you cast the spell must succeed on a Strength saving throw or have the Restrained condition until the spell ends.",
  control:
    "A Restrained creature can take an action to make a Strength (Athletics) check against your spell save DC. On a success, it frees itself and is no longer Restrained.",
},
  { id: "etherealness", name: "Etherealness", level: 7, school: "Conjuration" },
  { id: "expeditious-retreat", name: "Expeditious Retreat", level: 1, school: "Transmutation", concentration: true },
{
  id: "faerie-fire",
  name: "Faerie Fire",
  level: 1,
  school: "Evocation",
  concentration: true,
  castingTime: "Action",
  range: "60 feet",
  components: "V",
  duration: "Concentration, up to 1 minute",
  classes: ["Bard", "Druid"],
  description:
    "Objects in a 20-foot Cube within range are outlined in blue, green, or violet light (your choice). Each creature in the area is also outlined if it fails a Dexterity saving throw.",
  effects:
    "For the duration, affected creatures and objects shed Dim Light in a 10-foot radius and cannot benefit from being Invisible.",
  benefits:
    "Attack rolls against an affected creature or object have Advantage if the attacker can see it.",
},
  { id: "false-life", name: "False Life", level: 1, school: "Necromancy" },
  { id: "feather-fall", name: "Feather Fall", level: 1, school: "Transmutation" },
  { id: "feign-death", name: "Feign Death", level: 3, school: "Necromancy", ritual: true },
  { id: "find-familiar", name: "Find Familiar", level: 1, school: "Conjuration", ritual: true },
  { id: "find-steed", name: "Find Steed", level: 2, school: "Conjuration" },
  { id: "find-the-path", name: "Find the Path", level: 6, school: "Divination", concentration: true },
  { id: "find-traps", name: "Find Traps", level: 2, school: "Divination" },
  { id: "fire-bolt", name: "Fire Bolt", level: 0, school: "Evocation" },
  { id: "fire-shield", name: "Fire Shield", level: 4, school: "Evocation" },
  { id: "fire-storm", name: "Fire Storm", level: 7, school: "Evocation" },
  { id: "flame-blade", name: "Flame Blade", level: 2, school: "Evocation", concentration: true },
  { id: "flame-strike", name: "Flame Strike", level: 5, school: "Evocation" },
{
  id: "flaming-sphere",
  name: "Flaming Sphere",
  level: 2,
  school: "Conjuration",
  concentration: true,
  castingTime: "Action",
  range: "60 feet",
  components: "V, S, M (a ball of wax)",
  duration: "Concentration, up to 1 minute",
  classes: ["Druid", "Sorcerer", "Wizard"],
  description:
    "You create a 5-foot-diameter sphere of fire in an unoccupied space on the ground within range. It lasts for the duration.",
  effects:
    "Any creature that ends its turn within 5 feet of the sphere must make a Dexterity saving throw, taking 2d6 Fire damage on a failed save, or half as much on a success.",
  control:
    "As a Bonus Action, you can move the sphere up to 30 feet, rolling it along the ground.",
  interaction:
    "If you move the sphere into a creature’s space, that creature must make the saving throw against the sphere, and the sphere stops moving for the turn.",
  details:
    "The sphere can move over barriers up to 5 feet tall and jump up to 10 feet wide. It ignites flammable objects not being worn or carried. It sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d6 for each slot level above 2.",
},
  { id: "flesh-to-stone", name: "Flesh to Stone", level: 6, school: "Transmutation", concentration: true },
  { id: "fog-cloud", name: "Fog Cloud", level: 1, school: "Conjuration", concentration: true },
  { id: "foresight", name: "Foresight", level: 9, school: "Divination" },
  { id: "forbiddance", name: "Forbiddance", level: 6, school: "Abjuration", ritual: true },
  { id: "fount-of-moonlight", name: "Fount of Moonlight", level: 4, school: "Evocation", concentration: true },
  { id: "freedom-of-movement", name: "Freedom of Movement", level: 4, school: "Abjuration" },
  { id: "friends", name: "Friends", level: 0, school: "Enchantment" },
  { id: "gate", name: "Gate", level: 9, school: "Conjuration", concentration: true },
  { id: "geas", name: "Geas", level: 5, school: "Enchantment" },
  { id: "gentle-repose", name: "Gentle Repose", level: 2, school: "Necromancy", ritual: true },
  { id: "giant-insect", name: "Giant Insect", level: 4, school: "Conjuration", concentration: true },
  { id: "glyph-of-warding", name: "Glyph of Warding", level: 3, school: "Abjuration" },
{
  id: "goodberry",
  name: "Goodberry",
  level: 1,
  school: "Conjuration",
  castingTime: "Action",
  range: "Self",
  components: "V, S, M (a sprig of mistletoe)",
  duration: "24 hours",
  classes: ["Druid", "Ranger"],
  description:
    "Ten berries appear in your hand and are infused with magic for the duration.",
  effects:
    "A creature can take a Bonus Action to eat one berry. Eating a berry restores 1 Hit Point, and the berry provides enough nourishment to sustain a creature for one day.",
  limitations:
    "Uneaten berries disappear when the spell ends.",
},
  { id: "grasping-vine", name: "Grasping Vine", level: 4, school: "Conjuration", concentration: true },
  { id: "grease", name: "Grease", level: 1, school: "Conjuration" },
  { id: "greater-restoration", name: "Greater Restoration", level: 5, school: "Abjuration" },
  { id: "guidance", name: "Guidance", level: 0, school: "Divination", concentration: true },
  { id: "guiding-bolt", name: "Guiding Bolt", level: 1, school: "Evocation" },
  { id: "guardian-of-faith", name: "Guardian of Faith", level: 4, school: "Conjuration" },
  { id: "gust-of-wind", name: "Gust of Wind", level: 2, school: "Evocation", concentration: true },
  { id: "hallow", name: "Hallow", level: 5, school: "Abjuration" },
  { id: "hallucinatory-terrain", name: "Hallucinatory Terrain", level: 4, school: "Illusion" },
  { id: "harm", name: "Harm", level: 6, school: "Necromancy" },
  { id: "heal", name: "Heal", level: 6, school: "Abjuration" },
{
  id: "healing-word",
  name: "Healing Word",
  level: 1,
  school: "Abjuration",
  castingTime: "Bonus Action",
  range: "60 feet",
  components: "V",
  duration: "Instantaneous",
  classes: ["Bard", "Cleric", "Druid"],
  description:
    "A creature of your choice that you can see within range regains Hit Points equal to 2d4 plus your spellcasting ability modifier.",
  higherLevel:
    "When cast with a higher-level spell slot, the healing increases by 2d4 for each slot level above 1.",
},
  { id: "heat-metal", name: "Heat Metal", level: 2, school: "Transmutation", concentration: true },
  {
  id: "hellish-rebuke",
  name: "Hellish Rebuke",
  level: 1,
  school: "Evocation",
  castingTime:
    "Reaction, which you take in response to taking damage from a creature that you can see within 60 feet of yourself",
  range: "60 feet",
  components: "V, S",
  duration: "Instantaneous",
  classes: ["Warlock"],
  description:
    "The creature that damaged you is momentarily surrounded by green flames.",
  effects:
    "The target must make a Dexterity saving throw, taking 2d10 Fire damage on a failed save, or half as much damage on a success.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d10 for each slot level above 1.",
},
  { id: "heroes-feast", name: "Heroes' Feast", level: 6, school: "Conjuration" },
{
    id: "heroism",
    name: "Heroism",
    level: 1,
    school: "Enchantment",
    concentration: true,
    castingTime: "Action",
    range: "Touch",
    components: "V, S",
    duration: "Concentration, up to 1 minute",
    classes: ["bard", "paladin"],
    description:
      "A willing creature you touch is imbued with bravery.",
    benefits:
      "Until the spell ends, the creature is immune to the Frightened condition and gains Temporary Hit Points equal to your spellcasting ability modifier at the start of each of its turns.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 1.",
  },
  {
  id: "hold-person",
  name: "Hold Person",
  level: 2,
  school: "Enchantment",
  concentration: true,
  castingTime: "Action",
  range: "60 feet",
  components: "V, S, M (a straight piece of iron)",
  duration: "Concentration, up to 1 minute",
  classes: ["Bard", "Cleric", "Druid", "Sorcerer", "Warlock", "Wizard"],
  description:
    "Choose a Humanoid you can see within range. The target must succeed on a Wisdom saving throw or have the Paralyzed condition for the duration.",
  effects:
    "At the end of each of its turns, the target repeats the saving throw, ending the spell on itself on a success.",
  higherLevel:
    "When cast with a higher-level spell slot, you can target one additional Humanoid for each slot level above 2.",
},
  { id: "holy-aura", name: "Holy Aura", level: 8, school: "Abjuration", concentration: true },
{
    id: "ice-knife",
    name: "Ice Knife",
    level: 1,
    school: "Conjuration",
    castingTime: "Action",
    range: "60 feet",
    components: "S, M (a drop of water or a piece of ice)",
    duration: "Instantaneous",
    classes: ["druid", "sorcerer", "wizard"],
    description:
      "You create a shard of ice and fling it at one creature within range. Make a ranged spell attack against the target.",
    effects:
      "On a hit, the target takes 1d10 Piercing damage. Hit or miss, the shard then explodes.",
    savingThrows: "Dexterity",
    control:
      "The target and each creature within 5 feet of it must succeed on a Dexterity saving throw or take 2d6 Cold damage.",
    higherLevel:
      "The Cold damage increases by 1d6 for each spell slot level above 1.",
  },
    { id: "ice-storm", name: "Ice Storm", level: 4, school: "Evocation" },
  { id: "identify", name: "Identify", level: 1, school: "Divination", ritual: true },
  { id: "illusory-script", name: "Illusory Script", level: 1, school: "Illusion", ritual: true },
  { id: "incendiary-cloud", name: "Incendiary Cloud", level: 8, school: "Conjuration", concentration: true },
  { id: "inflict-wounds", name: "Inflict Wounds", level: 1, school: "Necromancy" },
  { id: "insect-plague", name: "Insect Plague", level: 5, school: "Conjuration", concentration: true },
{
    id: "invisibility",
    name: "Invisibility",
    level: 2,
    school: "Illusion",
    concentration: true,
    castingTime: "Action",
    range: "Touch",
    components: "V, S, M (an eyelash in gum arabic)",
    duration: "Concentration, up to 1 hour",
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    description:
      "A creature you touch has the Invisible condition until the spell ends.",
    endConditions:
      "The spell ends early immediately after the target makes an attack roll, deals damage, or casts a spell.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 2.",
  },
  {
    id: "jump",
    name: "Jump",
    level: 1,
    school: "Transmutation",
    castingTime: "Bonus Action",
    range: "Touch",
    components: "V, S, M (a grasshopper's hind leg)",
    duration: "1 minute",
    classes: ["druid", "ranger", "sorcerer", "wizard"],
    description:
      "You touch a willing creature. Once on each of its turns until the spell ends, that creature can jump up to 30 feet by spending 10 feet of movement.",
    benefits:
      "The target can jump up to 30 feet by spending 10 feet of movement once on each of its turns.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 1.",
  },
{
    id: "knock",
    name: "Knock",
    level: 2,
    school: "Transmutation",
    castingTime: "Action",
    range: "60 feet",
    components: "V",
    duration: "Instantaneous",
    classes: ["bard", "sorcerer", "wizard"],
    description:
      "Choose an object that you can see within range. The object can be a door, a box, a chest, a set of manacles, a padlock, or another object that contains a mundane or magical means that prevents access.",
    effects:
      "A target that is held shut by a mundane lock or that is stuck or barred becomes unlocked, unstuck, or unbarred. If the object has multiple locks, only one of them is unlocked.",
    special:
      "If the target is held shut by Arcane Lock, that spell is suppressed for 10 minutes, during which time the target can be opened and closed.",
    control:
      "When you cast the spell, a loud knock, audible up to 300 feet away, emanates from the target.",
  },
    { id: "legend-lore", name: "Legend Lore", level: 5, school: "Divination" },
{
  id: "lesser-restoration",
  name: "Lesser Restoration",
  level: 2,
  school: "Abjuration",
  castingTime: "Bonus Action",
  range: "Touch",
  components: "V, S",
  duration: "Instantaneous",
  classes: ["Bard", "Cleric", "Druid", "Paladin", "Ranger"],
  description:
    "You touch a creature and end one condition affecting it.",
  effects:
    "The condition can be Blinded, Deafened, Paralyzed, or Poisoned.",
},
  { id: "levitate", name: "Levitate", level: 2, school: "Transmutation", concentration: true },
  { id: "light", name: "Light", level: 0, school: "Evocation" },
  { id: "locate-animals-or-plants", name: "Locate Animals or Plants", level: 2, school: "Divination", ritual: true },
  { id: "locate-creature", name: "Locate Creature", level: 4, school: "Divination", concentration: true },
  { id: "locate-object", name: "Locate Object", level: 2, school: "Divination", concentration: true },
  {
    id: "longstrider",
    name: "Longstrider",
    level: 1,
    school: "Transmutation",
    castingTime: "Action",
    range: "Touch",
    components: "V, S, M (a pinch of dirt)",
    duration: "1 hour",
    classes: ["bard", "druid", "ranger", "wizard"],
    description:
      "You touch a creature. The target's Speed increases by 10 feet until the spell ends.",
    benefits: "The target's Speed increases by 10 feet until the spell ends.",
    higherLevel:
      "You can target one additional creature for each spell slot level above 1.",
  },
    { id: "mage-armor", name: "Mage Armor", level: 1, school: "Abjuration" },
  {
    id: "mage-hand",
    name: "Mage Hand",
    level: 0,
    school: "Conjuration",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S",
    duration: "1 minute",
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    description:
      "A spectral, floating hand appears at a point you choose within range. The hand lasts for the duration. The hand vanishes if it is ever more than 30 feet away from you or if you cast this spell again.",
    control:
      "When you cast the spell, you can use the hand to manipulate an object, open an unlocked door or container, stow or retrieve an item from an open container, or pour the contents out of a vial. As a Magic action on your later turns, you can control the hand again. As part of that action, you can move the hand up to 30 feet.",
    limitations:
      "The hand can't attack, activate magic items, or carry more than 10 pounds.",
  },
    { id: "magic-circle", name: "Magic Circle", level: 3, school: "Abjuration" },
  { id: "magic-missile", name: "Magic Missile", level: 1, school: "Evocation" },
  { id: "magic-mouth", name: "Magic Mouth", level: 2, school: "Illusion", ritual: true },
  { id: "magic-weapon", name: "Magic Weapon", level: 2, school: "Transmutation", concentration: true },
  { id: "mass-cure-wounds", name: "Mass Cure Wounds", level: 5, school: "Abjuration" },
  { id: "mass-heal", name: "Mass Heal", level: 9, school: "Abjuration" },
  { id: "mass-healing-word", name: "Mass Healing Word", level: 3, school: "Abjuration" },
  { id: "meld-into-stone", name: "Meld into Stone", level: 3, school: "Transmutation", ritual: true },
  { id: "melfs-acid-arrow", name: "Melf's Acid Arrow", level: 2, school: "Evocation" },
  { id: "mending", name: "Mending", level: 0, school: "Transmutation" },
  { id: "message", name: "Message", level: 0, school: "Transmutation" },
  { id: "mind-sliver", name: "Mind Sliver", level: 0, school: "Enchantment" },
  { id: "mind-spike", name: "Mind Spike", level: 2, school: "Divination", concentration: true },
{
    id: "minor-illusion",
    name: "Minor Illusion",
    level: 0,
    school: "Illusion",
    castingTime: "Action",
    range: "30 feet",
    components: "S, M (a bit of fleece)",
    duration: "1 minute",
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    description:
      "You create a sound or an image of an object within range that lasts for the duration.",
    options: [
      {
        name: "Sound",
        text: "The sound's volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, beating drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.",
      },
      {
        name: "Image",
        text: "The image of an object must be no larger than a 5-foot Cube. The image can't create sound, light, smell, or any other sensory effect.",
      },
    ],
    limitations:
      "Physical interaction with the image reveals it to be an illusion, since things can pass through it.",
    detection:
      "If a creature takes a Study action to examine the illusion, it can determine it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to that creature.",
  },
    { id: "mirage-arcane", name: "Mirage Arcane", level: 7, school: "Illusion" },
  { id: "mirror-image", name: "Mirror Image", level: 2, school: "Illusion" },
  { id: "misty-step", name: "Misty Step", level: 2, school: "Conjuration" },
{
  id: "moonbeam",
  name: "Moonbeam",
  level: 2,
  school: "Evocation",
  concentration: true,
  castingTime: "Action",
  range: "120 feet",
  components: "V, S, M (a moonseed leaf)",
  duration: "Concentration, up to 1 minute",
  classes: ["Druid"],
  description:
    "A silvery beam of pale light shines down in a 5-foot-radius, 40-foot-high Cylinder centered on a point within range. The area is filled with Dim Light.",
  control:
    "On later turns, you can take a Magic action to move the Cylinder up to 60 feet.",
  effects:
    "When the Cylinder appears, each creature in it makes a Constitution saving throw. On a failed save, a creature takes 2d10 Radiant damage, or half as much on a success.",
  special:
    "If a shape-shifted creature fails the save, it reverts to its true form and cannot shape-shift until it leaves the Cylinder.",
  triggers:
    "A creature also makes this saving throw when it enters the spell’s area for the first time on a turn or ends its turn there. A creature can only take this damage once per turn.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d10 for each slot level above 2.",
},
  { id: "move-earth", name: "Move Earth", level: 6, school: "Transmutation", concentration: true },
  { id: "nystuls-magic-aura", name: "Nystul's Magic Aura", level: 2, school: "Illusion" },
{
  id: "pass-without-trace",
  name: "Pass without Trace",
  level: 2,
  school: "Abjuration",
  concentration: true,
  castingTime: "Action",
  range: "Self",
  components: "V, S, M (ashes from burned mistletoe)",
  duration: "Concentration, up to 1 hour",
  classes: ["Druid", "Ranger"],
  description:
    "You radiate a concealing aura in a 30-foot emanation for the duration.",
  effects:
    "You and each creature you choose within the aura gain a +10 bonus to Dexterity (Stealth) checks and leave no tracks.",
},
  { id: "phantasmal-force", name: "Phantasmal Force", level: 2, school: "Illusion", concentration: true },
  { id: "planar-ally", name: "Planar Ally", level: 6, school: "Conjuration" },
  { id: "planar-binding", name: "Planar Binding", level: 5, school: "Abjuration" },
  { id: "plane-shift", name: "Plane Shift", level: 7, school: "Conjuration" },
  { id: "plant-growth", name: "Plant Growth", level: 3, school: "Transmutation" },
  { id: "poison-spray", name: "Poison Spray", level: 0, school: "Necromancy" },
  { id: "polymorph", name: "Polymorph", level: 4, school: "Transmutation", concentration: true },
  { id: "power-word-fortify", name: "Power Word Fortify", level: 7, school: "Enchantment" },
  { id: "power-word-heal", name: "Power Word Heal", level: 9, school: "Enchantment" },
  { id: "prayer-of-healing", name: "Prayer of Healing", level: 2, school: "Abjuration" },
  { id: "prestidigitation", name: "Prestidigitation", level: 0, school: "Transmutation" },
  { id: "produce-flame", name: "Produce Flame", level: 0, school: "Conjuration" },
  { id: "protection-from-energy", name: "Protection from Energy", level: 3, school: "Abjuration", concentration: true },
{
  id: "protection-from-evil-and-good",
  name: "Protection from Evil and Good",
  level: 1,
  school: "Abjuration",
  concentration: true,
  castingTime: "Action",
  range: "Touch",
  components: "V, S, M (a flask of Holy Water worth 25+ GP, which the spell consumes)",
  duration: "Concentration, up to 10 minutes",
  classes: ["Cleric", "Druid", "Paladin", "Warlock", "Wizard"],
  description:
    "Until the spell ends, one willing creature you touch is protected against Aberrations, Celestials, Elementals, Fey, Fiends, and Undead.",
  effects:
    "Creatures of those types have Disadvantage on attack rolls against the target.",
  benefits:
    "The target also can't be possessed or gain the Charmed or Frightened conditions from those creatures.",
  details:
    "If the target is already possessed, Charmed, or Frightened by such a creature, it has Advantage on any new saving throw against the relevant effect.",
},
  { id: "protection-from-poison", name: "Protection from Poison", level: 2, school: "Abjuration" },
{
    id: "purify-food-and-drink",
    name: "Purify Food and Drink",
    level: 1,
    school: "Transmutation",
    ritual: true,
    castingTime: "Action or Ritual",
    range: "10 feet",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["cleric", "druid", "paladin"],
    description:
      "You remove poison and rot from nonmagical food and drink in a 5-foot-radius Sphere centered on a point within range.",
    effects:
      "All nonmagical food and drink in the area is purified and rendered free of poison and disease.",
  },
  { id: "raise-dead", name: "Raise Dead", level: 5, school: "Necromancy" },
  { id: "ray-of-enfeeblement", name: "Ray of Enfeeblement", level: 2, school: "Necromancy", concentration: true },
  { id: "ray-of-frost", name: "Ray of Frost", level: 0, school: "Evocation" },
  { id: "ray-of-sickness", name: "Ray of Sickness", level: 1, school: "Necromancy" },
  { id: "reincarnate", name: "Reincarnate", level: 5, school: "Necromancy" },
  { id: "regenerate", name: "Regenerate", level: 7, school: "Transmutation" },
  { id: "remove-curse", name: "Remove Curse", level: 3, school: "Abjuration" },
  { id: "resistance", name: "Resistance", level: 0, school: "Abjuration", concentration: true },
  { id: "resurrection", name: "Resurrection", level: 7, school: "Necromancy" },
  { id: "revivify", name: "Revivify", level: 3, school: "Necromancy" },
  { id: "reverse-gravity", name: "Reverse Gravity", level: 7, school: "Transmutation", concentration: true },
  { id: "rope-trick", name: "Rope Trick", level: 2, school: "Transmutation" },
  { id: "sacred-flame", name: "Sacred Flame", level: 0, school: "Evocation" },
  { id: "sanctuary", name: "Sanctuary", level: 1, school: "Abjuration" },
  { id: "scorching-ray", name: "Scorching Ray", level: 2, school: "Evocation" },
  { id: "scrying", name: "Scrying", level: 5, school: "Divination", concentration: true },
{
  id: "searing-smite",
  name: "Searing Smite",
  level: 1,
  school: "Evocation",
  castingTime:
    "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike",
  range: "Self",
  components: "V",
  duration: "1 minute",
  classes: ["Paladin"],
  description:
    "As you hit the target, it takes an extra 1d6 Fire damage from the attack.",
  effects:
    "At the start of each of its turns, the target takes 1d6 Fire damage and then makes a Constitution saving throw. On a failed save, the spell continues. On a successful save, the spell ends.",
  higherLevel:
    "When cast with a higher-level spell slot, all the damage increases by 1d6 for each slot level above 1.",
},
  { id: "see-invisibility", name: "See Invisibility", level: 2, school: "Divination" },
  { id: "sending", name: "Sending", level: 3, school: "Divination" },
  { id: "shapechange", name: "Shapechange", level: 9, school: "Transmutation", concentration: true },
  { id: "shatter", name: "Shatter", level: 2, school: "Evocation" },
  { id: "shield", name: "Shield", level: 1, school: "Abjuration" },
{
  id: "shield-of-faith",
  name: "Shield of Faith",
  level: 1,
  school: "Abjuration",
  concentration: true,
  castingTime: "Bonus Action",
  range: "60 feet",
  components: "V, S, M (a prayer scroll)",
  duration: "Concentration, up to 10 minutes",
  classes: ["Cleric", "Paladin"],
  description:
    "A shimmering field surrounds a creature of your choice within range, granting it a +2 bonus to AC for the duration.",
},
  { id: "shillelagh", name: "Shillelagh", level: 0, school: "Transmutation" },
  { id: "shining-smite", name: "Shining Smite", level: 2, school: "Transmutation", concentration: true },
{
    id: "silent-image",
    name: "Silent Image",
    level: 1,
    school: "Illusion",
    concentration: true,
    castingTime: "Action",
    range: "60 feet",
    components: "V, S, M (a bit of fleece)",
    duration: "Concentration, up to 10 minutes",
    classes: ["bard", "sorcerer", "wizard"],
    description:
      "You create the image of an object, a creature, or some other visible phenomenon that is no larger than a 15-foot Cube.",
    control:
      "As a Magic action, you can cause the image to move to any spot within range and alter its appearance so that its movement appears natural.",
    limitations:
      "The image is purely visual and isn't accompanied by sound, smell, or other sensory effects.",
    detection:
      "Physical interaction reveals it to be an illusion. A creature can take a Study action to examine the image and determine it is an illusion with a successful Intelligence (Investigation) check against your spell save DC.",
    special:
      "If a creature discerns the illusion for what it is, the creature can see through the image.",
  },
  {
    id: "silence",
    name: "Silence",
    level: 2,
    school: "Illusion",
    ritual: true,
    concentration: true,
    castingTime: "Action or Ritual",
    range: "120 feet",
    components: "V, S",
    duration: "Concentration, up to 10 minutes",
    classes: ["bard", "cleric", "ranger"],
    description:
      "For the duration, no sound can be created within or pass through a 20-foot-radius Sphere centered on a point you choose within range.",
    benefits:
      "Any creature or object entirely inside the Sphere has Immunity to Thunder damage.",
    conditions:
      "Creatures have the Deafened condition while entirely inside the Sphere.",
    limitations:
      "Casting a spell that includes a Verbal component is impossible inside the Sphere.",
  },
  {
    id: "sleep",
    name: "Sleep",
    level: 1,
    school: "Enchantment",
    concentration: true,
    castingTime: "Action",
    range: "60 feet",
    components: "V, S, M (a pinch of sand or rose petals)",
    duration: "Concentration, up to 1 minute",
    classes: ["bard", "sorcerer", "wizard"],
    description:
      "Each creature of your choice in a 5-foot-radius Sphere centered on a point within range must succeed on a Wisdom saving throw or have the Incapacitated condition until the end of its next turn.",
    savingThrows: "Wisdom",
    conditions:
      "If a target fails the first save, it must repeat the save at the end of its next turn. If it fails the second save, it has the Unconscious condition for the duration.",
    endConditions:
      "The spell ends on a target if it takes damage or if someone within 5 feet of it takes an action to shake it out of the spell's effect.",
    special:
      "Creatures that don't sleep, such as elves, or that have Immunity to the Exhaustion condition automatically succeed on saves against this spell.",
  },
    { id: "sleet-storm", name: "Sleet Storm", level: 3, school: "Conjuration", concentration: true },
{
  id: "speak-with-animals",
  name: "Speak with Animals",
  level: 1,
  school: "Divination",
  ritual: true,
  castingTime: "Action or Ritual",
  range: "Self",
  components: "V, S",
  duration: "10 minutes",
  classes: ["Bard", "Druid", "Ranger", "Warlock"],
  description:
    "For the duration, you can comprehend and verbally communicate with Beasts, and you can use any of the Influence action’s skill options with them.",
  details:
    "Most Beasts have limited knowledge beyond survival and companionship, but they can provide information about nearby locations and creatures, including what they have perceived within the past day.",
},
{
  id: "speak-with-dead",
  name: "Speak with Dead",
  level: 3,
  school: "Necromancy",
  castingTime: "Action",
  range: "10 feet",
  components: "V, S, M (burning incense)",
  duration: "10 minutes",
  classes: ["Bard", "Cleric", "Wizard"],
  description:
    "You grant a semblance of life to a corpse within range, allowing it to answer questions you pose.",
  conditions:
    "The corpse must have a mouth and cannot be Undead. The spell fails if the corpse has been targeted by this spell within the past 10 days.",
  effects:
    "Until the spell ends, you can ask the corpse up to five questions. The corpse knows only what it knew in life, including the languages it knew.",
  behavior:
    "Answers are usually brief, cryptic, or repetitive. The corpse is under no compulsion to be truthful if you are hostile to it.",
  limitations:
    "The spell does not return the creature’s soul, only animates its spirit. The corpse cannot learn new information, doesn’t understand events after its death, and cannot speculate about the future.",
},
  { id: "speak-with-plants", name: "Speak with Plants", level: 3, school: "Transmutation" },
  { id: "spare-the-dying", name: "Spare the Dying", level: 0, school: "Necromancy" },
  { id: "spider-climb", name: "Spider Climb", level: 2, school: "Transmutation", concentration: true },
{
  id: "spike-growth",
  name: "Spike Growth",
  level: 2,
  school: "Transmutation",
  concentration: true,
  castingTime: "Action",
  range: "150 feet",
  components: "V, S, M (seven thorns)",
  duration: "Concentration, up to 10 minutes",
  classes: ["Druid", "Ranger"],
  description:
    "The ground in a 20-foot-radius sphere centered on a point within range sprouts hard spikes and thorns. The area becomes Difficult Terrain for the duration.",
  effects:
    "When a creature moves into or within the area, it takes 2d4 Piercing damage for every 5 feet it travels.",
  details:
    "The transformation of the ground is camouflaged to look natural.",
  detection:
    "A creature that cannot see the area when the spell is cast must take a Search action and succeed on a Wisdom (Perception or Survival) check against your spell save DC to recognize the terrain as hazardous before entering it.",
},
  { id: "spirit-guardians", name: "Spirit Guardians", level: 3, school: "Conjuration", concentration: true },
  { id: "spiritual-weapon", name: "Spiritual Weapon", level: 2, school: "Evocation", concentration: true },
  { id: "staggering-smite", name: "Staggering Smite", level: 4, school: "Enchantment", concentration: true },
  { id: "starry-wisp", name: "Starry Wisp", level: 0, school: "Evocation" },
  { id: "stone-shape", name: "Stone Shape", level: 4, school: "Transmutation" },
  { id: "stoneskin", name: "Stoneskin", level: 4, school: "Transmutation", concentration: true },
  { id: "storm-of-vengeance", name: "Storm of Vengeance", level: 9, school: "Conjuration", concentration: true },
{
  id: "suggestion",
  name: "Suggestion",
  level: 2,
  school: "Enchantment",
  concentration: true,
  castingTime: "Action",
  range: "30 feet",
  components: "V, M (a drop of honey)",
  duration: "Concentration, up to 8 hours",
  classes: ["Bard", "Sorcerer", "Warlock", "Wizard"],
  description:
    "You suggest a course of activity (up to 25 words) to a creature you can see within range that can hear and understand you.",
  conditions:
    "The suggestion must sound reasonable and cannot involve obviously harmful actions toward the target or its allies.",
  effects:
    "The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration or until you or your allies damage it.",
  behavior:
    "The Charmed target pursues the suggested course of action to the best of its ability.",
  durationRule:
    "If the suggested activity can be completed in a shorter time than the spell’s duration, the spell ends once the task is completed.",
},
  { id: "summon-beast", name: "Summon Beast", level: 2, school: "Conjuration", concentration: true },
  { id: "summon-celestial", name: "Summon Celestial", level: 5, school: "Conjuration", concentration: true },
  { id: "summon-elemental", name: "Summon Elemental", level: 4, school: "Conjuration", concentration: true },
  { id: "summon-fey", name: "Summon Fey", level: 3, school: "Conjuration", concentration: true },
  { id: "sunbeam", name: "Sunbeam", level: 6, school: "Evocation", concentration: true },
  { id: "sunburst", name: "Sunburst", level: 8, school: "Evocation" },
{
  id: "tashas-hideous-laughter",
  name: "Tasha's Hideous Laughter",
  level: 1,
  school: "Enchantment",
  concentration: true,
  castingTime: "Action",
  range: "30 feet",
  components: "V, S, M (a tart and a feather)",
  duration: "Concentration, up to 1 minute",
  classes: ["Bard", "Warlock", "Wizard"],
  description:
    "One creature of your choice within range must make a Wisdom saving throw.",
  effects:
    "On a failed save, the target has the Prone and Incapacitated conditions for the duration, laughing uncontrollably if it is capable of laughter.",
  behavior:
    "The target cannot stand up while affected.",
  savingThrows:
    "At the end of each of its turns, and each time it takes damage, the target can repeat the saving throw. It has Advantage on the save if it was triggered by damage.",
  higherLevel:
    "When cast with a higher-level spell slot, you can target one additional creature for each slot level above 1.",
},
  { id: "tensers-floating-disk", name: "Tenser's Floating Disk", level: 1, school: "Conjuration", ritual: true },
{
    id: "thaumaturgy",
    name: "Thaumaturgy",
    level: 0,
    school: "Transmutation",
    castingTime: "Action",
    range: "30 feet",
    components: "V",
    duration: "Up to 1 minute",
    classes: ["cleric"],
    description:
      "You manifest a minor wonder within range. You create one of the effects below within range. If you cast this spell multiple times, you can have up to three of its 1-minute effects active at a time.",
    options: [
      {
        name: "Altered Eyes",
        text: "You alter the appearance of your eyes for 1 minute.",
      },
      {
        name: "Booming Voice",
        text: "Your voice booms up to three times as loud as normal for 1 minute. For the duration, you have Advantage on Charisma (Intimidation) checks.",
      },
      {
        name: "Fire Play",
        text: "You cause flames to flicker, brighten, dim, or change color for 1 minute.",
      },
      {
        name: "Invisible Hand",
        text: "You instantaneously cause an unlocked door or window to fly open or slam shut.",
      },
      {
        name: "Phantom Sound",
        text: "You create an instantaneous sound that originates from a point of your choice within range, such as a rumble of thunder, the cry of a raven, or ominous whispers.",
      },
      {
        name: "Tremors",
        text: "You cause harmless tremors in the ground for 1 minute.",
      },
    ],
  },
  {
    id: "thorn-whip",
    name: "Thorn Whip",
    level: 0,
    school: "Transmutation",
    castingTime: "Action",
    range: "30 feet",
    components: "V, S, M (the stem of a thorny plant)",
    duration: "Instantaneous",
    classes: ["druid"],
    description:
      "You create a vine-like whip covered in thorns that lashes out at your command toward a creature in range. Make a melee spell attack against the target.",
    effects: "On a hit, the target takes 1d6 Piercing damage.",
    control:
      "If the target is Large or smaller, you can pull it up to 10 feet closer to you.",
    cantripUpgrade:
      "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
  },
    { id: "thunderclap", name: "Thunderclap", level: 0, school: "Evocation" },
{
  id: "thunderous-smite",
  name: "Thunderous Smite",
  level: 1,
  school: "Evocation",
  castingTime:
    "Bonus Action, which you take immediately after hitting a target with a Melee weapon or an Unarmed Strike",
  range: "Self",
  components: "V",
  duration: "Instantaneous",
  classes: ["Paladin"],
  description:
    "Your strike rings with thunder that is audible within 300 feet of you, and the target takes an extra 2d6 Thunder damage from the attack.",
  effects:
    "If the target is a creature, it must succeed on a Strength saving throw or be pushed 10 feet away from you and have the Prone condition.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d6 for each slot level above 1.",
},
{
    id: "thunderwave",
    name: "Thunderwave",
    level: 1,
    school: "Evocation",
    castingTime: "Action",
    range: "Self",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["bard", "druid", "sorcerer", "wizard"],
    description:
      "You unleash a wave of thunderous energy. Each creature in a 15-foot Cube originating from you makes a Constitution saving throw.",
    savingThrows: "Constitution",
    effects:
      "On a failed save, a creature takes 2d8 Thunder damage and is pushed 10 feet away from you. On a successful save, a creature takes half as much damage only.",
    control:
      "In addition, unsecured objects that are entirely within the Cube are pushed 10 feet away from you, and a thunderous boom is audible within 300 feet.",
    higherLevel:
      "The damage increases by 1d8 for each spell slot level above 1.",
  },
    { id: "tongues", name: "Tongues", level: 3, school: "Divination" },
{
    id: "toll-the-dead",
    name: "Toll the Dead",
    level: 0,
    school: "Necromancy",
    castingTime: "Action",
    range: "60 feet",
    components: "V, S",
    duration: "Instantaneous",
    classes: ["cleric", "warlock", "wizard"],
    description:
      "You point at one creature you can see within range, and the single chime of a dolorous bell is audible within 10 feet of the target. The target must succeed on a Wisdom saving throw or take 1d8 Necrotic damage.",
    savingThrows: "Wisdom",
    special:
      "If the target is missing any of its Hit Points, it instead takes 1d12 Necrotic damage.",
    cantripUpgrade:
      "The damage increases by one die when you reach levels 5 (2d8 or 2d12), 11 (3d8 or 3d12), and 17 (4d8 or 4d12).",
  },
    { id: "transport-via-plants", name: "Transport via Plants", level: 6, school: "Conjuration" },
  { id: "tree-stride", name: "Tree Stride", level: 5, school: "Conjuration", concentration: true },
  { id: "true-resurrection", name: "True Resurrection", level: 9, school: "Necromancy" },
  { id: "true-seeing", name: "True Seeing", level: 6, school: "Divination" },
{
    id: "true-strike",
    name: "True Strike",
    level: 0,
    school: "Divination",
    castingTime: "Action",
    range: "Self",
    components: "S, M (a weapon with which you have proficiency and that is worth 1+ CP)",
    duration: "Instantaneous",
    classes: ["bard", "sorcerer", "warlock", "wizard"],
    description:
      "Guided by a flash of magical insight, you make one attack with the weapon used in the spell's casting. The attack uses your spellcasting ability for the attack and damage rolls instead of using Strength or Dexterity.",
    special:
      "If the attack deals damage, it can be Radiant damage or the weapon's normal damage type (your choice).",
    cantripUpgrade:
      "Whether you deal Radiant damage or the weapon's normal damage type, the attack deals extra Radiant damage when you reach levels 5 (1d6), 11 (2d6), and 17 (3d6).",
  },
    { id: "tsunami", name: "Tsunami", level: 8, school: "Conjuration", concentration: true },
  { id: "unseen-servant", name: "Unseen Servant", level: 1, school: "Conjuration", ritual: true },
  {
    id: "vicious-mockery",
    name: "Vicious Mockery",
    level: 0,
    school: "Enchantment",
    castingTime: "Action",
    range: "60 feet",
    components: "V",
    duration: "Instantaneous",
    classes: ["bard"],
    description:
      "You unleash a string of insults laced with subtle enchantments at one creature you can see or hear within range. The target must succeed on a Wisdom saving throw or take 1d6 Psychic damage.",
    savingThrows: "Wisdom",
    penalties:
      "On a failed save, the target has Disadvantage on the next attack roll it makes before the end of its next turn.",
    cantripUpgrade:
      "The damage increases by 1d6 when you reach levels 5 (2d6), 11 (3d6), and 17 (4d6).",
  },
  { id: "wall-of-fire", name: "Wall of Fire", level: 4, school: "Evocation", concentration: true },
  { id: "wall-of-stone", name: "Wall of Stone", level: 5, school: "Evocation", concentration: true },
  { id: "wall-of-thorns", name: "Wall of Thorns", level: 6, school: "Conjuration", concentration: true },
{
    id: "warding-bond",
    name: "Warding Bond",
    level: 2,
    school: "Abjuration",
    castingTime: "Action",
    range: "Touch",
    components:
      "V, S, M (a pair of platinum rings worth 50+ GP each, which you and the target must wear for the duration)",
    duration: "1 hour",
    classes: ["cleric", "paladin"],
    description:
      "You touch another creature that is willing and create a mystic connection between you and the target until the spell ends.",
    benefits:
      "While the target is within 60 feet of you, it gains a +1 bonus to AC and saving throws, and it has Resistance to all damage.",
    effects:
      "Each time the target takes damage, you take the same amount of damage.",
    endConditions:
      "The spell ends if you drop to 0 Hit Points, if you and the target become separated by more than 60 feet, or if the spell is cast again on either creature.",
  },
    { id: "water-breathing", name: "Water Breathing", level: 3, school: "Transmutation", ritual: true },
  { id: "water-walk", name: "Water Walk", level: 3, school: "Transmutation", ritual: true },
  { id: "web", name: "Web", level: 2, school: "Conjuration", concentration: true },
  { id: "wind-walk", name: "Wind Walk", level: 6, school: "Transmutation" },
  { id: "wind-wall", name: "Wind Wall", level: 3, school: "Evocation", concentration: true },
  { id: "witch-bolt", name: "Witch Bolt", level: 1, school: "Evocation", concentration: true },
  { id: "word-of-radiance", name: "Word of Radiance", level: 0, school: "Evocation" },
  { id: "word-of-recall", name: "Word of Recall", level: 6, school: "Conjuration" },
{
  id: "wrathful-smite",
  name: "Wrathful Smite",
  level: 1,
  school: "Necromancy",
  castingTime:
    "Bonus Action, which you take immediately after hitting a creature with a Melee weapon or an Unarmed Strike",
  range: "Self",
  components: "V",
  duration: "1 minute",
  classes: ["Paladin"],
  description:
    "The target takes an extra 1d6 Necrotic damage from the attack and must succeed on a Wisdom saving throw or have the Frightened condition until the spell ends.",
  effects:
    "At the end of each of its turns, the Frightened target repeats the saving throw, ending the spell on itself on a success.",
  higherLevel:
    "When cast with a higher-level spell slot, the damage increases by 1d6 for each slot level above 1.",
},
  { id: "zone-of-truth", name: "Zone of Truth", level: 2, school: "Enchantment" },
];
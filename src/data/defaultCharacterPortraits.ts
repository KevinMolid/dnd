export type DefaultCharacterPortrait = {
  id: string;
  label: string;
  url: string;
};

export const defaultCharacterPortraits: DefaultCharacterPortrait[] = [
  {
    id: "warrior-1",
    label: "Warrior",
    url: "/images/character-portraits/FemaleHumanFighter.jpg",
  },
  {
    id: "mage-1",
    label: "Mage",
    url: "/images/character-portraits/MaleHalflingWizard.jpg",
  },
  {
    id: "rogue-1",
    label: "Rogue",
    url: "/images/character-portraits/FemaleTieflingRanger.jpg",
  },
  {
    id: "cleric-1",
    label: "Cleric",
    url: "/images/character-portraits/MaleDragonbornCleric.jpg",
  },
  {
    id: "ranger-1",
    label: "Ranger",
    url: "/images/character-portraits/FemaleElfBarbarian.jpg",
  },
  {
    id: "dwarf-1",
    label: "Dwarf",
    url: "/images/character-portraits/MaleDwarfPaladin.jpg",
  },
];
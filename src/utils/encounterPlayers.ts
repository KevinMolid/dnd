import type { EncounterPlayerInput } from "../context/EncounterContext";

import type { CampaignCharacter } from "../features/campaigns/hooks/useCampaignPageData";

import { getCharacterArmorClassFromEquipment } from "../rulesets/dnd/dnd2024/getCharacterArmorClassFromEquipment";

import { getCharacterHp } from "../rulesets/dnd/dnd2024/getCharacterHp";

import type { CharacterEquipmentEntry } from "../rulesets/dnd/dnd2024/types";

const characterHasAlertFeat = (
  character: CampaignCharacter,
) => {
  if (character.originFeatId === "alert") {
    return true;
  }

  const levelUpDecisions =
    character.choices?.levelUpDecisions ?? {};

  return Object.values(levelUpDecisions).some(
    (decision: any) =>
      decision?.featId === "alert",
  );
};

const getEncounterInitiativeBonus = (
  character: CampaignCharacter,
) => {
  const dex =
    character.abilityScores?.dex;

  const dexMod =
    typeof dex === "number"
      ? Math.floor((dex - 10) / 2)
      : 0;

  return (
    dexMod +
    (characterHasAlertFeat(character)
      ? 5
      : 0)
  );
};

const getEncounterArmorClass = (
  character: CampaignCharacter,
) => {
  const dex =
    character.abilityScores?.dex ??
    10;

  const equipment =
    (
      character as {
        equipment?: CharacterEquipmentEntry[];
      }
    ).equipment ?? [];

  try {
    return getCharacterArmorClassFromEquipment({
      dexterityScore: dex,
      equipment,
    });
  } catch (error) {
    console.error(
      "Failed to calculate armor class for encounter:",
      error,
    );

    return 10;
  }
};

const getLiveCharacterHp = (
  character: CampaignCharacter,
) => {
  try {
    const hp = getCharacterHp(
      character as never,
    );

    return {
      currentHp:
        hp.currentHp,

      maxHp:
        hp.maxHp,
    };
  } catch {
    return {
      currentHp:
        character.currentHp ??
        0,

      maxHp:
        character.maxHp ??
        1,
    };
  }
};

export const mapCharacterToEncounterPlayer = (
  character: CampaignCharacter,
): EncounterPlayerInput => {
  const liveHp =
    getLiveCharacterHp(
      character,
    );

  return {
    characterId:
      character.id,

    name:
      character.name,

    maxHp:
      liveHp.maxHp,

    currentHp:
      liveHp.currentHp,

    armorClass:
      getEncounterArmorClass(
        character,
      ),

    initiativeBonus:
      getEncounterInitiativeBonus(
        character,
      ),

    level:
      character.level,

    classId:
      character.classId,

    speciesId:
      character.speciesId,
  };
};

export const getActiveCampaignCharacters = (
  characters: CampaignCharacter[],
) => {
  return characters.filter(
    (character) =>
      character.campaignStatus ===
      "active",
  );
};
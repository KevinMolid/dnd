import type { CharacterDoc, CharacterSheetDerived } from "../types";

import OverviewDashboard from "../components/OverviewDashboard";

import { abilityLabels } from "../utils/characterSheetConstants";

type OverviewTabProps = {
  character: CharacterDoc;

  derived: CharacterSheetDerived;
};

const traitGroupLabels: Record<string, string> = {
  species: "Species",
  class: "Class",
  subclass: "Subclass",
  background: "Background",
  feats: "Feat",
  other: "Other",
};

const formatMoney = (copper: number) => {
  const safeCopper = Math.max(0, Math.floor(copper));

  const gp = Math.floor(safeCopper / 100);

  const remainingAfterGp = safeCopper % 100;

  const sp = Math.floor(remainingAfterGp / 10);

  const cp = remainingAfterGp % 10;

  const parts: string[] = [];

  if (gp > 0) {
    parts.push(`${gp} GP`);
  }

  if (sp > 0) {
    parts.push(`${sp} SP`);
  }

  if (cp > 0 || parts.length === 0) {
    parts.push(`${cp} CP`);
  }

  return parts.join(" · ");
};

const OverviewTab = ({ character, derived }: OverviewTabProps) => {
  /*
   * CombatTab already uses these exact rows for the
   * character's calculated equipped weapon attacks,
   * so Overview simply presents a compact subset.
   */
  const attacks = derived.equippedWeaponAttacks.map((attack) => ({
    id: attack.instanceId,

    name: attack.name,

    attackBonus: attack.attackBonus,

    damage: attack.damage,

    detail: [
      attack.isOffHand ? "Off-Hand" : null,

      attack.isThrown ? "Thrown" : null,

      attack.isTwoHanded ? "Two-Handed" : null,
    ]
      .filter(Boolean)
      .join(" · "),
  }));

  /*
   * Flatten the spell groups and remove duplicates.
   * This gives Overview a short quick-reference list
   * while the Spells tab remains the complete list.
   */
  const allSpells = [
    ...derived.groupedTieflingLegacySpells.flatMap((group) => group.spells),

    ...derived.groupedSpells.flatMap((group) => group.spells),
  ];

  const seenSpellIds = new Set<string>();

  const quickSpells = allSpells.filter((spell) => {
    const id = spell.spellId ?? spell.id ?? spell.name;

    if (seenSpellIds.has(id)) {
      return false;
    }

    seenSpellIds.add(id);

    return true;
  });

  const features = derived.traitGroups.flatMap((group) =>
    group.traits.map((trait: any) => ({
      id: trait.id ?? `${group.key}-${trait.name}`,

      name: trait.name ?? "Feature",

      source: trait.source ?? traitGroupLabels[group.key] ?? group.key,

      description: trait.description,
    })),
  );

  const moneyCp = derived.moneyCp ?? character.moneyCp ?? 0;

  const xpRemaining =
    derived.xpProgress.nextLevelXp === null
      ? undefined
      : Math.max(
          0,
          derived.xpProgress.neededXp - derived.xpProgress.progressXp,
        );

  return (
    <OverviewDashboard
      skills={derived.skillRows.map((skill) => ({
        id: skill.id,

        name: skill.name,

        ability: abilityLabels[skill.ability],

        bonus: skill.total,

        proficient: skill.proficient,

        expertise: skill.expertise,
      }))}
      attacks={attacks}
      spells={quickSpells}
      conditions={
        (
          character as CharacterDoc & {
            conditions?: string[];
          }
        ).conditions ?? []
      }
      features={features}
      moneyLabel={formatMoney(moneyCp)}
      progress={{
        level: derived.xpProgress.level,

        xp: derived.xp,

        nextLevelXp: derived.xpProgress.nextLevelXp,

        progressPercent: derived.xpProgress.progressPercent,

        xpRemaining,
      }}
    />
  );
};

export default OverviewTab;

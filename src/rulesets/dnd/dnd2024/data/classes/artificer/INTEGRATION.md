# Artificer integration — remaining application wiring

This kit provides concrete support modules, not an automatically integrated feature. Import paths assume the same folder depth as Cleric. Verify 2025 final subclass data before release.

## Types (existing types.ts)
- Add `"artificer"` to `CharacterClassId` and `SpellListId`.
- Add `"alchemist" | "armorer" | "artillerist" | "battle-smith" | "cartographer"` to `CharacterSubclassId`.
- Add `artificerReplication?: ArtificerReplicationState` to `CharacterChoices` if you want strongly typed persistence. Import the type with `import type` to avoid runtime cycles; alternatively use the local `ArtificerChoices` intersection type in the save component.

## Character creation / level-up
- In the class switch/registry that assembles choices, include `artificerToolChoicesByLevel`, `artificerCantripChoicesByLevel`, and `artificerSubclassChoicesByLevel` for Artificer only.
- At L1, also keep the class's 2 selected skill proficiencies, two chosen cantrips and two prepared spells. Grant Thieves' Tools and Tinker's Tools automatically from `artificer.toolProficiencies`, plus the chosen artisan's tool from `toolProficiencyChoice`. Do not double-prompt if your generic class tool choice already works.
- At L3 save subclass choice into `choices.subclassId` or the level-up decision and ensure `choices.subclassId` is populated during derivation.
- At L10 and L14 add one chosen cantrip; reject already chosen cantrips.

## Derived spell generation
- After normal class/feat spells have been derived, call `mergeArtificerFixedSpells(character, spells)`.
- Populate `artificerSubclassSpellMap` from the final 2025 source; currently empty, deliberately.
- Then call `mergeArtificerSubclassDerivedSpells(character, spells)`. The functions do not write to Firestore.
- `knownByLevel` refers to chosen cantrips only: Mending is a free extra from Tinker's Magic.

## Magic item replication
- `artificerReplicationState.ts` declares a persistable `knownPlanIds` and `activeItems` model, plus validation.
- Populate eligible plan IDs from your **real** 2025 plan catalog filtered by Artificer level; supply that set to validation. Never trust client eligibility checks alone for authoritative gameplay.
- Use existing character save/update action to store this state in `choices.artificerReplication`. Save updates after choosing plans, changing plans at level-up, or completing a Long Rest.
- For an active replicated item, persist a stable `instanceId`. Only add to inventory when you can atomically remove/retire an older replicated instance and reconcile item equipment/attunement. Avoid accidental duplicates on refresh.

## Starting equipment
Check these IDs against your item registry: `studded-leather`, `dagger`, `thieves-tools`, `tinkers-tools`, `dungeoneers-pack`. If not found, change IDs to actual keys rather than displaying phantom items.

## Remaining missing files for full integration
Need the app's character creation choices assembler, level-up choices assembler, character derived-data/spell generation function, character save function, and item registry. Without these we cannot safely patch their call sites.

## Smoke tests
- L1: 2 L1 slots, 2 prepared, 2 chosen cantrips + fixed Mending; 1 extra artisan tool proficiency.
- L3: 3 L1 slots, 4 prepared; subclass selected and subclass spells counted separately.
- L5: 4 L1 / 2 L2 slots, 6 prepared.
- L10: 3 chosen cantrips + Mending; max 6 plans and 4 active magic items.
- Change subclass or load older characters: derivation should be idempotent, not retain old subclass grants.

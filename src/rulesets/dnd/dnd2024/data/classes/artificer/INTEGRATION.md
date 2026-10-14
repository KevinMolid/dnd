# Artificer integration checklist

1. In `types.ts`, add `"artificer"` to `CharacterClassId` and `SpellListId`. Add `"alchemist" | "armorer" | "artillerist" | "battle-smith" | "cartographer"` to `CharacterSubclassId`.
2. Import/register `artificer` and `artificerSubclasses` in your class/subclass registries.
3. Add an `artificer` spell list to the spell registry and check which spells are present in your spell database. Without this, cantrip and prepared-spell selection will not work.
4. Register `artificerSubclassChoicesByLevel`, cantrip choices, and tool choices with Character Creation and Level Up.
5. Wire `mergeArtificerSubclassDerivedSpells` into derived-spell generation after populating the 2025 subclass spell map.
6. Implement `Replicate Magic Item` plans known and active items with persistent character choices; don't inject items into inventory automatically without lifecycle handling.
7. `Mending` needs a fixed cantrip grant from Tinker's Magic (rather than using one of the 2 chosen cantrip slots).
8. Item IDs in starting equipment (`studded-leather`, `dungeoneers-pack`, etc.) must match your actual item registry.
9. Subclass features are summary placeholders, not complete action/resource implementations. Verify against licensed 2025 subclass rules before production use.
10. Test level 1 (2 slots, 2 prepared, 2 chosen cantrips + Mending), level 3 (3 slots, 4 prepared), level 5 (4/2 slots, 6 prepared), and level 10 (third chosen cantrip).

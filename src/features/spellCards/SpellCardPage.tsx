import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useCampaignPageData } from "../campaigns/hooks/useCampaignPageData";
import { useCharacterSheetData } from "../character-sheet/hooks/useCharacterSheetData";
import { spells as officialSpells } from "../../rulesets/dnd/dnd2024/data/spells";
import { SpellCard, type SpellCardData } from "./SpellCard";
import SpellCardPickerModal, { getSpellForCard } from "./SpellCardPickerModal";
import { SPELL_CARD_STORAGE_PREFIX } from "./spellCardTransfer";
import "./spell-card.css";
import "./spell-card-page.css";

export const sacredFlame: SpellCardData = {
  id: "sacred-flame", name: "Sacred Flame", level: 0, school: "Evocation",
  castingTime: "Action", range: "60 feet", components: "V, S", duration: "Instantaneous",
  description: "Flame-like radiance descends on a creature that you can see within range.",
  effects: "The target must succeed on a Dexterity saving throw or take 1d8 Radiant damage. The target gains no benefit from Half Cover or Three-Quarters Cover for this save.",
  savingThrow: "Dexterity",
};

export type SpellCardPageProps = { spell?: SpellCardData };
type SourceSpell = Record<string, any>;
const spellKey = (spell: { id?: string; spellId?: string; name?: string }) =>
  String(spell.spellId || spell.id || spell.name || "").trim().toLowerCase();

function uniqueSpells(items: SpellCardData[]) {
  const seen = new Set<string>();
  return items.filter((spell) => {
    const key = spellKey(spell);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const officialById = new Map(officialSpells.map((spell) => [spell.id, spell]));

function toCard(source: SourceSpell): SpellCardData {
  const id = String(source.spellId ?? source.id ?? source.name);
  const reference = officialById.get(id) ?? getSpellForCard(id);
  const spell = { ...reference, ...source } as SourceSpell;
  const extras: Array<[string, unknown]> = [
    ["Details", spell.details], ["Control", spell.control],
    ["Interaction", spell.interaction], ["Penalties", spell.penalties],
    ["Benefits", spell.benefits], ["Conditions", spell.conditions],
    ["Behavior", spell.behavior], ["Duration Rule", spell.durationRule],
    ["Special", spell.special], ["Triggers", spell.triggers],
    ["Detection", spell.detection], ["Limitations", spell.limitations],
    ["End Conditions", spell.endConditions], ["Higher Level", spell.higherLevel],
    ...((spell.options ?? []) as Array<{ name: string; text: string }>).map((x) => [x.name, x.text] as [string, unknown]),
  ];
  return {
    id, name: String(spell.name ?? id), characterName: typeof spell.characterName === "string" ? spell.characterName : undefined, level: Number(spell.level ?? 0),
    school: String(spell.school ?? ""), castingTime: String(spell.castingTime ?? ""),
    range: String(spell.range ?? ""), components: String(spell.components ?? ""),
    duration: String(spell.duration ?? ""),
    description: spell.description, effects: spell.effects,
    savingThrow: spell.savingThrows ?? spell.savingThrow,
    extraSections: extras.filter(([, value]) => value != null && value !== "")
      .map(([label, value]) => [label, String(value)]),
  };
}

function readInitialSpell(spell?: SpellCardData): SpellCardData | null {
  if (spell) return spell;
  const token = new URLSearchParams(window.location.search).get("card");
  if (!token) return null;
  try {
    const stored = localStorage.getItem(`${SPELL_CARD_STORAGE_PREFIX}${token}`);
    return stored ? JSON.parse(stored) as SpellCardData : null;
  } catch { return null; }
}

/** This component uses the exact same character data hook as CharacterSheet. */
function CharacterSpellLoader({
  characterId, existing, onAdd, onClose,
}: {
  characterId: string;
  existing: SpellCardData[];
  onAdd: (spells: SpellCardData[]) => void;
  onClose: () => void;
}) {
  const { character, derived, loading, error } = useCharacterSheetData(characterId);
  const prepared = useMemo(() => {
    if (!character) return [] as SpellCardData[];
    const raw = character as SourceSpell;
    const characterName = String(raw.name ?? "").trim();
    if (raw.buildMode === "custom") {
      return uniqueSpells((raw.customSpellcasting?.spells ?? []).map((spell: SourceSpell) => ({ ...toCard(spell), characterName })));
    }
    if (!derived) return [];
    const all = [
      ...(derived.groupedTieflingLegacySpells ?? []).flatMap((group) => group.spells),
      ...(derived.groupedSpells ?? []).flatMap((group) => group.spells),
    ];
    return uniqueSpells(all.map((spell) => ({ ...toCard(spell as SourceSpell), characterName })));
  }, [character, derived]);
  const existingIds = new Set(existing.map(spellKey));
  const addable = prepared.filter((spell) => !existingIds.has(spellKey(spell)));
  return (
    <>
      {loading ? <p>Loading character spells…</p> : error ? <p role="alert">{error}</p> : (
        <p>{prepared.length} spells found · {addable.length} not yet on the print sheet.</p>
      )}
      <div className="spell-card-page__modal-footer">
        <button type="button" onClick={onClose}>Cancel</button>
        <button type="button" disabled={loading || !!error || !addable.length}
          onClick={() => onAdd(addable)}>Add All Spells ({addable.length})</button>
      </div>
    </>
  );
}

/** Reads the campaign from the transferred character context without inventing an ID. */
function useResolvedCampaignId() {
  const [campaignId, setCampaignId] = useState(() =>
    new URLSearchParams(window.location.search).get("campaignId") ?? "");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const directId = params.get("campaignId");
    if (directId) { setCampaignId(directId); return; }
    const characterId = params.get("characterId");
    if (!characterId) return;
    let cancelled = false;
    setLoading(true);
    getDoc(doc(db, "characters", characterId)).then((snapshot) => {
      if (!cancelled) setCampaignId(String(snapshot.data()?.campaignId ?? ""));
    }).catch((error) => {
      console.error("Failed to resolve campaign for spell cards", error);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return { campaignId, loading };
}

export default function SpellCardPage({ spell }: SpellCardPageProps) {
  const [cards, setCards] = useState<SpellCardData[]>(() => {
    const initial = readInitialSpell(spell);
    return initial ? [initial] : [];
  });
  const [dialog, setDialog] = useState<"spells" | "characters" | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [activeCharacterName, setActiveCharacterName] = useState("");
  const { campaignId, loading: contextLoading } = useResolvedCampaignId();
  const { campaignCharacters, campaignCharactersLoading, pageState } = useCampaignPageData(campaignId || undefined);

  // Restore character names when opening cards from character-sheet URLs.
  useEffect(() => {
    const characterId = new URLSearchParams(window.location.search).get("characterId");
    if (!characterId) return;
    let cancelled = false;
    getDoc(doc(db, "characters", characterId))
      .then((snapshot) => {
        if (cancelled || !snapshot.exists()) return;
        const name = String(snapshot.data().name ?? "").trim();
        if (!name) return;
        setActiveCharacterName(name);
        setCards((current) => current.map((card) =>
          card.characterName ? card : { ...card, characterName: name },
        ));
      })
      .catch((error) => console.error("Failed to load spell card character name", error));
    return () => { cancelled = true; };
  }, []);

  // Each spell level starts on its own sheet. Within a level, cards are
  // alphabetical; groups of nine retain fixed positions on every A4 page.
  const printSheets = useMemo(() => {
    const sorted = [...cards].sort(
      (a, b) => a.level - b.level || a.name.localeCompare(b.name),
    );
    const sheets: SpellCardData[][] = [];
    let currentLevel: number | null = null;
    let currentSheet: SpellCardData[] = [];

    for (const card of sorted) {
      if (
        currentSheet.length > 0 &&
        (card.level !== currentLevel || currentSheet.length === 9)
      ) {
        sheets.push(currentSheet);
        currentSheet = [];
      }
      currentLevel = card.level;
      currentSheet.push(card);
    }
    if (currentSheet.length > 0) sheets.push(currentSheet);
    return sheets;
  }, [cards]);

  function addCards(next: SpellCardData[]) {
    setCards((current) => uniqueSpells([...current, ...next]));
  }

  return (
    <main className="spell-print-page spell-card-page">
      <div className="spell-print-page__controls spell-card-page__toolbar">
        <div className="spell-card-page__heading">
          <strong>Spell Cards</strong>
          <span>{cards.length} {cards.length === 1 ? "card" : "cards"} · 2.5 × 3.5 in / 63.5 × 88.9 mm</span>
        </div>
        <div className="spell-card-page__actions">
          <button type="button" onClick={() => setDialog("spells")}>+ Add Spells</button>
          <button type="button" onClick={() => { setSelectedCharacterId(""); setDialog("characters"); }}>+ Add Character Spells</button>
          <button type="button" onClick={() => setCards([])} disabled={!cards.length}>Clear All</button>
          <button type="button" onClick={() => window.print()} disabled={!cards.length}>Print Cards</button>
        </div>
      </div>

      {!cards.length && <p className="spell-card-page__empty">No spell cards selected. Add spells to prepare a print sheet.</p>}
      <div className="spell-card-page__sheets">
        {printSheets.map((sheet, pageIndex) => (
          <section className="spell-card-page__sheet" key={pageIndex} aria-label={`Print sheet ${pageIndex + 1}`}>
            <div className="spell-card-page__grid">
              {sheet.map((item) => (
                <div className="spell-card-page__item" key={spellKey(item)}>
                  <button type="button" className="spell-card-page__remove"
                    aria-label={`Remove ${item.name}`} title={`Remove ${item.name}`}
                    onClick={() => setCards((current) => current.filter((s) => spellKey(s) !== spellKey(item)))}>×</button>
                  <SpellCard spell={item} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <SpellCardPickerModal isOpen={dialog === "spells"} onClose={() => setDialog(null)}
        selectedSpellIds={cards.map((card) => card.id)}
        onSelect={({ spellId, name, level }) => {
          const full = getSpellForCard(spellId) ?? officialById.get(spellId) ?? { id: spellId, name, level };
          addCards([{ ...toCard(full as SourceSpell), characterName: activeCharacterName || undefined }]);
        }}
        onRemove={(spellId) => setCards((current) => current.filter((item) => spellKey(item) !== spellId.toLowerCase()))}
      />

      {dialog === "characters" && (
        <div className="spell-card-page__modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialog(null);
        }}>
          <section className="spell-card-page__modal" role="dialog" aria-modal="true" aria-labelledby="spell-card-dialog-title">
            <div className="spell-card-page__modal-header">
              <h2 id="spell-card-dialog-title">Add Character Spells</h2>
              <button type="button" onClick={() => setDialog(null)} aria-label="Close">×</button>
            </div>
            {contextLoading || (campaignId && campaignCharactersLoading) ? (
              <p>Loading campaign characters…</p>
            ) : !campaignId ? (
              <p>No campaign context was provided. Open spell cards from a character sheet, or use a link containing <code>?campaignId=YOUR_CAMPAIGN_ID</code>.</p>
            ) : pageState !== "ready" ? (
              <p>Campaign unavailable or access denied.</p>
            ) : campaignCharacters.length === 0 ? (
              <p>No campaign characters available.</p>
            ) : (
              <>
                <label className="spell-card-page__field-label" htmlFor="spell-card-character">Select character</label>
                <select id="spell-card-character" value={selectedCharacterId}
                  onChange={(event) => setSelectedCharacterId(event.target.value)}>
                  <option value="">Choose a character…</option>
                  {campaignCharacters.map((character) => (
                    <option key={character.id} value={character.id}>
                      {character.name}{character.className ? ` · ${character.className}` : ""}{character.level ? ` · Lv ${character.level}` : ""}
                    </option>
                  ))}
                </select>
                {selectedCharacterId && <CharacterSpellLoader key={selectedCharacterId}
                  characterId={selectedCharacterId} existing={cards}
                  onAdd={(spells) => {
                    const selected = campaignCharacters.find((character) => character.id === selectedCharacterId);
                    setActiveCharacterName(selected?.name ?? "");
                    addCards(spells);
                    setDialog(null);
                  }}
                  onClose={() => setDialog(null)} />}
              </>
            )}
            {!selectedCharacterId && <div className="spell-card-page__modal-footer">
              <button type="button" onClick={() => setDialog(null)}>Close</button>
            </div>}
          </section>
        </div>
      )}
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useMonsterLibrary from "../../hooks/useMonsterLibrary";
import "./wild-shape-card.css";
import printStyles from "./wild-shape-card.css?raw";

type Monster = ReturnType<typeof useMonsterLibrary>["allMonsters"][number];
type MonsterRecord = Monster & Record<string, unknown>;
type CardSize = "standard" | "large";

const crAsNumber = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const fraction = normalized.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator ? Number(fraction[1]) / denominator : null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const maxCrOptions = ["0", "1/8", "1/4", "1/2", "1", "2", "3", "4", "5", "6", "7", "8"];


const numberOrDash = (value: unknown) =>
  typeof value === "number" || typeof value === "string" ? String(value) : "—";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function textPairs(value: unknown): { name: string; text: string }[] {
  return Array.isArray(value)
    ? value.flatMap((item) => {
        const entry = asRecord(item);
        const name = String(entry.name ?? "").trim();
        const text = String(entry.text ?? entry.description ?? "").trim();
        return name && text ? [{ name, text }] : [];
      })
    : [];
}
function printSpeed(value: unknown): string {
  if (typeof value === "string") return value;
  const speed = asRecord(value);
  const parts = ["walk", "climb", "swim", "burrow", "fly"].flatMap((key) => {
    const amount = speed[key];
    if (typeof amount !== "number" || amount <= 0) return [];
    return [
      `${key === "walk" ? "Speed" : key[0].toUpperCase() + key.slice(1)} ${amount} ft`,
    ];
  });
  return parts.join(" · ") || "—";
}
function modifier(score: unknown): string {
  if (typeof score !== "number") return "—";
  const amount = Math.floor((score - 10) / 2);
  return `${amount >= 0 ? "+" : ""}${amount}`;
}

function BeastCard({
  monster,
  characterName,
}: {
  monster: Monster;
  characterName: string;
}) {
  const data = monster as MonsterRecord;
  const stats = asRecord(data.stats);
  const traits = textPairs(data.traits);
  const actions = textPairs(data.actions);
  const bonusActions = textPairs(data.bonusActions);
  const reactions = textPairs(data.reactions);
  const senses = asRecord(data.senses);
  const skills = asRecord(data.skills);
  const saves = asRecord(data.savingThrows);
  const formatGroup = (group: Record<string, unknown>) =>
    Object.entries(group)
      .filter(([, v]) => typeof v === "string" || typeof v === "number")
      .map(([k, v]) => `${k} ${typeof v === "number" && v >= 0 ? "+" : ""}${v}`)
      .join(", ");
  return (
    <article className="wild-card">
      <div className="wild-card__header">
        <div className="wild-card__crest" aria-hidden="true">
          ✦
        </div>
        <div className="wild-card__heading">
          <h2>{monster.name}</h2>
          <div>
            {String(data.size ?? "")} Beast
            {data.subtype ? ` · ${String(data.subtype)}` : ""}
          </div>
        </div>
        <div className="wild-card__cr">
          <small>CR</small>
          <b>{numberOrDash(monster.challengeRating)}</b>
        </div>
      </div>
      <div className="wild-card__stats">
        <div>
          <small>AC</small>
          <strong>{numberOrDash(monster.armorClass)}</strong>
        </div>
        <div>
          <small>HP</small>
          <strong>{numberOrDash(monster.hp)}</strong>
        </div>
        <div className="wild-card__speed">
          <small>SPEED</small>
          <strong>{printSpeed(data.speed ?? data.speeds)}</strong>
        </div>
      </div>
      <div className="wild-card__abilities">
        {(["str", "dex", "con", "int", "wis", "cha"] as const).map((key) => (
          <div key={key}>
            <small>{key.toUpperCase()}</small>
            <strong>{numberOrDash(stats[key])}</strong>
            <span>{modifier(stats[key])}</span>
          </div>
        ))}
      </div>
      <div className="wild-card__body">
        {Object.keys(saves).length > 0 && (
          <div className="wild-card__line">
            <b>Saves</b> {formatGroup(saves)}
          </div>
        )}
        {Object.keys(skills).length > 0 && (
          <div className="wild-card__line">
            <b>Skills</b> {formatGroup(skills)}
          </div>
        )}
        {Object.keys(senses).length > 0 && (
          <div className="wild-card__line">
            <b>Senses</b> {formatGroup(senses)}
          </div>
        )}
        {[
          ["TRAITS", traits],
          ["ACTIONS", actions],
          ["BONUS ACTIONS", bonusActions],
          ["REACTIONS", reactions],
        ].map(([title, values]) => {
          const entries = values as { name: string; text: string }[];
          if (!entries.length) return null;
          return (
            <section className="wild-card__section" key={title as string}>
              <h3>{title as string}</h3>
              {entries.map((entry, i) => (
                <p key={`${entry.name}-${i}`}>
                  <b>{entry.name}.</b> {entry.text}
                </p>
              ))}
            </section>
          );
        })}
      </div>
      <footer className="wild-card__footer">
        <span>WILD SHAPE</span>
        <span>{characterName}</span>
      </footer>
    </article>
  );
}

export default function WildShapeCardPage() {
  const [params] = useSearchParams();
  const characterId = params.get("characterId") ?? "";
  const [campaignId, setCampaignId] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [knownKeys, setKnownKeys] = useState<string[]>([]);
  const [loadingCharacter, setLoadingCharacter] = useState(
    Boolean(characterId),
  );
  const [error, setError] = useState("");
  const [size, setSize] = useState<CardSize>("standard");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [maxCr, setMaxCr] = useState("");
  const { allMonsters, loading: loadingMonsters } = useMonsterLibrary(
    campaignId || undefined,
  );

  useEffect(() => {
    if (!characterId) return;
    let active = true;
    setLoadingCharacter(true);
    getDoc(doc(db, "characters", characterId))
      .then((snap) => {
        if (!active) return;
        if (!snap.exists()) {
          setError("Character not found.");
          return;
        }
        const data = snap.data();
        const keys = Array.isArray(data.wildShapeFormKeys)
          ? data.wildShapeFormKeys.filter(
              (x): x is string => typeof x === "string",
            )
          : [];
        setKnownKeys(keys);
        setSelected(keys);
        setCharacterName(typeof data.name === "string" ? data.name : "");
        setCampaignId(
          typeof data.campaignId === "string" ? data.campaignId : "",
        );
      })
      .catch(() => {
        if (active) setError("Could not load the character.");
      })
      .finally(() => {
        if (active) setLoadingCharacter(false);
      });
    return () => {
      active = false;
    };
  }, [characterId]);

  const byKey = useMemo(
    () =>
      new Map(
        allMonsters.map((monster) => [
          `${monster.source}:${monster.id}`,
          monster,
        ]),
      ),
    [allMonsters],
  );
  const selectable = useMemo(
    () =>
      allMonsters
        .filter((monster) => {
          const raw = monster as MonsterRecord;
          return (
            String(raw.type ?? raw.creatureType ?? "").toLowerCase() ===
              "beast" &&
            monster.name.toLowerCase().includes(search.toLowerCase())
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allMonsters, search],
  );
  const resolved = selected
    .map((key) => ({ key, monster: byKey.get(key) }))
    .filter((entry): entry is { key: string; monster: Monster } =>
      Boolean(entry.monster),
    );
  const missing = selected.filter((key) => !byKey.has(key));
  const pageSize = size === "large" ? 4 : 9;
  const sheets = Array.from(
    { length: Math.ceil(resolved.length / pageSize) },
    (_, i) => resolved.slice(i * pageSize, (i + 1) * pageSize),
  );
  const addOrRemove = (key: string) =>
    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  const busy = loadingCharacter || loadingMonsters;

  const selectThroughCr = (value: string) => {
    setMaxCr(value);
    const limit = crAsNumber(value);
    if (limit === null) return;
    // Replace the print selection only; never modify known Wild Shape forms.
    setSelected(
      allMonsters
        .filter((monster) => {
          const raw = monster as MonsterRecord;
          const cr = crAsNumber(monster.challengeRating);
          return String(raw.type ?? raw.creatureType ?? "").toLowerCase() === "beast" &&
            cr !== null && cr <= limit;
        })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((monster) => `${monster.source}:${monster.id}`),
    );
  };

  const printCards = async () => {
    const sheetElement = document.querySelector<HTMLElement>(".wild-print__sheets");
    if (!sheetElement || !resolved.length) return;

    // An isolated print document avoids global app @media print rules that
    // may hide the React root, main content, or the cards themselves.
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "Wild Shape cards print document");
    iframe.setAttribute("aria-hidden", "true");
    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "1px",
      height: "1px",
      opacity: "0",
      border: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(iframe);

    const printDoc = iframe.contentDocument;
    if (!printDoc) {
      iframe.remove();
      return;
    }
    const printContents = sheetElement.cloneNode(true) as HTMLElement;
    printContents.querySelectorAll("button").forEach((button) => button.remove());
    printDoc.open();
    printDoc.write(`<!doctype html><html><head><meta charset="utf-8" /><title>Wild Shape Cards</title><style>${printStyles}</style></head><body><main class="wild-print wild-print--${size}">${printContents.outerHTML}</main></body></html>`);
    printDoc.close();

    try {
      await printDoc.fonts.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (error) {
      console.error("Wild Shape printing failed:", error);
    }

    // Do not remove the frame while the browser is preparing the print preview.
    // Cleanup after printing, or retain briefly as a fallback.
    iframe.contentWindow?.addEventListener("afterprint", () => iframe.remove(), { once: true });
    window.setTimeout(() => iframe.remove(), 120000);
  };

  return (
    <main className={`wild-print wild-print--${size}`}>
      <header className="wild-print__toolbar">
        <div>
          <h1>Wild Shape Cards</h1>
          <p>
            {characterName || "Beast stat blocks"} · {selected.length} cards ·{" "}
            {size === "large" ? "2 × 2" : "3 × 3"} per A4
          </p>
        </div>
        <div className="wild-print__toolbar-actions">
          <label htmlFor="wild-card-size">Card size</label>
          <select
            id="wild-card-size"
            value={size}
            onChange={(event) => setSize(event.target.value as CardSize)}
          >
            <option value="standard">Standard (3×3)</option>
            <option value="large">Large (2×2)</option>
          </select>
          <button
            type="button"
            onClick={() => void printCards()}
            disabled={!resolved.length}
          >
            Print Cards
          </button>
        </div>
      </header>
      {busy ? (
        <p className="wild-print__message">Loading beast stat blocks…</p>
      ) : null}
      {error ? (
        <p className="wild-print__message" role="alert">
          {error}
        </p>
      ) : null}
      {!busy && !resolved.length && !error ? (
        <p className="wild-print__message">
          No forms selected. Choose Beasts below.
        </p>
      ) : null}
      {missing.length > 0 && !busy ? (
        <p className="wild-print__message">
          {missing.length} selected form(s) are missing from the monster library
          and cannot be printed.
        </p>
      ) : null}
      <div className="wild-print__sheets">
        {sheets.map((sheet, pageIndex) => (
          <section
            className="wild-print__sheet"
            key={pageIndex}
            aria-label={`A4 page ${pageIndex + 1}`}
          >
            <div className="wild-print__grid">
              {sheet.map(({ key, monster }) => (
                <div className="wild-print__slot" key={key}>
                  <button
                    className="wild-print__remove"
                    type="button"
                    title={`Remove ${monster.name}`}
                    onClick={() => addOrRemove(key)}
                  >
                    ×
                  </button>
                  <BeastCard monster={monster} characterName={characterName} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="wild-print__picker">
        <div className="wild-print__picker-heading">
          <h2>Add Beast Cards</h2>
          <p>
            Selected Wild Shape forms are included automatically. You can add
            more for printing without changing the character's known forms.
          </p>
        </div>
        <div className="wild-print__bulk-select">
          <label htmlFor="wild-max-cr">Select all Beasts up to CR</label>
          <select
            id="wild-max-cr"
            value={maxCr}
            onChange={(event) => selectThroughCr(event.target.value)}
          >
            <option value="">Max CR…</option>
            {maxCrOptions.map((cr) => (
              <option key={cr} value={cr}>CR {cr}</option>
            ))}
          </select>
          <button type="button" onClick={() => { setSelected([]); setMaxCr(""); }}>
            Clear selection
          </button>
          <span>{selected.length} selected</span>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search beasts…"
          aria-label="Search beasts"
        />
        <div className="wild-print__beasts">
          {selectable.map((monster) => {
            const key = `${monster.source}:${monster.id}`;
            const checked = selected.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => addOrRemove(key)}
                className={checked ? "is-selected" : ""}
              >
                <span>
                  {checked ? "✓ " : "+ "}
                  {monster.name}
                </span>
                <small>
                  CR {monster.challengeRating}
                  {knownKeys.includes(key) ? " · Known" : ""}
                </small>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

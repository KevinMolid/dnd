import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

type FightingStyle = {
  id: string;
  name: string;
  description: string;
};

const FIGHTING_STYLES: FightingStyle[] = [
  { id: "archery", name: "Archery", description: "+2 to attack rolls with Ranged weapons." },
  { id: "blind-fighting", name: "Blind Fighting", description: "Blindsight within 10 feet." },
  { id: "defense", name: "Defense", description: "+1 AC while wearing Light, Medium, or Heavy armor." },
  { id: "dueling", name: "Dueling", description: "+2 damage with a one-handed Melee weapon when holding no other weapons." },
  { id: "great-weapon-fighting", name: "Great Weapon Fighting", description: "Treat a 1 or 2 on eligible two-handed melee weapon damage dice as a 3." },
  { id: "interception", name: "Interception", description: "Reaction: reduce damage to a nearby creature by 1d10 + proficiency bonus (weapon or shield required)." },
  { id: "protection", name: "Protection", description: "Use your Reaction and a shield to protect a nearby creature from an attack." },
  { id: "thrown-weapon-fighting", name: "Thrown Weapon Fighting", description: "Draw thrown weapons as part of the attack; +2 damage with thrown weapon attacks." },
  { id: "two-weapon-fighting", name: "Two-Weapon Fighting", description: "Add your ability modifier to the extra attack's damage from the Light property." },
  { id: "unarmed-fighting", name: "Unarmed Fighting", description: "Unarmed Strike damage die improves; grappled creatures can take damage at the start of your turn." },
];

const CLASS_STYLES: Record<string, FightingStyle> = {
  paladin: {
    id: "blessed-warrior",
    name: "Blessed Warrior",
    description: "Learn two Cleric cantrips; they count as Paladin spells and use Charisma.",
  },
  ranger: {
    id: "druidic-warrior",
    name: "Druidic Warrior",
    description: "Learn two Druid cantrips; they count as Ranger spells and use Wisdom.",
  },
};

type Props = {
  characterId: string;
  classId?: string | null;
  className?: string | null;
};

export default function FightingStylePicker({ characterId, classId, className }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const characterClass = (classId || className || "").trim().toLowerCase();
  const options = useMemo(() => {
    const special = CLASS_STYLES[characterClass];
    return special ? [...FIGHTING_STYLES, special] : FIGHTING_STYLES;
  }, [characterClass]);

  useEffect(() => {
    if (!characterId) return;
    setLoading(true);
    setError("");
    return onSnapshot(
      doc(db, "characters", characterId),
      (snapshot) => {
        const data = snapshot.data();
        setSelectedId(typeof data?.fightingStyleId === "string" ? data.fightingStyleId : null);
        setLoading(false);
      },
      (cause) => {
        setError(cause.message);
        setLoading(false);
      },
    );
  }, [characterId]);

  const select = async (id: string) => {
    if (!characterId || savingId || selectedId === id) return;
    setSavingId(id);
    setError("");
    try {
      await updateDoc(doc(db, "characters", characterId), {
        fightingStyleId: id,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save Fighting Style.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mt-3" data-no-swipe>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          Choose Fighting Style
        </span>
        <span className="text-[10px] text-zinc-500">
          {loading ? "Loading…" : selectedId ? "1 selected" : "None selected"}
        </span>
      </div>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {options.map((style) => {
          const active = selectedId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => void select(style.id)}
              disabled={loading || savingId !== null}
              aria-pressed={active}
              className={`rounded-lg border px-2.5 py-2 text-left transition disabled:opacity-60 ${
                active
                  ? "border-emerald-500/40 bg-emerald-500/[0.10]"
                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`text-xs font-semibold ${active ? "text-emerald-200" : "text-zinc-100"}`}>
                  {style.name}
                </span>
                {active && <span className="text-emerald-400" aria-label="Selected">✓</span>}
              </span>
              <span className="mt-1 block text-[10px] leading-4 text-zinc-400">{style.description}</span>
            </button>
          );
        })}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

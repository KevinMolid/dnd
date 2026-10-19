import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import CharacterIdentityEditor, {
  type EditableCharacterIdentity,
} from "../features/character-sheet/components/CharacterIdentityEditor.tsx";

const EditCharacter = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const [character, setCharacter] = useState<EditableCharacterIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadCharacter = async () => {
      if (!characterId) {
        setError("Missing character ID.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const snapshot = await getDoc(doc(db, "characters", characterId));
        if (cancelled) return;
        if (!snapshot.exists()) {
          setCharacter(null);
          setError("Character not found.");
        } else {
          setCharacter({
            ...(snapshot.data() as Omit<EditableCharacterIdentity, "id">),
            id: snapshot.id,
          });
        }
      } catch (cause) {
        if (cancelled) return;
        console.error("Failed to load character:", cause);
        setCharacter(null);
        setError(cause instanceof Error ? cause.message : "Failed to load character.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void loadCharacter();
    return () => { cancelled = true; };
  }, [characterId]);

  if (loading) {
    return <div className="min-h-[calc(100dvh-65px)] bg-zinc-950 px-4 py-8 text-sm text-zinc-400">Loading character...</div>;
  }

  if (!character || error) {
    return (
      <div className="min-h-[calc(100dvh-65px)] bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          {error || "Character not found."}
          <div className="mt-4"><Link to="/" className="text-zinc-200 underline">Back home</Link></div>
        </div>
      </div>
    );
  }

  return <CharacterIdentityEditor key={character.id} character={character} />;
};

export default EditCharacter;

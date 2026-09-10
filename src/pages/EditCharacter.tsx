import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";

import CustomCharacterCreator from "./CustomCharacterCreator";
import GuidedDndCharacterEditor from "./GuidedCharacterEditor";

import type { CustomCharacter } from "../types/customCharacter";

type LoadedCharacter = {
  id: string;
  buildMode?: string;
  [key: string]: unknown;
};

const EditCharacter = () => {
  const { characterId } = useParams<{
    characterId: string;
  }>();

  const [character, setCharacter] = useState<LoadedCharacter | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setError("Missing character ID.");
        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const characterSnap = await getDoc(doc(db, "characters", characterId));

        if (!characterSnap.exists()) {
          setCharacter(null);
          setError("Character not found.");

          return;
        }

        setCharacter({
          id: characterSnap.id,
          ...characterSnap.data(),
        });
      } catch (err: any) {
        console.error("Failed to load character:", err);

        setCharacter(null);

        setError(err?.message || "Failed to load character.");
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-zinc-400">Loading character...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            {error || "Character not found."}
          </div>

          <Link
            to="/"
            className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  /*
   * Custom characters reuse the same complete
   * form used during creation.
   */
  if (character.buildMode === "custom") {
    return (
      <CustomCharacterCreator
        mode="edit"
        characterId={character.id}
        initialCharacter={character as unknown as CustomCharacter}
      />
    );
  }

  /*
   * All existing guided characters continue
   * through the old editor unchanged.
   */
  return <GuidedDndCharacterEditor />;
};

export default EditCharacter;

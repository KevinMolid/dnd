import { useState } from "react";
import CustomCharacterCreator from "./CustomCharacterCreator";
import GuidedDndCharacterCreator from "./GuidedDndCharacterCreator";

type CharacterCreationMode = "custom" | "guided-dnd-2024";

const NewCharacter = () => {
  const [mode, setMode] = useState<CharacterCreationMode | null>(null);

  if (mode === "custom") {
    return <CustomCharacterCreator onBackToModeSelect={() => setMode(null)} />;
  }

  if (mode === "guided-dnd-2024") {
    return <GuidedDndCharacterCreator />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Character Creator
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Create New Character
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Choose whether you want a guided D&amp;D 2024 character or a flexible
          custom character.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("guided-dnd-2024")}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="text-xl font-semibold text-white">
              Guided D&amp;D 2024
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Pick class, species, background, spells, traits, equipment and
              rules-based options.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("custom")}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="text-xl font-semibold text-white">Custom Character</p>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Manually enter class, species, stats, HP, AC and traits. Best for
              homebrew, NPCs and other systems.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCharacter;

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
          Quickly enter an existing character, or build a new D&amp;D 2024
          character using the guided rules.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("custom")}
            className="group rounded-3xl border border-white/15 bg-white/10 p-6 text-left shadow-xl transition hover:border-white/30 hover:bg-white/15"
          >
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300">
              Recommended
            </div>

            <p className="text-xl font-semibold text-white">
              Quick / Custom Character
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Already have a character? Enter the values directly from your
              character sheet without following a step-by-step creation process.
            </p>

            <p className="mt-4 text-xs leading-5 text-zinc-500">
              Also useful for homebrew characters, NPCs and custom rules.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode("guided-dnd-2024")}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="text-xl font-semibold text-white">
              Guided D&amp;D 2024
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Build a new D&amp;D 2024 character step by step using classes,
              species, backgrounds, spells, traits, equipment and rules-based
              choices.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCharacter;

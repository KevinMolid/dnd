import { useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import EncounterTemplateBuilder from "../components/EncounterTemplateBuilder";
import type { EncounterTemplate } from "../context/EncounterContext";

const EncounterTemplatesPage = () => {
  const [templates, setTemplates] = useState<EncounterTemplate[]>([]);

  const handleSaveTemplate = (template: EncounterTemplate) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...template,
      },
    ]);
  };

  return (
    <Container>
      <div className="space-y-6">
        <H1>Encounter Templates</H1>

        <EncounterTemplateBuilder onSave={handleSaveTemplate} />

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
          <h2 className="mb-3 text-lg font-semibold text-white">
            Saved Templates
          </h2>

          {templates.length === 0 ? (
            <p className="text-sm text-zinc-400">No templates saved yet.</p>
          ) : (
            <div className="space-y-2">
              {templates.map((template, index) => (
                <div
                  key={`${template.name}-${index}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3"
                >
                  <div className="font-medium text-white">{template.name}</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {template.monsters.reduce(
                      (sum, monster) => sum + monster.quantity,
                      0,
                    )}{" "}
                    monsters
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EncounterTemplatesPage;

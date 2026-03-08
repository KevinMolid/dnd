import H3 from "./H3";
import H4 from "./H4";

type Stats = {
  Str: number;
  Dex: number;
  Con: number;
  Int: number;
  Wis: number;
  Cha: number;
};

export type MonsterType =
  | "Aberration"
  | "Beast"
  | "Celestial"
  | "Construct"
  | "Dragon"
  | "Elemental"
  | "Fey"
  | "Fiend"
  | "Giant"
  | "Humanoid"
  | "Monstrosity"
  | "Ooze"
  | "Plant"
  | "Undead";

export type StatBlockProps = {
  name: string;
  type: MonsterType;
  description?: string;
  img?: string;
  AC: string;
  HP: number;
  speed: string | number;
  stats: Stats;
  skills?: string;
  senses?: string;
  language?: string;
  CR?: string;
  traits?: React.ReactNode;
  actions?: React.ReactNode;
  bonusActions?: React.ReactNode;
  isLocked?: boolean;
  onToggleLock?: () => void;
  onAddToEncounter?: () => void;
};

// Helpers
const getModifier = (stat: number) => {
  const mod = Math.floor((stat - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

const StatBlock = ({
  name,
  description,
  img,
  AC,
  HP,
  speed,
  stats,
  skills,
  senses,
  language,
  CR,
  traits,
  actions,
  bonusActions,
  isLocked = false,
  onToggleLock,
  onAddToEncounter,
}: StatBlockProps) => {
  return (
    <div className="border border-neutral-700 rounded-sm bg-neutral-800 max-w-96">
      <div className="h-1 bg-neutral-600"></div>

      <div className="p-2">
        <div className="mb-1 flex items-start justify-between gap-3">
          <div>
            <H3 className="mb-0 text-yellow-500">{name}</H3>
            {description && <p className="mb-1">{description}</p>}
          </div>

          <div className="flex items-center gap-3">
            {onAddToEncounter && (
              <button
                onClick={onAddToEncounter}
                className="text-neutral-400 transition hover:text-green-400"
                title="Add to encounter"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            )}

            {onToggleLock && (
              <button
                onClick={onToggleLock}
                className="text-neutral-400 transition hover:text-yellow-400"
                title={isLocked ? "Unlock" : "Lock"}
              >
                <i
                  className={`fa-solid ${isLocked ? "fa-lock" : "fa-lock-open"}`}
                ></i>
              </button>
            )}
          </div>
        </div>

        {img && (
          <img src={img} className="h-60 w-full object-cover" alt={name} />
        )}

        <div className="h-0.5 bg-yellow-600"></div>

        <p>
          <span className="font-medium">Armor Class</span> {AC}
        </p>
        <p>
          <span className="font-medium">Hit Points</span> {HP}
        </p>
        <p>
          <span className="font-medium">Speed</span> {speed}
        </p>

        <div className="h-0.5 bg-yellow-600"></div>

        <div className="grid grid-cols-6 text-center gap-2">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key}>
              <p className="font-medium">{key.toUpperCase()}</p>
              <p>
                {value} ({getModifier(value)})
              </p>
            </div>
          ))}
        </div>

        <div className="h-0.5 bg-yellow-600"></div>

        {skills && (
          <p>
            <span className="font-medium">Skills</span> {skills}
          </p>
        )}

        {senses && (
          <p>
            <span className="font-medium">Senses</span> {senses}
          </p>
        )}

        {language && (
          <p>
            <span className="font-medium">Languages</span> {language}
          </p>
        )}

        {CR && CR !== "Player Character" && (
          <p>
            <span className="font-medium">CR</span> {CR}
          </p>
        )}

        {traits && (
          <>
            <H4 className="text-yellow-500">Traits</H4>
            <div className="h-0.5 bg-yellow-600"></div>
            <div className="max-w-96">{traits}</div>
          </>
        )}

        {actions && (
          <>
            <H4 className="text-yellow-500">Actions</H4>
            <div className="h-0.5 bg-yellow-600"></div>
            <div className="max-w-96">{actions}</div>
          </>
        )}

        {bonusActions && (
          <>
            <H4 className="text-yellow-500">Bonus Actions</H4>
            <div className="h-0.5 bg-yellow-600"></div>
            <div className="max-w-96">{bonusActions}</div>
          </>
        )}
      </div>

      <div className="h-1 bg-neutral-600"></div>
    </div>
  );
};

export default StatBlock;

import CsLabel from "./CsLabel";

type Props = {
  character: Character;
};

type Character = {
  name: String;
  playername: String;
  race: String;
  class: String;
  background: String;
  stats: number[];
};

const CharacterSheet = ({ character }: Props) => {
  const modifiers = character.stats.map((stat) => {
    const modifier = Math.floor((stat - 10) / 2);
    if (modifier >= 0) {
      return "+" + modifier;
    }
    return modifier;
  });

  return (
    <div className={"bg-neutral-900 shadow-lg h-[1000px]"}>
      {/* Header */}
      <div className={`grid lg:grid-cols-3 gap-2 p-2`}>
        {/* Name and image */}
        <div className="flex w-full">
          <img
            className="w-20 aspect-square object-cover border-2 border-black"
            src={`/${character.name}Avatar.png`}
            alt=""
          />
          {/* Name */}
          <div className="flex-grow flex justify-center gap-2 items-center p-2">
            <div className="w-full">
              <p className="bg-neutral-950 font-medium text-3xl">
                {character.name}
              </p>
              <CsLabel>Character Name</CsLabel>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:col-span-2 grid grid-cols-3 p-2 gap-2">
          <div>
            <p className="bg-neutral-950 font-medium">{character.class} 1</p>
            <CsLabel>Class & Level</CsLabel>
          </div>
          <div>
            <p className="bg-neutral-950 font-medium">{character.background}</p>
            <CsLabel>Background</CsLabel>
          </div>
          <div>
            <p className="bg-neutral-950 font-medium">{character.playername}</p>
            <CsLabel>Player Name</CsLabel>
          </div>
          <div>
            <p className="bg-neutral-950 font-medium">{character.race}</p>
            <CsLabel>Race</CsLabel>
          </div>
          <div>
            <p className="bg-neutral-950 font-medium">-</p>
            <CsLabel>Alignment</CsLabel>
          </div>
          <div>
            <p className="bg-neutral-950 font-medium">0</p>
            <CsLabel>
              Experience <span className="hidden md:inline">Points</span>
            </CsLabel>
          </div>
        </div>
      </div>

      {/* Essentials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pb-2 px-2">
        <div className="bg-neutral-950 flex flex-col items-center pb-2 relative">
          <p className="text-4xl font-bold mb-1">
            <i className="fa-solid fa-shield-halved text-neutral-600"></i> 14
          </p>
          <CsLabel>Armor Class</CsLabel>
        </div>
        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="text-4xl font-bold mb-1">
            <i className="fa-solid fa-shoe-prints text-neutral-600"></i> 30
          </p>
          <CsLabel>Speed</CsLabel>
        </div>
        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="text-4xl font-bold mb-1">
            <i className="fa-solid fa-heart text-neutral-600"></i> 10
          </p>
          <CsLabel>Hit Points</CsLabel>
        </div>
        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="text-4xl font-bold mb-1">+2</p>
          <CsLabel>Proficiency Bonus</CsLabel>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pb-2 px-2">
        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[0]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[0]}</p>
          <CsLabel>Strength</CsLabel>
        </div>

        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[1]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[1]}</p>
          <CsLabel>Dexterity</CsLabel>
        </div>

        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[2]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[2]}</p>
          <CsLabel>Constitution</CsLabel>
        </div>

        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[3]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[3]}</p>
          <CsLabel>Intelligence</CsLabel>
        </div>

        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[4]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[4]}</p>
          <CsLabel>Wisdom</CsLabel>
        </div>

        <div className="bg-neutral-950 flex flex-col items-center pb-2">
          <p className="border-b border-slate-600 px-2">{character.stats[5]}</p>
          <p className="text-4xl font-bold mb-1">{modifiers[5]}</p>
          <CsLabel>Charisma</CsLabel>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;

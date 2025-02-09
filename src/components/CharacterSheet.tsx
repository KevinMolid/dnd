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
};

const CharacterSheet = ({ character }: Props) => {
  const classColor =
    character.class === "Rogue"
      ? "bg-gray-800"
      : character.class === "Barbarian"
      ? "bg-red-600"
      : character.class === "Druid"
      ? "bg-green-600"
      : character.class === "Bard"
      ? "bg-sky-500"
      : character.class === "Paladin"
      ? "bg-yellow-500"
      : "bg-gray-400";

  return (
    <div className={"bg-white shadow-lg h-[1000px]"}>
      {/* Header */}
      <div
        className={`${classColor} grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-4`}
      >
        {/* Name */}
        <div className="bg-white flex justify-center items-center p-2">
          <div className="w-full">
            <p className="bg-slate-100 font-medium text-3xl">
              {character.name}
            </p>
            <CsLabel>Character Name</CsLabel>
          </div>
        </div>
        {/* Details */}
        <div className="bg-white w-full col-span-2 grid grid-cols-3 p-2 gap-2 border border-black">
          <div>
            <p className="bg-slate-100 font-medium">{character.class} 1</p>
            <CsLabel>Class & Level</CsLabel>
          </div>
          <div>
            <p className="bg-slate-100 font-medium">{character.background}</p>
            <CsLabel>Background</CsLabel>
          </div>
          <div>
            <p className="bg-slate-100 font-medium">{character.playername}</p>
            <CsLabel>Player Name</CsLabel>
          </div>
          <div>
            <p className="bg-slate-100 font-medium">{character.race}</p>
            <CsLabel>Race</CsLabel>
          </div>
          <div>
            <p className="bg-slate-100 font-medium">-</p>
            <CsLabel>Alignment</CsLabel>
          </div>
          <div>
            <p className="bg-slate-100 font-medium">0</p>
            <CsLabel>Experience Points</CsLabel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;

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
  return (
    <div className={"bg-paper-100 shadow-lg h-[1000px]"}>
      {/* Header */}
      <div className={`grid lg:grid-cols-3 gap-2 p-2`}>
        {/* Name and image */}
        <div className="flex w-full">
          <img
            className="w-20 aspect-square object-cover border-2 border-black"
            src="public\AtiramAvatar.png"
            alt=""
          />
          {/* Name */}
          <div className="flex-grow flex justify-center gap-2 items-center p-2">
            <div className="w-full">
              <p className="bg-paper-200 font-medium text-3xl">
                {character.name}
              </p>
              <CsLabel>Character Name</CsLabel>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="w-full lg:col-span-2 grid grid-cols-3 p-2 gap-2 border-2 border-black">
          <div>
            <p className="bg-paper-200 font-medium">{character.class} 1</p>
            <CsLabel>Class & Level</CsLabel>
          </div>
          <div>
            <p className="bg-paper-200 font-medium">{character.background}</p>
            <CsLabel>Background</CsLabel>
          </div>
          <div>
            <p className="bg-paper-200 font-medium">{character.playername}</p>
            <CsLabel>Player Name</CsLabel>
          </div>
          <div>
            <p className="bg-paper-200 font-medium">{character.race}</p>
            <CsLabel>Race</CsLabel>
          </div>
          <div>
            <p className="bg-paper-200 font-medium">-</p>
            <CsLabel>Alignment</CsLabel>
          </div>
          <div>
            <p className="bg-paper-200 font-medium">0</p>
            <CsLabel>
              Experience <span className="hidden md:inline">Points</span>
            </CsLabel>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pb-2 px-2">
        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">10</p>
          <p className="text-4xl font-bold mb-1">+0</p>
          <CsLabel>Strength</CsLabel>
        </div>

        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">16</p>
          <p className="text-4xl font-bold mb-1">+3</p>
          <CsLabel>Dexterity</CsLabel>
        </div>

        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">16</p>
          <p className="text-4xl font-bold mb-1">+3</p>
          <CsLabel>Constitution</CsLabel>
        </div>

        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">16</p>
          <p className="text-4xl font-bold mb-1">+3</p>
          <CsLabel>Intelligence</CsLabel>
        </div>

        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">16</p>
          <p className="text-4xl font-bold mb-1">+3</p>
          <CsLabel>Dexterity</CsLabel>
        </div>

        <div className="flex flex-col items-center border-2 border-black pb-2">
          <p className="border-b border-paper-400 px-2">16</p>
          <p className="text-4xl font-bold mb-1">+3</p>
          <CsLabel>Dexterity</CsLabel>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;

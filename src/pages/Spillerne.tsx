import Container from "../components/Container";
import Tab from "../components/Tab";
import H2 from "../components/H2";
import { useState } from "react";

const Spillerne = () => {
  const [activePlayer, setActivePlayer] = useState("Atiram");

  const players = [
    {
      name: "Atiram",
      race: "Thiefling",
      class: "Rogue",
      background: "Criminal",
    },
    {
      name: "Balasar",
      race: "Dragonborn",
      class: "Barbarian",
      background: "Soldier",
    },
    { name: "Lia", race: "Elf", class: "Druid", background: "Outlander" },
    { name: "Luthien", race: "Elf", class: "Bard", background: "Noble" },
    {
      name: "Roland",
      race: "Half-elf",
      class: "Paladin",
      background: "Soldier",
    },
  ];

  const activePlayerData = players.find(
    (player) => player.name === activePlayer
  );

  return (
    <div>
      <Container>
        <H2>Spillerne</H2>

        <ul className="flex my-4">
          {players.map((player) => (
            <Tab
              active={activePlayer === player.name}
              key={player.name}
              onClick={() => setActivePlayer(player.name)}
            >
              <p className="leading-none">{player.name}</p>
              <p className="leading-none mb-1">
                <small className="font-medium">
                  {player.race} {player.class}
                </small>
              </p>
            </Tab>
          ))}
        </ul>

        <H2>
          {activePlayerData?.name} - {activePlayerData?.race}{" "}
          {activePlayerData?.class}
        </H2>
        <p>Bakgrunn: {activePlayerData?.background}</p>

        <div className="border-black border h-[1000px]">
          {/* Header */}
          <div className="bg-gray-200 grid grid-cols-3 gap-2 p-2">
            {/* Name */}
            <div className="bg-white flex justify-center items-center p-2">
              <div className="bg-slate-100 h-10 w-full"></div>
            </div>
            {/* Details */}
            <div className="bg-white w-full col-span-2 grid grid-cols-3 p-2 gap-2">
              <div className="bg-slate-100 h-8"></div>
              <div className="bg-slate-100 h-8"></div>
              <div className="bg-slate-100 h-8"></div>
              <div className="bg-slate-100 h-8"></div>
              <div className="bg-slate-100 h-8"></div>
              <div className="bg-slate-100 h-8"></div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Spillerne;

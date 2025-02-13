import Container from "../components/Container";
import Tab from "../components/Tab";
import H1 from "../components/H1";
import CharacterSheet from "../components/CharacterSheet";

import { useState } from "react";

const Spillerne = () => {
  const [activePlayer, setActivePlayer] = useState("Atiram");

  const players = [
    {
      name: "Atiram",
      playername: "Marita",
      race: "Thiefling",
      class: "Rogue",
      background: "Criminal",
      stats: [10, 16, 15, 12, 10, 12],
    },
    {
      name: "Balasar",
      playername: "Sara",
      race: "Dragonborn",
      class: "Barbarian",
      background: "Soldier",
      stats: [16, 14, 16, 8, 10, 8],
    },
    {
      name: "Lia",
      playername: "Janicke",
      race: "Elf",
      class: "Druid",
      background: "Outlander",
      stats: [10, 12, 16, 10, 16, 8],
    },
    {
      name: "Luthien",
      playername: "Esmeralda",
      race: "Elf",
      class: "Bard",
      background: "Noble",
      stats: [8, 14, 14, 12, 10, 16],
    },
    {
      name: "Roland",
      playername: "Kaj",
      race: "Half-elf",
      class: "Paladin",
      background: "Soldier",
      stats: [16, 12, 14, 10, 10, 14],
    },
  ];

  const activePlayerData = players.find(
    (player) => player.name === activePlayer
  );

  return (
    <div>
      <Container>
        <H1>Spillerne</H1>

        <ul className="flex my-6">
          {players.map((player) => (
            <Tab
              active={activePlayer === player.name}
              key={player.name}
              onClick={() => setActivePlayer(player.name)}
            >
              <div className="flex items-center">
                <img
                  className="hidden sm:inline w-8"
                  src={player.class + "White.png"}
                  alt={player.class}
                />
                <div>
                  <p className="leading-none">{player.name}</p>
                  <p className="leading-none mb-1 text-xs font-medium text-neutral-400">
                    <span className="hidden lg:inline">{player.race}</span>{" "}
                    {player.class}
                  </p>
                </div>
              </div>
            </Tab>
          ))}
        </ul>

        {activePlayerData && <CharacterSheet character={activePlayerData} />}
      </Container>
    </div>
  );
};

export default Spillerne;

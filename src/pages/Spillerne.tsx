import Container from "../components/Container";
import Tab from "../components/Tab";
import H2 from "../components/H2";
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
    },
    {
      name: "Balasar",
      playername: "Sara",
      race: "Dragonborn",
      class: "Barbarian",
      background: "Soldier",
    },
    {
      name: "Lia",
      playername: "Janicke",
      race: "Elf",
      class: "Druid",
      background: "Outlander",
    },
    {
      name: "Luthien",
      playername: "Esmeralda",
      race: "Elf",
      class: "Bard",
      background: "Noble",
    },
    {
      name: "Roland",
      playername: "Kaj",
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
              <div className="flex items-center">
                <img
                  className="hidden sm:inline w-8"
                  src={player.class + ".png"}
                  alt={player.class}
                />
                <div>
                  <p className="leading-none">{player.name}</p>
                  <p className="leading-none mb-1 text-xs font-medium">
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

import Container from "../components/Container";
import Tab from "../components/Tab";
import H2 from "../components/H2";
import { useState } from "react";

const Spillerne = () => {
  const [activePlayer, setActivePlayer] = useState("Atiram");

  const players = [
    { name: "Atiram", race: "Thiefling", class: "Rogue" },
    { name: "Balasar", race: "Dragonborn", class: "Barbarian" },
    { name: "Lia", race: "Elf", class: "Druid" },
    { name: "Luthien", race: "Elf", class: "Bard" },
    { name: "Roland", race: "Half-elf", class: "Paladin" },
  ];

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

        <H2>Atiram - Thiefling Rogue</H2>
        <p>Bakgrunn: Criminal</p>

        <H2>Balasar - Dragonborn Barbarian</H2>
        <p>Bakgrunn: Soldier</p>

        <H2>Lia - Elf Druid</H2>
        <p>Bakgrunn: Outlander</p>

        <H2>Luthien - Elf Bard</H2>
        <p>Bakgrunn: Noble</p>

        <H2>Roland - Half-elf Paladin</H2>
        <p>Bakgrunn: Soldier</p>
      </Container>
    </div>
  );
};

export default Spillerne;

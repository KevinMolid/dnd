import Container from "../components/Container";
import H1 from "../components/H1";
import StatBlock from "../components/StatBlock";
import { players } from "../data/players";

const Players = () => {
  const sortedPlayers = [...players].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <div>
      <Container>
        <H1>Spillere</H1>

        <div className="flex flex-wrap gap-4">
          {sortedPlayers.map((player) => (
            <StatBlock key={player.name} {...player} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Players;

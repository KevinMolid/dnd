import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import Paragraph from "../components/Paragraph";

const NPCene = () => {
  return (
    <div>
      <Container>
        <H1>NPCene</H1>
        <Paragraph>
          En NPC er en hvilken som helst karakter som ikke styres av en spiller.
          Alle NPCer styres av spillmesteren.
        </Paragraph>
        <H2>Viktige karakterer</H2>
        <ul className="mb-4">
          <li>
            <p>
              <span className="font-semibold">Gundren Rockseeker</span>
            </p>
          </li>
          <li>
            <p>
              <span className="font-semibold">Sildar Hallwinter</span>
            </p>
          </li>
          <li>
            <p>
              <span className="font-semibold">Den Sorte Edderkoppen</span>
            </p>
          </li>
          <li>
            <p>
              <span className="font-semibold">Bart Stonehill</span>
            </p>
          </li>
        </ul>

        <H2>Uviktige karakterer</H2>
        <ul className="mb-4">
          <li>
            <p>
              <span className="font-semibold">Molly</span>
            </p>
          </li>
          <li>
            <p>Tharden Rockseeker</p>
          </li>
          <li>
            <p>Nundro Rockseeker</p>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default NPCene;

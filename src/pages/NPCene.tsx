import Container from "../components/Container";
import H1 from "../components/H1";
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
        <ul>
          <li>
            <p>Gundren Rockseeker</p>
            <p>Tharden Rockseeker</p>
            <p>Nundro Rockseeker</p>
            <p>Sildar Hallwinter</p>
            <p>Den Sorte Edderkoppen</p>
            <p>Bart</p>
            <p>Molly</p>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default NPCene;

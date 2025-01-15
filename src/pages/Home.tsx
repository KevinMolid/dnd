import Container from "../components/Container";
import H2 from "../components/H2";

const Home = () => {
  return (
    <div>
      <Container>
        <p className="mb-4">
          Velkommen! Denne siden er laget for å holde styr på alt som skjer i
          DnD-eventyret "Den Tapte Gruven i Phandelver".
        </p>
        <p className="mb-4">
          Her finner du en oppsummering av de viktigste hendelsene så langt. Du
          finner de viktigste reglene du trenger som spiller og generelle tips
          til hva man kan tenke på for å gjøre det til en morsom og positiv
          opplevelse for alle!
        </p>
        <H2>Historien</H2>
        <p>Session 1</p>
        <H2>Reglene</H2>
        <H2>Spillerne</H2>
        <H2>NPCene</H2>
      </Container>
    </div>
  );
};

export default Home;

import Container from "../components/Container";
import H1 from "../components/H1";

const Home = () => {
  return (
    <div>
      <Container>
        <H1>Velkommen!</H1>
        <p>
          Denne siden er laget for å holde styr på alt som skjer i DnD-eventyret
          <span className="font-medium"> Den Tapte Gruven i Phandelver</span>.
        </p>
        <p>
          Her finner du en oppsummering av de viktigste hendelsene i{" "}
          <span className="font-medium">Eventyret</span> så langt. Du finner de
          viktigste <span className="font-medium">Reglene</span> du trenger som
          spiller og generelle{" "}
          <span className="font-medium">Tips og Triks</span> til hva man kan
          tenke på for å gjøre det til en morsom og positiv opplevelse for alle!
        </p>
        <p>
          Du finner også informasjon om{" "}
          <span className="font-medium">Spillerne</span> og{" "}
          <span className="font-medium">NPCene</span>.
        </p>
      </Container>
    </div>
  );
};

export default Home;

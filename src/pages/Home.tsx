import Container from "../components/Container";
import H1 from "../components/H1";
import Paragraph from "../components/Paragraph";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Container>
        <H1>Velkommen!</H1>
        <Paragraph>
          Denne siden er laget for å holde styr på alt som skjer i DnD-eventyret
          <span className="font-medium"> Den Tapte Gruven i Phandelver</span>.
        </Paragraph>
        <Paragraph>
          Her finner du en oppsummering av{" "}
          <Link
            to="/historien"
            className="font-medium text-slate-100 hover:underline"
          >
            Historien
          </Link>{" "}
          så langt. Du finner de viktigste{" "}
          <Link
            to="/reglene"
            className="font-medium text-slate-100 hover:underline"
          >
            Reglene
          </Link>{" "}
          du trenger som spiller og generelle{" "}
          <Link
            to="/tips"
            className="font-medium text-slate-100 hover:underline"
          >
            Tips
          </Link>{" "}
          til hva man kan tenke på for å gjøre det til en morsom og positiv
          opplevelse for alle!
        </Paragraph>
        <Paragraph>
          Du finner også informasjon om{" "}
          <Link
            to="/spillere"
            className="font-medium text-slate-100 hover:underline"
          >
            Spillere
          </Link>{" "}
          og{" "}
          <Link
            to="/karakterer"
            className="font-medium text-slate-100 hover:underline"
          >
            Karakterer
          </Link>
          .
        </Paragraph>
      </Container>
    </div>
  );
};

export default Home;

import Container from "../components/Container";
import H2 from "../components/H2";
import H3 from "../components/H3";

const Historien = () => {
  return (
    <div>
      <Container>
        <H2>Historien</H2>
        <H3>Økt 1: På pub med Gundren</H3>
        <p>
          Dere møtte dvergen Gundren Rockseeker og hans venn Sildar Hallwinter
          på et vertshus i byen Neverwinter. Spillerne introduserte seg for
          hverandre og fortalte litt om seg selv:
        </p>
        <p>
          <span className="font-bold">Atiram</span>: Tiefling Rogue. Tidligere
          kriminell. Stavanger-dialekt.
          <br />
          <span className="font-bold">Roland</span>: Half-elf Paladin. Tidligere
          soldat. Rolig og behersket.
          <br />
          <span className="font-bold">Balasar</span>: Dragonborn Barbarian.
          Tidligere soldat. Rappkjefta nordlening.
          <br />
          <span className="font-bold">Lia</span>: Elf Druid. Bakgrunn som
          Outlander. Mystisk og klok.
          <br />
          <span className="font-bold">Luthien</span>: Elf Bard. Bakgrunn som
          Entertainer. Dramatisk og sjarmerende.
        </p>
        <p>
          Gundren var veldig ivrig (og veldig hemmelighetsfull) om noe stort han
          ville dele, men først trengte han hjelp med et oppdrag. Gundren tilbød
          15 gp til hver av dere for å frakte en vogn med forsyninger til
          landsbyen Phandalin.
        </p>
        <p>
          Gundren og Sildar dro i forveien for å ordne med noe "Business" i
          Phandalin.
        </p>
        <H3>Økt 2: Kidnappet smed-datter</H3>
        <p>
          På vei sørover langs High Road kom dere til en liten grend, hvor
          vertshuset nylig hadde blitt brent til grunnen. Noen vakter i et
          vakttårn fortalte at grenda hadde blitt angrepet gjentatte ganger av
          goblins. I det siste angrepet ble et barn bortført fra vertshuset.
          Smeden, og hans kone fortalte at datteren deres ble tatt av goblins.
          Lederen i vakttårnet,
        </p>
      </Container>
    </div>
  );
};

export default Historien;

import Container from "../components/Container";
import H2 from "../components/H2";
import H3 from "../components/H3";
import Paragraph from "../components/Paragraph";

const Historien = () => {
  return (
    <div>
      <Container>
        <H2>Historien</H2>
        <H3>Økt 1: På pub med Gundren</H3>
        <Paragraph>
          Dere møtte dvergen Gundren Rockseeker og hans venn Sildar Hallwinter
          på et vertshus i byen Neverwinter. Spillerne introduserte seg for
          hverandre og fortalte litt om seg selv:
        </Paragraph>
        <Paragraph>
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
        </Paragraph>
        <Paragraph>
          Gundren var veldig ivrig (og veldig hemmelighetsfull) om noe stort han
          ville dele, men først trengte han hjelp med et oppdrag. Gundren tilbød
          15 gp til hver av dere for å frakte en vogn med forsyninger til
          landsbyen Phandalin.
        </Paragraph>
        <Paragraph>
          Gundren og Sildar dro i forveien for å ordne med noe "Business" i
          Phandalin.
        </Paragraph>
        <H3>Økt 2: Kidnappet smed-datter</H3>
        <Paragraph>
          På vei sørover langs High Road kom dere til en liten grend, hvor
          vertshuset nylig hadde blitt brent til grunnen. Noen vakter i et
          vakttårn fortalte at grenda hadde blitt angrepet gjentatte ganger av
          goblins. I det siste angrepet ble et barn bortført fra vertshuset.
          Smeden, Ferrus Stryker, og hans kone, Margot, fortalte at datteren
          deres, Remi, ble tatt av goblins. Lederen i vakttårnet, Kaptein
          Thorne, lovet en dusør på 5 sp per goblin-øre.
        </Paragraph>
        <Paragraph>
          Spor etter kamp ved vertshuset ledet østover mot Neverwinter Woods.
        </Paragraph>
        <H3>Økt 3: Mystisk goblin-rituale</H3>
        <Paragraph>
          Roland, Atiram og Lia bestemte seg for å følge sporene østover for å
          forsøke og finne Remi, mens Luthien og Balasar ble hos smeden. Roland
          overtalte Kaptein Thorne til å følge dere og hjelpe dere med å spore
          opp goblinene.
        </Paragraph>
        <Paragraph>
          På veg østover observerte dere et lys litt mot nord som Lia kjente
          igjen som Helm's Hold, et tilfluktsted for flyktninger fra The Spell
          Plague.
        </Paragraph>
        <Paragraph>
          Dere fant en eldgammel krypt ved skogen full av goblins, med
          skarpslipte tenner. Krypten så ut til å være bygget av The Elves of
          Iliyanbruen, en gruppe alver kjent for å ha stått i mot horder av
          orker for mange hundre år siden. Etter å elegant ha unngått en
          livsffarlig felle med store knivblader som ble sluppet fra taket,
          bekjempet dere flere goblins, og en hobgoblin. En av goblinene hadde
          en merkelig tryllestav og så ut til å være i ferd med å utføre et
          rituale. Dere reddet Remi fra et lite bur, skar av ørene til goblinene
          og tok med dere staaven og noen gullgjenstander fra ritualet; en kniv,
          en døpeskål og en røkelsesholder.
        </Paragraph>
        <Paragraph>
          Til tross for litt tvilsom oppførsel viste Thorne seg å være
          pålitelig, og ga dere en belønning på 110 sp. Ferrus Stryker tilbød
          gratis smedtjenester for å ha reddet datteren hans. Dere kjøpte en
          kilo jern som Ferrus smidde om til 100 fotangler.
        </Paragraph>
        <Paragraph>
          Lia fiklet litt med tryllestaven (Wand of Eldritch Blast) og knyttet
          et sterkt bånd til den.
        </Paragraph>

        <H3>Økt 4: Bakholdsangrep og Atiram i fare</H3>
        <Paragraph>
          Etter å ha fulgt High Road sørover i et par dager tok dere av østover
          på Triboar Trail. Her ble dere møtt av to døde hester liggende i veien
          med piler stikkende ut av siden.
        </Paragraph>
      </Container>
    </div>
  );
};

export default Historien;

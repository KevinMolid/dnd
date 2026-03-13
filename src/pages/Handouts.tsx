import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container";
import H1 from "../components/H1";
import H2 from "../components/H2";
import H4 from "../components/H4";

import Description from "../components/Description";

// Maps
import map1 from "/Maps/CragmawHideout.jpg";
import map2 from "/Maps/Phandalin.jpg";
import map3 from "/Maps/CragmawCastle.jpg";
import map4 from "/Maps/RedbrandHideout.jpg";
import map5 from "/Maps/Thundertree.jpg";
import map6 from "/Maps/WaveEchoCave.jpg";

import drawing1 from "/Drawing1.png";
import drawing2 from "/Drawing2.png";
import drawing3 from "/Drawing3.png";
import drawing4 from "/Drawing4.png";
import drawing5 from "/Drawing5.png";

import letter1 from "/Letter1.png";
import letter2 from "/Letter2.png";

type RoomMonster = {
  name: string;
  count?: number;
  notes?: string;
};

type RoomData = {
  id: number;
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  readAloud?: string;
  description: React.ReactNode;
  monsters?: RoomMonster[];
  captives?: React.ReactNode;
  treasure?: string[];
  developments?: React.ReactNode;
  experience?: string;
  notes?: string[];
  exits?: number[];
};

type HandoutImage = {
  title: string;
  src: string;
};

type MapHandout = HandoutImage & {
  rooms?: RoomData[];
};

const redbrandHideoutRooms: RoomData[] = [
  {
    id: 1,
    name: "Kjeller",
    x: 82,
    y: 79,
    description: (
      <>
        <p className="mb-2">
          Enhver utforskning av herregårdens område viser at det er forlatt, men
          det finnes mange spor som leder til en steintrapp like ved ruinene av
          et stort, tomt kjøkken. Nederst i trappen står en ulåst dør som leder
          inn til en kjeller.
        </p>
        <p className="mb-4">Når karakterene åpner døren, les følgende:</p>
        <Description>
          Døren åpner seg mot en liten repos som er rundt halvannen meter bred
          og ligger omtrent fire og en halv meter over gulvet i en stor kjeller.
          En steintrapp går ned til gulvet i to korte trappeløp. En annen dør
          står under trappen mot nord. En stor steinsisterne opptar den vestlige
          delen av rommet, og langs veggene står tønner og fat.
        </Description>
        <p className="mb-2">
          Dette rommet ser ut til å være en stor lagerkjeller, akkurat slik man
          kunne forvente under en gammel herregård. Redbrands ønsker å holde
          basen sin skjult, så bortsett fra fatene med ferske forsyninger finnes
          det ingenting her som avslører deres tilstedeværelse.
        </p>
        <p className="mb-2">
          Tønnene inneholder saltet svinekjøtt og storfekjøtt, mel, sukker,
          epler og øl. Å flytte rundt på tønnene for å undersøke dem grundig
          lager mye støy og tiltrekker oppmerksomheten til Redbrands i område 2.
        </p>
        <p className="mb-2">
          <strong>Sisterne.</strong> Dette rektangulære vannreservoaret er rent
          og fylt med kaldt, friskt vann. Det er rundt tre meter dypt, og kanten
          rundt er omtrent 60 cm høyere enn gulvet rundt (slik at bunnen av
          sisternen ligger omtrent 2,5 meter under gulvnivå). Avløpsrør fra
          taket på den gamle herregården over leder regnvann ned i sisternen.
        </p>
        <p className="mb-2">
          En vanntett veske henger i et tau festet til sørveggen i sisternen,
          omtrent 60 cm under vannflaten. Den er ikke synlig fra overflaten, men
          kan oppdages med en vellykket Visdom (Perception)-sjekk, DC 15, eller
          automatisk av en karakter som undersøker sisternen med en stang eller
          hopper ned i vannet. Vesken inneholder noen verdifulle gjenstander (se
          Skatt).
        </p>
        <p className="mb-2">
          <strong>Hemmelig dør.</strong> En hemmelig dør finnes i det
          sørvestlige hjørnet av rommet. Se avsnittet Generelle trekk for mer
          informasjon om hemmelige dører.
        </p>
      </>
    ),
    developments: (
      <>
        <p className="mb-2">
          Det finnes ingen monstre eller skurker i dette området, men bøllene i
          område 2 legger merke til det hvis karakterene lager mye støy her. De
          sniker seg inn i rommet og kan få overraskelse dersom karakterene ikke
          hører dem (se Surprise i Basic Rules).
        </p>
        <p>
          Hvis bøllene kjemper i dette området og to av dem blir beseiret, kan
          den siste bøllen avsløre den hemmelige døren ved å flykte i den
          retningen.
        </p>
      </>
    ),
    treasure: [
      "en potion of healing",
      "en potion of invisibility",
      "50 gp",
      "et rent sett med vanlige reiseklær",
    ],
    exits: [2, 3, 8],
  },
  {
    id: 2,
    name: "Brakke",
    x: 58,
    y: 69,
    description: (
      <>
        <p className="mb-4">
          De fleste av Redbrands’ menneskelige medlemmer bor i Phandalin. Denne
          brakken er et godt sted å holde lav profil etter å ha presset penger
          eller varer fra lokale gruvearbeidere og pelsjegere.
        </p>
        <Description>
          Rommet ser ut til å være et lagerrom som er tatt i bruk som sovesal.
          To køyesenger står mot veggen nær døren, mens tønner og kasser fyller
          den sørlige delen av kammeret.
        </Description>
        <p>
          Tre Redbrand-bøller hviler i dette rommet. Hvis de hører mye støy fra
          område 1 (inkludert høye stemmer eller tønner som rulles rundt), gjør
          de seg klare til kamp og forsøker å overraske inntrengerne.
        </p>
        <p>Tønnene her inneholder lignende forsyninger som de i område 1.</p>
      </>
    ),
    monsters: [{ name: "Redbrand Ruffian", count: 3 }],
    treasure: [
      "Den første inneholder 16 sp og 7 gp",
      "Den andre inneholder 12 sp og 5 gp",
      "Den tredje inneholder 15 ep og to granater (10 gp hver)",
    ],
    experience:
      "Dersom gruppen beseirer bøllene, deles 300 XP likt mellom karakterene.",
    exits: [1],
  },
  {
    id: 3,
    name: "Felle i gangen",
    x: 88,
    y: 54,
    description: (
      <>
        <p className="mb-4">
          Dette området var en del av de opprinnelige kjellerne til Tresendar
          Manor. Redbrands gravde ut jorden under steingulvet og laget en skjult
          fallgrop.
        </p>
        <Description>
          Et tykt lag støv dekker steinhellene i denne dystre gangen. Veggene er
          dekorert med falske søyler for hver tredje meter, og de doble dørene i
          vestenden av gangen er kledd i kobberplater som nå er blitt grønne av
          alder. En relieffskulptur av en sørgmodig engel pryder dørene.
        </Description>
        <p className="mb-2">
          Fallgropen midt i gangen er skjult under et falskt gulv bestående av
          løse steinheller lagt oppå svake trebjelker. Hellene og bjelkene gir
          etter under en vekt på 45 kg eller mer. En karakter som leter etter
          feller i gangen kan oppdage den skjulte gropen med en vellykket Visdom
          (Perception)-sjekk, DC 15. En vellykket sjekk avslører også smale
          avsatser langs nord- og sørkanten av gropen. En skapning som forsøker
          å snike seg rundt gropen ved å bruke en av disse avsatsene må lykkes
          på en Dexterity (Acrobatics)-sjekk, DC 10.
        </p>
        <p className="mb-2">
          En skapning som utløser fellen, eller mislykkes på Dexterity-sjekken
          for å komme seg forbi gropen, må gjøre et Dexterity saving throw, DC
          15, for å gripe kanten. Ved et mislykket kast faller skapningen 6
          meter ned på jordgulvet i gropen, tar 2d6 knusningsskade, og lander
          liggende (prone).
        </p>
      </>
    ),
    experience:
      "Dersom gruppen unngår eller overlever fallgropen, deles 100 XP likt mellom karakterene.",
    exits: [2, 3],
  },
  {
    id: 4,
    name: "Tresendar-kryptene",
    x: 62,
    y: 45,
    description: (
      <>
        <p className="mb-4">
          De eldre medlemmene av den for lengst forsvunne Tresendar-familien ble
          en gang lagt til hvile i dette mausoleet.
        </p>
        <Description>
          Tre store steinsarkofager står i denne støvete krypten, og lent mot
          hver sarkofag står et menneskeskjelett kledd i biter av rustent
          ringbrynjerustning. Falske søyler langs veggene er skåret ut som
          spredende eiketrær. De doble dørene i det sørøstlige hjørnet er kledd
          i matt, anløpen kobberplate.
        </Description>
        <p className="mb-2">
          De tre skjelettene er animert og angriper enhver skapning som kommer
          innenfor 3 meter fra døren som leder til område 5 eller døren som
          leder til område 6 — med mindre skapningen bærer en skarlagensrød
          Redbrand-kappe eller sier passordet «Illefarn» (navnet på et gammelt
          alverike som en gang strakte seg over store deler av Sword Coast).
        </p>
        <p>
          Steinlokket på hver sarkofag er utskåret slik at det forestiller
          personen som ligger begravet inni — to menneskelige menn og én
          menneskelig kvinne, alle med et adelig preg. Hvis sarkofagene åpnes,
          inneholder gravene for det meste morkne bein og rester av klær, men se
          avsnittet Skatt.
        </p>
      </>
    ),
    developments: (
      <p>
        Kamp i dette rommet varsler Redbrands i område 5 om at problemer er på
        vei.
      </p>
    ),
    monsters: [{ name: "Skeleton", count: 3 }],
    treasure: [
      "Blant beina i hver sarkofag ligger en platina signetring verdt 50 gp.",
    ],
    experience:
      "Dersom gruppen beseirer skjelettene, deles 150 XP likt mellom karakterene.",
    exits: [3, 5, 6, 7],
  },
  {
    id: 5,
    name: "Slaveceller",
    x: 72,
    y: 31,
    description: (
      <>
        <p className="mb-4">
          De siste to månedene har Redbrands fanget reisende i området og holdt
          dem i disse cellene til de kan bli solgt som slaver.
        </p>
        <Description>
          <p className="mb-2">
            Dette lange rommet er delt inn i tre seksjoner, med jerngitter som
            avgrenser nord- og sørdelen. Skittent halm dekker gulvet i cellene,
            og de hengslede dørene er sikret med kjettinger og hengelåser. To
            pjuskete menneskekvinner sitter i cellen i sør, mens en menneskegutt
            er sperret inne i cellen i nord. Alle er kledd i enkle grå tunikaer
            og har jernhalsbånd rundt halsen.
          </p>
          <p>En haug med kasserte klær ligger slengt mot den fjerne veggen.</p>
        </Description>
        <p className="mb-2">
          To Redbrand-bøller i skarlagensrøde kapper står vakt her, men de
          bruker mesteparten av tiden på å håne de hjelpeløse fangene (se
          avsnittet Fanger). Hvis de hører kamp i område 5, tar de opp
          stillinger langs veggen nær døren og forsøker deretter å overraske
          inntrengerne. Fangene er for redde til å rope advarsler eller tilkalle
          hjelp.
        </p>
        <p className="mb-2">
          Kleshaugen tilhører ulike fanger som har vært holdt her i løpet av de
          siste to månedene — minst et dusin mennesker, å dømme etter størrelsen
          på haugen.
        </p>
        <p>
          <strong>Celledører.</strong> Celledørene har enkle låser som kan åpnes
          med tyveredskaper og en vellykket Dexterity-sjekk, DC 10. Dørene kan
          også brytes opp med rå styrke med en vellykket Strength-sjekk, DC 22.
        </p>
      </>
    ),
    captives: (
      <>
        <p className="mb-2">
          De tre menneskelige commoners som holdes fanget her er Mirna Dendrar
          og hennes to tenåringsbarn: den tretten år gamle Nars og den atten år
          gamle Nilsa.
        </p>
        <p className="mb-2">
          For noen dager siden drepte Redbrands Mirnas ektemann, Thel, fordi han
          trosset dem. (Likets hans kan finnes i område 8.) Den samme natten
          vendte banden tilbake og bortførte familien fra hjemmet deres i
          Phandalin. Banden planlegger å selge familien som slaver.
        </p>
        <p className="mb-2">
          Familien Dendrar er svært takknemlige dersom karakterene redder dem,
          men de kan ikke gi mye informasjon om Redbrands’ skjulested. Alt de
          vet er at lederen er en trollmann (de har ikke møtt ham og kjenner
          ikke navnet hans), og at han har «høye, hårete monstre med store ører»
          (bugbears) som arbeider for seg.
        </p>
        <p>
          <strong>Sideoppdrag: Mirnas arvestykke</strong> Selv om familien ikke
          har noe å tilby som belønning, forteller Mirna at hun kanskje vet hvor
          et verdifullt arvestykke er skjult. Da hun var en ung jente, flyktet
          hun og familien fra byen Thundertree etter at stedet ble overrunnet av
          udøde. Familien hennes drev en urte- og alkymibutikk, og inne i
          butikken lå et skrin med et smaragdsmykke skjult under en del av
          lagringshyllene. Hun våget aldri å vende tilbake for å hente det.
          Butikken lå i den sørøstlige delen av Thundertree. Hvis karakterene
          bestemmer seg for å utforske ruinene av Thundertree, se del 3 av
          eventyret.
        </p>
      </>
    ),
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen beseirer bøllene. Del 100 XP likt mellom karakterene dersom familien Dendrar kommer levende tilbake til byen.",
    exits: [2, 3],
  },
  {
    id: 6,
    name: "Våpenlager",
    x: 60,
    y: 21,
    description: (
      <>
        <p className="mb-4">
          Døren til dette rommet er låst fra utsiden. Rett overfor den låste
          døren finnes en hemmelig dør som leder til område 7. For mer
          informasjon om låste dører og hemmelige dører, se avsnittet Generelle
          trekk tidligere.
        </p>
        <Description>
          Våpenstativer langs veggene i dette kammeret holder spyd, sverd,
          armbrøster og armbrøstbolter. Et dusin skitne røde kapper henger på
          kroker ved døren.
        </Description>
        <p className="mb-2">
          Redbrands har ambisiøse planer om å utvide rekkene sine i nær fremtid,
          og har derfor begynt å samle opp våpen og rustninger.
        </p>
        <p className="mb-2">Våpenstativene inneholder:</p>
        <ul>
          <li>12 spyd</li>
          <li>6 korte sverd (shortswords)</li>
          <li>4 langsverd (longswords)</li>
          <li>6 lette armbrøster</li>
          <li>8 kogger, hver med 20 armbrøstbolter.</li>
        </ul>
      </>
    ),
    exits: [4, 7],
  },
  {
    id: 7,
    name: "Lager og arbeidsområde",
    x: 42,
    y: 21,
    description: (
      <>
        <p className="mb-4">
          I dette kammeret gjør Redbrands opp status over de stjålne varene
          sine. De sender dem enten ut gjennom hulen mot sør, eller pakker dem
          for lagring i festningen.
        </p>
        <Description>
          <p className="mb-2">
            Dette området utgjør den nordlige enden av en stor naturlig grotte,
            men det er blitt ferdigstilt med vegger av tilhuggede steinblokker
            og et gulv av steinheller. Flere tønner står lagret langs veggene,
            sammen med en rekke tomme kasser, pakkestrå, hammere, brekkjern og
            spiker.
          </p>
          <p>
            Grotten fortsetter et godt stykke sørover. Dere kan skimte flere
            passasjer som åpner seg fra den større hulen, samt noe som ser ut
            til å være en dyp grop eller kløft i gulvet.
          </p>
        </Description>
        <p>
          Dette rommet inneholder to hemmelige dører, én som leder til område 6
          og én som leder til område 12. Se avsnittet Generelle trekk for mer
          informasjon om hemmelige dører.
        </p>
      </>
    ),
    treasure: [
      "De fleste forsyningene og varene her er ikke spesielt verdifulle, men blant dem ligger tretti beverskinn, hver verdt 2 gp. De ble plyndret fra en karavane på Triboar Trail for noen dager siden.",
    ],
    exits: [4, 6, 8, 12],
  },
  {
    id: 8,
    name: "Kløften",
    x: 32,
    y: 59,
    description: (
      <>
        <p className="mb-4">
          Karakterene kan komme hit via tre forskjellige ruter: tunnelen fra
          område 1, lagerrommet i område 7, eller den grovt uthugde passasjen
          mot sør, som fortsetter utenfor kartet i omtrent tretti meter før den
          kommer ut fra en tunnel i skogen sør for Tresendar Manor. Denne
          passasjen er en utmerket måte å smugle mennesker eller varer inn og ut
          av Phandalin uten å bli sett, og passer derfor perfekt for en bande
          med slavehandlere og tyver.
        </p>
        <Description>
          En kald bris fyller denne store naturlige grotten og bærer med seg en
          svak lukt av råtnende kjøtt. En kløft deler grotten i to og flankeres
          av to grove steinsøyler som støtter det seks meter høye taket. To
          buede trebroer spenner over avgrunnen.
        </Description>
        <p className="mb-2">
          Vokteren av denne hulen er en nothic — et sinnssykt underjordisk
          monster som hungre etter kjøtt. Skapningen ble lokket hit av en svak
          magisk effekt som strømmer ut fra kløften, og den holdt til i området
          da Redbrands flyttet inn. Iarno klarte å inngå en avtale med monsteret
          og overtalte det til å hjelpe med å vokte basen i bytte mot skatter og
          sporadiske gaver av ferskt kjøtt. Likevel er nothicen ikke til å stole
          på.
        </p>
        <p className="mb-2">
          Nothicen holder til nær den vestlige enden av de to broene. Hvis den
          legger merke til inntrengere som kommer inn i hulen, gjemmer den seg
          bak en av de store steinsøylene og observerer dem. Den forsøker også å
          bruke Weird Insight (se monsterets statblokk) for å avdekke
          karakterenes hemmeligheter.
        </p>
        <p className="mb-2">
          Nothicen kommuniserer ved telepati. Hvis den blir oppdaget,
          foretrekker den å forhandle og kan lett svikte Redbrands dersom den
          tilbys noe bedre — for eksempel løftet om mat. Når du rollespiller
          nothicen, kan du hviske, le manisk og komme med usammenhengende
          mumling. Beskriv også at skapningen egentlig ikke snakker høyt, men
          heller fyller karakterenes sinn med sine kvalme hviskinger og krav om
          mat. Nothicen vet alt det Redbrands vet (se avsnittet What the
          Redbrands Know).
        </p>
        <p className="mb-2">
          <strong>Broer.</strong> Broene er laget av treplanker og har ingen
          rekkverk. Den sørlige broen er rigget til å kollapse dersom en
          skapning som veier mer enn 25 kg går over den. En karakter som står
          ved broen kan oppdage at konstruksjonen er svak med en vellykket
          Intelligence (Investigation)-sjekk, DC 15. Enhver skapning kan bruke
          en handling til å løsne den ene enden av en av broene slik at den
          faller ned i kløften.
        </p>
        <p>
          <strong>Kløften.</strong> Denne bratte sprekken i bakken er 1,5 til 3
          meter bred og 6 meter dyp. De grove veggene er enkle å klatre opp uten
          ferdighetssjekk. En skapning som faller ned i kløften tar 2d6
          knusningsskade og lander liggende i en haug med stein og bein som
          regnes som vanskelig terreng. Bunnen av kløften føles unaturlig kald.
          Hvis området undersøkes med en detect magic-formel, utstråler det en
          svak nekromantisk aura. Magien gjør at alt organisk materiale i
          kløften eldes og brytes ned med halv hastighet. Blant knuste og godt
          gnagde bein ligger det halvspiste liket av Thel Dendrar, treskjæreren
          fra Phandalin som ble drept av Redbrands. Fredløse etterlot liket her
          som mat til nothicen.
        </p>
      </>
    ),
    treasure: [
      "Nothicen oppbevarer skatten sin i en slitt trekiste som er skjult i en liten fordypning nederst i kløften, under den nordlige broen. Kisten kan ikke sees fra kanten av kløften, men er lett synlig for enhver karakter som klatrer ned i sprekken. Kisten inneholder:",
      "160 sp",
      "120 gp",
      "5 malakitt-edelstener (15 gp hver)",
      "2 potions of healing",
      "1 spell scroll of augury",
      "Kisten inneholder også et +1 longsword i en slire dekorert med sølv. Sverdet er inngravert med navnet “Talon”, og håndtaket er formet som en rovfugl med utspente vinger. Det tilhørte en gang en stor ridder ved navn Aldith Tresendar, kjent som Den svarte hauken. En karakter som lykkes på en Intelligence (History)-sjekk, DC 15, gjenkjenner sverdet og husker denne historien. Sir Aldith døde mens han forsvarte herregården sin mot orker som angrep gjennom de skjulte hulene under eiendommen. Talon gikk tapt her helt til nothicen fant det.",
    ],
    experience:
      "Del 450 XP likt mellom karakterene dersom gruppen beseirer nothicen eller forhandler frem en våpenhvile med den.",
    exits: [1, 7, 9, 10, 11],
  },
  {
    id: 9,
    name: "Vaktbrakke",
    x: 15,
    y: 83,
    description: (
      <>
        <p className="mb-4">
          En karakter som lytter ved døren og lykkes på en Visdom
          (Perception)-sjekk, DC 10, hører flere grove stemmer som gir
          nedverdigende ordre på goblinspråket. Eksempler kan være «Slikk
          gulvet!» og «Rull rundt som en hund!». Bugbearene her plager
          goblinslaven sin.
        </p>

        <Description>
          <p className="mb-2">
            Denne brakken inneholder fire grovt bygde tresenger, med hauger av
            tepper og skitne tallerkener spredt rundt. En sterk lukt av uvaskede
            kropper og råttent kjøtt fyller luften.
          </p>
          <p>
            Tre høye, hårete humanoider slenger seg blant rotet og bjeffer ordre
            til en stakkars liten goblin som ydmyker seg for underholdningen
            deres. Den plutselige ankomsten til gruppen får goblinen til å
            besvime.
          </p>
        </Description>

        <p className="mb-2">
          Tre <strong>bugbears</strong> og én <strong>goblin</strong> er til
          stede her. Goblinen, <strong>Droop</strong>, faller bevisstløs om ved
          synet av gruppen, men en annen skapning kan bruke en handling på å
          vekke ham. Ellers forblir Droop bevisstløs i{" "}
          <strong>1d10 minutter</strong>.
        </p>

        <p className="mb-2">
          Bugbearene arbeider for <strong>Den svarte edderkoppen</strong> og ble
          sendt hit for å hjelpe Iarno med å holde både Redbrands og innbyggerne
          i Phandalin i sjakk. Lederen heter <strong>Mosk</strong>. Han bærer en
          øyelapp besatt med smykkesteiner, selv om han har begge øynene sine.
          Mosk bruker øyelappen fordi han synes den ser fin ut.
        </p>

        <p className="mb-2">
          Bugbearene unngår de menneskelige medlemmene av Redbrands. Hvis
          karakterene har på seg skarlagensrøde kapper tatt fra andre steder,
          antar bugbearene at de tjener Iarno. Nakne bedragere kan til og med
          overtale bugbearene til å hjelpe med å håndtere «forrædere» eller
          «bedragere» andre steder i skjulestedet. Hvis du vil støtte dette med
          en sjekk, kan karakteren som gjør mesteparten av snakkingen gjøre en
          <strong> Karisma (Deception)-sjekk, DC 15</strong>, for å overbevise
          bugbearene om å gjøre det gruppen ønsker.
        </p>
      </>
    ),
    monsters: [
      { name: "Bugbear", count: 3, notes: "Lederen er Mosk." },
      {
        name: "Goblin",
        count: 1,
        notes:
          "Droop er ingen reell trussel og besvimer straks gruppen dukker opp.",
      },
    ],
    captives: (
      <>
        <p className="mb-2">
          Goblinen <strong>Droop</strong> er ingen trussel mot gruppen. Han er
          blitt kuet av bugbearene og følger ordrene deres helt til noen
          sterkere tar kontroll.
        </p>

        <p className="mb-2">
          Hvis han våkner under kamp, gjemmer Droop seg og prøver å unngå
          striden. Han er så feig at dersom han blir beordret til å kjempe, gjør
          han det med <strong>ulempe (disadvantage)</strong>.
        </p>

        <p className="mb-2">
          Droop kjenner den generelle utformingen av Redbrands’ skjulested, samt
          plasseringen til hemmelige dører og feller. Han tenker ikke på å tilby
          informasjonen av seg selv, men hvis noen spør ham direkte, forteller
          han så mye han kan huske i et forsøk på å være nyttig. Noen detaljer
          kan være forvirrende eller feil blandet sammen — han er tross alt en
          goblin.
        </p>

        <p className="mb-2">
          Hvis bugbearene blir tatt av dage, forsøker Droop å gjøre seg nyttig
          for gruppen. Han husker ikke veien til Cragmaw Castle, men vet at det
          ligger langt mot nord, inne i skogen. Han vet også at gobliner fra
          Cragmaw patruljerer rundt Phandalin, og foreslår at karakterene
          kanskje kan fange en patrulje for å lære mer om slottet.
        </p>

        <p>
          Karakterene kan godt få lyst til å beholde Droop i følget en stund.
          Han fungerer best som en feig, men potensielt nyttig ledsager.
        </p>
      </>
    ),
    developments: (
      <>
        <p className="mb-2">
          Bugbearene er de eneste i Redbrands’ skjulested som kjenner
          plasseringen til <strong>Wave Echo Cave</strong>. De vil ikke
          frivillig røpe denne informasjonen, siden de frykter Den svarte
          edderkoppen mer enn de frykter karakterene.
        </p>

        <p className="mb-2">
          Bugbearene vet også hvor <strong>Cragmaw Castle</strong> ligger, men
          heller ikke denne informasjonen deler de villig. En karakter som
          forhører en tatt bugbear kan presse informasjonen ut av ham med en
          vellykket <strong>Karisma (Intimidation)-sjekk, DC 15</strong>.
        </p>
      </>
    ),
    treasure: [
      "Mosk bærer en beltepung med 33 sp.",
      "Han har også en øyelapp av svart lær besatt med halvedelstener verdt 50 gp.",
      "Mosk har en jernnøkkel som låser opp og låser alle dørene i Redbrands’ skjulested.",
    ],
    experience:
      "Del 600 XP likt mellom karakterene dersom gruppen beseirer bugbearene.",
    notes: [
      "Droop er mye mer interessant som sosial ressurs enn som kampmotstander.",
      "Scarlet cloaks kan gi gruppen en god mulighet til bedrag og rollespill her.",
      "Mosk bør føles litt komisk, men fortsatt farlig.",
    ],
    exits: [8, 10],
  },
  {
    id: 10,
    name: "Fellesrom",
    x: 15,
    y: 50,
    description: (
      <>
        <p className="mb-2">
          Dette området fungerer som hovedkvarter og møtested for Redbrands. Når
          det ikke pågår offisielle diskusjoner, brukes det også som et
          fellesrom hvor vaktene i skjulestedet kan slappe av når de ikke er på
          vakt.
        </p>

        <p className="mb-4">
          En karakter som lytter ved døren og lykkes på en Visdom
          (Perception)-sjekk, DC 10, hører skurkene innenfor opptatt med et
          spill knokebein. Dette lager en merkelig klaprende lyd, etterfulgt av
          rop, stønn og plutselig skravling idet veddemål blir utbetalt. Hvis
          karakterene stormer inn i rommet, overrasker de automatisk dem som er
          der inne.
        </p>

        <Description>
          <p className="mb-2">
            Flere slitte bord og stoler står spredt rundt i dette store rommet.
            Trebenker er trukket opp langs vegger dekorert med brune og røde
            draperier, og flere ølfat står lent opp og tappet.
          </p>
          <p>
            Fire hardbarkede menneskelige krigere iført skarlagensrøde kapper
            sitter samlet rundt et av bordene. En haug med mynter og små
            verdigjenstander ligger stablet på bordplaten mellom dem.
          </p>
        </Description>

        <p className="mb-2">
          Fire <strong>Redbrand-bøller</strong> drikker og spiller knokebein når
          karakterene kommer inn. Spillet er ikke langt unna å utvikle seg til
          en krangel, slik det ofte gjør. Terningene er rigget, og bøllen som
          eier dem er naturligvis den som vinner.
        </p>

        <p className="mb-2">
          Alle fire har drukket tungt og er{" "}
          <strong>forgiftet (poisoned)</strong>. Se Basic Rules for effektene av
          tilstanden poisoned.
        </p>

        <p>
          Redbrands gjenkjenner umiddelbart karakterer som bærer skarlagensrøde
          kapper som bedragere. Men raske karakterer kan likevel klare å utgi
          seg for å være «nye rekrutter», særlig hvis de tilbyr seg å bli med i
          spillet. Hvis du vil støtte dette med en sjekk, kan karakteren som
          gjør mesteparten av snakkingen gjøre en{" "}
          <strong>Karisma (Deception)-sjekk, DC 10</strong> for å lure
          Redbrands.
        </p>
      </>
    ),
    monsters: [
      {
        name: "Redbrand Ruffian",
        count: 4,
        notes: "Alle fire er beruset og poisoned når kampen starter.",
      },
    ],
    treasure: [
      "75 cp",
      "55 sp",
      "22 ep",
      "15 gp",
      "En gullørering besatt med en liten rubin verdt 30 gp",
    ],
    experience:
      "Del 400 XP likt mellom karakterene dersom gruppen beseirer Redbrands i dette rommet.",
    notes: [
      "Hvis gruppen stormer inn, overrasker de automatisk rommets beboere.",
      "Bordet med mynter og smågjenstander kan brukes som distraksjon dersom det veltes.",
      "Dette rommet egner seg godt til sosial infiltrasjon hvis gruppen bruker Redbrand-kapper.",
    ],
    exits: [8, 9, 11],
  },
  {
    id: 11,
    name: "Trollmannens verksted",
    x: 15,
    y: 26,
    description: (
      <>
        <p className="mb-4">
          Svake boblende og dryppende lyder kan høres gjennom begge dørene til
          dette rommet med en vellykket{" "}
          <strong>Visdom (Perception)-sjekk, DC 15</strong>.
        </p>

        <Description>
          <p className="mb-2">
            Dette rommet ser ut til å være et verksted for en trollmann. En
            rotte piler over gulvet og søker tilflukt under et stort arbeidsbord
            fylt med alembiker, retorter, destillasjonsspiraler og andre
            alkymistiske apparater, alt sammen i ferd med å småkoke og boble.
          </p>
          <p>Bokhyllene er overfylte av pergamentruller og merkelige bøker.</p>
        </Description>

        <p className="mb-2">
          Iarno har etterlatt sin <strong>rotte familiar</strong> her for å
          holde utkikk etter inntrengere. Rotten deler en telepatisk forbindelse
          med mesteren sin og sender en kort advarsel til Iarno så snart den
          oppdager uvedkommende.
        </p>

        <p className="mb-2">
          Rotten har en bevegelseshastighet på <strong>20 feet</strong>,
          <strong> AC 10</strong>, <strong>1 hit point</strong>, og ingen
          effektive angrep. Hvis rotten blir drept, forsvinner den.
        </p>

        <p className="mb-2">
          Hvis karakterene lar rotten være uskadd, følger den etter dem som om
          den er nysgjerrig eller sulten. Den kan til og med late som den liker
          en karakter som mater den, men den forblir fullstendig lojal mot
          Iarno.
        </p>

        <p className="mb-2">
          <strong>Bøker og notater.</strong> Iarno forsøker å mestre kunsten å
          brygge miksturer og lage alkymistiske blandinger. Bøkene og notatene
          som ligger spredt rundt i rommet er grunnleggende tekster om alkymi.
          Enhver karakter med ferdighet i <strong>Arcana</strong> kan se at
          apparatet ser ut til å være satt opp for å brygge{" "}
          <strong>potions of invisibility</strong> — selv om han ikke har lykkes
          så langt.
        </p>

        <p>
          Blant bøkene finnes en bok skrevet på <strong>dvergspråk</strong>. Det
          er dagboken til en eventyrer ved navn <strong>Urmon</strong>, og den
          beskriver historien til <strong>The Lost Mine of Phandelver</strong>{" "}
          og
          <strong> The Forge of Spells</strong>. I tillegg nevner Urmon at en
          magisk stridsklubbe ved navn <strong>Lightbringer</strong> ble bestilt
          av prester viet til <strong>Lathander</strong>, morgengryets gud, fra
          magikerne som arbeidet sammen med gnomene og dvergene i
          <strong> Phandelver’s Pact</strong>. Klubben gikk tapt da Wave Echo
          Cave og gruven forsvant fra historien.
        </p>
      </>
    ),
    developments: (
      <>
        <p>
          Fordi Iarno og rotte-familiaren hans deler en telepatisk forbindelse,
          vet magikeren i <strong>område 12</strong> at karakterene er på vei og
          får tid til å forberede seg.
        </p>
      </>
    ),
    treasure: [
      "De fleste materialene i rommet har ingen verdi.",
      "Tre små flasker inneholder sjeldne reagenser: kvikksølv, dragegalle og pulverisert belladonna.",
      "Hver av disse er verdt 25 gp for en apoteker eller alkymist.",
    ],
    notes: [
      "Rotten er først og fremst et varslingssystem, ikke en kampmotstander.",
      "Dagboken til Urmon er en fin måte å gi gruppen lore om Wave Echo Cave og Forge of Spells.",
      "Lightbringer kan nevnes her som et tydelig framtidig spor.",
    ],
    exits: [8, 10, 12],
  },
  {
    id: 12,
    name: "Glasstaffs kvarter",
    x: 25,
    y: 21,
    description: (
      <>
        <p className="mb-4">
          Hvis karakterene nærmer seg dette rommet gjennom den hemmelige
          passasjen fra område 7, kan de overraske lederen for Redbrands —
          <strong> Iarno “Glasstaff” Albrek</strong>. Ellers varsler
          rotte-familiaren hans ham om alle som nærmer seg gjennom område 11, og
          han flykter før karakterene rekker frem.
        </p>

        <Description>
          Veggene i dette soveværelset er dekket av draperier i skarlagensrødt
          stoff. Innredningen består av et lite skrivebord med tilhørende stol,
          en komfortabel seng og en trekiste ved fotenden av sengen.
        </Description>

        <p className="mb-2">
          Hvis Iarno blir overrasket, kan du lese følgende:
        </p>

        <Description>
          Ved skrivebordet sitter en lav, mørkskjegget menneskemann i kapper og
          studerer en bok. Han bærer en fyrstelignende kappe av hermelin. En
          vakker glassstav lener seg mot stolen hans, lett innen rekkevidde.
        </Description>

        <p className="mb-2">
          Hvis rotten i område 11 advarer ham om at trøbbel er på vei, griper
          Iarno sin <strong>staff of defense</strong> og skriftrullene i kisten
          sin (se <strong>Skatt</strong>) og flykter gjennom den hemmelige døren
          i det nordøstlige hjørnet av rommet. I hastverket etterlater han et
          brev fra <strong>Den svarte edderkoppen</strong> (se{" "}
          <strong>Utvikling</strong>) og forsømmer å lukke den hemmelige døren
          helt. Karakterer får
          <strong> fordel</strong> på evnesjekker for å finne den halvåpne
          døren.
        </p>

        <p className="mb-2">
          Hvis han klarer å rømme, flykter Iarno til område 1 via område 7 og
          område 8 for å hente vesken som er skjult i sisternen der. Hvis
          <strong> nothicen</strong> fortsatt lever i område 8, beordrer han den
          til å sinke eventuelle forfølgere. Hvis karakterene tar ham igjen,
          drikker Iarno <strong>potion of invisibility</strong> fra vesken og
          flykter fra skjulestedet. Etter ditt skjønn kan han dukke opp senere i
          eventyret.
        </p>

        <p className="mb-2">
          <strong>Rollespill av Iarno.</strong> Iarno er et tidligere medlem av
          <strong> Lords’ Alliance</strong> som grep muligheten i Phandalin til
          å fylle egne lommer. Han ble opprinnelig sendt for å opprette en slags
          ordensmakt i byen, men samlet i stedet en gruppe fredløse og lokale
          bøller for å sikre sin egen maktposisjon.
        </p>

        <p className="mb-2">
          Iarno kjente til Den svarte edderkoppen gjennom kontaktene sine i
          Lords’ Alliance og fikk arrangert et møte. Drowen lovet å dele
          hemmelighetene og rikdommene fra <strong>Forge of Spells</strong> med
          trollmannen i bytte mot hjelp og lojalitet.
        </p>

        <p className="mb-2">
          Iarno opptrer høflig og fornemt, tiltaler bøllene sine som
          <em> “mine gode herrer”</em>, og omtaler skitne handlinger som
          kidnapping eller ildspåsettelse som{" "}
          <em>“den ubehagelige lille saken”</em>
          eller <em>“de beklagelige hendelsene”</em>. Han omtaler karakterene
          som
          <em> “gjester”</em> og uttrykker beklagelse over at han ikke kan tilby
          passende underholdning under besøket deres. Bak den høflige fasaden er
          han imidlertid like brutal og arrogant som enhver annen Redbrand.
        </p>

        <p className="mb-2">
          Hvis han blir truet, bruker Iarno <strong>staff of defense</strong>{" "}
          til å kaste <strong>mage armor</strong> på seg selv. Deretter kaster
          han offensive formularer mot fiender han kan se. Han bruker også
          stavens
          <strong>shield</strong>-kraft for ekstra beskyttelse.
        </p>

        <p>
          Hvis han blir redusert til <strong>8 hit points eller færre</strong>{" "}
          og ikke har noen fluktmulighet, overgir Iarno seg. Han verdsetter sitt
          eget liv over alt annet og oppfører seg som en mønsterfange i håp om
          at Den svarte edderkoppen på en eller annen måte får vite om
          situasjonen og “ordner friheten hans”.
        </p>
      </>
    ),
    developments: (
      <>
        <p className="mb-2">
          Hvis Iarno blir avhørt mens han er i fangenskap, kan han opplyse om
          følgende, og alt er sant:
        </p>

        <ul className="mb-2 list-disc pl-5">
          <li>Den svarte edderkoppen er en drow (mørkalv).</li>
          <li>
            Den svarte edderkoppen sendte tre bugbears for å hjelpe Iarno med å
            holde befolkningen i Phandalin under kontroll, men Redbrands har
            klart seg uten dem.
          </li>
          <li>
            Bugbearene kjenner veien til Wave Echo Cave, men det gjør ikke
            Iarno.
          </li>
          <li>
            Den svarte edderkoppen leter etter Forge of Spells i Wave Echo Cave.
          </li>
          <li>
            Dverger og gnomer i Phandelver’s Pact brukte den magiske smia til å
            lage kraftige magiske gjenstander.
          </li>
          <li>
            Ingen andre medlemmer av Lords’ Alliance kjenner til Iarnos svik.
          </li>
        </ul>

        <p className="mb-2">
          Flere papirer og notater ligger pent stablet på skrivebordet,
          hovedsakelig bestillinger Iarno har skrevet til apotekere og
          alkymister i nærliggende bosetninger for å få tak i flere materialer
          til verkstedet sitt. Karakterene finner også et brev signert med
          symbolet til Den svarte edderkoppen:
        </p>

        <Description>
          <p className="mb-2">Lord Albrek,</p>
          <p className="mb-2">
            Spionene mine i Neverwinter forteller meg at fremmede snart vil
            ankomme Phandalin. De kan arbeide for dvergene. Fang dem hvis du
            kan, drep dem hvis du må, men ikke la dem ødelegge planene våre.
            Sørg for at alle dvergkart de måtte ha i sin besittelse blir levert
            til meg snarest mulig. Jeg stoler på deg, Iarno. Ikke skuff meg.
          </p>
        </Description>

        <p>
          Hvis Iarno blir tatt til fange, sørger{" "}
          <strong>Sildar Hallwinter</strong>
          for at trollmannen blir fengslet i townmaster’s hall til han trygt kan
          fraktes tilbake til Neverwinter. Om Iarno senere stilles for retten
          ligger utenfor dette eventyrets omfang. Den svarte edderkoppen er for
          opptatt til å blande seg inn i trollmannens skjebne.
        </p>
      </>
    ),
    treasure: [
      "Ved fotenden av sengen står en solid, ulåst trekiste med de beste byttene Redbrands har samlet de siste to månedene.",
      "Kisten inneholder 180 sp.",
      "Kisten inneholder 130 gp.",
      "En silkepung med fem karneoler (10 gp hver), to peridoter (15 gp hver) og én perle (100 gp).",
      "To magiske skriftruller som Iarno tok med seg fra Neverwinter: en scroll of charm person og en scroll of fireball.",
      "Iarno bærer også en staff of defense.",
    ],
    notes: [
      "Hvis gruppen kommer gjennom hemmelig passasje fra område 7, kan de overraske Iarno.",
      "Hvis rotten i område 11 får varslet ham, er han allerede på vei ut når gruppen ankommer.",
      "Den hemmelige døren i rommet står litt på gløtt dersom Iarno flykter i hast.",
      "Iarno er mer nyttig levende enn død hvis gruppen vil ha informasjon.",
      "Han bør spilles som høflig, arrogant og selvhøytidelig.",
    ],
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen dreper Iarno Albrek. Dobbel XP-belønningen dersom de fanger Iarno og overleverer ham til Sildar Hallwinter i Phandalin.",
    exits: [7, 11],
  },
];

const waveEchoRooms: RoomData[] = [
  {
    id: 1,
    name: "Huleinngangen",
    x: 23,
    y: 76,
    description: (
      <>
        <p className="mb-4">
          Enten karakterene følger Gundrens kart eller får veibeskrivelse til
          Wave Echo Cave fra en annen kilde, vil deres første tilnærming føre
          dem til en smal tunnel med inngang skjult i foten av Sword Mountains.
        </p>
        <Description>
          <p className="mb-2">
            Inngangstunnelen leder inn i en stor grotte, støttet av en naturlig
            steinsøyle og med tre stalagmitter som reiser seg fra gulvet. I den
            vestlige delen av hulen, bak steinsøylen, ligger tre soveposer og en
            haug med vanlige forsyninger — sekker med mel, poser med salt,
            tønner med saltet kjøtt, lanterner, flasker med lampeolje, hakker,
            spader og annet utstyr. Blant forsyningene ser dere kroppen til en
            dverggruvearbeider, død i minst en uke.
          </p>
          <p>
            Den nordøstlige delen av grotten har rast sammen og danner en grop
            som er omtrent tre meter bred og seks meter dyp. Et solid hampetau
            er bundet fast rundt en stalagmitt i nærheten og henger ned langs
            siden av gropen. På bunnen av gropen fører en grovt uthugget tunnel
            videre mot nordvest og øst.
          </p>
        </Description>
        <p className="mb-2">
          Dette var leirplassen til Rockseeker-brødrene. Den døde dvergen er
          Tharden, Gundrens bror, som ble drept av Den svarte edderkoppen.
          Gundrens andre bror, Nundro, var også her og er nå fange hos Den
          svarte edderkoppen i område 20.
        </p>
        <p className="mb-2">
          Dvergenes forsyninger kan være nyttige, men de er ikke spesielt
          verdifulle.
        </p>
        <p className="mb-2">
          <strong>Åpen grop.</strong> Å klatre opp eller ned veggen i gropen
          uten tau krever en vellykket Styrke (Athletics)-sjekk, DC 15. En
          karakter som mislykkes med sjekken med 5 eller mer, faller ned og tar
          1d6 knusningsskade per 3 meter fall, og lander liggende nederst i
          gropen. Tunnelen på bunnen av gropen leder mot nordvest til område 2
          og mot øst til område 3.
        </p>
      </>
    ),
    treasure: [
      "Tharden bærer et par Boots of Striding and Springing. I sin hast med å utforske resten av Wave Echo Cave overså Nezznar dem.",
    ],
    exits: [2, 3],
  },
  {
    id: 2,
    name: "Gruvetunneler",
    x: 25,
    y: 60,
    description: (
      <>
        <p className="mb-4">
          Dette nettverket av ganger er en gammel del av det opprinnelige
          gruveområdet i Wave Echo Cave.
        </p>

        <Description>
          Området består av en rekke kryssende tunneler. Taket her er bare rundt
          to meter høyt, og flere av gangene ender i delvis uthugde bergvegger.
        </Description>

        <p>
          Blindgangene er steder hvor gruvearbeiderne ga opp utgravingen og
          bestemte seg for å lete videre andre steder. I en av disse lurer en
          okergelé (ochre jelly). Når gruppen kommer inn i denne delen av
          gruven, begynner gelen å snike seg etter dem og venter instinktivt på
          en mulighet til å angripe et enslig mål.
        </p>
      </>
    ),
    monsters: [{ name: "Ochre jelly", count: 1 }],
    exits: [1, 3, 6, 9, 10],
  },
  {
    id: 3,
    name: "Storeroom",
    x: 50,
    y: 76,
    description:
      "Broken crates, torn sacks, and ruined mining supplies are scattered here. Most useful contents were taken long ago.",
    treasure: ["Possibly a few salvageable tools or minor supplies"],
    exits: [2],
  },
  {
    id: 4,
    name: "Old Guard Room",
    x: 42,
    y: 84,
    readAloud:
      "Dusty pallets, broken stools, and old weapon racks fill this chamber. Though most of the room is in disrepair, there are signs of recent occupation.",
    description:
      "This room appears to have once housed guards or workers. The old furniture is decayed, but tracks and disturbed dust suggest that creatures have used the area recently.",
    monsters: [
      {
        name: "Ghoul",
        count: 3,
        notes: "They attack living creatures immediately.",
      },
    ],
    notes: [
      "This room works well as an early tension-building encounter.",
      "You can describe claw marks, old bones, or the smell of decay before combat begins.",
    ],
    exits: [2, 5],
  },
  {
    id: 5,
    name: "Collapsed Chamber",
    x: 61,
    y: 82,
    description:
      "A portion of the ceiling has fallen here, leaving a heap of broken stone and debris. Movement through parts of the room is difficult.",
    notes: ["Good place for a hazard, tracks, or environmental storytelling."],
    exits: [4, 6],
  },
  {
    id: 6,
    name: "Temple Ruins",
    x: 50,
    y: 62,
    description:
      "Ancient stonework and cracked decorative features suggest this was once a place of significance within the mine.",
    notes: ["Good place for lore, inscriptions, or magical residue."],
    exits: [5, 7],
  },
  {
    id: 7,
    name: "The Forge of Spells",
    x: 65,
    y: 62,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [6],
  },
  {
    id: 8,
    name: "The Forge of Spells",
    x: 74,
    y: 68,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [3, 13],
  },
  {
    id: 9,
    name: "The Forge of Spells",
    x: 53,
    y: 50,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [7, 11, 12],
  },
  {
    id: 10,
    name: "The Forge of Spells",
    x: 16,
    y: 30,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [2, 11, 18],
  },
  {
    id: 11,
    name: "The Forge of Spells",
    x: 34,
    y: 31,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [10, 12, 18],
  },
  {
    id: 12,
    name: "The Forge of Spells",
    x: 63,
    y: 35,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 13,
    name: "The Forge of Spells",
    x: 82,
    y: 51,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 14,
    name: "The Forge of Spells",
    x: 89,
    y: 54,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 15,
    name: "The Forge of Spells",
    x: 87,
    y: 43,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 16,
    name: "The Forge of Spells",
    x: 77,
    y: 18,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 17,
    name: "The Forge of Spells",
    x: 49,
    y: 10,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 18,
    name: "The Forge of Spells",
    x: 36,
    y: 21,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 19,
    name: "The Forge of Spells",
    x: 13,
    y: 13,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
  {
    id: 20,
    name: "The Forge of Spells",
    x: 23,
    y: 9,
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here, and the forge radiates the faded remains of ancient dwarven magic.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment, though its power is now unstable and diminished.",
    notes: [
      "This is one of the most important rooms in the dungeon.",
      "Use strong sensory description: green light, humming energy, heatless glow.",
    ],
    exits: [9, 11, 15, 18],
  },
];

const maps: MapHandout[] = [
  { title: "Cragmaw Hideout", src: map1, rooms: [] },
  { title: "Phandalin", src: map2, rooms: [] },
  { title: "Cragmaw Castle", src: map3, rooms: [] },
  { title: "Redbrand Hideout", src: map4, rooms: redbrandHideoutRooms },
  { title: "Thundertree", src: map5, rooms: [] },
  { title: "Wave Echo Cave", src: map6, rooms: waveEchoRooms },
];

const drawings: HandoutImage[] = [
  { title: "Drawing 1", src: drawing1 },
  { title: "Drawing 2", src: drawing2 },
  { title: "Drawing 3", src: drawing3 },
  { title: "Drawing 4", src: drawing4 },
  { title: "Drawing 5", src: drawing5 },
];

const letters: HandoutImage[] = [
  { title: "Letter 1", src: letter1 },
  { title: "Letter 2", src: letter2 },
];

const Handouts = () => {
  const [selectedMap, setSelectedMap] = useState<MapHandout | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const [selectedImage, setSelectedImage] = useState<HandoutImage | null>(null);

  const [zoom, setZoom] = useState(1);

  const selectedRoom = useMemo(() => {
    if (!selectedMap?.rooms?.length || selectedRoomId === null) return null;
    return selectedMap.rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [selectedMap, selectedRoomId]);

  const openMap = (map: MapHandout) => {
    setSelectedMap(map);
    setZoom(1);
    setSelectedRoomId(map.rooms?.[0]?.id ?? null);
  };

  const closeMap = () => {
    setSelectedMap(null);
    setSelectedRoomId(null);
    setZoom(1);
  };

  const openImage = (image: HandoutImage) => {
    setSelectedImage(image);
    setZoom(1);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 4));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const hasOpenViewer = selectedMap || selectedImage;
      if (!hasOpenViewer) return;

      if (e.key === "Escape") {
        if (selectedMap) closeMap();
        if (selectedImage) closeImage();
      }

      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMap, selectedImage]);

  return (
    <Container>
      <H1>Handouts</H1>

      <H2>Maps</H2>
      <div className="flex gap-2 flex-wrap">
        {maps.map((map) => (
          <div key={map.title}>
            <H4>{map.title}</H4>
            <button
              type="button"
              onClick={() => openMap(map)}
              className="block cursor-pointer"
            >
              <img
                className="w-40 aspect-square object-cover rounded hover:opacity-90 transition"
                src={map.src}
                alt={map.title}
              />
            </button>
          </div>
        ))}
      </div>

      <H2>Items</H2>

      <H2>Drawings</H2>
      <div className="flex gap-2 flex-wrap">
        {drawings.map((drawing) => (
          <button
            key={drawing.title}
            type="button"
            onClick={() => openImage(drawing)}
            className="block cursor-pointer"
          >
            <img
              className="w-40 rounded hover:opacity-90 transition"
              src={drawing.src}
              alt={drawing.title}
            />
          </button>
        ))}
      </div>

      <H2>Letters</H2>
      <div className="flex gap-2 flex-wrap">
        {letters.map((letter) => (
          <button
            key={letter.title}
            type="button"
            onClick={() => openImage(letter)}
            className="block cursor-pointer"
          >
            <img
              className="w-40 rounded hover:opacity-90 transition"
              src={letter.src}
              alt={letter.title}
            />
          </button>
        ))}
      </div>

      {selectedMap && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 md:p-6">
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-zinc-950 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <div className="text-lg font-semibold">{selectedMap.title}</div>
                <div className="text-sm text-white/60">
                  Click a numbered room marker to show its details.
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={zoomOut}
                  className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={resetZoom}
                  className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={closeMap}
                  className="rounded bg-red-500 px-3 py-1 hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_600px]">
              <div className="min-h-0 overflow-auto bg-zinc-900 p-4">
                <div
                  className="inline-block origin-top-left"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <div className="relative inline-block">
                    <img
                      src={selectedMap.src}
                      alt={selectedMap.title}
                      className="block max-w-none select-none rounded"
                      draggable={false}
                    />

                    {selectedMap.rooms?.map((room) => {
                      const isSelected = selectedRoomId === room.id;

                      return (
                        <button
                          key={room.id}
                          type="button"
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold shadow-lg transition
                            ${
                              isSelected
                                ? "h-9 w-9 border-white bg-red-500 text-white"
                                : "h-8 w-8 border-red-500 bg-stone-100 text-red-600 hover:bg-white"
                            }`}
                          style={{
                            left: `${room.x}%`,
                            top: `${room.y}%`,
                          }}
                          title={`${room.id}. ${room.name}`}
                        >
                          {room.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <aside className="min-h-0 overflow-auto border-t border-white/10 bg-zinc-950 p-4 lg:border-l lg:border-t-0">
                {!selectedMap.rooms || selectedMap.rooms.length === 0 ? (
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">
                      No room data yet
                    </div>
                    <p className="text-sm text-white/70">
                      This map does not yet have interactive room markers and
                      notes.
                    </p>
                  </div>
                ) : !selectedRoom ? (
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">Select a room</div>
                    <p className="text-sm text-white/70">
                      Click one of the numbered markers on the map to view room
                      information.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-white/50">
                        Område {selectedRoom.id}
                      </div>
                      <h3 className="text-xl font-bold">{selectedRoom.name}</h3>
                    </div>

                    {selectedRoom.readAloud && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-yellow-300">
                          Read aloud
                        </div>
                        <p className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 p-3 text-sm leading-6 text-yellow-50">
                          {selectedRoom.readAloud}
                        </p>
                      </section>
                    )}

                    <section className="space-y-2 text-sm leading-6 text-white/75">
                      {selectedRoom.description}
                    </section>

                    {selectedRoom.captives && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Fanger
                        </div>
                        <div className="space-y-2 text-sm leading-6 text-white/75">
                          {selectedRoom.captives}
                        </div>
                      </section>
                    )}

                    {selectedRoom.monsters &&
                      selectedRoom.monsters.length > 0 && (
                        <section className="space-y-2">
                          <div className="text-sm font-semibold text-white/90">
                            Monstre
                          </div>
                          <div className="space-y-2">
                            {selectedRoom.monsters.map((monster, index) => (
                              <div
                                key={`${monster.name}-${index}`}
                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                              >
                                <div className="font-medium">
                                  {monster.count ? `${monster.count}x ` : ""}
                                  {monster.name}
                                </div>
                                {monster.notes && (
                                  <div className="mt-1 text-sm text-white/65">
                                    {monster.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                    {selectedRoom.developments && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Utvikling
                        </div>
                        <div className="space-y-2 text-sm leading-6 text-white/75">
                          {selectedRoom.developments}
                        </div>
                      </section>
                    )}

                    {selectedRoom.treasure &&
                      selectedRoom.treasure.length > 0 && (
                        <section className="space-y-2">
                          <div className="text-sm font-semibold text-white/90">
                            Skatter
                          </div>
                          <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                            {selectedRoom.treasure.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </section>
                      )}

                    {selectedRoom.experience && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Tildel Erfaringspoeng
                        </div>
                        <p className="text-sm leading-6 text-white/75">
                          {selectedRoom.experience}
                        </p>
                      </section>
                    )}

                    {selectedRoom.notes && selectedRoom.notes.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          DM-Notater
                        </div>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">
                          {selectedRoom.notes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {selectedRoom.exits && selectedRoom.exits.length > 0 && (
                      <section className="space-y-2">
                        <div className="text-sm font-semibold text-white/90">
                          Tilkoblede områder
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedRoom.exits.map((exitRoomId) => (
                            <button
                              key={exitRoomId}
                              type="button"
                              onClick={() => setSelectedRoomId(exitRoomId)}
                              className="rounded bg-white/10 px-3 py-1 text-sm hover:bg-white/20"
                            >
                              Område {exitRoomId}
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80"
          onClick={closeImage}
        >
          <div className="flex items-center justify-between bg-black/50 p-4 text-white">
            <div className="font-semibold">{selectedImage.title}</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomOut();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                -
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomIn();
                }}
                className="rounded bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                +
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeImage();
                }}
                className="rounded bg-red-500 px-3 py-1 hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>

          <div
            className="flex flex-1 items-start justify-center overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => {
              e.preventDefault();

              if (e.deltaY < 0) {
                setZoom((prev) => Math.min(prev + 0.1, 4));
              } else {
                setZoom((prev) => Math.max(prev - 0.1, 0.5));
              }
            }}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="h-auto max-w-none select-none"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Handouts;

import Description from "../../components/Description";
import type { RoomData } from "./types";

export const thundertreeRooms: RoomData[] = [
  {
    id: 1,
    name: "Vestlig hytte",
    markers: [{ x: 12, y: 31 }],
    description: (
      <>
        <p className="mb-4">Denne hytten har sett bedre dager.</p>

        <Description>
          I skyggen av et gammelt tre ligger en sammenrast steinhytte uten tak.
          Ugress og vill vegetasjon har tatt over området rundt ruinene.
        </Description>

        <p className="mb-2">
          To <strong>twig blights</strong> skjuler seg blant ugresset på hver
          side av den åpne inngangen til hytten. Gjør en{" "}
          <strong>Dexterity (Stealth)-sjekk</strong> for blightene og sammenlign
          resultatet med karakterenes{" "}
          <strong>passive Wisdom (Perception)</strong> for å avgjøre om de blir
          oppdaget.
        </p>

        <p>
          Blightene angriper ikke på egen hånd (med mindre de forsvarer seg),
          men de skynder seg til hjelp for twig blightene i område 2 dersom kamp
          bryter ut der.
        </p>
      </>
    ),
    monsters: [{ name: "Twig Blight", count: 2 }],
    experience:
      "Del 50 XP likt mellom karakterene dersom gruppen ødelegger twig blightene.",
    notes: [
      "Blightene ligger i bakhold blant ugresset ved inngangen.",
      "De angriper vanligvis bare dersom de blir provosert eller hvis kamp bryter ut i område 2.",
    ],
    encounterTemplate: {
      name: "Område 1 - Vestlig hytte",
      entities: [
        { entityKind: "monster", entityName: "Twig Blight", count: 2 },
      ],
    },
    exits: [2],
  },
  {
    id: 2,
    name: "Blighted hytter",
    markers: [{ x: 25, y: 45 }],
    description: (
      <>
        <p className="mb-4">
          Vind og vær har gjort sitt her, og lite er igjen av disse husene eller
          det som en gang fantes inni dem.
        </p>

        <Description>
          Disse to side om side liggende ruinene ser ut til en gang å ha vært
          hjemmene til velstående kjøpmenn eller bønder. Nå står bare
          sammenraste vegger og hauger av ruiner igjen. Flere unge trær har
          vokst opp midt i restene av bygningene.
        </Description>

        <p className="mb-2">
          Gjengroingen skjuler en dødelig trussel —{" "}
          <strong>seks twig blights</strong> som lurer blant det vanlige
          løvverket. Å oppdage dem krever en vellykket{" "}
          <strong>Wisdom (Perception)</strong>-sjekk mot blightenes{" "}
          <strong>Dexterity (Stealth)</strong>-sjekk.
        </p>

        <p>
          Disse plantemonstrene er sultne og kjemper til de blir ødelagt. Én
          runde etter at de angriper, slutter twig blightene i område 1 seg til
          kampen.
        </p>
      </>
    ),
    monsters: [{ name: "Twig Blight", count: 6 }],
    treasure: [
      "En grundig gjennomsøking av den østlige hytten og en vellykket Wisdom (Perception)-sjekk, DC 10, avslører en gammel kiste under heller og røtter fra treet som vokser gjennom huset.",
      "Kisten inneholder 700 cp.",
      "160 sp.",
      "90 gp.",
    ],
    experience:
      "Del 50 XP likt mellom karakterene dersom gruppen ødelegger disse twig blightene.",
    notes: [
      "Twig blightene ligger skjult blant vanlig vegetasjon.",
      "Én runde etter at kampen starter, kommer twig blightene fra område 1 til unnsetning.",
      "Østlige hytte inneholder den skjulte skattekisten.",
    ],
    encounterTemplate: {
      name: "Område 2 - Blighted hytter",
      entities: [
        { entityKind: "monster", entityName: "Twig Blight", count: 6 },
      ],
    },
    exits: [1],
  },
  {
    id: 3,
    name: "The Brown Horse",
    markers: [{ x: 32, y: 12 }],
    description: (
      <>
        <p className="mb-4">
          Dette var en gang <strong>The Brown Horse</strong>, et vertshus kjent
          for sitt utmerkede øl.
        </p>

        <Description>
          Et værslitt skilt ved døren til denne store bygningen viser et falmet
          bilde av en arbeidshest som holder en ølkrus. Bygningen henger skjevt
          og er i dårlig stand, men den er mer intakt enn ruinene på den andre
          siden av veien.
        </Description>

        <p className="mb-2">
          Fire <strong>ash zombies</strong> lurer i skyggene inne i bygningen,
          henslengt mot veggene eller under bardisken. Når levende skapninger
          går inn, stønner zombieene og begynner å røre på seg, før de langsomt
          reiser seg opp. De bruker halve bevegelsen sin på å komme seg på beina
          og forfølger deretter alle karakterer de kan se, og angriper til de
          blir ødelagt.
        </p>

        <p className="mb-2">
          Den østlige halvdelen av bygningen var tidligere fellesrommet, mens
          den vestlige delen huset kjøkkenet og bryggekarene. Store tretønner
          står mot vest, og en svak lukt av gjær henger fortsatt i luften. Ølet
          er for lengst borte.
        </p>

        <p>
          <strong>Ash Zombies.</strong> Disse zombieene ble skapt av den magiske
          ødeleggelsen da Mount Hotenow hadde utbrudd for tretti år siden. De
          bruker vanlig <strong>zombie</strong>-statblock, men har også
          egenskapen <strong>Ash Puff</strong>.
        </p>
      </>
    ),
    monsters: [{ name: "Ash Zombie", count: 4 }],
    notes: [
      "Zombieene starter liggende eller sammensunket i skyggene.",
      "De bruker halv bevegelse på å reise seg når levende skapninger kommer inn.",
      "Bruk vanlig Zombie-statblock med Ash Puff-egenskapen.",
    ],
    developments: (
      <>
        <p>
          <strong>Ash Puff.</strong> Første gang en ash zombie tar skade, må
          alle levende skapninger innen 5 fot lykkes på et{" "}
          <strong>Constitution saving throw, DC 10</strong>, ellers får de
          disadvantage på attack rolls, saving throws og ability checks i 1
          minutt. En påvirket skapning kan gjøre et nytt saving throw ved
          slutten av hver av sine turer for å avslutte effekten tidligere.
        </p>
      </>
    ),
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen ødelegger ash zombieene.",
    encounterTemplate: {
      name: "Område 3 - The Brown Horse",
      entities: [{ entityKind: "monster", entityName: "Ash Zombie", count: 4 }],
    },
    exits: [4],
  },
  {
    id: 4,
    name: "Druidens utkikkspost",
    markers: [{ x: 25, y: 69 }],
    description: (
      <>
        <p className="mb-4">
          Når <strong>Reidoth</strong> besøker Thundertree, er det her han slår
          leir.
        </p>

        <Description>
          Dette lille huset ser ut til å være i bedre stand enn de ødelagte og
          forfalne bygningene i nærheten. Dørene er forsterket med tunge
          jernbånd, og tykke skodder beskytter vinduene.
        </Description>

        <p className="mb-2">
          Reidoth er en mager, hvitskjegget mann som ikke bruker to ord når ett
          holder. Selv om han får svært få besøk, er han rimelig gjestfri.
        </p>

        <p className="mb-2">
          Reidoth er dyktig til å holde seg unna ash zombies som har overtatt
          landsbyen, og til å unngå de muterte plantene i området. Han vet at
          farlige edderkopper skjuler seg i ruinene ved foten av høyden, og han
          mistenker at noen holder seg skjult på østsiden av byen — han har sett
          «folk i svarte masker og kapper» (kultistene) luske rundt.
        </p>

        <p>
          Det som bekymrer ham mest akkurat nå, er at en{" "}
          <strong>grønn drage</strong> har flyttet inn i tårnet i område 7 siden
          forrige gang han var her. Han advarer karakterene om alle disse
          truslene og foreslår at de forlater Thundertree før de blir drept.
        </p>
      </>
    ),
    developments: (
      <>
        <p className="mb-2">
          Hvis karakterene spør om <strong>Cragmaw Castle</strong>, gir Reidoth
          gladelig veibeskrivelse. Han er medlem av{" "}
          <strong>Emerald Enclave</strong>, en vidtrekkende gruppe av
          villmarksfolk som forsøker å bevare naturens orden og fjerne farlige
          trusler som forstyrrer balansen.
        </p>

        <p className="mb-2">
          Hvis karakterene spør Reidoth om <strong>Wave Echo Cave</strong>, vil
          han ikke avsløre plasseringen direkte, men han tilbyr seg å guide
          gruppen dit i bytte mot en tjeneste: han vil at de skal jage bort
          dragen i område 7. Hvis de lykkes, holder Reidoth sin del av avtalen,
          men han blir ikke med inn i gruven.
        </p>

        <p className="mb-2">
          Hvis karakterene angriper ham av en eller annen grunn, forvandler
          Reidoth seg til et <strong>grått ekorn</strong> og smetter ut av huset
          gjennom en sprekk i veggen. Han forsvinner inn i skogen og venter til
          de fiendtlige karakterene har dratt. Utkikksposten hans inneholder
          ingenting av verdi.
        </p>

        <p>
          <strong>Å bli med i Emerald Enclave.</strong> Hvis gruppen hjelper
          Reidoth ved å jage bort <strong>Venomfang</strong>, kan han i det
          skjulte oppsøke enkelte medlemmer av gruppen og oppfordre dem til å
          slutte seg til Emerald Enclave. Han snakker først og fremst med dem
          som viser et oppriktig ønske om å beskytte naturens orden. Hvis en
          karakter godtar, gir Reidoth vedkommende tittelen{" "}
          <strong>Springwarden</strong>.
        </p>
      </>
    ),
    notes: [
      "Reidoth er en viktig informasjonskilde i Thundertree.",
      "Han kjenner til kultistene, edderkoppene, ash zombies og Venomfang.",
      "Han kan gi veien til Cragmaw Castle direkte.",
      "Han kan føre gruppen til Wave Echo Cave hvis de jager bort dragen.",
      "Han er medlem av Emerald Enclave og kan rekruttere passende karakterer.",
    ],
    exits: [3, 7],
  },
  {
    id: 5,
    name: "Blighted gårdshus",
    markers: [{ x: 38.5, y: 83.5 }],
    description: (
      <>
        <p className="mb-4">
          Sør for denne gården ligger et jorde med tette felt av tornkratt og
          buskas.
        </p>

        <Description>
          Denne ruinen ser ut til en gang å ha vært et gårdshus. Nå er den
          halvveis oppslukt av tett vegetasjon, med trær som vokser opp gjennom
          de ødelagte grunnmurene. Veien fortsetter litt sørover forbi ruinene
          før den ender ved et gjengrodd jorde.
        </Description>

        <p>
          Krattet øst for denne ruinen kryr av{" "}
          <strong>åtte twig blights</strong>. Enhver forstyrrelse inne i det
          ødelagte gårdshuset, for eksempel at karakterene roter rundt i
          ruinene, vekker blightenes vrede.
        </p>

        <p>
          Hver runde i <strong>3 runder</strong> beveger to twig blights seg mot
          den sørlige døråpningen inn til gårdshuset, mens to andre beveger seg
          mot den nordlige døråpningen. Blightene angriper til de blir ødelagt.
        </p>
      </>
    ),
    monsters: [{ name: "Twig Blight", count: 8 }],
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen ødelegger twig blightene.",
    notes: [
      "Twig blightene kommer i bølger over 3 runder.",
      "Hver runde kommer 2 mot sørinngangen og 2 mot nordinngangen.",
      "De aktiveres når ruinene blir forstyrret.",
    ],
    encounterTemplate: {
      name: "Område 5 - Blighted gårdshus",
      entities: [
        { entityKind: "monster", entityName: "Twig Blight", count: 8 },
      ],
    },
    exits: [],
  },
  {
    id: 6,
    name: "Ødelagt butikk",
    markers: [{ x: 55, y: 64 }],
    description: (
      <>
        <p className="mb-4">
          Denne tidligere landhandelen er ikke helt ruinert ennå, og deler av
          det teglbelagte taket står fortsatt.
        </p>

        <Description>
          Ved et veikryss nær midten av landsbyen slynger en smal vei seg opp
          den bratte åssiden mot nord. Rett sør ligger en ødelagt bygning som
          ser ut til å ha vært en butikk eller et verksted. Nett strekker seg
          over veien, fra bygningen til trærne på nordsiden av veien.
        </Description>

        <p className="mb-2">
          To <strong>giant spiders</strong> skjuler seg på innsiden av veggene i
          denne ruinbygningen, og kan derfor ikke sees utenfra. Føletråder fra
          nettene i veien gjør at edderkoppene merker når bytte beveger seg i
          nettet, og da klatrer de raskt over veggen og angriper.
        </p>

        <p className="mb-2">
          De varslede edderkoppene overrasker enhver karakter hvis{" "}
          <strong>passive Wisdom (Perception)</strong>-score er lavere enn{" "}
          <strong>17</strong>.
        </p>

        <p className="mb-2">
          <strong>Nett.</strong> Nettene fyller to ruter nord for døråpningen
          (og ruten markert med «6»). De regnes som{" "}
          <strong>difficult terrain</strong>, og en skapning som forsøker å
          bevege seg gjennom dem må lykkes på en{" "}
          <strong>Strength (Athletics)-sjekk, DC 10</strong>. Ved feil blir
          skapningen <strong>restrained</strong> i nettene.
        </p>

        <p className="mb-2">
          En skapning som sitter fast kan bruke en handling hver runde for å
          prøve å komme seg fri med en <strong>Strength-sjekk, DC 12</strong>,
          eller prøve å skjære seg løs med et lett våpen som gir{" "}
          <strong>slashing damage</strong>.
        </p>

        <p className="mb-2">
          Nettene har <strong>AC 10</strong>, <strong>5 hit points</strong>,
          <strong> vulnerability to fire damage</strong>, og{" "}
          <strong>immunity to bludgeoning, poison, and psychic damage</strong>.
        </p>

        <p>
          Det er vanskelig å komme rundt nettene på grunn av tornekrattet på
          nordsiden av veien. Å gå rundt ruinbygningen mot sør leder til twig
          blightene i område 5.
        </p>
      </>
    ),
    monsters: [{ name: "Giant Spider", count: 2 }],
    treasure: [
      "I den vestlige delen av bygningen henger liket av en uheldig eventyrer innspunnet i edderkoppsilke.",
      "Kroppen er inntørket og tømt for væske, men ser ut til å ha tilhørt en mannlig alv.",
      "Liket bærer studded leather armor.",
      "Et shortsword i slire henger ved hoften.",
      "Et nøye søk avdekker også en potion of healing i en beltepung.",
      "23 gp.",
      "35 sp.",
    ],
    experience:
      "Del 400 XP likt mellom karakterene dersom gruppen beseirer giant spiders.",
    notes: [
      "Edderkoppene ligger i bakhold og reagerer når noen går inn i nettene.",
      "Karakterer med passive Perception under 17 blir overrasket.",
      "Nett kan lett brennes bort, men er ellers vanskelige å passere.",
      "Å gå rundt sør leder mot twig blightene i område 5.",
    ],
    encounterTemplate: {
      name: "Område 6 - Ødelagt butikk",
      entities: [
        { entityKind: "monster", entityName: "Giant Spider", count: 2 },
      ],
    },
    exits: [5, 7],
  },
  {
    id: 7,
    name: "Dragens tårn",
    markers: [{ x: 51.5, y: 12 }],
    description: (
      <>
        <p className="mb-4">
          Dette tårnet var tidligere hjemmet til en menneskelig trollmann som
          ble drept da han kjempet mot ash zombies som overrant Thundertree for
          tretti år siden.
        </p>

        <Description>
          På toppen av høyden står et rundt tårn med en liten hytte festet til
          siden. Begge er i god stand, selv om halvparten av taket på tårnet
          mangler. En dør leder inn i hytten, og flere pilespaltevinduer er
          synlige i tårnet. Det er en uhyggelig stillhet over området, og en
          merkelig, skarp lukt henger i luften.
        </Description>

        <p className="mb-2">
          Likene av to groteske <strong>giant spiders</strong> ligger nær kanten
          av stien, som om de er blitt slept dit. De oppblåste kroppene deres er
          boblete og oppsprukne, og ser ut til å ha blitt revet i stykker av et
          stort dyr.
        </p>

        <p className="mb-2">
          En ung grønn drage ved navn <strong>Venomfang</strong> har nylig gjort
          krav på tårnet. Den fløy over Thundertree mens den lette etter et
          egnet skjulested i Neverwinter Wood. Likene av edderkoppene er de
          tidligere beboerne i tårnet, drept av dragen etter at den rev seg
          gjennom taket. Siden den gang har Venomfang holdt lav profil.
        </p>

        <p className="mb-2">
          <strong>Tårnet.</strong> Dragen bor i selve tårnet — ett enkelt rom
          med omtrent 40 fot takhøyde. En fem fot bred trapp slynger seg opp
          langs innsiden til den åpne toppen, noe som gir dragen enkel tilgang
          til sitt nye hjem. Tunge trebjelker og støtteverk krysser interiøret.
        </p>

        <p className="mb-2">
          Venomfang ønsker ikke å gi opp et så lovende skjulested, men hvis
          karakterene reduserer dragen til halvparten av hit points, klatrer den
          til toppen av tårnet og flyr bort for å kjempe en annen dag.
        </p>

        <p>
          <strong>Hytten.</strong> Hytten inneholder støvete møbler dekket av
          spindelvev, men ingenting av verdi. Hvis karakterene lager mye støy i
          hytten, hører dragen dem og forbereder seg på kamp.
        </p>
      </>
    ),
    monsters: [{ name: "Venomfang", count: 1 }],
    treasure: [
      "En gammel trekiste som står brutt opp på gulvet i tårnet inneholder resten av den døde trollmannens skatter.",
      "800 sp.",
      "150 gp.",
      "4 sølvbegre besatt med månesteiner (60 gp hver).",
      "En scroll of misty step.",
      "En scroll of lightning bolt.",
      "Under myntene ligger en rusten battleaxe av dvergisk håndverk.",
      "Runer på øksehodet lyder «Hew».",
      "Hew er en +1 battleaxe som gir maksimal skade når den treffer en plant creature eller en gjenstand laget av tre.",
      "Den som bærer øksen føler seg urolig når han eller hun ferdes gjennom skog.",
    ],
    developments: (
      <>
        <p>
          Venomfang bruker mye av tiden sin på å beundre skattene sine.
          Karakterene er neppe sterke nok til å drepe dragen på dette nivået,
          men de kan klare å jage den bort dersom de presser den hardt nok.
        </p>
      </>
    ),
    experience:
      "Del 2,000 XP likt mellom karakterene dersom gruppen jager bort Venomfang. Dersom de faktisk dreper dragen, er den verdt 3,900 XP.",
    notes: [
      "Venomfang bør føles som en langt større trussel enn de fleste andre møter i området.",
      "Dragen flykter når den er redusert til halvparten av hit points.",
      "Støy i hytten kan varsle dragen før karakterene går inn i tårnet.",
      "Hew er et viktig magisk våpen, spesielt nyttig mot plantefiender.",
    ],
    encounterTemplate: {
      name: "Område 7 - Dragens tårn",
      entities: [{ entityKind: "monster", entityName: "Venomfang", count: 1 }],
    },
    exits: [4, 6],
  },
  {
    id: 8,
    name: "Gammel smie",
    markers: [{ x: 61, y: 79 }],
    description: (
      <>
        <p className="mb-4">Denne smien ble forlatt for lenge siden.</p>

        <Description>
          En bred skorstein og råtnende hauger med ved stablet utenfor veggene
          på denne skakke bygningen tyder på at dette en gang var en smie.
        </Description>

        <p className="mb-2">
          To <strong>ash zombies</strong> ligger sammensunket på gulvet. Når
          karakterene går inn, reiser monstrene seg opp (og bruker halve
          bevegelsen sin på å gjøre det) før de angriper.
        </p>

        <p className="mb-2">
          Når zombieene først har fått øye på karakterene, forfølger de dem
          uansett hvor de går.
        </p>

        <p>
          Ulike gamle redskaper — tenger, blåsebelg, hammere og et par
          jernambolter — ligger spredt rundt inne i bygningen.
        </p>
      </>
    ),
    monsters: [{ name: "Ash Zombie", count: 2 }],
    experience:
      "Del 100 XP likt mellom karakterene dersom gruppen ødelegger ash zombieene.",
    notes: [
      "Zombieene starter liggende på gulvet og bruker halv bevegelse på å reise seg.",
      "De jager karakterene videre når de først har fått øye på dem.",
      "Bruk Ash Zombie-egenskapene i tillegg til vanlig zombie-statblock.",
    ],
    encounterTemplate: {
      name: "Område 8 - Gammel smie",
      entities: [{ entityKind: "monster", entityName: "Ash Zombie", count: 2 }],
    },
    exits: [],
  },
  {
    id: 9,
    name: "Urtehandlerens butikk",
    markers: [{ x: 71.5, y: 64 }],
    description: (
      <>
        <p className="mb-4">
          Dette var en gang en urte- og alkymibutikk som tilhørte familien til
          <strong> Mirna Dendrar</strong>, som nå bor i Phandalin.
        </p>

        <Description>
          Denne ruinbutikken er fylt med nedbøyde oppbevaringshyller og ødelagte
          møbler. Glasskår og knuste keramikkbiter glitrer blant ugresset og
          ruinene, sammen med råtnende bøker og tønner.
        </Description>

        <p className="mb-2">
          Alle ingrediensene og miksturene her er for lengst ødelagt, og bøkene
          er uleselige klumper av råte.
        </p>

        <p>
          En liten trekiste er imidlertid skjult i et hemmelig rom under
          oppbevaringshyllene. En karakter som leter gjennom ruinene kan finne
          kisten med en vellykket{" "}
          <strong>Wisdom (Perception)-sjekk, DC 15</strong>. Sjekken lykkes
          automatisk dersom <strong>Mirna</strong> har sendt gruppen for å finne
          familiearvestykket hennes.
        </p>
      </>
    ),
    treasure: [
      "En liten trekiste (uten egen verdi).",
      "Et gullkjede med et fint smaragdanheng (200 gp).",
    ],
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen returnerer halskjedet til Mirna i stedet for å beholde det.",
    notes: [
      "Dette rommet knytter Thundertree til Redbrand-historien i Phandalin.",
      "Kjedet er Mirna Dendrar sitt familiearvestykke.",
      "Perception DC 15 for å finne kisten hvis ikke Mirna ga oppdraget.",
    ],
    exits: [],
  },
  {
    id: 10,
    name: "Torget",
    markers: [{ x: 75, y: 31 }],
    description: (
      <>
        <p className="mb-4">
          Den fremrykkende vegetasjonen har ennå ikke slukt dette torget.
        </p>

        <Description>
          På østsiden av byen åpner veien seg til et lite torg. Flere ødelagte
          bygninger omringer den sørlige siden av plassen, men en større og mer
          intakt bygning i nord ser ut til å ha vært en brakke. En vei leder mot
          sørøst, en annen går mot sørvest rundt høyden midt i byen, og en
          tredje sti slynger seg nordover.
        </Description>

        <p className="mb-2">
          Midt på torget står en værbitt trestatue av en kriger som holder spyd
          og skjold. Den heller svakt til den ene siden.
        </p>

        <p className="mb-2">
          Statuen er omtrent <strong>10 fot høy</strong>, inkludert sokkelen.
          Den forestiller en gammel helt fra Neverwinter ved navn{" "}
          <strong>Palien</strong>, som ifølge historiene beseiret flere monstre
          i Neverwinter Wood da Thundertree først ble grunnlagt.
        </p>

        <p>
          En karakter som studerer statuen kan gjenkjenne hvem den forestiller
          med en vellykket <strong>Intelligence (History)-sjekk, DC 15</strong>.
          Statuen kan veltes med en <strong>Strength-sjekk, DC 20</strong>.
        </p>
      </>
    ),
    notes: [
      "Statuen av Palien er et historisk minnesmerke fra Thundertrees tidlige dager.",
      "History DC 15 for å identifisere helten Palien.",
      "Strength DC 20 for å velte statuen.",
    ],
    exits: [6, 8],
  },
  {
    id: 11,
    name: "Gammel garnison",
    markers: [{ x: 85, y: 17 }],
    description: (
      <>
        <p className="mb-4">
          Innbyggerne i Thundertree levde tett på{" "}
          <strong>Neverwinter Wood</strong>, og måtte derfor alltid være på
          vakt.
        </p>

        <Description>
          Denne gamle brakken har klart seg bedre enn de fleste bygningene i
          landsbyen. På taket finnes en enkel brystvernmur, og smale
          pilespaltevinduer viser at bygningen en gang fungerte som et lite fort
          i nødstilfeller.
        </Description>

        <p className="mb-2">
          Fem <strong>ash zombies</strong> lurer inne i bygningen. De er de
          tidligere soldatene i garnisonen, fortsatt iført rester av rustne
          ringbrynjer og soldatkapper. Disse rustrestene gir dem ingen bonus til
          Armor Class.
        </p>

        <p>
          Zombieene reiser seg og angriper dersom en levende skapning forstyrrer
          dem.
        </p>

        <p className="mb-2">
          Interiøret inneholder fortsatt møbler. Hovedrommet har en stige som
          leder opp gjennom en lem til taket.
        </p>

        <p className="mb-2">
          Rommet mot nord inneholder <strong>to dobbeltkøyer</strong>, mens
          rommet mot sør har <strong>tre dobbeltkøyer</strong>, noe som gir
          plass til totalt ti soldater.
        </p>

        <p>
          Nordvest for hovedrommet ligger et lite kjøkken og spiskammer. Her
          står fortsatt råtnende sekker og tønner som en gang inneholdt saltet
          kjøtt, men alt av mat har for lengst blitt spist av skadedyr.
        </p>
      </>
    ),
    monsters: [{ name: "Ash Zombie", count: 5 }],
    experience:
      "Del 250 XP likt mellom karakterene dersom gruppen ødelegger ash zombieene.",
    notes: [
      "Ash zombies er tidligere soldater fra garnisonen.",
      "De bruker vanlig Zombie-statblock med Ash Puff-egenskapen.",
      "Bygningen er mer solid enn de fleste ruinene i Thundertree.",
      "En stige i hovedrommet leder opp til taket.",
    ],
    encounterTemplate: {
      name: "Område 11 - Gammel garnison",
      entities: [{ entityKind: "monster", entityName: "Ash Zombie", count: 5 }],
    },
    exits: [10],
  },
  {
    id: 12,
    name: "Veverens hytte",
    markers: [{ x: 78, y: 45 }],
    description: (
      <>
        <p className="mb-4">
          Denne sammenraste hytten fungerer som et lokkemiddel for skapningene
          som holder til i nærheten.
        </p>

        <Description>
          Innsiden av ruinene er fylt med hauger av vrakrester og sammenrast
          bygningsmateriale. I ett hjørne står en ødelagt vevstol.
        </Description>

        <p>
          Seks <strong>twig blights</strong> skjuler seg i krattet sør for denne
          ruinen. La hver karakter gjøre en{" "}
          <strong>Wisdom (Perception)-sjekk</strong> som motsettes av blightenes{" "}
          <strong>Dexterity (Stealth)-sjekk</strong> for å avgjøre om gruppen
          blir overrasket av dem.
        </p>
      </>
    ),
    monsters: [{ name: "Twig Blight", count: 6 }],
    developments: (
      <>
        <p>
          Høye lyder her varsler kultistene i område <strong>13</strong>, som
          deretter undersøker området stille og forsiktig.
        </p>
      </>
    ),
    experience:
      "Del 150 XP likt mellom karakterene dersom gruppen ødelegger twig blightene.",
    notes: [
      "Twig blightene ligger skjult i krattet sør for ruinene.",
      "La hver karakter gjøre en contested Perception vs. Stealth-sjekk for å avgjøre overraskelse.",
      "Høye lyder kan tiltrekke kultistene fra område 13.",
    ],
    encounterTemplate: {
      name: "Område 12 - Veverens hytte",
      entities: [
        { entityKind: "monster", entityName: "Twig Blight", count: 6 },
      ],
    },
    exits: [13],
  },
  {
    id: 13,
    name: "Dragekultister",
    markers: [{ x: 88, y: 79 }],
    description: (
      <>
        <p className="mb-4">
          En gruppe som kaller seg <strong>Cult of the Dragon</strong> forsøker
          å inngå allianser med mektige drager langs Sword Coast.
        </p>

        <Description>
          Fire kultister har nylig sporet en grønn drage til Thundertree og
          venter nå på det rette øyeblikket til å nærme seg den og forsøke å
          opprette en allianse. De har holdt dragen under oppsikt på avstand for
          å vurdere temperamentet dens og hva den kan ønske seg.
        </Description>

        <p className="mb-2">
          Dette lille gårdshuset ser ved første øyekast ut som enda et tomt og
          forlatt hjem. Men alle dørene er lukket, og vinduene er stengt med
          skodder.
        </p>

        <p className="mb-2">
          Dørene er stengt og <strong>bommet fra innsiden</strong>, og krever en
          vellykket <strong>Strength-sjekk, DC 20</strong>, for å brytes opp.
          Skoddene er også sikret fra innsiden og kan tvinges opp med en{" "}
          <strong>Strength-sjekk, DC 15</strong>.
        </p>

        <p className="mb-2">
          Seks menneskelige <strong>cultists</strong> skjuler seg inne i huset.
          Fire står vakt — to i hvert rom — mens de to andre hviler i det
          største kammeret.
        </p>

        <p className="mb-2">
          Kultistene bærer svarte kapper skåret til så de ligner dragevinger, og
          svarte lærmasker med stiliserte dragehorn. I tillegg til{" "}
          <strong>Common</strong> snakker de også <strong>Draconic</strong>.
        </p>

        <p>
          Inne i huset er det støvete og fullt av spindelvev. Det eneste
          inventaret er en liten ovn, et bord, to stoler og en køye som
          kultistene deler.
        </p>
      </>
    ),
    monsters: [{ name: "Cultist", count: 6 }],
    treasure: [
      "I hovedrommet har Favric en liten skrin med gave til den grønne dragen.",
      "Tre diamanter (100 gp hver).",
      "Favric bærer også en potion of flying i en forseglet liten flaske rundt halsen.",
    ],
    developments: (
      <>
        <p className="mb-2">
          Kultistene ønsker ikke kamp og foretrekker egentlig å bli latt i fred.
          Lederen deres er en ond og ambisiøs ung mann ved navn{" "}
          <strong>Favric</strong>, som håper å stige raskt i gradene ved å vinne
          troskapen til den grønne dragen i område <strong>7</strong>.
        </p>

        <p className="mb-2">
          De andre kultistene deler ikke Favrics ambisjoner, og flykter dersom
          han blir fanget eller drept.
        </p>

        <p>
          Hvis karakterene snakker med kultistene, forklarer Favric at de har
          kommet for å forhandle med den grønne dragen, selv om han ikke kjenner
          navnet dens. Hvis karakterene uttrykker et lignende ønske, foreslår
          Favric en allianse. I virkeligheten planlegger han å tilby karakterene
          til dragen som en del av gaven sin, og hvis kamp bryter ut, stiller
          kultistene seg på dragens side.
        </p>
      </>
    ),
    experience:
      "Del 150 XP likt mellom karakterene dersom gruppen beseirer eller driver bort kultistene.",
    notes: [
      "Dørene er bommet fra innsiden: Strength DC 20 for å bryte dem opp.",
      "Skoddene er også sikret fra innsiden: Strength DC 15 for å tvinge dem opp.",
      "Favric er gruppens leder og den klart mest ambisiøse av kultistene.",
      "De andre kultistene flykter dersom Favric blir tatt eller drept.",
      "Kultistene ønsker helst ikke kamp, men vil støtte dragen hvis konflikt oppstår.",
    ],
    encounterTemplate: {
      name: "Område 13 - Dragekultister",
      entities: [{ entityKind: "monster", entityName: "Cultist", count: 6 }],
    },
    exits: [12, 7],
  },
];

import Description from "../../components/Description";
import type { RoomData } from "./types";

export const cragmawCastleRooms: RoomData[] = [
  {
    id: 1,
    name: "Slottsinngangen",
    markers: [{ x: 13.5, y: 54.5 }],
    description: (
      <>
        <p className="mb-4">
          Hovedportene mellom område 1 og 2 er laget av tre dekket med bronse,
          men de er tæret av rust og har kollapset.
        </p>

        <Description>
          Slottet består av syv forfalne tårn i ulike størrelser og høyder, men
          de øvre etasjene er alle i varierende grad rast sammen. En kort trapp
          leder opp til en terrasse foran hovedinngangen. Forbi vraket av et par
          knuste dører ligger en skyggelagt hall. Runde tårn ruver over
          inngangspartiet, med mørke pileskår som vender ned mot terrassen.
        </Description>

        <p className="mb-2">
          Ingen monstre holder til her, men goblinvakter i område 3 skal
          egentlig holde utkikk. De kikker imidlertid bare av og til ut gjennom
          pileskårene, så karakterer som beveger seg stille kan kanskje snike
          seg forbi dem.
        </p>

        <p>
          La hver karakter gjøre en <strong>Dexterity (Stealth)-sjekk</strong>.
          Den laveste sjekken blir <strong>DC</strong> for goblinenes
          <strong> Wisdom-sjekker</strong> for å oppdage gruppen.
        </p>
      </>
    ),
    developments: (
      <>
        <p>
          Hvis goblinene oppdager karakterene, eller hvis karakterene nærmer seg
          åpent, skyter goblinene piler fra dekning bak pileskårene. De kan
          imidlertid ikke skyte direkte på fiender som står ved eller forbi den
          ødelagte porten. Goblinene roper også høyt nok til å varsle allierte i
          område 4 og område 6 om at slottet er under angrep.
        </p>
      </>
    ),
    notes: [
      "Dette rommet fungerer mest som inngangssone og varslingspunkt, ikke som et fullt kamprom i seg selv.",
      "Stealth her kan ha stor betydning for hvor mange rom som blir varslet videre.",
    ],
    exits: [2, 3],
  },
  {
    id: 2,
    name: "Felle i hallen",
    markers: [{ x: 26, y: 45 }],
    description: (
      <>
        <p className="mb-4">
          Dette brede rommet var en gang slottets forhall, men fungerer nå som
          et farlig slagfelt.
        </p>

        <Description>
          Dører står lukket mot nord og sør, og en sammenrast haug med stein og
          murrester skjuler delvis gangen mot sør. Mot øst ender en bred
          korridor i to nye dører som leder videre mot sør og øst. Korridoren er
          fylt med støvete murrester og nedfalt puss fra et delvis sammenrast
          tak.
        </Description>

        <p className="mb-2">
          Hvis goblinvaktene i område 3 har slått alarm, stormer goblinene og
          hobgoblinene i område 4 og område 6 ut gjennom nord- og sørdørene
          samtidig. De angriper fra begge retninger i et forsøk på å overvelde
          eventyrerne og drive dem ut av slottet.
        </p>

        <p className="mb-2">
          <strong>Felle.</strong> Det støvete laget av puss og steinrester foran
          døren som leder til område 8 skjuler en kobbertråd spent over gulvet.
          Tråden er koblet til låsepinner i det ødelagte taket over.
        </p>

        <p className="mb-2">
          Å oppdage snubletråden krever en passiv{" "}
          <strong>Wisdom (Perception)</strong>-score på minst 20, eller en
          vellykket <strong>Wisdom (Perception)-sjekk, DC 10</strong> dersom
          karakterene aktivt leter etter feller i området. Når den først er
          oppdaget, er snubletråden enkel å unngå eller uskadeliggjøre og krever
          ingen ytterligere sjekk.
        </p>

        <p>
          Enhver skapning som beveger seg gjennom ruinene uten å unngå tråden
          utløser et ras av trebjelker og tunge steiner fra taket. Alle
          skapninger i området må gjøre et{" "}
          <strong>Dexterity saving throw, DC 10</strong>. Ved et mislykket kast
          tar skapningen <strong>3d6 bludgeoning damage</strong>
          fra raset (halv skade ved et vellykket kast).
        </p>
      </>
    ),
    developments: (
      <>
        <p>
          Lyden av sammenrasing varsler skapningene i område 3, område 7, område
          8 og område 9 om at noe er galt i slottet.
        </p>
      </>
    ),
    experience:
      "Del 100 XP likt mellom karakterene dersom gruppen oppdager eller overlever fellen.",
    notes: [
      "Fellen ligger foran døren til område 8.",
      "Raset er også en effektiv alarm for resten av slottet.",
    ],
    exits: [1, 4, 6, 8],
  },
  {
    id: 3,
    name: "Bueskytterpost",
    markers: [
      { x: 19.5, y: 68 },
      { x: 16.5, y: 36.5 },
    ],
    description: (
      <>
        <p className="mb-4">
          Cragmaw Castle sine viktigste forsvar er den hemmelige plasseringen og
          det faktum at stedet ser forlatt ut. I tillegg plasserer kong Grol
          vakter som kan drive bort inntrengere som kommer for nær.
        </p>

        <Description>
          Dette lille rommet er fylt med murrester og annet rusk. En pilespalte
          rett overfor døren gir et godt skuddfelt mot terrassen foran
          slottsporten.
        </Description>

        <p>
          To <strong>goblins</strong> holder til i hvert av disse rommene. Ved å
          bytte på å skyte og dukke tilbake i dekning kan begge bueskytterne
          skyte piler mot mål utenfor hver runde. Når karakterene kommer inn i
          rommet, slipper goblinene kortbuene sine og trekker nærkampvåpnene
          sine.
        </p>
      </>
    ),
    monsters: [{ name: "Goblin", count: 2 }],
    experience:
      "Del 100 XP likt mellom karakterene for hvert par goblin-bueskyttere gruppen beseirer.",
    notes: [
      "Goblinene skyter først fra pilespalten mot mål utenfor slottet.",
      "Når rommet blir stormet, bytter de til nærkamp.",
      "Område 3 består av to separate rom på kartet, og begge skal markeres.",
    ],
    exits: [1, 2],
  },
  {
    id: 4,
    name: "Ødelagt brakke",
    markers: [{ x: 23, y: 73 }],
    description: (
      <>
        <p className="mb-4">
          Goblinene i Cragmaw bruker hver eneste bit av tilgjengelig plass i
          slottet.
        </p>

        <Description>
          Det sørvestlige tårnet i slottet er lite mer enn en haug med ruiner.
          Flere fillete soveposer ligger spredt utover det som er igjen av
          gulvplassen, og en smal, svingete passasje leder østover gjennom
          ruinene.
        </Description>

        <p>
          Tre <strong>goblins</strong> holder til her. Selv om ruinene ser
          farlige ut, er tårnet stabilt, og passasjen mot øst er trygg.
        </p>
      </>
    ),
    monsters: [{ name: "Goblin", count: 3 }],
    developments: (
      <>
        <p>
          Høye lyder her tiltrekker oppmerksomheten til goblinene i område 7. Én
          goblin kommer for å undersøke forstyrrelsen. Hvis den ikke kommer
          tilbake, eller hvis den oppdager trøbbel og slår alarm, kommer de
          andre også for å undersøke.
        </p>
      </>
    ),
    experience:
      "Del 150 XP likt mellom karakterene dersom gruppen beseirer disse goblinene.",
    notes: [
      "Selv om tårnet ser ustabilt ut, er ruinene trygge å bevege seg gjennom.",
      "Dette rommet kan lett trekke inn forsterkninger fra område 7.",
    ],
    encounterTemplate: {
      name: "Område 4 - Ødelagt brakke",
      entities: [{ entityKind: "monster", entityName: "Goblin", count: 3 }],
    },
    exits: [2, 7],
  },
  {
    id: 5,
    name: "Lagerrom",
    markers: [{ x: 26, y: 27 }],
    description: (
      <>
        <p className="mb-4">
          Karavaner som Cragmaw-goblinene har plyndret langs High Road og
          Triboar Trail sørger for forsyninger til slottet.
        </p>

        <Description>
          Gamle tønner med saltet kjøtt og sekker med råtnende korn fyller dette
          lagerområdet. Blant forsyningene ser dere en blodig rustning av chain
          mail, en heavy crossbow og et usliret longsword med symbolet til
          Neverwinter innarbeidet i håndtaket.
        </Description>

        <p className="mb-2">
          Selv om forsyningene her ikke er spiselige etter menneskelige
          standarder, tåler goblinene dem når ferskere mat ikke er tilgjengelig.
        </p>

        <p className="mb-2">
          <strong>Dvergebrandy.</strong> Én liten tønne er fylt med en
          usedvanlig god dvergisk brandy, som goblinene har oversett på grunn av
          den beskjedne størrelsen. Tønnen inneholder omtrent tjue glass.
        </p>

        <p>
          En karakter som drikker ett glass brandy får tilbake{" "}
          <strong>1 hit point</strong>, men en karakter som drikker to glass
          innen én time blir <strong>poisoned</strong> i én time.
        </p>
      </>
    ),
    treasure: [
      "En suit of chain mail som tilhører Sildar Hallwinter.",
      "En heavy crossbow.",
      "Et longsword med Neverwinters emblem i håndtaket.",
      "En liten tønne med dvergisk brandy tilsvarende omtrent tjue glass.",
    ],
    developments: (
      <>
        <p>
          <strong>Sildars utstyr.</strong> Chain mail-rustningen og sverdet
          tilhører Sildar Hallwinter. Sildar er svært takknemlig dersom i det
          minste sverdet hans blir levert tilbake til ham.
        </p>
      </>
    ),
    notes: [
      "Forsyningene er stort sett verdiløse eller uspiselige for vanlige mennesker.",
      "Brandyen fungerer som en liten, situasjonell helingsressurs, men med risiko ved overforbruk.",
    ],
    exits: [7],
  },
  {
    id: 6,
    name: "Hobgoblin-brakke",
    markers: [{ x: 16.5, y: 27 }],
    description: (
      <>
        <p className="mb-4">
          Cragmaw-stammen består av flere typer goblinoider. Noen få bugbears
          hersker over et større antall miserable gobliner og noen få
          hobgoblins. Hobgoblinene planlegger en dag å kvitte seg med bugbearene
          og ta over selv, men foreløpig er bugbearene for sterke til å
          utfordre.
        </p>

        <Description>
          Fire enkle halmmadrasser og soveposer ligger på gulvet i denne
          brakken. Veggbraketter holder en rekke våpen — spyd, sverd,
          morgenstjerner og mer. Den nordlige veggen viser tegn til skader, men
          gulvet er ryddet for stein og murrester.
        </Description>

        <p>
          Fire <strong>hobgoblins</strong> holder til i dette rommet. Siden
          goblin-naboene deres stadig havner i slåsskamper, bryr de seg ikke om
          bråk i område 2 eller område 3. De reagerer derimot raskt hvis
          fremmede dukker opp i tårnet deres, eller hvis goblinvakter slår
          alarm.
        </p>
      </>
    ),
    monsters: [{ name: "Hobgoblin", count: 4 }],
    treasure: [
      "5 spyd montert på veggene.",
      "4 longswords.",
      "3 morningstars.",
      "2 greatswords.",
      "En fin quarterstaff dekorert med stiliserte fjær. Den veier bare 1 lb og er verdt 10 gp.",
    ],
    experience:
      "Del 400 XP likt mellom karakterene dersom gruppen beseirer hobgoblinene i dette rommet.",
    encounterTemplate: {
      name: "Område 6 - Hobgoblin-brakke",
      entities: [{ entityKind: "monster", entityName: "Hobgoblin", count: 4 }],
    },
    notes: [
      "Hobgoblinene ignorerer vanlig støy fra gobliner i område 2 og 3.",
      "De reagerer umiddelbart på alarm fra goblinvaktene eller direkte inntrengere.",
    ],
    exits: [2, 3, 7],
  },
  {
    id: 7,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 8,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 9,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 10,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 11,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 12,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 13,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 14,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
];

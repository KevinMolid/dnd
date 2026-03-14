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
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 5,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
  },
  {
    id: 6,
    name: "Kjeller",
    markers: [{ x: 82, y: 79 }],
    description: <></>,
    exits: [2, 3, 8],
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

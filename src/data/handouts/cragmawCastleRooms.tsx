export const cragmawCastleRooms = [
  {
    id: 1,
    name: "Slottsinngangen",
    markers: [{ x: 13.5, y: 54.5 }],
    readAloud:
      "Slottet består av syv forfalne tårn i ulike størrelser og høyder, men de øvre etasjene er alle i varierende grad rast sammen. En kort trapp leder opp til en terrasse foran hovedinngangen. Forbi vraket av et par knuste dører ligger en skyggelagt hall. Runde tårn ruver over inngangspartiet, med mørke pileskår som vender ned mot terrassen.",
    description: [
      "Hovedportene mellom område 1 og 2 er laget av tre dekket med bronse, men de er tæret av rust og har kollapset.",
      "Ingen monstre holder til her, men goblinvakter i område 3 skal egentlig holde utkikk. De kikker imidlertid bare av og til ut gjennom pileskårene, så karakterer som beveger seg stille kan kanskje snike seg forbi dem.",
      "La hver karakter gjøre en Dexterity (Stealth)-sjekk. Den laveste sjekken blir DC for goblinenes Wisdom-sjekker for å oppdage gruppen.",
    ],
    developments: [
      "Hvis goblinene oppdager karakterene, eller hvis karakterene nærmer seg åpent, skyter goblinene piler fra dekning bak pileskårene. De kan imidlertid ikke skyte direkte på fiender som står ved eller forbi den ødelagte porten. Goblinene roper også høyt nok til å varsle allierte i område 4 og område 6 om at slottet er under angrep.",
    ],
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
    readAloud:
      "Dører står lukket mot nord og sør, og en sammenrast haug med stein og murrester skjuler delvis gangen mot sør. Mot øst ender en bred korridor i to nye dører som leder videre mot sør og øst. Korridoren er fylt med støvete murrester og nedfalt puss fra et delvis sammenrast tak.",
    description: [
      "Dette brede rommet var en gang slottets forhall, men fungerer nå som et farlig slagfelt.",
      "Hvis goblinvaktene i område 3 har slått alarm, stormer goblinene og hobgoblinene i område 4 og område 6 ut gjennom nord- og sørdørene samtidig. De angriper fra begge retninger i et forsøk på å overvelde eventyrerne og drive dem ut av slottet.",
      "Felle: Det støvete laget av puss og steinrester foran døren som leder til område 8 skjuler en kobbertråd spent over gulvet. Tråden er koblet til låsepinner i det ødelagte taket over.",
      "Å oppdage snubletråden krever en passiv Wisdom (Perception)-score på minst 20, eller en vellykket Wisdom (Perception)-sjekk, DC 10 dersom karakterene aktivt leter etter feller i området. Når den først er oppdaget, er snubletråden enkel å unngå eller uskadeliggjøre og krever ingen ytterligere sjekk.",
      "Enhver skapning som beveger seg gjennom ruinene uten å unngå tråden utløser et ras av trebjelker og tunge steiner fra taket. Alle skapninger i området må gjøre et Dexterity saving throw, DC 10. Ved et mislykket kast tar skapningen 3d6 bludgeoning damage fra raset (halv skade ved et vellykket kast).",
    ],
    developments: [
      "Lyden av sammenrasing varsler skapningene i område 3, område 7, område 8 og område 9 om at noe er galt i slottet.",
    ],
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
    readAloud:
      "Dette lille rommet er fylt med murrester og annet rusk. En pilespalte rett overfor døren gir et godt skuddfelt mot terrassen foran slottsporten.",
    description: [
      "Cragmaw Castle sine viktigste forsvar er den hemmelige plasseringen og det faktum at stedet ser forlatt ut. I tillegg plasserer kong Grol vakter som kan drive bort inntrengere som kommer for nær.",
      "To goblins holder til i hvert av disse rommene. Ved å bytte på å skyte og dukke tilbake i dekning kan begge bueskytterne skyte piler mot mål utenfor hver runde. Når karakterene kommer inn i rommet, slipper goblinene kortbuene sine og trekker nærkampvåpnene sine.",
    ],
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
    readAloud:
      "Det sørvestlige tårnet i slottet er lite mer enn en haug med ruiner. Flere fillete soveposer ligger spredt utover det som er igjen av gulvplassen, og en smal, svingete passasje leder østover gjennom ruinene.",
    description: [
      "Goblinene i Cragmaw bruker hver eneste bit av tilgjengelig plass i slottet.",
      "Tre goblins holder til her. Selv om ruinene ser farlige ut, er tårnet stabilt, og passasjen mot øst er trygg.",
    ],
    monsters: [{ name: "Goblin", count: 3 }],
    developments: [
      "Høye lyder her tiltrekker oppmerksomheten til goblinene i område 7. Én goblin kommer for å undersøke forstyrrelsen. Hvis den ikke kommer tilbake, eller hvis den oppdager trøbbel og slår alarm, kommer de andre også for å undersøke.",
    ],
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
    readAloud:
      "Gamle tønner med saltet kjøtt og sekker med råtnende korn fyller dette lagerområdet. Blant forsyningene ser dere en blodig rustning av chain mail, en heavy crossbow og et usliret longsword med symbolet til Neverwinter innarbeidet i håndtaket.",
    description: [
      "Karavaner som Cragmaw-goblinene har plyndret langs High Road og Triboar Trail sørger for forsyninger til slottet.",
      "Selv om forsyningene her ikke er spiselige etter menneskelige standarder, tåler goblinene dem når ferskere mat ikke er tilgjengelig.",
      "Dvergebrandy: Én liten tønne er fylt med en usedvanlig god dvergisk brandy, som goblinene har oversett på grunn av den beskjedne størrelsen. Tønnen inneholder omtrent tjue glass.",
      "En karakter som drikker ett glass brandy får tilbake 1 hit point, men en karakter som drikker to glass innen én time blir poisoned i én time.",
    ],
    treasure: [
      "En suit of chain mail som tilhører Sildar Hallwinter.",
      "En heavy crossbow.",
      "Et longsword med Neverwinters emblem i håndtaket.",
      "En liten tønne med dvergisk brandy tilsvarende omtrent tjue glass.",
    ],
    developments: [
      "Sildars utstyr: Chain mail-rustningen og sverdet tilhører Sildar Hallwinter. Sildar er svært takknemlig dersom i det minste sverdet hans blir levert tilbake til ham.",
    ],
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
    readAloud:
      "Fire enkle halmmadrasser og soveposer ligger på gulvet i denne brakken. Veggbraketter holder en rekke våpen — spyd, sverd, morgenstjerner og mer. Den nordlige veggen viser tegn til skader, men gulvet er ryddet for stein og murrester.",
    description: [
      "Cragmaw-stammen består av flere typer goblinoider. Noen få bugbears hersker over et større antall miserable gobliner og noen få hobgoblins. Hobgoblinene planlegger en dag å kvitte seg med bugbearene og ta over selv, men foreløpig er bugbearene for sterke til å utfordre.",
      "Fire hobgoblins holder til i dette rommet. Siden goblin-naboene deres stadig havner i slåsskamper, bryr de seg ikke om bråk i område 2 eller område 3. De reagerer derimot raskt hvis fremmede dukker opp i tårnet deres, eller hvis goblinvakter slår alarm.",
    ],
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
    name: "Bankettsalen",
    markers: [{ x: 39, y: 59 }],
    readAloud:
      "Den vestlige delen av denne store hallen ender i en vegg av ruiner, men resten av rommet er fortsatt intakt. Dette må en gang ha vært slottets bankettsal, med et høyt tak som reiser seg omtrent tjuefem fot over gulvet. To store trebord med enkle benker står midt i rommet, og et messingkar fylt med glødende kull står plassert i et hjørne. Skitne tallerkener, halvfulle gryter med stuing, mugne brødkanter og gnagde bein dekker bordene.",
    description: [
      "Slottets herre underholdt en gang gjestene sine her med overdådige banketter og danser. Nå er stedet en skitten goblin-matsal.",
      "Denne salen huser sju gobliner og lederen deres — en feit og gretten goblin ved navn Yegg, som har 12 hit points. Yegg er hovedkokken for Cragmaw-stammen og plager de motvillige hjelperne sine brutalt mens de arbeider med å skaffe mat til stammen.",
    ],
    monsters: [
      { name: "Goblin", count: 7 },
      {
        name: "Yegg",
        count: 1,
        notes: "Goblin-leder og hovedkokk. Har 12 hit points.",
      },
    ],
    developments: [
      "Hvis Yegg blir drept, flykter eventuelle gobliner som fortsatt er i live mot øst eller vest. De unngår døren mot nord på grunn av fellen i område 2.",
    ],
    experience:
      "Del 400 XP likt mellom karakterene dersom gruppen beseirer goblinene i dette rommet.",
    notes: [
      "Yegg bør oppleves som en uspiselig, tyrannisk goblin-kokk.",
      "Goblinene vil helst flykte når lederen deres faller.",
      "Norddøren unngås på grunn av fellen i område 2.",
    ],
    encounterTemplate: {
      name: "Område 7 - Bankettsalen",
      entities: [
        { entityKind: "monster", entityName: "Goblin", count: 7 },
        { entityKind: "monster", entityName: "Yegg", count: 1 },
      ],
    },
    exits: [4, 5, 6, 8, 9],
  },
  {
    id: 8,
    name: "Mørk Hall",
    markers: [{ x: 42, y: 41 }],
    readAloud:
      "Denne høye og smale hallen ser ut til å ha vært en del av et kapell eller en helligdom en gang i tiden. Langs de øvre veggene er det hugget skulpturer av englelignende figurer som stirrer ned på gulvet under. I nord blokkerer tunge gardiner et par buede åpninger. Mellom dem står et sprukket, men rikt utsmykket steinkar for glør.",
    description: [
      "Selv midt på dagen slipper det ikke inn noe naturlig lys her. Uten mørkesyn eller en lyskilde ligger området i totalt mørke.",
      "Dette kammeret huser en grick, kjæledyret til goblinen Lhupo (område 9). Gricken liker å klatre opp til en avsats skjult i skyggene blant statuene høyt oppe i rommet. Derfra observerer den stille inntrengere før den slipper seg ned for å angripe.",
      "Sammenlign grickens Dexterity (Stealth)-sjekk med karakterenes Wisdom (Perception)-sjekker (eller deres passive score) for å avgjøre hvem som blir overrasket. Gricken vet at gobliner ikke skal spises med mindre Lhupo gir tillatelse. Resten av Cragmaw-goblinene er livredde for dette kjæledyret og skynder seg alltid gjennom rommet, helst to eller tre sammen.",
      "En cleric som undersøker kapellets utsmykning kan gjøre en Intelligence (Religion)-sjekk, DC 10, for å identifisere gudene som en gang ble tilbedt her: Oghma (kunnskapens gud), Mystra (magiens gudinne), Lathander (daggryets gud) og Tymora (lykkens gudinne). Dette avslører at slottet opprinnelig ble bygget av mennesker.",
    ],
    monsters: [{ name: "Grick", count: 1 }],
    developments: [
      "Hvis kamp bryter ut her, kan goblinene i område 9 ikke bli overrasket.",
    ],
    treasure: [
      "I steinkaret ligger en haug med kull. Under kullet er en gullstatuett av en solalv (100 gp) pakket inn i rødt stoff.",
      "Statuetten er magisk. Detect Magic avslører divinasjonsmagi.",
      "En ikke-ond skapning som holder statuetten kan stille ett spørsmål og motta et telepatisk svar som om den hadde kastet Augury. Etter at en skapning har brukt statuetten én gang, kan den aldri aktivere den igjen.",
    ],
    experience:
      "Del 450 XP likt mellom karakterene dersom gruppen beseirer gricken.",
    notes: [
      "Gricken angriper vanligvis fra bakhold ovenfra.",
      "Goblins i slottet er redde for Lhupos kjæledyr og beveger seg raskt gjennom rommet.",
      "Statuetten kan gi spillerne nyttig informasjon hvis de bruker den smart.",
    ],
    encounterTemplate: {
      name: "Område 8 - Mørk Hall",
      entities: [{ entityKind: "monster", entityName: "Grick", count: 1 }],
    },
    exits: [7, 9],
  },
  {
    id: 9,
    name: "Goblinhelligdom",
    markers: [{ x: 42, y: 22 }],
    readAloud:
      "Dette kammeret ligger i det nordlige tårnet av slottet. Et steinalter står midt i rommet, dekket av et blodflekket svart klede. På toppen av alteret ligger flere gyldne ritualgjenstander – en kalk, en kniv og et røkelseskar – nøye arrangert. To buede åpninger mot sør er skjult bak tunge gardiner.",
    description: [
      "Gobliner har ingen bruk for menneskenes guder, så Cragmaw-stammen har omgjort dette stedet til en helligdom for Maglubiyet, guden for gobliner og hobgoblins.",
      "Helligdommen er hjemmet til Lhupo (en goblin med 12 hit points) og to vanlige gobliner som fungerer som hans “akolytter”. De bærer skitne kapper over rustningen sin, men ingen av dem har guddommelige krefter — selv om Lhupo hevder at Maglubiyet snakker til ham.",
      "Hvis goblinene hørte kamp mot gricken i område 8, gjemmer de seg bak alteret og forsøker å overraske karakterene. Hvis ikke, kneler alle tre foran alteret og ber til sin onde gud.",
      "Det blodflekkede kledet dekker hele alteret. Sidene av alteret er dekorert med utskjæringer av de samme gudene som finnes i utsmykningen i område 8.",
    ],
    monsters: [
      {
        name: "Lhupo",
        count: 1,
        notes:
          "Goblinprest og vokter av gricken i område 8. Har 12 hit points.",
      },
      { name: "Goblin", count: 2 },
    ],
    treasure: [
      "En gullkalk verdt 150 gp.",
      "En utsmykket ritualkniv verdt 60 gp.",
      "Et gullbelagt røkelseskar verdt 120 gp.",
    ],
    experience:
      "Del 150 XP likt mellom karakterene dersom gruppen beseirer goblinene.",
    notes: [
      "Lhupo påstår at han kan høre Maglubiyet snakke til ham.",
      "Goblinene kan forsøke bakholdsangrep hvis de hørte kamp i område 8.",
      "Alteret er opprinnelig laget av mennesker og viser fortsatt symboler for Oghma, Mystra, Lathander og Tymora under kledet.",
    ],
    encounterTemplate: {
      name: "Område 9 - Goblinhelligdom",
      entities: [
        { entityKind: "monster", entityName: "Lhupo", count: 1 },
        { entityKind: "monster", entityName: "Goblin", count: 2 },
      ],
    },
    exits: [8],
  },
  {
    id: 10,
    name: "Bakporten",
    markers: [{ x: 38.5, y: 82 }],
    readAloud:
      "På sørsiden av det gamle slottet leder en gjengrodd sti til en passasje som skrår opp inn i murveggen. Her står en stor jerndør, beskyttet mot direkte angrep utenfra. Pilespalter omtrent tre meter over bakken ser ned mot stien.",
    description: [
      "Denne sideinngangen til slottet er låst, men ikke bevoktet.",
      "Jerndør: Døren er låst. Den kan åpnes med thieves’ tools og en vellykket Dexterity-sjekk, DC 15, eller slås inn med en Strength-sjekk, DC 25.",
      "Pilespalter: En karakter som stopper opp og lytter ved pilespaltene kan høre lyder fra område 7 – klirrende servise og gobliner som krangler om hvem som skal vaske opp. Goblinene holder imidlertid ikke vakt her.",
      "Hvis karakterene lager mye støy eller oppstyr, for eksempel ved å slå ned døren, kommer goblinene fra område 7 for å undersøke. Hvis de ser inntrengere utenfor, roper de alarm.",
    ],
    notes: [
      "Dette er en alternativ inngang til slottet som kan brukes til sniking.",
      "Høy støy kan trekke gobliner fra område 7 til døren.",
      "Pilespaltene gir utsikt til stien utenfor.",
    ],
    exits: [7],
  },
  {
    id: 11,
    name: "Ødelagt tårn",
    markers: [{ x: 55, y: 27 }],
    readAloud:
      "Dette tårnet har nesten rast helt sammen, selv om det fortsatt finnes litt åpen plass på bakkenivå. Råtne kasser og eldgamle tønner viser at dette en gang ble brukt som lager for forsyninger. Et tungt forheng blokkerer et sammenrast område mot sør, og en intakt dør leder østover. Mot nord ender en kort passasje gjennom ruinene ved en skjerm av lerret.",
    description: [
      "Et stykke støvete lerret (markert med «C» på kartet) skjuler den nordlige inngangen til dette området, og går nesten i ett med steinverk og ruiner rundt.",
      "En karakter som lykkes på en Wisdom (Perception)-sjekk, DC 15, oppdager en smal sti som leder opp til den skjulte inngangen. Hvis karakterene aktivt leter etter en hemmelig inngang på utsiden av slottet, kan de gjøre en Wisdom (Perception)-sjekk, DC 10 for å oppdage lerrets-“døren”.",
    ],
    notes: [
      "Lerretet fungerer som en skjult inngang fra utsiden av slottet.",
      "Dette rommet er nyttig for spillere som prøver å snike seg inn i slottet uten å bruke hovedinngangen.",
      "Rommet virker tomt, men gir en viktig alternativ tilgang videre innover i slottet.",
    ],
    exits: [12],
  },
  {
    id: 12,
    name: "Vaktbrakke",
    markers: [{ x: 67.5, y: 54.5 }],
    readAloud:
      "Et steinkar fylt med glødende kull lyser opp midten av dette lille rommet. Fire halmmadrasser ligger langs østmuren. Veggen mot sør har rast sammen, men en sperret tredør i den retningen er fortsatt tilgjengelig. Et tungt forheng henger i en buegang mot nord.",
    description: [
      "Skapningene her holder vakt gjennom en pilespalte, så karakterer som sniker seg rundt på østsiden av slottet vil sannsynligvis bli oppdaget og angrepet.",
      "To hobgoblins står vakt i dette rommet. De er smarte, tøffe og lojale mot King Grol. Når kamp bryter ut, løper én av hobgoblinene for å advare kongen i område 14. Den vender tilbake to runder senere for å delta i kampen igjen.",
      "Dette området var en gang en stue for slottets menneskelige beboere, men de råtne møblene ble knust av Cragmaw-goblinene og brukt som ved.",
    ],
    monsters: [{ name: "Hobgoblin", count: 2 }],
    experience:
      "Del 200 XP likt mellom karakterene dersom gruppen beseirer hobgoblinene.",
    notes: [
      "Hobgoblinene holder utkikk gjennom pilespalten mot østsiden av slottet.",
      "Én hobgoblin prøver å varsle King Grol i område 14 ved kampstart.",
    ],
    encounterTemplate: {
      name: "Område 12 - Vaktbrakke",
      entities: [{ entityKind: "monster", entityName: "Hobgoblin", count: 2 }],
    },
    exits: [11, 13, 14],
  },
  {
    id: 13,
    name: "Owlbear-tårnet",
    markers: [{ x: 64, y: 73 }],
    readAloud:
      "De øvre etasjene i dette tårnet har rast sammen og etterlatt et hult, sylinderformet rom som strekker seg minst ni meter opp. De øvre delene forsvinner i skyggene. Støv, steinmasser og knust glass dekker gulvet, og mot sør ligger gamle arbeidsbord og bokhyller veltet og ødelagt. Midt i rommet står et enormt beist som ser ut som en pjuskete bjørn med hodet til en ugle. Det reiser seg og brøler når det ser dere.",
    description: [
      "Døren til dette rommet holdes lukket med en tung trebom — en tydelig, men stillferdig advarsel om at fare venter på den andre siden. Når bommen løftes bort, våkner skapningen i rommet og slipper ut et fryktinngytende brøl.",
      "Pilespaltene i dette rommet er lukket med skodder, noe som gjør rommet mørkt. Tekst og beskrivelser her forutsetter at karakterene har mørkesyn eller en lyskilde.",
      "Cragmaw-stammen har fanget en owlbear og sperret den inne i dette tårnet. Rommet holdes mørkt for å holde udyret roligere, men King Grol vet ennå ikke hva han skal gjøre med det.",
      "Hvis en karakter kaster ferskt kjøtt til den, sluker owlbearen maten. Ellers angriper den den første skapningen den ser i døråpningen.",
      "Dette rommet var en gang et bibliotek og verksted, men ingenting av det opprinnelige innholdet er lenger intakt.",
    ],
    monsters: [{ name: "Owlbear", count: 1 }],
    developments: [
      "Hvis karakterene åpner døren og holder seg unna owlbearen, flykter den ut av slottet — sannsynligvis gjennom område 11. Skapningen angriper alt som stiller seg i veien for den.",
    ],
    treasure: [
      "Det som er igjen av tårnets andre etasje er en skarp avsats, hvor det står en slitt trekiste.",
      "Kisten er vanskelig å få øye på fra gulvet og krever en vellykket Wisdom (Perception)-sjekk, DC 15, for å bli oppdaget.",
      "Kisten er ulåst og inneholder 90 ep",
      "120 gp",
      "En potion of healing.",
      "En scroll of silence.",
      "En scroll of revivify.",
    ],
    experience:
      "Del 700 XP likt mellom karakterene dersom gruppen beseirer owlbearen eller slipper den løs.",
    notes: [
      "Owlbearen kan brukes som et kaotisk element i slottet dersom gruppen slipper den fri.",
      "Rommet er mørkt med vilje for å holde skapningen roligere.",
      "Ferskt kjøtt kan brukes for å distrahere owlbearen kortvarig.",
    ],
    encounterTemplate: {
      name: "Område 13 - Owlbear-tårnet",
      entities: [{ entityKind: "monster", entityName: "Owlbear", count: 1 }],
    },
    exits: [11, 12],
  },
  {
    id: 14,
    name: "King Grols kvarter",
    markers: [{ x: 77, y: 27 }],
    readAloud:
      "Rommet er Grols private oppholdsrom i den nordøstlige delen av slottet. Her finnes rester av tidligere komfort, men området er nå dominert av den brutale bugbear-kongen og hans nærmeste. I et hjørne ligger Gundren Rockseeker bevisstløs, mens resten av rommet bærer preg av grov bruk og makt.",
    description: [
      "King Grol er en fryktinngytende, gammel bugbear med 45 hit points. Han styrer Cragmaw-stammen gjennom ren frykt og brutalitet. Alderen har gjort skuldrene hans krokete og ryggen bøyd, men han er fortsatt overraskende smidig og sterk. Han er krevende, hevngjerrig, og ingen i Cragmaw-stammen våger å trosse ham.",
      "Grol har selskap av Snarl, en ulv med 18 hit points, og en doppelganger forkledd som en kvinnelig drow. Doppelgangeren, Vyerith, er en sendebud fra Den svarte edderkoppen, og har kommet for å hente Gundren Rockseeker og kartet til Wave Echo Cave fra King Grol.",
      "Grol ønsker å selge kartet i stedet for å overlevere det, og han og den forkledde drowen forhandler om en pris. Vyerith ønsker først å avhøre Gundren for å finne ut om noen andre kjenner til gruvens plassering. Etterpå planlegger doppelgangeren å drepe dvergen og ødelegge kartet.",
      "Hvis skurkene er blitt varslet om at et angrep er nært forestående, skjuler Vyerith seg bak døren mot nordøst og lar den stå på gløtt, i håp om å angripe en inntrenger bakfra. Samtidig holder Grol Gundren som gissel og er klar til å drepe dvergen hvis karakterene ikke trekker seg tilbake.",
      "Pilespalter: Pilespaltene her ligger omtrent 15 fot over bakkenivå på utsiden, men ingen holder vakt gjennom dem. Det er derfor lite sannsynlig at skapningene i rommet legger merke til inntrengere som beveger seg utenfor slottet.",
      "Nordvestlig rom: Dette delvis sammenraste sidekammeret var en gang et komfortabelt baderom. Det inneholder fortsatt et stort flislagt badekar, men ingen av slottets nåværende beboere bruker det.",
      "Bevisstløs dverg: Nær det sørvestlige hjørnet av rommet ligger Gundren Rockseeker, en dverg commoner. Han er bevisstløs, men stabil på 0 hit points.",
    ],
    monsters: [
      {
        name: "King Grol",
        count: 1,
        notes: "Gammel, brutal bugbear-konge med 45 hit points.",
      },
      {
        name: "Snarl",
        count: 1,
        notes: "Grols ulv. Har 18 hit points.",
      },
      {
        name: "Vyerith",
        count: 1,
        notes:
          "Doppelganger forkledd som kvinnelig drow og utsending fra Den svarte edderkoppen.",
      },
    ],
    captives: [
      "Gundren Rockseeker ligger bevisstløs, men stabil. Hvis han blir vekket til live igjen, takker han gruppen for redningen, men nekter å forlate Cragmaw Castle uten kartet sitt. Dessverre vet han ikke hvor King Grol har gjemt det.",
    ],
    developments: [
      "Hvis Grol blir drept, forsøker Vyerith å drepe Gundren og flykte med kartet. Hun vil sannsynligvis løpe mot område 11 og rømme gjennom den skjulte lerretsdøren der.",
      "Hvis hun blir presset opp i et hjørne, kjemper doppelgangeren til døden i stedet for å la seg fange.",
    ],
    treasure: [
      "Under madrassen i Grols seng ligger en sydd lærsekk.",
      "Sekken inneholder 220 sp",
      "160 ep",
      "3 potions of healing.",
      "Gundrens kart til Wave Echo Cave.",
    ],
    experience:
      "Del 950 XP likt mellom karakterene dersom gruppen beseirer King Grol, ulven og doppelgangeren. Tildel ytterligere 200 XP dersom karakterene redder Gundren Rockseeker og eskorterer ham trygt tilbake til Phandalin.",
    notes: [
      "Dette er klimaksrommet i Cragmaw Castle.",
      "Grol kan bruke Gundren som gissel hvis han blir varslet på forhånd.",
      "Vyerith bør spilles som kald, kalkulerende og fullstendig villig til å drepe Gundren for å beskytte oppdraget.",
      "Snarl fungerer best som en aggressiv beskytter rundt Grol.",
    ],
    encounterTemplate: {
      name: "Område 14 - King Grols kvarter",
      entities: [
        { entityKind: "monster", entityName: "King Grol", count: 1 },
        { entityKind: "monster", entityName: "Snarl", count: 1 },
        { entityKind: "monster", entityName: "Vyerith", count: 1 },
      ],
    },
    exits: [12, 13],
  },
] as const;

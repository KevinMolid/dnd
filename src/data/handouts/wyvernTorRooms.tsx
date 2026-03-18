export const wyvernTorRooms = [
  {
    id: 1,
    name: "Utenfor hulen",
    markers: [{ x: 80, y: 85 }],
    readAloud:
      "Dere kjenner en svak lukt av røyk idet dere klatrer opp en steinete rygg på den nedre delen av høyden. Omtrent 50 yards unna åpner en hule seg i bunnen av en liten ravine. Ved en stor stein omtrent 20 yards foran huleinngangen sitter en enslig orc og holder vakt.",
    description: [
      "Wyvern Tor er en stor høyde med milevis av ulendt terreng rundt seg.",
      "Å finne den skjulte orcleiren tar tid. Gruppen kan gjøre én Wisdom (Perception)-sjekk, DC 15 eller Wisdom (Survival)-sjekk, DC 10 per time for å finne leiren. Sjekken gjøres av karakteren som leder an.",
      "Hvis karakterene klarer å ta ut vakten raskt og stille, har de en sjanse til å overraske fiendene inne i hulen.",
      "Hvis vakten oppdager karakterene som sniker seg innpå, eller ikke blir stilnet raskt, løper den tilbake til hulen for å varsle de andre.",
    ],
    monsters: [{ name: "Orc", count: 1 }],
    notes: [
      "Dette er vaktposten utenfor hulen.",
      "Hvis vakten varsler hulen, mister gruppen muligheten til å overraske fiendene inne.",
      "Leiren ligger skjult i ulendt terreng og må spores opp først.",
    ],
    encounterTemplate: {
      name: "Wyvern Tor - Utenfor hulen",
      entities: [{ entityKind: "monster", entityName: "Orc", count: 1 }],
    },
    exits: [2],
  },
  {
    id: 2,
    name: "Orcleiren i hulen",
    markers: [{ x: 70, y: 42 }],
    readAloud:
      "Inne i hulen har orcene slått seg ned blant røyk, skitt og plyndrede eiendeler. Dette er den nåværende basen til en gruppe orcer som har beveget seg inn i området for å speide på bosetningene nær Phandalin, overfalle reisende og plyndre når muligheten byr seg.",
    description: [
      "Hulen fungerer som skjulested for en brutal speidergruppe fra Many Arrows-stammen.",
      "Her inne befinner det seg Brughor Axe-Biter, den brutale lederen deres, sammen med seks vanlige orcs og en skitten ogre ved navn Gog.",
      "Brughor er mer interessert i drap og plyndring enn i selve speideroppdraget. Gog kjemper til han blir drept, mens de andre orcene kjemper til Brughor blir drept.",
      "Dersom Brughor faller, flykter eventuelle gjenværende orcer.",
    ],
    monsters: [
      { name: "Brughor Axe-Biter", count: 1 },
      { name: "Orc", count: 6 },
      { name: "Ogre", count: 1 },
    ],
    treasure: [
      "En ulåst skattekiste i hulen inneholder bytte fra flere gårder lenger nord.",
      "750 cp",
      "180 sp",
      "62 ep",
      "30 gp",
      "Tre små flasker parfyme (10 gp hver)",
    ],
    experience:
      "Del 1,250 XP likt mellom karakterene dersom gruppen beseirer orcene og ogre Gog.",
    notes: [
      "Brughor Axe-Biter er lederen for gruppen og et eget monster.",
      "Gog kjemper til døden.",
      "De vanlige orcene flykter dersom Brughor blir drept.",
      "Hvis vakten utenfor rakk å varsle hulen, er fiendene forberedt.",
      "Å beseire fiendene her fullfører oppdraget fra Townmaster Harbin Wester og innfrir også løftet til Hamun Kost.",
    ],
    encounterTemplate: {
      name: "Wyvern Tor - Orcleiren i hulen",
      entities: [
        {
          entityKind: "monster",
          entityName: "Brughor Axe-Biter",
          count: 1,
        },
        { entityKind: "monster", entityName: "Orc", count: 6 },
        { entityKind: "monster", entityName: "Ogre", count: 1 },
      ],
    },
    exits: [1],
  },
] as const;

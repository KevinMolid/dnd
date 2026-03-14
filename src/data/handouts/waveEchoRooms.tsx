import Description from "../../components/Description";
import type { RoomData } from "./types";

export const waveEchoRooms: RoomData[] = [
  {
    id: 1,
    name: "Huleinngangen",
    markers: [{ x: 23, y: 76 }],
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
          uten tau krever en vellykket Styrke (Athletics)-sjekk, DC 15.
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
    markers: [{ x: 25, y: 60 }],
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
          okergelé (ochre jelly).
        </p>
      </>
    ),
    monsters: [{ name: "Ochre jelly", count: 1 }],
    exits: [1, 3, 6, 9, 10],
  },

  {
    id: 3,
    name: "Storeroom",
    markers: [{ x: 50, y: 76 }],
    description:
      "Broken crates, torn sacks, and ruined mining supplies are scattered here. Most useful contents were taken long ago.",
    treasure: ["Possibly a few salvageable tools or minor supplies"],
    exits: [2],
  },

  {
    id: 4,
    name: "Old Guard Room",
    markers: [{ x: 42, y: 84 }],
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
    exits: [2, 5],
  },

  {
    id: 5,
    name: "Collapsed Chamber",
    markers: [{ x: 61, y: 82 }],
    description:
      "A portion of the ceiling has fallen here, leaving a heap of broken stone and debris.",
    exits: [4, 6],
  },

  {
    id: 6,
    name: "Temple Ruins",
    markers: [{ x: 50, y: 62 }],
    description:
      "Ancient stonework and cracked decorative features suggest this was once a place of significance within the mine.",
    exits: [5, 7],
  },

  {
    id: 7,
    name: "The Forge of Spells",
    markers: [{ x: 65, y: 62 }],
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here.",
    description:
      "This chamber is the heart of Wave Echo Cave. The Forge of Spells once empowered weapons and armor with enchantment.",
    exits: [6],
  },

  {
    id: 8,
    name: "The Forge of Spells",
    markers: [{ x: 74, y: 68 }],
    readAloud:
      "A strange green glow illuminates this chamber. Arcane energy lingers here.",
    description: "This chamber is the heart of Wave Echo Cave.",
    exits: [3, 13],
  },

  {
    id: 9,
    name: "The Forge of Spells",
    markers: [{ x: 53, y: 50 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [7, 11, 12],
  },

  {
    id: 10,
    name: "The Forge of Spells",
    markers: [{ x: 16, y: 30 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [2, 11, 18],
  },

  {
    id: 11,
    name: "The Forge of Spells",
    markers: [{ x: 34, y: 31 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [10, 12, 18],
  },

  {
    id: 12,
    name: "The Forge of Spells",
    markers: [{ x: 63, y: 35 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 13,
    name: "The Forge of Spells",
    markers: [{ x: 82, y: 51 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 14,
    name: "The Forge of Spells",
    markers: [{ x: 89, y: 54 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 15,
    name: "The Forge of Spells",
    markers: [{ x: 87, y: 43 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 16,
    name: "The Forge of Spells",
    markers: [{ x: 77, y: 18 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 17,
    name: "The Forge of Spells",
    markers: [{ x: 49, y: 10 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 18,
    name: "The Forge of Spells",
    markers: [{ x: 36, y: 21 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 19,
    name: "The Forge of Spells",
    markers: [{ x: 13, y: 13 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },

  {
    id: 20,
    name: "The Forge of Spells",
    markers: [{ x: 23, y: 9 }],
    readAloud: "A strange green glow illuminates this chamber.",
    description: "Arcane energy lingers here.",
    exits: [9, 11, 15, 18],
  },
];

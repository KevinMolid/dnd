import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";

import { wyvernTorRooms } from "../../data/handouts/wyvernTorRooms";
import { waveEchoRooms } from "../../data/handouts/waveEchoRooms";
import { thundertreeRooms } from "../../data/handouts/thundertreeRooms";
import { cragmawCastleRooms } from "../../data/handouts/cragmawCastleRooms";
import { redbrandHideoutRooms } from "../../data/handouts/redbrandHideoutRooms";

const CAMPAIGN_ID = "f9vUb3UFgbbPun1hmen2";
const CREATED_BY_UID = "TpIjj1WnmrX1Ro3x79mun8m6ITj1";
const PLACEHOLDER_IMAGE_URL =
  "https://i.etsystatic.com/18388031/r/il/056bd0/6063210018/il_1080xN.6063210018_a4k1.jpg";

type SeedMap = {
  id: string;
  title: string;
  order: number;
  rooms: readonly unknown[];
};

const MAPS: SeedMap[] = [
  {
    id: "redbrand-hideout",
    title: "Redbrand Hideout",
    order: 1,
    rooms: redbrandHideoutRooms,
  },
  {
    id: "cragmaw-castle",
    title: "Cragmaw Castle",
    order: 2,
    rooms: cragmawCastleRooms,
  },
  {
    id: "thundertree",
    title: "Thundertree",
    order: 3,
    rooms: thundertreeRooms,
  },
  {
    id: "wave-echo-cave",
    title: "Wave Echo Cave",
    order: 4,
    rooms: waveEchoRooms,
  },
  {
    id: "wyvern-tor",
    title: "Wyvern Tor",
    order: 5,
    rooms: wyvernTorRooms,
  },
];

export const importStarterMaps = async () => {
  const batch = writeBatch(db);

  for (const map of MAPS) {
    const ref = doc(db, "campaigns", CAMPAIGN_ID, "maps", map.id);

    batch.set(
      ref,
      {
        title: map.title,
        imageUrl: PLACEHOLDER_IMAGE_URL,
        order: map.order,
        rooms: map.rooms,
        campaignId: CAMPAIGN_ID,
        createdByUid: CREATED_BY_UID,
        ownerUid: CREATED_BY_UID,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  }

  await batch.commit();
};
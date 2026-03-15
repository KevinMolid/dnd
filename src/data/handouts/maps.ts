import map1 from "/Maps/CragmawHideout.jpg";
import map2 from "/Maps/Phandalin.jpg";
import map3 from "/Maps/CragmawCastle.jpg";
import map4 from "/Maps/RedbrandHideout.jpg";
import map5 from "/Maps/Thundertree.jpg";
import map6 from "/Maps/WaveEchoCave.jpg";
import map7 from "/Maps/WyvernTor.jpg";

import type { MapHandout } from "./types";
import { redbrandHideoutRooms } from "./redbrandHideoutRooms";
import { waveEchoRooms } from "./waveEchoRooms";
import { cragmawCastleRooms } from "./cragmawCastleRooms";
import { thundertreeRooms } from "./thundertreeRooms";
import { wyvernTorRooms } from "./wyvernTorRooms";



export const maps: MapHandout[] = [
  { title: "Cragmaw Hideout", src: map1, rooms: [] },
  { title: "Phandalin", src: map2, rooms: [] },
    { title: "Cragmaw Castle", src: map3, rooms: cragmawCastleRooms },
  { title: "Redbrand Hideout", src: map4, rooms: redbrandHideoutRooms },
    { title: "Thundertree", src: map5, rooms: thundertreeRooms },
  { title: "Wave Echo Cave", src: map6, rooms: waveEchoRooms },
      { title: "Wyvern Tor", src: map7, rooms: wyvernTorRooms },

];
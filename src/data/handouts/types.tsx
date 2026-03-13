import type { ReactNode } from "react";
import type { EncounterTemplate } from "../../context/EncounterContext";

export type RoomMonster = {
  name: string;
  count?: number;
  notes?: string;
};

export type RoomData = {
  id: number;
  name: string;
  x: number;
  y: number;
  readAloud?: string;
  description: ReactNode;
  monsters?: RoomMonster[];
  captives?: ReactNode;
  treasure?: string[];
  developments?: ReactNode;
  experience?: string;
  notes?: string[];
  exits?: number[];
  encounterTemplate?: EncounterTemplate;
};

export type HandoutImage = {
  title: string;
  src: string;
};

export type MapHandout = HandoutImage & {
  rooms?: RoomData[];
};

export type Region = "צפון" | "מרכז" | "דרום" | null;

export type TypeBucket =
  | "מרתון"
  | "חצי מרתון"
  | "10 ק\"מ"
  | "5 ק\"מ"
  | "עממי / ילדים"
  | "אחר";

export interface RaceSize {
  avgFinishers: number | null;
  lastFinishers: number | null;
  class: string | null;
}

export interface RaceQuality {
  tier: string | null;
  depth: string | null;
  eq10kMen: string | null;
  eq10kWomen: string | null;
  roadComparable: boolean;
}

export interface Race {
  id: string;
  name: string;
  date: string;
  city: string;
  region: Region;
  lat: number | null;
  lng: number | null;
  distances: string[];
  distancesKm: (number | null)[];
  typeBucket: TypeBucket;
  difficulty: string | null;
  organizer: string | null;
  registrationUrl: string | null;
  officialUrl: string | null;
  iaaCertified: boolean;
  summary: string | null;
  racePage: string | null;
  size: RaceSize;
  quality: RaceQuality;
}

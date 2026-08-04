import type { Race, Region, TypeBucket } from "@/lib/types";
import { getRaceCategory, type RaceCategory } from "@/lib/badges";

export const REGIONS: Region[] = ["צפון", "מרכז", "דרום"];

export const DISTANCE_BUCKETS: TypeBucket[] = [
  "מרתון",
  "חצי מרתון",
  '10 ק"מ',
  '5 ק"מ',
  "עממי / ילדים",
];

export type QuickCategory = RaceCategory | "all";

export const REGISTRATION_STATUSES = [
  { value: "open", label: "פתוח להרשמה" },
  { value: "upcoming", label: "הרשמה טרם נפתחה" },
] as const;

export interface Filters {
  query: string;
  regions: Set<Region>;
  distances: Set<TypeBucket>;
  quickCategory: QuickCategory;
  registration: Set<"open" | "upcoming">;
}

export function emptyFilters(): Filters {
  return {
    query: "",
    regions: new Set(),
    distances: new Set(),
    quickCategory: "all",
    registration: new Set(),
  };
}

export function isFiltersActive(f: Filters) {
  return (
    f.regions.size > 0 ||
    f.distances.size > 0 ||
    f.quickCategory !== "all" ||
    f.registration.size > 0
  );
}

export function applyFilters(races: Race[], f: Filters): Race[] {
  const q = f.query.trim().toLowerCase();

  return races.filter((r) => {
    if (q) {
      const haystack = [r.name, r.city, r.organizer ?? "", ...r.distances]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (f.regions.size > 0 && (!r.region || !f.regions.has(r.region))) return false;

    if (f.distances.size > 0 && !f.distances.has(r.typeBucket)) return false;

    if (f.quickCategory !== "all" && getRaceCategory(r) !== f.quickCategory) return false;

    if (f.registration.size > 0) {
      const status = r.registrationUrl ? "open" : "upcoming";
      if (!f.registration.has(status)) return false;
    }

    return true;
  });
}

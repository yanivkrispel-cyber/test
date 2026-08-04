import type { Race } from "@/lib/types";

export type RaceCategory = "night" | "trail" | "road";

export function getRaceCategory(race: Race): RaceCategory {
  if (race.name.includes("לילה")) return "night";
  return race.quality.roadComparable ? "road" : "trail";
}

export const CATEGORY_LABEL: Record<RaceCategory, string> = {
  night: "מרוץ לילה",
  trail: "מרוץ שטח",
  road: "מרוץ כביש",
};

export function isPopular(race: Race): boolean {
  return race.size.class === "גדול" || Boolean(race.quality.tier?.startsWith("אליטה"));
}

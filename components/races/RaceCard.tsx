"use client";

import { MapPin, Calendar, Users, BadgeCheck, Mountain, Route } from "lucide-react";

import type { Race } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REGION_ACCENT: Record<string, string> = {
  צפון: "#2f9e6d",
  מרכז: "#ff385c",
  דרום: "#c17c1f",
};

function difficultyVariant(difficulty: string | null) {
  if (!difficulty) return "muted" as const;
  if (difficulty === "קל") return "success" as const;
  if (difficulty === "בינוני") return "outline" as const;
  return "default" as const;
}

interface RaceCardProps {
  race: Race;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function RaceCard({ race, selected, onSelect }: RaceCardProps) {
  const accent = (race.region && REGION_ACCENT[race.region]) || "#929292";
  const isRoad = race.quality.roadComparable;
  const registrationOpen = Boolean(race.registrationUrl);

  return (
    <article
      onClick={() => onSelect(race.id)}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-md border bg-canvas transition-shadow hover:shadow-card",
        selected ? "border-ink shadow-card" : "border-hairline-soft"
      )}
    >
      <div className="h-2" style={{ backgroundColor: accent }} />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold leading-snug text-ink">{race.name}</h3>
          {race.iaaCertified && (
            <span title="מוסמך איגוד האתלטיקה" className="shrink-0 text-primary">
              <BadgeCheck className="h-5 w-5" />
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(race.date)}
          </span>
          {race.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {race.city}
              {race.region ? ` · ${race.region}` : ""}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {race.distances.length > 0 ? (
            race.distances.map((d) => (
              <Badge key={d} variant="default">
                {d}
              </Badge>
            ))
          ) : (
            <Badge variant="muted">מרחקים יפורסמו בהמשך</Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {race.difficulty && (
            <Badge variant={difficultyVariant(race.difficulty)}>קושי: {race.difficulty}</Badge>
          )}
          <Badge variant="outline" className="inline-flex items-center gap-1">
            {isRoad ? <Route className="h-3 w-3" /> : <Mountain className="h-3 w-3" />}
            {isRoad ? "כביש" : "שטח"}
          </Badge>
          {race.size.class && (
            <Badge variant="outline" className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {race.size.class}
              {race.size.avgFinishers ? ` · ${race.size.avgFinishers.toLocaleString("he-IL")} בממוצע` : ""}
            </Badge>
          )}
        </div>

        {race.quality.tier && (
          <div className="rounded-sm bg-surface-soft px-3 py-2 text-[12px] text-body">
            <span className="font-semibold text-ink">דירוג איכות: </span>
            {race.quality.tier}
            {race.quality.eq10kMen && (
              <span className="text-muted"> · שווה-ערך 10 ק&quot;מ (גברים): {race.quality.eq10kMen}</span>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center gap-2">
          {registrationOpen ? (
            <Button
              asChild
              size="sm"
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={race.registrationUrl!} target="_blank" rel="noopener noreferrer">
                הרשמה למרוץ
              </a>
            </Button>
          ) : (
            <Badge variant="muted" className="flex-1 justify-center py-2.5">
              הרשמה טרם נפתחה
            </Badge>
          )}
          {race.racePage && (
            <Button
              asChild
              variant="outline"
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={race.racePage} target="_blank" rel="noopener noreferrer">
                פרטים
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

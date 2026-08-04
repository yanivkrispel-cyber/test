"use client";

import { MapPin, Calendar, Users, BadgeCheck, Mountain, Route, Flame } from "lucide-react";

import type { Race } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { getRaceCategory, isPopular } from "@/lib/badges";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RaceCoverArt } from "@/components/races/RaceCoverArt";

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
  const category = getRaceCategory(race);
  const isRoad = race.quality.roadComparable;
  const registrationOpen = Boolean(race.registrationUrl);
  const popular = isPopular(race);

  return (
    <article
      onClick={() => onSelect(race.id)}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-md border bg-canvas transition-shadow hover:shadow-card",
        selected ? "border-ink shadow-card" : "border-hairline-soft"
      )}
    >
      <div className="relative aspect-[16/10]">
        <RaceCoverArt category={category} className="absolute inset-0" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {race.city ? (
            <Badge variant="canvas" className="shadow-card">
              <MapPin className="h-3 w-3" />
              {race.city}
            </Badge>
          ) : (
            <span />
          )}
          {registrationOpen ? (
            <Badge className="bg-[#0f7a3d] text-white shadow-card">פתוחה להרשמה</Badge>
          ) : (
            <Badge variant="canvas" className="text-muted shadow-card">
              הרשמה טרם נפתחה
            </Badge>
          )}
        </div>

        {popular && (
          <div className="absolute inset-x-3 bottom-3">
            <Badge variant="canvas" className="shadow-card gap-1">
              <Flame className="h-3 w-3 text-primary" />
              מבוקש ביותר
            </Badge>
          </div>
        )}
      </div>

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
          {race.region && <span>{race.region}</span>}
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

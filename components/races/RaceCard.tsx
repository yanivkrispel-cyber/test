"use client";

import { useState } from "react";
import { MapPin, Calendar, BadgeCheck, Mountain, Route, Flame } from "lucide-react";

import type { Race } from "@/lib/types";
import { formatDateShort } from "@/lib/format";
import { getRaceCategory, isPopular } from "@/lib/badges";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RaceCoverArt } from "@/components/races/RaceCoverArt";

const MAX_VISIBLE_DISTANCES = 3;

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
  const [imageFailed, setImageFailed] = useState(false);
  const visibleDistances = race.distances.slice(0, MAX_VISIBLE_DISTANCES);
  const hiddenDistanceCount = race.distances.length - visibleDistances.length;

  return (
    <article
      onClick={() => onSelect(race.id)}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-md border bg-canvas transition-shadow hover:shadow-card",
        selected ? "border-ink shadow-card" : "border-hairline-soft"
      )}
    >
      <div className="relative aspect-[16/10]">
        {race.coverImageUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={race.coverImageUrl}
            alt={race.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <RaceCoverArt category={category} className="absolute inset-0" />
        )}

        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1.5">
          {race.city ? (
            <Badge variant="canvas" className="shadow-card px-2 py-1 text-[10px]">
              <MapPin className="h-2.5 w-2.5" />
              {race.city}
            </Badge>
          ) : (
            <span />
          )}
          {registrationOpen ? (
            <Badge className="bg-[#0f7a3d] px-2 py-1 text-[10px] text-white shadow-card">
              פתוחה להרשמה
            </Badge>
          ) : (
            <Badge variant="canvas" className="px-2 py-1 text-[10px] text-muted shadow-card">
              טרם נפתחה
            </Badge>
          )}
        </div>

        {popular && (
          <div className="absolute inset-x-2 bottom-2">
            <Badge variant="canvas" className="shadow-card gap-1 px-2 py-1 text-[10px]">
              <Flame className="h-2.5 w-2.5 text-primary" />
              מבוקש ביותר
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="line-clamp-1 text-[14px] font-semibold leading-snug text-ink" title={race.name}>
            {race.name}
          </h3>
          {race.iaaCertified && (
            <span title="מוסמך איגוד האתלטיקה" className="shrink-0 text-primary">
              <BadgeCheck className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateShort(race.date)}
          </span>
          {race.region && <span>{race.region}</span>}
        </div>

        <div className="flex flex-wrap gap-1">
          {visibleDistances.length > 0 ? (
            <>
              {visibleDistances.map((d) => (
                <Badge key={d} variant="default" className="px-2 py-1 text-[10px]">
                  {d}
                </Badge>
              ))}
              {hiddenDistanceCount > 0 && (
                <Badge variant="muted" className="px-2 py-1 text-[10px]">
                  +{hiddenDistanceCount}
                </Badge>
              )}
            </>
          ) : (
            <Badge variant="muted" className="px-2 py-1 text-[10px]">
              מרחקים יפורסמו בהמשך
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {race.difficulty && (
            <Badge variant={difficultyVariant(race.difficulty)} className="px-2 py-1 text-[10px]">
              {race.difficulty}
            </Badge>
          )}
          <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-[10px]">
            {isRoad ? <Route className="h-2.5 w-2.5" /> : <Mountain className="h-2.5 w-2.5" />}
            {isRoad ? "כביש" : "שטח"}
          </Badge>
        </div>

        {race.quality.tier && (
          <div className="truncate rounded-sm bg-surface-soft px-2 py-1.5 text-[11px] text-body">
            <span className="font-semibold text-ink">איכות: </span>
            {race.quality.tier}
          </div>
        )}

        <div className="mt-0.5 flex items-center gap-1.5">
          {registrationOpen ? (
            <Button asChild size="sm" className="h-9 flex-1 text-[13px]" onClick={(e) => e.stopPropagation()}>
              <a href={race.registrationUrl!} target="_blank" rel="noopener noreferrer">
                הרשמה
              </a>
            </Button>
          ) : (
            <Badge variant="muted" className="h-9 flex-1 items-center justify-center text-[12px]">
              טרם נפתחה
            </Badge>
          )}
          {race.racePage && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 text-[13px]"
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

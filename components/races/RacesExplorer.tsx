"use client";

import { useMemo, useState } from "react";
import { Map as MapIcon, List as ListIcon } from "lucide-react";

import type { Race } from "@/lib/types";
import { applyFilters, emptyFilters, type Filters } from "@/lib/filters";
import { Header } from "@/components/races/Header";
import { FilterPanel } from "@/components/races/FilterPanel";
import { RaceCard } from "@/components/races/RaceCard";
import { MapView } from "@/components/races/MapView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RacesExplorerProps {
  races: Race[];
}

export function RacesExplorer({ races }: RacesExplorerProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const filtered = useMemo(() => applyFilters(races, filters), [races, filters]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.date.localeCompare(b.date)),
    [filtered]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header filters={filters} onChange={setFilters} resultCount={filtered.length} />

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 lg:grid-cols-[260px_1fr_1fr] lg:px-6">
        {/* filter sidebar — desktop only */}
        <aside className="hidden border-e border-hairline-soft lg:block">
          <div className="sticky top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto py-2">
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* race list */}
        <section
          className={cn(
            "px-4 py-4 sm:px-6 lg:border-e lg:border-hairline-soft",
            mobileView === "map" && "hidden lg:block"
          )}
        >
          <div className="lg:h-[calc(100vh-73px-2rem)] lg:overflow-y-auto lg:pe-2">
            {sorted.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-muted">
                <p className="text-[16px] font-medium text-ink">לא נמצאו מרוצים תואמים</p>
                <p className="text-[14px]">נסו לשנות את מילות החיפוש או לנקות סינון</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 lg:grid-cols-1">
                {sorted.map((race) => (
                  <RaceCard
                    key={race.id}
                    race={race}
                    selected={race.id === selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      setMobileView("map");
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* map */}
        <section
          className={cn(
            "px-4 pb-4 sm:px-6 lg:px-0 lg:pb-0",
            mobileView === "list" && "hidden lg:block"
          )}
        >
          <div className="h-[70vh] lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)]">
            <MapView races={filtered} selectedId={selectedId} onSelectRace={setSelectedId} />
          </div>
        </section>
      </div>

      {/* mobile list/map toggle */}
      <div className="fixed inset-x-0 bottom-4 z-20 flex justify-center lg:hidden">
        <div className="flex items-center gap-1 rounded-full bg-ink p-1 shadow-card">
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "gap-1.5 rounded-full text-white hover:bg-white/10",
              mobileView === "list" && "bg-white text-ink hover:bg-white"
            )}
            onClick={() => setMobileView("list")}
          >
            <ListIcon className="h-4 w-4" />
            רשימה
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "gap-1.5 rounded-full text-white hover:bg-white/10",
              mobileView === "map" && "bg-white text-ink hover:bg-white"
            )}
            onClick={() => setMobileView("map")}
          >
            <MapIcon className="h-4 w-4" />
            מפה
          </Button>
        </div>
      </div>
    </div>
  );
}

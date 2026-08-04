"use client";

import { Search, SlidersHorizontal, Footprints } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/races/FilterPanel";
import { isFiltersActive, type Filters } from "@/lib/filters";

interface HeaderProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}

export function Header({ filters, onChange, resultCount }: HeaderProps) {
  const activeCount =
    filters.regions.size + filters.distances.size + filters.trackTypes.size + filters.registration.size;

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <div className="flex items-center gap-2 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <Footprints className="h-5 w-5" />
          </span>
          <span className="text-[18px] font-bold whitespace-nowrap">מדד המרוצים</span>
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="חיפוש לפי שם מרוץ, עיר או מרחק…"
            className="rounded-full ps-11"
            aria-label="חיפוש מרוצים"
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            data-testid="result-count"
            className="hidden text-[14px] text-muted sm:inline whitespace-nowrap"
          >
            {resultCount.toLocaleString("he-IL")} מרוצים
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                סינון
                {activeCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-white">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent title="סינון מרוצים">
              <FilterPanel filters={filters} onChange={onChange} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isFiltersActive(filters) === false ? null : (
        <div className="border-t border-hairline-soft px-4 py-1.5 text-center text-[12px] text-muted sm:hidden">
          {resultCount.toLocaleString("he-IL")} תוצאות
        </div>
      )}
    </header>
  );
}

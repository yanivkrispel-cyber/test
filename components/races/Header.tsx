"use client";

import { Search, SlidersHorizontal, Footprints, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/races/FilterPanel";
import { CategoryTabs } from "@/components/races/CategoryTabs";
import { REGIONS, DISTANCE_BUCKETS, isFiltersActive, type Filters } from "@/lib/filters";
import type { Region, TypeBucket } from "@/lib/types";

type NonNullRegion = Exclude<Region, null>;

interface HeaderProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}

function SegmentSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | "";
  options: { value: T; label: string }[];
  onChange: (value: T | "") => void;
}) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col justify-center px-5 py-1.5">
      <span className="text-[12px] font-semibold text-ink">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className="w-full cursor-pointer appearance-none truncate bg-transparent pe-5 text-[14px] text-muted outline-none"
      >
        <option value="">הכל</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-2 start-4 h-3.5 w-3.5 text-muted" />
    </div>
  );
}

export function Header({ filters, onChange, resultCount }: HeaderProps) {
  const activeCount = filters.regions.size + filters.distances.size + filters.registration.size;

  const singleRegion = filters.regions.size === 1 ? [...filters.regions][0] : "";
  const singleDistance = filters.distances.size === 1 ? [...filters.distances][0] : "";

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center justify-between gap-2 text-ink">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
              <Footprints className="h-5 w-5" />
            </span>
            <span className="text-[18px] font-bold whitespace-nowrap">מדד המרוצים</span>
          </div>
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

        {/* mobile: simple search input */}
        <div className="relative sm:hidden">
          <Search className="pointer-events-none absolute top-1/2 start-4 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="חיפוש לפי שם מרוץ, עיר או מרחק…"
            className="rounded-full ps-11"
            aria-label="חיפוש מרוצים"
          />
        </div>

        {/* desktop: segmented pill search bar */}
        <div className="hidden flex-1 items-stretch overflow-hidden rounded-full border border-hairline bg-canvas shadow-card sm:flex">
          <div className="flex min-w-0 flex-[1.4] flex-col justify-center px-5 py-1.5">
            <span className="text-[12px] font-semibold text-ink">חיפוש</span>
            <input
              value={filters.query}
              onChange={(e) => onChange({ ...filters, query: e.target.value })}
              placeholder="שם מרוץ, עיר…"
              aria-label="חיפוש מרוצים"
              className="w-full truncate bg-transparent text-[14px] text-ink placeholder:text-muted outline-none"
            />
          </div>
          <div className="w-px shrink-0 bg-hairline" />
          <SegmentSelect<TypeBucket>
            label="מרחק מקצה"
            value={singleDistance}
            options={DISTANCE_BUCKETS.map((d) => ({ value: d, label: d }))}
            onChange={(v) =>
              onChange({ ...filters, distances: v ? new Set([v]) : new Set() })
            }
          />
          <div className="w-px shrink-0 bg-hairline" />
          <SegmentSelect<NonNullRegion>
            label="אזור"
            value={(singleRegion || "") as NonNullRegion | ""}
            options={REGIONS.filter((r): r is NonNullRegion => Boolean(r)).map((r) => ({
              value: r,
              label: r,
            }))}
            onChange={(v) =>
              onChange({ ...filters, regions: v ? new Set([v]) : new Set() })
            }
          />
          <div className="flex items-center p-1.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary">
              <Search className="h-4 w-4" />
            </span>
          </div>
        </div>

        <span className="hidden shrink-0 text-[14px] text-muted lg:inline whitespace-nowrap" data-testid="result-count">
          {resultCount.toLocaleString("he-IL")} מרוצים
        </span>
      </div>

      <div className="border-t border-hairline-soft">
        <CategoryTabs
          value={filters.quickCategory}
          onChange={(quickCategory) => onChange({ ...filters, quickCategory })}
        />
      </div>

      {isFiltersActive(filters) && (
        <div className="border-t border-hairline-soft px-4 py-1.5 text-center text-[12px] text-muted sm:hidden">
          {resultCount.toLocaleString("he-IL")} תוצאות
        </div>
      )}
    </header>
  );
}

"use client";

import { cn } from "@/lib/utils";
import {
  REGIONS,
  DISTANCE_BUCKETS,
  REGISTRATION_STATUSES,
  isFiltersActive,
  type Filters,
} from "@/lib/filters";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  filters: Filters;
  onChange: (next: Filters) => void;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-[14px] font-medium transition-colors",
        active
          ? "border-ink bg-ink text-white"
          : "border-hairline bg-canvas text-ink hover:border-border-strong"
      )}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-hairline-soft px-5 py-5 last:border-b-0">
      <h3 className="mb-3 text-[16px] font-semibold text-ink">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function toggleSetValue<T>(set: Set<T>, value: T) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  }

  return (
    <div>
      <Section title="אזור">
        {REGIONS.map((region) => (
          <Chip
            key={region}
            active={filters.regions.has(region)}
            onClick={() =>
              onChange({ ...filters, regions: toggleSetValue(filters.regions, region) })
            }
          >
            {region}
          </Chip>
        ))}
      </Section>

      <Section title="מרחק">
        {DISTANCE_BUCKETS.map((bucket) => (
          <Chip
            key={bucket}
            active={filters.distances.has(bucket)}
            onClick={() =>
              onChange({ ...filters, distances: toggleSetValue(filters.distances, bucket) })
            }
          >
            {bucket}
          </Chip>
        ))}
      </Section>

      <Section title="סטטוס הרשמה">
        {REGISTRATION_STATUSES.map((status) => (
          <Chip
            key={status.value}
            active={filters.registration.has(status.value)}
            onClick={() =>
              onChange({
                ...filters,
                registration: toggleSetValue(filters.registration, status.value),
              })
            }
          >
            {status.label}
          </Chip>
        ))}
      </Section>

      {isFiltersActive(filters) && (
        <div className="px-5 py-4">
          <Button
            variant="tertiary"
            size="sm"
            className="px-0"
            onClick={() =>
              onChange({
                ...filters,
                regions: new Set(),
                distances: new Set(),
                quickCategory: "all",
                registration: new Set(),
              })
            }
          >
            נקה סינון
          </Button>
        </div>
      )}
    </div>
  );
}

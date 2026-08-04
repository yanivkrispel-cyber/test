"use client";

import { Moon, Mountain, Route, LayoutGrid } from "lucide-react";

import type { QuickCategory } from "@/lib/filters";
import { cn } from "@/lib/utils";

const TABS: { value: QuickCategory; label: string; Icon: typeof Route }[] = [
  { value: "all", label: "כל המרוצים", Icon: LayoutGrid },
  { value: "night", label: "מרוצי לילה", Icon: Moon },
  { value: "trail", label: "מרוצי שטח", Icon: Mountain },
  { value: "road", label: "מרוצי כביש", Icon: Route },
];

interface CategoryTabsProps {
  value: QuickCategory;
  onChange: (value: QuickCategory) => void;
}

export function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <nav className="scrollbar-none flex gap-1 overflow-x-auto px-4 sm:px-6" dir="rtl">
      {TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[14px] font-medium transition-colors",
              active
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink"
            )}
          >
            <tab.Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

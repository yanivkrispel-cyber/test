import { Moon, Mountain, Route } from "lucide-react";

import type { RaceCategory } from "@/lib/badges";
import { cn } from "@/lib/utils";

const CATEGORY_STYLES: Record<
  RaceCategory,
  { gradient: string; Icon: typeof Route }
> = {
  road: { gradient: "linear-gradient(135deg, #ff5470 0%, #ff385c 45%, #c1123a 100%)", Icon: Route },
  trail: { gradient: "linear-gradient(135deg, #4cb98a 0%, #2f9e6d 45%, #1c5c40 100%)", Icon: Mountain },
  night: { gradient: "linear-gradient(135deg, #2d2f5e 0%, #1a1a3d 55%, #0f0f23 100%)", Icon: Moon },
};

export function RaceCoverArt({
  category,
  className,
}: {
  category: RaceCategory;
  className?: string;
}) {
  const { gradient, Icon } = CATEGORY_STYLES[category];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundImage: gradient }}
    >
      {/* decorative texture per category, purely illustrative */}
      {category === "night" ? (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(1.5px 1.5px at 20% 30%, #fff 100%, transparent 100%), radial-gradient(1.5px 1.5px at 65% 20%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 80% 45%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 35% 60%, #fff 100%, transparent 100%), radial-gradient(1.5px 1.5px at 90% 15%, #fff 100%, transparent 100%), radial-gradient(1px 1px at 10% 70%, #fff 100%, transparent 100%)",
          }}
        />
      ) : (
        <svg
          className="absolute inset-0 h-full w-full opacity-25"
          viewBox="0 0 200 120"
          preserveAspectRatio="none"
          fill="none"
        >
          {category === "road" ? (
            <path
              d="M -10 90 C 40 60, 60 100, 110 70 S 180 40, 220 60"
              stroke="#ffffff"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M -10 100 L 30 55 L 55 80 L 90 30 L 120 75 L 150 45 L 175 80 L 210 60 L 210 120 L -10 120 Z"
              fill="#ffffff"
            />
          )}
        </svg>
      )}

      <Icon
        className="absolute bottom-3 start-3 h-9 w-9 text-white/70"
        strokeWidth={1.5}
      />
    </div>
  );
}

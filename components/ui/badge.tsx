import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-[11px] font-semibold leading-none px-2.5 py-1.5 w-fit",
  {
    variants: {
      variant: {
        default: "bg-surface-strong text-ink",
        canvas: "bg-canvas text-ink shadow-card",
        primary: "bg-primary text-on-primary",
        outline: "bg-canvas text-ink border border-hairline",
        success: "bg-[#e7f6ec] text-[#0f7a3d]",
        muted: "bg-transparent text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };

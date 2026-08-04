import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[16px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary rounded-sm hover:bg-primary-active",
        secondary:
          "bg-canvas text-ink rounded-sm border border-ink hover:bg-surface-soft",
        tertiary: "bg-transparent text-ink underline-offset-4 hover:underline",
        pill: "bg-primary text-on-primary rounded-full text-[14px] hover:bg-primary-active",
        outline:
          "bg-canvas text-ink rounded-full border border-hairline hover:border-border-strong",
        ghost: "bg-transparent text-ink rounded-full hover:bg-surface-strong",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-9 px-4 text-[14px]",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}

export { Button, buttonVariants };

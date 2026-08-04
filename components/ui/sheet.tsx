"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  title = "סינון",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { title?: string }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 end-0 z-50 flex h-full w-5/6 max-w-sm flex-col gap-0 bg-canvas shadow-lg",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <DialogPrimitive.Title className="text-[20px] font-semibold text-ink">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className="rounded-full p-2 hover:bg-surface-strong">
            <X className="h-5 w-5" />
            <span className="sr-only">סגור</span>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent };

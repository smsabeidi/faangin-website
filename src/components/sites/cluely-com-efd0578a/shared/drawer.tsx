"use client";

import type { ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

export function Drawer({ shouldScaleBackground = true, ...props }: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" shouldScaleBackground={shouldScaleBackground} repositionInputs={false} {...props} />;
}

export function DrawerTrigger(props: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal(props: ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/80 dark:bg-background/90", className)}
      {...props}
    />
  );
}

export function DrawerContent({
  className,
  children,
  hasHandle = true,
  hasOverlay = true,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content> & { hasHandle?: boolean; hasOverlay?: boolean }) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      {hasOverlay && <DrawerOverlay />}
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn("fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-[10px] border bg-popover", className)}
        {...props}
      >
        {hasHandle && <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-muted" />}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

export function DrawerTitle({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title data-slot="drawer-title" className={cn("text-lg leading-none font-semibold tracking-tight", className)} {...props} />
  );
}

export function DrawerDescription({ className, ...props }: ComponentProps<typeof DrawerPrimitive.Description>) {
  return <DrawerPrimitive.Description data-slot="drawer-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

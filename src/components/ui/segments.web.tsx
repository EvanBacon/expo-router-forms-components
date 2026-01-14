"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------------
 * Segments (Container)
 * ----------------------------------------------------------------------------------*/

interface SegmentsProps {
  /** The initial value for uncontrolled Segments */
  defaultValue?: string;

  /** The controlled value for controlled Segments */
  value?: string;

  /** Callback when the value changes (for controlled mode) */
  onValueChange?: (value: string) => void;

  /** The children of the Segments component (SegmentsList, SegmentsContent, etc.) */
  children: ReactNode;

  /** Additional CSS classes */
  className?: string;
}

export function Segments({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: SegmentsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="segments"
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn("flex flex-col gap-2", className)}
    >
      {children}
    </TabsPrimitive.Root>
  );
}

/* ----------------------------------------------------------------------------------
 * SegmentsList
 * ----------------------------------------------------------------------------------*/

export function SegmentsList({
  children,
  className,
}: {
  /** The children will typically be one or more SegmentsTrigger elements */
  children: ReactNode;
  /** Style prop (ignored on web, use className instead) */
  style?: any;
  /** Additional CSS classes */
  className?: string;
}) {
  return (
    <TabsPrimitive.List
      data-slot="segments-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
    >
      {children}
    </TabsPrimitive.List>
  );
}

/* ----------------------------------------------------------------------------------
 * SegmentsTrigger
 * ----------------------------------------------------------------------------------*/

interface SegmentsTriggerProps {
  /** The value that this trigger represents */
  value: string;
  /** The label to display for this trigger */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function SegmentsTrigger({
  value,
  children,
  className,
}: SegmentsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="segments-trigger"
      value={value}
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

SegmentsTrigger.displayName = "SegmentsTrigger";

/* ----------------------------------------------------------------------------------
 * SegmentsContent
 * ----------------------------------------------------------------------------------*/

interface SegmentsContentProps {
  /** The value from the matching SegmentsTrigger */
  value: string;
  /** The content to be rendered when the active value matches */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function SegmentsContent({
  value,
  children,
  className,
}: SegmentsContentProps) {
  return (
    <TabsPrimitive.Content
      data-slot="segments-content"
      value={value}
      className={cn("flex-1 outline-none", className)}
    >
      {children}
    </TabsPrimitive.Content>
  );
}

Segments.List = SegmentsList;
Segments.Trigger = SegmentsTrigger;
Segments.Content = SegmentsContent;

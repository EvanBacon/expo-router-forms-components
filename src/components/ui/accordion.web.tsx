"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// Context for custom indicators to access expanded state
const AccordionItemContext = React.createContext<{
  isExpanded: boolean;
} | null>(null);

export function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("useAccordionItem must be used within an Accordion.Item");
  }
  return context;
}

export type AccordionProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  className?: string;
};

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export type AccordionItemProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Item
> & {
  className?: string;
};

export function AccordionItem({
  className,
  value,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("group border-b border-sf-border", className)}
      value={value}
      {...props}
    >
      <AccordionItemContext.Provider
        value={{
          // Use data attribute to determine expanded state
          get isExpanded() {
            return false; // Will be overridden by CSS/data-state
          },
        }}
      >
        {children}
      </AccordionItemContext.Provider>
    </AccordionPrimitive.Item>
  );
}

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  className?: string;
  /** Custom indicator element, or false to hide the indicator */
  indicator?: React.ReactNode | false;
};

export function AccordionTrigger({
  className,
  children,
  indicator,
  ...props
}: AccordionTriggerProps) {
  const showDefaultIndicator = indicator === undefined;
  const showCustomIndicator = indicator !== undefined && indicator !== false;

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-left text-base font-medium text-sf-text transition-all",
          "hover:underline",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
          "[&[data-state=open]_.accordion-indicator]:rotate-180",
          className
        )}
        {...props}
      >
        <span className="flex-1 pr-2">{children}</span>
        {showDefaultIndicator && (
          <ChevronDownIcon className="accordion-indicator h-3.5 w-3.5 shrink-0 text-sf-text-3 transition-transform duration-200" />
        )}
        {showCustomIndicator && indicator}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
> & {
  className?: string;
};

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "overflow-hidden text-sm text-sf-text-2 transition-all",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

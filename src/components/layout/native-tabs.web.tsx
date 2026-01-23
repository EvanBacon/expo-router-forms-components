"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------------
 * Context for BottomAccessory
 * ----------------------------------------------------------------------------------*/

type BottomAccessoryPlacement = "regular" | "inline";

interface BottomAccessoryContextValue {
  placement: BottomAccessoryPlacement;
}

const BottomAccessoryContext = React.createContext<BottomAccessoryContextValue>(
  {
    placement: "regular",
  }
);

/**
 * Hook to get the current placement of the BottomAccessory.
 * On web, always returns 'regular' since there's no inline tab bar mode.
 */
function usePlacement(): BottomAccessoryPlacement {
  const context = React.useContext(BottomAccessoryContext);
  return context.placement;
}

/* ----------------------------------------------------------------------------------
 * BottomAccessory Component
 * ----------------------------------------------------------------------------------*/

interface BottomAccessoryProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * BottomAccessory renders content above the tab bar (like Apple Music's mini-player).
 *
 * On web, this creates a floating accessory bar at the bottom of the viewport.
 * Use the usePlacement() hook to adapt content based on placement.
 */
function BottomAccessory({ children, className }: BottomAccessoryProps) {
  return (
    <div
      data-slot="bottom-accessory"
      className={cn(
        "fixed bottom-4 left-1/2 z-50 -translate-x-1/2",
        "flex items-center justify-center",
        "pointer-events-auto",
        className
      )}
    >
      <BottomAccessoryContext.Provider value={{ placement: "regular" }}>
        {children}
      </BottomAccessoryContext.Provider>
    </div>
  );
}

// Attach the usePlacement hook to the component
BottomAccessory.usePlacement = usePlacement;

/* ----------------------------------------------------------------------------------
 * Tabs Wrapper (Web)
 *
 * On web, this is a minimal wrapper since the actual tab UI is handled by
 * TabBarController. This wrapper just provides the BottomAccessory positioning.
 * ----------------------------------------------------------------------------------*/

interface TabsProps {
  children?: React.ReactNode;
  className?: string;
  tintColor?: string;
}

/**
 * Web implementation of Tabs wrapper.
 *
 * This is a lightweight container that handles BottomAccessory positioning.
 * For full web tab functionality, use TabBarControllerTabs from
 * @/components/ui/tab-bar-controller.web instead.
 */
function Tabs({ children, className }: TabsProps) {
  // Separate BottomAccessory children from other children
  const { accessories, otherChildren } = React.useMemo(() => {
    const accessories: React.ReactNode[] = [];
    const otherChildren: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === BottomAccessory) {
        accessories.push(child);
      } else {
        otherChildren.push(child);
      }
    });

    return { accessories, otherChildren };
  }, [children]);

  return (
    <div data-slot="tabs-wrapper" className={cn("relative flex flex-1 flex-col", className)}>
      {otherChildren}
      {accessories}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * Trigger Components (Web Stubs)
 *
 * These are placeholder components that maintain API compatibility with native.
 * On web, the actual tab triggers are handled by TabBarController.
 * ----------------------------------------------------------------------------------*/

interface TriggerProps {
  name: string;
  role?: "search" | undefined;
  children?: React.ReactNode;
}

function Trigger({ children }: TriggerProps) {
  // On web, triggers are handled by TabBarController
  // This just passes through children for compatibility
  return <>{children}</>;
}

function TriggerLabel({ children }: { children?: React.ReactNode }) {
  return null;
}

interface TriggerIconProps {
  sf?:
    | string
    | {
        default: string;
        selected?: string;
      };
}

function TriggerIcon(_props: TriggerIconProps) {
  return null;
}

// Attach sub-components
Trigger.Label = TriggerLabel;
Trigger.Icon = TriggerIcon;

// Attach to Tabs
Tabs.Trigger = Trigger;
Tabs.BottomAccessory = BottomAccessory;

export { Tabs, usePlacement };
export type { BottomAccessoryProps, BottomAccessoryPlacement, TabsProps };

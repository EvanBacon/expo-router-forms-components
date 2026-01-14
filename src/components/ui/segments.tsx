"use client";

import SegmentedControl from "@react-native-segmented-control/segmented-control";

import React, {
  Children,
  createContext,
  ReactNode,
  use,
  useState,
} from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------------
 * Context
 * ----------------------------------------------------------------------------------*/

interface SegmentsContextValue {
  value: string;
  setValue: (value: string | ((prev: string) => string)) => void;
}

const SegmentsContext = createContext<SegmentsContextValue | undefined>(
  undefined
);

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

  /** Additional CSS classes (primarily used on web) */
  className?: string;
}

export function Segments({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: SegmentsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ""
  );

  // Determine if we're in controlled mode
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (newValue: string | ((prev: string) => string)) => {
    const resolvedValue =
      typeof newValue === "function" ? newValue(value) : newValue;

    if (!isControlled) {
      setUncontrolledValue(resolvedValue);
    }
    onValueChange?.(resolvedValue);
  };

  return (
    <SegmentsContext value={{ value, setValue }}>
      <View className={cn("flex flex-col gap-2", className)}>{children}</View>
    </SegmentsContext>
  );
}

export function SegmentsList({
  children,
  style,
  className,
}: {
  /** The children will typically be one or more SegmentsTrigger elements */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Additional CSS classes (primarily used on web) */
  className?: string;
}) {
  const context = use(SegmentsContext);
  if (!context) {
    throw new Error("SegmentsList must be used within a Segments");
  }

  const { value, setValue } = context;

  // Filter out only SegmentsTrigger elements
  const triggers = Children.toArray(children).filter(
    (child: any) => child.type?.displayName === "SegmentsTrigger"
  );

  // Collect labels and values from each SegmentsTrigger
  const labels = triggers.map((trigger: any) => trigger.props.children);
  const values = triggers.map((trigger: any) => trigger.props.value);

  // When the user switches the segment, update the context value
  const handleChange = (event: any) => {
    const index = event.nativeEvent.selectedSegmentIndex;
    setValue(values[index]);
  };

  return (
    <SegmentedControl
      values={labels}
      style={style}
      selectedIndex={values.indexOf(value)}
      onChange={handleChange}
    />
  );
}

/* ----------------------------------------------------------------------------------
 * SegmentsTrigger
 * ----------------------------------------------------------------------------------*/

interface SegmentsTriggerProps {
  /** The value that this trigger represents */
  value: string;
  /** The label to display for this trigger in the SegmentedControl */
  children: ReactNode;
  /** Additional CSS classes (primarily used on web) */
  className?: string;
}

export function SegmentsTrigger(_: SegmentsTriggerProps) {
  // We don't actually render anything here. This component serves as a "marker"
  // for the SegmentsList to know about possible segments.
  return null;
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
  /** Additional CSS classes (primarily used on web) */
  className?: string;
}

export function SegmentsContent({
  value,
  children,
  className,
}: SegmentsContentProps) {
  const context = use(SegmentsContext);
  if (!context) {
    throw new Error("SegmentsContent must be used within a Segments");
  }

  const { value: currentValue } = context;
  if (currentValue !== value) {
    return null;
  }

  return (
    <View className={cn("flex-1 outline-none", className)}>{children}</View>
  );
}

Segments.List = SegmentsList;
Segments.Trigger = SegmentsTrigger;
Segments.Content = SegmentsContent;

import * as React from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { Animated } from "@/tw/animated";
import { View, Text, ViewProps } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";
import { SFIcon } from "./sf-icon";

// Animation constants inspired by heroui
const LAYOUT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

const INDICATOR_SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
};

const CONTENT_FADE_DURATION = 150;

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  expandedItems: string[];
  toggleItem: (value: string) => void;
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

function useAccordionContext() {
  const context = React.use(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

type AccordionItemContextValue = {
  value: string;
  isExpanded: boolean;
  toggle: () => void;
};

const AccordionItemContext = React.createContext<
  AccordionItemContextValue | undefined
>(undefined);

function useAccordionItemContext() {
  const context = React.use(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionItem components must be used within an AccordionItem"
    );
  }
  return context;
}

// Export hook for custom triggers
export { useAccordionItemContext as useAccordionItem };

export type AccordionProps = ViewProps & {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  className?: string;
};

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onValueChange,
  collapsible = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const isControlled = controlledValue !== undefined;
  const expandedItems = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : controlledValue
        ? [controlledValue]
        : []
    : internalValue;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      let newValue: string[];

      if (type === "single") {
        if (expandedItems.includes(itemValue)) {
          newValue = collapsible ? [] : [itemValue];
        } else {
          newValue = [itemValue];
        }
      } else {
        if (expandedItems.includes(itemValue)) {
          newValue = expandedItems.filter((v) => v !== itemValue);
        } else {
          newValue = [...expandedItems, itemValue];
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onValueChange) {
        onValueChange(type === "single" ? (newValue[0] ?? "") : newValue);
      }
    },
    [type, expandedItems, collapsible, isControlled, onValueChange]
  );

  return (
    <AccordionContext value={{ type, expandedItems, toggleItem, collapsible }}>
      <Animated.View
        layout={LinearTransition.springify()
          .damping(LAYOUT_SPRING_CONFIG.damping)
          .stiffness(LAYOUT_SPRING_CONFIG.stiffness)
          .mass(LAYOUT_SPRING_CONFIG.mass)}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </Animated.View>
    </AccordionContext>
  );
}

export type AccordionItemProps = ViewProps & {
  value: string;
  className?: string;
};

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const { expandedItems, toggleItem } = useAccordionContext();
  const isExpanded = expandedItems.includes(value);

  const toggle = React.useCallback(() => {
    toggleItem(value);
  }, [toggleItem, value]);

  return (
    <AccordionItemContext value={{ value, isExpanded, toggle }}>
      <Animated.View
        layout={LinearTransition.springify()
          .damping(LAYOUT_SPRING_CONFIG.damping)
          .stiffness(LAYOUT_SPRING_CONFIG.stiffness)
          .mass(LAYOUT_SPRING_CONFIG.mass)}
        className={cn("border-b border-sf-border", className)}
        {...props}
      >
        {children}
      </Animated.View>
    </AccordionItemContext>
  );
}

export type AccordionTriggerProps = ViewProps & {
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
  const { isExpanded, toggle } = useAccordionItemContext();

  const rotation = useSharedValue(isExpanded ? 1 : 0);

  React.useEffect(() => {
    rotation.value = withSpring(isExpanded ? 1 : 0, INDICATOR_SPRING_CONFIG);
  }, [isExpanded, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const showDefaultIndicator = indicator === undefined;
  const showCustomIndicator = indicator !== undefined && indicator !== false;

  return (
    <Pressable
      onPress={toggle}
      className={cn("flex-row items-center justify-between py-4", className)}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      {...props}
    >
      <View className="flex-1 pr-2">
        {typeof children === "string" ? (
          <Text className="text-sf-text text-base font-medium">{children}</Text>
        ) : (
          children
        )}
      </View>
      {showDefaultIndicator && (
        <Animated.View style={animatedIconStyle}>
          <SFIcon name="chevron.down" size={14} className="text-sf-text-3" />
        </Animated.View>
      )}
      {showCustomIndicator && indicator}
    </Pressable>
  );
}

export type AccordionContentProps = ViewProps & {
  className?: string;
};

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const { isExpanded } = useAccordionItemContext();

  if (!isExpanded) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(CONTENT_FADE_DURATION)}
      exiting={FadeOut.duration(CONTENT_FADE_DURATION)}
      layout={LinearTransition.springify()
        .damping(LAYOUT_SPRING_CONFIG.damping)
        .stiffness(LAYOUT_SPRING_CONFIG.stiffness)
        .mass(LAYOUT_SPRING_CONFIG.mass)}
    >
      <View className={cn("pb-4", className)} {...props}>
        {children}
      </View>
    </Animated.View>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;

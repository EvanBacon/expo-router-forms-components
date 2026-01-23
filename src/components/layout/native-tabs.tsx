"use client";

import * as React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
 * Returns 'inline' on iOS 26+ when the accessory is rendered inline with the tab bar,
 * otherwise returns 'regular'.
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
}

/**
 * BottomAccessory renders content below the tab bar.
 *
 * On iOS 26+, this uses the native tab bar accessory API.
 * On Android and older iOS versions, this renders a user-space implementation
 * that positions content at the bottom of the screen above the safe area.
 */
function BottomAccessory({ children }: BottomAccessoryProps) {
  const insets = useSafeAreaInsets();

  // Check if native BottomAccessory is available (iOS 26+)
  const NativeBottomAccessory = (NativeTabs as any).BottomAccessory;

  if (process.env.EXPO_OS === "ios" && NativeBottomAccessory) {
    // Use native implementation on iOS 26+
    return <NativeBottomAccessory>{children}</NativeBottomAccessory>;
  }

  // User-space implementation for Android and older iOS
  return (
    <View
      style={[
        styles.accessoryContainer,
        {
          // Position above the tab bar (approximately 49pt on iOS, 56dp on Android)
          bottom: (process.env.EXPO_OS === "ios" ? 49 : 56) + insets.bottom,
        },
      ]}
    >
      <BottomAccessoryContext.Provider value={{ placement: "regular" }}>
        {children}
      </BottomAccessoryContext.Provider>
    </View>
  );
}

// Attach the usePlacement hook to the component
BottomAccessory.usePlacement = usePlacement;

const styles = StyleSheet.create({
  accessoryContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});

/* ----------------------------------------------------------------------------------
 * Tabs Wrapper
 * ----------------------------------------------------------------------------------*/

type TabsProps = React.ComponentProps<typeof NativeTabs> & {
  children?: React.ReactNode;
};

/**
 * Tabs wrapper around NativeTabs that adds support for BottomAccessory
 * with fallback implementations for Android and web.
 */
function Tabs({ children, ...props }: TabsProps) {
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
    <NativeTabs {...props}>
      {otherChildren}
      {accessories}
    </NativeTabs>
  );
}

// Re-export all NativeTabs sub-components
Tabs.Trigger = NativeTabs.Trigger;
Tabs.BottomAccessory = BottomAccessory;

export { Tabs, usePlacement };
export type { BottomAccessoryProps, BottomAccessoryPlacement };

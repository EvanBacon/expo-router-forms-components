// import { Stack as NativeStack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React from "react";

// Better transitions on web, no changes on native.
import NativeStack from "@/components/layout/modal-navigator";
import { isLiquidGlassAvailable } from "expo-glass-effect";
const GLASS = isLiquidGlassAvailable();
// These are the default stack options for iOS, they disable on other platforms.
const DEFAULT_STACK_HEADER: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : GLASS
    ? {
        // iOS 26 + liquid glass
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },

        headerLargeTitle: true,
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerBlurEffect: "systemChromeMaterial",
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerLargeTitle: true,
      };

/** Create a bottom sheet on iOS with extra snap points (`sheetAllowedDetents`) */
export const BOTTOM_SHEET: NativeStackNavigationOptions = {
  // https://github.com/software-mansion/react-native-screens/blob/main/native-stack/README.md#sheetalloweddetents
  presentation: "formSheet",
  contentStyle: GLASS ? { backgroundColor: "transparent" } : undefined,
  gestureDirection: "vertical",
  animation: "slide_from_bottom",
  sheetGrabberVisible: true,
  sheetInitialDetentIndex: 0,
  sheetAllowedDetents: [0.5, 1.0],
};

export default function Stack({
  screenOptions,
  children,
  ...props
}: React.ComponentProps<typeof NativeStack>) {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { sheet, modal, ...props } = child.props;
      if (sheet) {
        return React.cloneElement(child, {
          ...props,
          options: {
            ...BOTTOM_SHEET,
            ...props.options,
          },
        });
      } else if (modal) {
        return React.cloneElement(child, {
          ...props,
          options: {
            presentation: "modal",
            ...props.options,
          },
        });
      }
    }
    return child;
  });

  return (
    <NativeStack
      screenOptions={{
        ...DEFAULT_STACK_HEADER,
        ...screenOptions,
      }}
      {...props}
      children={processedChildren}
    />
  );
}

Stack.Screen = NativeStack.Screen as React.FC<
  React.ComponentProps<typeof NativeStack.Screen> & {
    /** Make the sheet open as a bottom sheet with default options on iOS. */
    sheet?: boolean;
    /** Make the screen open as a modal. */
    modal?: boolean;
  }
>;

/* ----------------------------------------------------------------------------------
 * Web-only exports (no-op on native)
 * ----------------------------------------------------------------------------------*/

/** No-op on native - only used for web stack header */
export function useStackHeaderConfig(_config: {
  title?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerShown?: boolean;
}) {
  // No-op on native - the native stack handles headers automatically
}

/** No-op on native - renders nothing */
export function HeaderButton(_props: {
  icon?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return null;
}

/** No-op on native */
export function StackFloatingHeader(_props: any) {
  return null;
}

/** No-op on native */
export function StackScreen({ children }: { children: React.ReactNode; [key: string]: any }) {
  return <>{children}</>;
}

export function useStackHeaderContext() {
  return { isSidebarOpen: false, isInsideTabBar: false };
}

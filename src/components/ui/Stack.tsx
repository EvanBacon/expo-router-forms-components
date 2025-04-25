// import { Stack as NativeStack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React from "react";

// Better transitions on web, no changes on native.
import NativeStack from "@/components/layout/modalNavigator";

// These are the default stack options for iOS, they disable on other platforms.
const DEFAULT_STACK_HEADER: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
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

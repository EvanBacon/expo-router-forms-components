import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultRouterOptions,
  StackRouter,
  StackNavigationState,
  ParamListBase,
} from "@react-navigation/native";
import {
  NativeStackView,
  NativeStackNavigationOptions,
  NativeStackNavigationHelpers,
} from "@react-navigation/native-stack";
import { Drawer } from "vaul";
import { withLayoutContext } from "expo-router";

/** Extend NativeStackNavigationOptions with extra sheet/detent props */
type MyModalStackNavigationOptions = NativeStackNavigationOptions & {
  presentation?:
    | "modal"
    | "formSheet"
    | "containedModal"
    | "card"
    | "fullScreenModal";
  /**
   * If you want to mimic iOS sheet detents on native (iOS 16+ w/ react-native-screens),
   * you might do something like:
   *
   * supportedOrientations?: string[];
   * sheetAllowedDetents?: Array<number>;
   * sheetInitialDetentIndex?: number;
   *
   * But here we specifically pass them for the web side via vaul:
   */
  sheetAllowedDetents?: Array<number | string>; // e.g. [0.5, 1.0] or ['148px', '355px', 1]
  sheetInitialDetentIndex?: number; // which index in `sheetAllowedDetents` is the default
  sheetGrabberVisible?: boolean;
};

type MyModalStackRouterOptions = DefaultRouterOptions & {
  // Extend if you need custom router logic
};

type Props = {
  initialRouteName?: string;
  screenOptions?: MyModalStackNavigationOptions;
  children: React.ReactNode;
};

function MyModalStackNavigator({
  initialRouteName,
  children,
  screenOptions,
}: Props) {
  const { state, navigation, descriptors, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      MyModalStackRouterOptions,
      MyModalStackNavigationOptions,
      NativeStackNavigationHelpers
    >(StackRouter, {
      children,
      screenOptions,
      initialRouteName,
    });

  return (
    <NavigationContent>
      <MyModalStackView
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

import * as AC from "@bacons/apple-colors";
/**
 * Filters out "modal"/"formSheet" routes from the normal <NativeStackView> on web,
 * rendering them in a vaul <Drawer> with snap points. On native, we just let
 * React Navigation handle the sheet or modal transitions.
 */
function MyModalStackView({
  state,
  navigation,
  descriptors,
}: {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: Record<
    string,
    {
      options: MyModalStackNavigationOptions;
      render: () => React.ReactNode;
    }
  >;
}) {
  const isWeb = Platform.OS === "web";

  // Filter out any route that wants to be shown as a modal on web
  const nonModalRoutes = state.routes.filter((route) => {
    const descriptor = descriptors[route.key];
    const { presentation } = descriptor.options || {};
    const isModalType =
      presentation === "modal" ||
      presentation === "formSheet" ||
      presentation === "fullScreenModal" ||
      presentation === "containedModal";
    return !(isWeb && isModalType);
  });

  // Recalculate index so we don't point to a missing route on web
  let nonModalIndex = nonModalRoutes.findIndex(
    (r) => r.key === state.routes[state.index]?.key
  );
  if (nonModalIndex < 0) {
    nonModalIndex = nonModalRoutes.length - 1;
  }

  const newStackState: StackNavigationState<ParamListBase> = {
    ...state,
    routes: nonModalRoutes,
    index: nonModalIndex,
  };

  return (
    <div
      data-vaul-drawer-wrapper=""
      style={{ flex: 1, display: "flex", overflow: "hidden" }}
    >
      {/* Normal stack rendering for native & non-modal routes on web */}
      <NativeStackView
        state={newStackState}
        navigation={navigation}
        descriptors={descriptors}
      />

      {/* Render vaul Drawer for active "modal" route on web, with snap points */}
      {isWeb &&
        state.routes.map((route, i) => {
          const descriptor = descriptors[route.key];
          const {
            presentation,
            sheetAllowedDetents,
            sheetInitialDetentIndex,
            sheetGrabberVisible,
          } = descriptor.options || {};

          const couldHaveDetents = presentation === "formSheet";

          const isModalType =
            presentation === "modal" ||
            presentation === "formSheet" ||
            presentation === "fullScreenModal" ||
            presentation === "containedModal";
          const isActive = i === state.index && isModalType;
          if (!isActive) return null;

          // Convert numeric detents (e.g. 0.5 => "50%") to a string
          // If user passes pixel or percentage strings, we'll keep them as is.
          const rawDetents = sheetAllowedDetents || [1];
          const snapPoints = rawDetents.map((val) => {
            // if (typeof val === "number") {
            //   return val >= 1 ? "100%" : `${val * 100}%`;
            // }
            return val; // e.g. "148px", "50%", etc.
          });

          return (
            <Drawer.Root
              key={route.key}
              open={true}
              fadeFromIndex={0}
              // Provide snap points to vaul
              snapPoints={snapPoints}
              // For a "sheet" style, might want to scale background slightly
              shouldScaleBackground={presentation !== "formSheet"}
              onOpenChange={(open) => {
                if (!open) {
                  navigation.goBack();
                }
              }}
            >
              <Drawer.Portal>
                <Drawer.Overlay
                  style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                  }}
                />
                <Drawer.Content
                  style={{
                    position: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    bottom: 0,
                    left: 0,
                    right: 0,

                    borderRadius: "8px 8px 0 0",
                    overflow: "hidden",
                    height: "100%",
                    maxHeight: "97%",
                  }}
                >
                  {/* Optional "grabber" */}
                  {sheetGrabberVisible && (
                    <div
                      style={{
                        padding: 16,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: AC.systemGroupedBackground,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: AC.separator,
                        }}
                      />
                    </div>
                  )}

                  {/* Render the actual screen */}
                  {descriptor.render()}
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          );
        })}
    </div>
  );
}

const styles = StyleSheet.create({
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
});

const createMyModalStack = createNavigatorFactory(MyModalStackNavigator);

/**
 * If you're using Expo Router, wrap with `withLayoutContext`.
 * Otherwise, just export the createMyModalStack().Navigator as usual.
 */
const RouterModal = withLayoutContext(createMyModalStack().Navigator);

export default RouterModal;
import ThemeProvider from "@/components/ui/ThemeProvider";

import { AsyncFont } from "@/components/data/async-font";
// import Tabs from "@/components/ui/Tabs";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";

import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";

SplashScreen.preventAutoHideAsync();

function SplashFallback() {
  useEffect(
    () => () => {
      SplashScreen.hideAsync();
    },
    []
  );
  return null;
}

import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationOptions,
} from "@bottom-tabs/react-navigation";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import React from "react";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

// export default function TabLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Expo",
//           tabBarIcon: () => ({ sfSymbol: "bubbles.and.sparkles" }),
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: "Everywhere",
//           tabBarIcon: () => ({ sfSymbol: "cursorarrow.click.2" }),
//         }}
//       />
//     </Tabs>
//   );
// }

export default function Layout() {
  // Keep the splash screen visible while we fetch resources
  return (
    <Suspense fallback={<SplashFallback />}>
      {/* Load fonts in suspense */}
      <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
      <ThemeProvider>
        <Tabs>
          <Tabs.Screen
            name="(index)"
            options={{
              title: "Expo",
              tabBarIcon: () => ({ sfSymbol: "sparkles" }),
            }}
          />
          <Tabs.Screen
            name="(info)"
            options={{
              title: "Everywhere",
              tabBarIcon: () => ({ sfSymbol: "cursorarrow.click.2" }),
            }}
          />
          <Tabs.Screen
            name="sitemap"
            options={{
              href: null,
              // title: "Everywhere",
              // tabBarIcon: () => ({ sfSymbol: "cursorarrow.click.2" }),
            }}
          />
        </Tabs>

        {/* <Tabs>
          <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
          <Tabs.Screen
            name="(info)"
            systemImage="cursorarrow.rays"
            title="Info"
          />
        </Tabs> */}
      </ThemeProvider>
    </Suspense>
  );
}

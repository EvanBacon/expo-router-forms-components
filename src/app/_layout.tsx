import "@/global.css";

import ThemeProvider from "@/components/ui/theme-provider";

import { AsyncFont } from "@/components/data/async-font";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import { Tabs } from "@/components/layout/native-tabs";
import { useCSSVariable } from "@/tw";
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

export default function Layout() {
  const label = useCSSVariable("--sf-text");

  // Keep the splash screen visible while we fetch resources
  return (
    <Suspense fallback={<SplashFallback />}>
      {/* Load fonts in suspense */}
      <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1, display: "contents" }}>
          {/*
            Use the Tabs wrapper for cross-platform BottomAccessory support.
            On iOS 26+, BottomAccessory uses native tab bar accessories.
            On Android/web, it renders a user-space implementation.
          */}
          <Tabs tintColor={label}>
            <Tabs.Trigger name="(index)">
              <Tabs.Trigger.Label>Home</Tabs.Trigger.Label>
              <Tabs.Trigger.Icon
                sf={{
                  default: "house",
                  selected: "house.fill",
                }}
              />
            </Tabs.Trigger>
            <Tabs.Trigger name="(info)" role="search">
              <Tabs.Trigger.Label>Info</Tabs.Trigger.Label>
              <Tabs.Trigger.Icon sf="cursorarrow.rays" />
            </Tabs.Trigger>

            {/* Example BottomAccessory - uncomment to see it in action
            <Tabs.BottomAccessory>
              <NowPlayingBar />
            </Tabs.BottomAccessory>
            */}
          </Tabs>

          <Toaster />
        </GestureHandlerRootView>
      </ThemeProvider>
    </Suspense>
  );
}

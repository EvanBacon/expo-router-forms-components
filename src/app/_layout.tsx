import "@/global.css";

import ThemeProvider from "@/components/ui/theme-provider";

import { AsyncFont } from "@/components/data/async-font";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import { NativeTabs } from "expo-router/unstable-native-tabs";
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
        
            <NativeTabs tintColor={label}>
              <NativeTabs.Trigger name="(index)">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                  sf={{
                    default: "house",
                    selected: "house.fill",
                  }}
                />
              </NativeTabs.Trigger>
              <NativeTabs.Trigger name="(info)" role="search">
                <NativeTabs.Trigger.Label>Info</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="cursorarrow.rays" />
              </NativeTabs.Trigger>
            </NativeTabs>
          
          <Toaster />
        </GestureHandlerRootView>
      </ThemeProvider>
    </Suspense>
  );
}

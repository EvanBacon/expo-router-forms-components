import ThemeProvider from "@/components/ui/theme-provider";

import { AsyncFont } from "@/components/data/async-font";
import Tabs from "@/components/layout/tabs";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";

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
  // Keep the splash screen visible while we fetch resources
  return (
    <Tabs>
      <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
    </Tabs>
  );
}

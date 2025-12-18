import ThemeProvider from "@/components/ui/theme-provider";

import { AsyncFont } from "@/components/data/async-font";
import Tabs from "@/components/layout/tabs";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
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

export default function Layout() {
  // Keep the splash screen visible while we fetch resources
  return (
    <Suspense fallback={<SplashFallback />}>
      {/* Load fonts in suspense */}
      <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1, display: "contents" }}>
          <Tabs>
            <Tabs.Screen
              name="(index)"
              sf={{ default: "house", selected: "house.fill" }}
              title="Home"
            />
            <Tabs.Screen
              name="(info)"
              sf={{ default: "cursorarrow.rays", selected: "cursorarrow.rays" }}
              title="Info"
            />
          </Tabs>
          <Toaster />
        </GestureHandlerRootView>
      </ThemeProvider>
    </Suspense>
  );
}

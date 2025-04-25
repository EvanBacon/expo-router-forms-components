import ThemeProvider from "@/components/ui/ThemeProvider";

import Tabs from "@/components/ui/Tabs";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";

// SplashScreen.preventAutoHideAsync();

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
  return (
    <Suspense fallback={<SplashFallback />}>
      {/* <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" /> */}
      <ThemeProvider>
        <Tabs>
          <Tabs.Screen name="(index)" systemImage="house.fill" title="Home" />
          <Tabs.Screen
            name="(info)"
            systemImage="cursorarrow.rays"
            title="Info"
          />
        </Tabs>
      </ThemeProvider>
    </Suspense>
  );
}

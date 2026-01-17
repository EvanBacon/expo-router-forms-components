import "@/global.css";

import ThemeProvider from "@/components/ui/theme-provider";
import { ReanimatedScreenProvider } from "react-native-screens/reanimated";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AsyncFont } from "@/components/data/async-font";
import { Slot, SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
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
  // Keep the splash screen visible while we fetch resources
  return (
    <Suspense fallback={<SplashFallback />}>
      {/* Load fonts in suspense */}
      <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1, display: "contents" }}>
          <ReanimatedScreenProvider>
            <KeyboardProvider>
              <Navigator />
            </KeyboardProvider>
          </ReanimatedScreenProvider>

          <Toaster />
        </GestureHandlerRootView>
      </ThemeProvider>
    </Suspense>
  );
}

function Navigator() {
  const label = useCSSVariable("--sf-text");

  return <Slot />;

  return (
    <NativeTabs tintColor={label}>
      <NativeTabs.Trigger name="(index)">
        <Label>Home</Label>
        <Icon
          sf={{
            default: "house",
            selected: "house.fill",
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(info)" role="search">
        <Label>Info</Label>
        <Icon sf="cursorarrow.rays" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

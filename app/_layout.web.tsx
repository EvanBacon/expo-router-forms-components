import ThemeProvider from "@/components/ui/ThemeProvider";

import { Slot } from "expo-router";

export default function Layout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}

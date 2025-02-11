import ThemeProvider from "@/components/ui/ThemeProvider";

import Tabs from "@/components/ui/Tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
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
    </GestureHandlerRootView>
  );
}

"use client";

import Animated, { FadeIn as EnterFadeIn } from "react-native-reanimated";

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <Animated.View entering={EnterFadeIn.duration(500)}>
      {children}
    </Animated.View>
  );
}

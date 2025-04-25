"use client";

import { useScrollToTop } from "@/hooks/useTabToTop";
import * as AC from "@bacons/apple-colors";
import { ScrollViewProps } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabOverflow } from "./TabBarBackground";

export function BodyScrollView(
  props: ScrollViewProps & { ref?: React.Ref<Animated.ScrollView> }
) {
  const paddingBottom = useBottomTabOverflow();

  const statusBarInset = useSafeAreaInsets().top; // inset of the status bar

  const largeHeaderInset = statusBarInset + 92; // inset to use for a large header since it's frame is equal to 96 + the frame of status bar

  useScrollToTop(props.ref!, -largeHeaderInset);

  return (
    <Animated.ScrollView
      scrollToOverflowEnabled
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      {...props}
      style={[{ backgroundColor: AC.systemGroupedBackground }, props.style]}
    />
  );
}

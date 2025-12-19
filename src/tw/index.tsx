import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

import { Link as RouterLink } from "expo-router";

import React from "react";
import type { ViewProps } from "react-native";
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  ScrollViewProps,
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet,
  TouchableHighlight as RNTouchableHighlight,
  TextInput as RNTextInput,
  RefreshControl as RNRefreshControl,
} from "react-native";

export const Link = (
  props: React.ComponentProps<typeof RouterLink> & {
    className?: string;
  }
) => {
  return useCssElement(RouterLink, props, {
    className: "style",
  });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => {
        return `var(${variable})`;
      };

export const View = (props: ViewProps) => {
  return useCssElement(RNView, props, {
    className: "style",
  });
};
View.displayName = "CSS(View)";

export { Image, ImageProps } from "./image";

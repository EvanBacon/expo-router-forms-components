import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

import { Link as RouterLink } from "@/components/ui/link";
import Animated from "react-native-reanimated";

import React from "react";
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

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & {
    className?: string;
  }
) => {
  return useCssElement(RNPressable, props, {
    className: "style",
  });
};
Pressable.displayName = "CSS(Pressable)";

export const View = (
  props: React.ComponentProps<typeof RNView> & {
    className?: string;
  }
) => {
  return useCssElement(RNView, props, {
    className: "style",
  });
};
View.displayName = "CSS(View)";

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & {
    className?: string;
  }
) => {
  return useCssElement(RNTextInput, props, {
    className: "style",
  });
};

export const AnimatedScrollView = (
  props: React.ComponentProps<Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
  }
) => {
  return useCssElement(Animated.ScrollView, props, {
    className: "style",
    contentClassName: "contentContainerStyle",
    contentContainerClassName: "contentContainerStyle",
  });
};

function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight>
) {
  const { underlayColor, ...style } = StyleSheet.flatten(props.style) || {};

  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight>
) => {
  return useCssElement(XXTouchableHighlight, props, {
    className: "style",
  });
};
TouchableHighlight.displayName = "CSS(TouchableHighlight)";

export const Text = (
  props: React.ComponentProps<typeof RNText> & {
    className?: string;
  }
) => {
  return useCssElement(RNText, props, {
    className: "style",
  });
};
Text.displayName = "CSS(Text)";

export { Image, ImageProps } from "./image";

import { useCssElement } from "react-native-css";

import React from "react";
import {
  View as RNView,
  Pressable as RNPressable,
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet,
  TouchableHighlight as RNTouchableHighlight,
} from "react-native";

import {
  BorderlessButton as RNBorderlessButton,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from "react-native-gesture-handler";

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
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

export const BorderlessButton = (
  props: React.ComponentProps<typeof RNBorderlessButton> & {
    className?: string;
  }
) => {
  return useCssElement(RNBorderlessButton, props, {
    className: "style",
  });
};

export const TouchableOpacity = (
  props: React.ComponentProps<typeof RNTouchableOpacity> & {
    className?: string;
  }
) => {
  return useCssElement(RNTouchableOpacity, props, {
    className: "style",
  });
};
export const TouchableWithoutFeedback = (
  props: React.ComponentProps<typeof RNTouchableWithoutFeedback> & {
    className?: string;
  }
) => {
  return useCssElement(RNTouchableWithoutFeedback, props, {
    className: "style",
  });
};

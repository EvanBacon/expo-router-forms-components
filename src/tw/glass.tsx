import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

import React from "react";
import { StyleSheet } from "react-native";

import {
  GlassView as EXGlassView,
  isLiquidGlassAvailable,
  GlassContainer as EXGlassContainer,
} from "expo-glass-effect";
import Animated from "react-native-reanimated";

import { BlurView as EXBlurView } from "expo-blur";

const AnimatedEXGlassView = Animated.createAnimatedComponent(EXGlassView);

const GLASS_ENABLED = isLiquidGlassAvailable();

const AnimatedBlurView = Animated.createAnimatedComponent(EXBlurView);

export const BlurView = (
  props: React.ComponentProps<typeof AnimatedBlurView> & {
    className?: string;
  }
) => {
  return useCssElement(AnimatedBlurView, props, {
    className: "style",
  });
};
BlurView.displayName = "CSS(BlurView)";

export const InnerAppleGlassView = ({
  fallbackTint,
  fallbackIntensity,
  ...props
}: React.ComponentProps<typeof AnimatedEXGlassView> & {
  className?: string;
  fallbackTint?: React.ComponentProps<typeof EXBlurView>["tint"];
  fallbackIntensity?: React.ComponentProps<typeof EXBlurView>["intensity"];
}) => {
  return useCssElement(BetterGlassView, props, {
    className: "style",
  });
};

const FallbackAppleGlassView = ({
  fallbackTint,
  fallbackIntensity,
  ...props
}: React.ComponentProps<typeof AnimatedEXGlassView> & {
  className?: string;
  fallbackTint?: React.ComponentProps<typeof EXBlurView>["tint"];
  fallbackIntensity?: React.ComponentProps<typeof EXBlurView>["intensity"];
}) => {
  return (
    <BlurView
      {...props}
      style={[{ overflow: "hidden" }, props.style]}
      tint={fallbackTint}
      intensity={fallbackIntensity}
    />
  );
};

export const AppleGlassView = GLASS_ENABLED
  ? InnerAppleGlassView
  : FallbackAppleGlassView;

function BetterGlassView(
  props: React.ComponentProps<typeof AnimatedEXGlassView>
) {
  const { style, props: converted } = convertStylesToProps(props.style, {
    backgroundColor: "tintColor",
  });

  return <AnimatedEXGlassView {...{ ...props, style, ...converted }} />;
}

export const GlassContainer = (
  props: React.ComponentProps<typeof EXGlassContainer> & {
    className?: string;
  }
) => {
  return useCssElement(EXGlassContainer, props, {
    className: "style",
  });
};
GlassContainer.displayName = "CSS(GlassContainer)";

function convertStylesToProps(style: any, move: Record<string, string>) {
  if (!style) {
    return { style: style, props: {} };
  }
  const flatStyle = StyleSheet.flatten(style) || {};

  const props = {};

  for (const [styleKey, propKey] of Object.entries(move)) {
    if (styleKey in flatStyle) {
      props[propKey] = flatStyle[styleKey];
      delete flatStyle[styleKey];
    }
  }

  return { style: flatStyle, props };
}

// Fork of upstream but with forward ref for Link asChild
// https://github.com/react-navigation/react-navigation/blob/bddcc44ab0e0ad5630f7ee0feb69496412a00217/packages/elements/src/Header/HeaderButton.tsx#L1
import {
  PlatformPressable,
  type HeaderButtonProps,
} from "@react-navigation/elements";
import React from "react";
import { Platform, StyleSheet } from "react-native";

export function HeaderButton({
  disabled,
  onPress,
  pressColor,
  pressOpacity,
  accessibilityLabel,
  testID,
  style,
  children,
  ...props
}: HeaderButtonProps) {
  return (
    <PlatformPressable
      {...props}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      pressColor={pressColor}
      pressOpacity={pressOpacity}
      android_ripple={androidRipple}
      style={[styles.container, disabled && styles.disabled, style]}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      {children}
    </PlatformPressable>
  );
}

const androidRipple = {
  borderless: true,
  foreground: Platform.OS === "android" && Platform.Version >= 23,
  radius: 20,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    // Roundness for iPad hover effect
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});

/**
 * Copyright (c) Evan Bacon.
 * Copyright (c) Nicolas Gallagher.
 *
 * https://github.com/necolas/react-native-web/blob/922c134f2b7c428cc19daaeb3cac4b6a4c8ec6a3/packages/react-native-web/src/exports/Switch/index.js#L1C1-L236C23
 */

import * as AC from "@bacons/apple-colors";
import * as React from "react";
import {
  ViewProps,
  StyleSheet,
  View,
  ColorValue,
  ViewStyle,
  StyleProp,
} from "react-native";
// @ts-expect-error
import createElement from "react-native-web/dist/exports/createElement";
// @ts-expect-error
import multiplyStyleLengthValue from "react-native-web/dist/modules/multiplyStyleLengthValue";

type SwitchProps = ViewProps & {
  activeThumbColor?: ColorValue;
  activeTrackColor?: ColorValue;
  disabled?: boolean;
  onValueChange?: (e: any) => void;
  thumbColor?: ColorValue;
  trackColor?: ColorValue | { false: ColorValue; true: ColorValue };
  value?: boolean;
};

const emptyObject = {};
const thumbDefaultBoxShadow = "0px 1px 3px rgba(0,0,0,0.5)";
const thumbFocusedBoxShadow = `${thumbDefaultBoxShadow}, 0 0 0 10px rgba(0,0,0,0.1)`;

const defaultActiveTrackColor = AC.systemGreen;
const defaultTrackColor = AC.systemGray4;
const defaultDisabledTrackColor = AC.systemGray5;

const defaultActiveThumbColor = AC.label;
const defaultThumbColor = AC.label;
const defaultDisabledThumbColor = AC.systemGray3;

export function Switch({
  ref: forwardedRef,
  ...props
}: SwitchProps & { ref?: React.Ref<View> }) {
  const {
    "aria-label": ariaLabel,
    accessibilityLabel,
    activeThumbColor,
    activeTrackColor,
    disabled = false,
    onValueChange,
    style = emptyObject,
    thumbColor,
    trackColor,
    value = false,
    ...other
  } = props;

  const thumbRef = React.useRef<View>(null);

  function handleChange(event: any) {
    if (onValueChange != null) {
      onValueChange(event.nativeEvent.target.checked);
    }
  }

  function handleFocusState(event: any) {
    const isFocused = event.nativeEvent.type === "focus";
    const boxShadow = isFocused ? thumbFocusedBoxShadow : thumbDefaultBoxShadow;
    if (thumbRef.current != null) {
      // @ts-expect-error
      thumbRef.current.style.boxShadow = boxShadow;
    }
  }

  const { height: styleHeight, width: styleWidth } =
    StyleSheet.flatten<ViewStyle>(style);
  const height = styleHeight || "20px";
  const minWidth = multiplyStyleLengthValue(height, 2);
  const width = (styleWidth ?? 0) > minWidth ? styleWidth : minWidth;
  const trackBorderRadius = multiplyStyleLengthValue(height, 0.5);

  const trackCurrentColor = (function () {
    if (value === true) {
      if (trackColor != null && typeof trackColor === "object") {
        return trackColor.true;
      } else {
        return activeTrackColor ?? defaultActiveTrackColor;
      }
    } else {
      if (trackColor != null && typeof trackColor === "object") {
        return trackColor.false;
      } else {
        return trackColor ?? defaultTrackColor;
      }
    }
  })();

  const thumbCurrentColor = value
    ? activeThumbColor ?? defaultActiveThumbColor
    : thumbColor ?? defaultThumbColor;

  const thumbHeight = height;
  const thumbWidth = thumbHeight;

  const rootStyle = [
    styles.root,
    style,
    disabled && styles.cursorDefault,
    { height, width },
  ];

  const disabledTrackColor = (function () {
    if (value === true) {
      if (
        (typeof activeTrackColor === "string" && activeTrackColor != null) ||
        (typeof trackColor === "object" && trackColor?.true)
      ) {
        return trackCurrentColor;
      } else {
        return defaultDisabledTrackColor;
      }
    } else {
      if (
        (typeof trackColor === "string" && trackColor != null) ||
        (typeof trackColor === "object" && trackColor?.false)
      ) {
        return trackCurrentColor;
      } else {
        return defaultDisabledTrackColor;
      }
    }
  })();

  const disabledThumbColor = (function () {
    if (value === true) {
      if (activeThumbColor == null) {
        return defaultDisabledThumbColor;
      } else {
        return thumbCurrentColor;
      }
    } else {
      if (thumbColor == null) {
        return defaultDisabledThumbColor;
      } else {
        return thumbCurrentColor;
      }
    }
  })();

  const trackStyle = [
    styles.track,
    {
      backgroundColor: disabled ? disabledTrackColor : trackCurrentColor,
      borderRadius: trackBorderRadius,
    },
  ];

  const thumbStyle: StyleProp<ViewStyle> = [
    styles.thumb,
    value && styles.thumbActive,
    {
      height: thumbHeight as any,
      width: thumbWidth as any,
      backgroundColor: disabled ? disabledThumbColor : thumbCurrentColor,
      marginStart: value ? multiplyStyleLengthValue(thumbWidth, -1) : 0,
    },
  ];

  const nativeControl = createElement("input", {
    "aria-label": ariaLabel || accessibilityLabel,
    checked: value,
    disabled: disabled,
    onBlur: handleFocusState,
    onChange: handleChange,
    onFocus: handleFocusState,
    ref: forwardedRef,
    style: [styles.nativeControl, styles.cursorInherit],
    type: "checkbox",
    role: "switch",
  });

  return (
    <View {...other} style={rootStyle}>
      <View style={trackStyle} />
      <View ref={thumbRef} style={thumbStyle} />
      {nativeControl}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    cursor: "pointer",
    userSelect: "none",
  },
  cursorDefault: {
    cursor: "default",
  },
  cursorInherit: {
    cursor: "inherit",
  },
  track: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    margin: "auto",
    transitionDuration: "0.1s",
    width: "100%",
    // @ts-expect-error
    forcedColorAdjust: "none",
  },
  thumb: {
    forcedColorAdjust: "none",
    alignSelf: "flex-start",
    borderRadius: "100%",
    boxShadow: thumbDefaultBoxShadow,
    start: "0%",
    transform: "translateZ(0)",
    transitionDuration: "0.1s",
  },
  thumbActive: {
    insetInlineStart: "100%",
  },
  nativeControl: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    margin: 0,
    appearance: "none",
    padding: 0,
    width: "100%",
  },
});

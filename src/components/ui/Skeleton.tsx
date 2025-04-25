"use client";

import React from "react";
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

const BASE_COLORS = {
  dark: { primary: "rgb(17, 17, 17)", secondary: "rgb(51, 51, 51)" },
  light: {
    primary: "rgb(250, 250, 250)",
    secondary: "rgb(205, 205, 205)",
  },
} as const;

const makeColors = (mode: keyof typeof BASE_COLORS) => [
  BASE_COLORS[mode].primary,
  BASE_COLORS[mode].secondary,
  BASE_COLORS[mode].secondary,
  BASE_COLORS[mode].primary,
  BASE_COLORS[mode].secondary,
  BASE_COLORS[mode].primary,
];

const DARK_COLORS = new Array(3)
  .fill(0)
  .map(() => makeColors("dark"))
  .flat();

const LIGHT_COLORS = new Array(3)
  .fill(0)
  .map(() => makeColors("light"))
  .flat();

export const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  delay,
}: {
  width: number;
  height: number;
  borderRadius?: number;
  delay?: number;
}) => {
  return (
    <Skeleton
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
        height,
        borderRadius,
      }}
      delay={delay}
    />
  );
};

const Skeleton = ({
  style,
  delay,
  dark: inputDark,
}: {
  style?: StyleProp<ViewStyle>;
  delay?: number;
  dark?: boolean;
} = {}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dark = inputDark ?? useColorScheme() !== "light";
  const translateX = React.useRef(new Animated.Value(-1)).current;
  const [width, setWidth] = React.useState(150);

  const colors = dark ? DARK_COLORS : LIGHT_COLORS;
  const targetRef = React.useRef<View>(null);

  const onLayout = React.useCallback(() => {
    targetRef.current?.measureInWindow((_x, _y, width, _height) => {
      setWidth(width);
    });
  }, []);

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          delay: delay || 0,
          toValue: 1,
          duration: 5000,
          useNativeDriver: process.env.EXPO_OS !== "web",
          // Ease in
          easing: Easing.in(Easing.ease),
        }),
      ])
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, [translateX, delay]);

  const translateXStyle = React.useMemo(
    () => ({
      transform: [
        {
          translateX: translateX.interpolate({
            inputRange: [-1, 1],
            outputRange: [-width * 8, width],
          }),
        },
      ],
    }),
    [translateX, width]
  );

  return (
    <View
      ref={targetRef}
      style={[
        {
          height: 32,
          borderRadius: 8,
          borderCurve: "continuous",
          overflow: "hidden",
          backgroundColor: "transparent",
        },
        style,
      ]}
      onLayout={onLayout}
    >
      <Animated.View
        style={[
          translateXStyle,
          { width: "800%", height: "100%", backgroundColor: "transparent" },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              [process.env.EXPO_OS === "web"
                ? `backgroundImage`
                : `experimental_backgroundImage`]: `linear-gradient(to right, ${colors.join(
                ", "
              )})`,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;

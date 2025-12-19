import { Text } from "@/tw";
import mdcGlyph from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json";
import mdGlyph from "@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json";
import * as Font from "expo-font";
import React from "react";
import {
  StyleSheet,
  type ColorValue,
  type StyleProp,
  type TextStyle,
} from "react-native";

export const MaterialIcons = ({
  name,
  size,
  color,
  style = {},
  ...props
}: {
  name: keyof typeof mdGlyph;
  size?: number;
  color?: null | ColorValue;
  style?: StyleProp<TextStyle>;
}) => {
  Font.useFonts({
    material: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf"),
  });
  const point = mdGlyph[name];
  return (
    <Text
      style={[
        styles.md,
        {
          fontSize: size,
          color,
        } as any,
        style,
      ]}
      {...props}
    >
      {point ? String.fromCodePoint(point) : "?"}
    </Text>
  );
};

export const MaterialCommunityIcons = ({
  name,
  size,
  color,
  style = {},
  ...props
}: {
  name: keyof typeof mdcGlyph;
  size?: number;
  color?: null | ColorValue;
  style?: StyleProp<TextStyle>;
}) => {
  Font.useFonts({
    "material-community": require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
  });

  const point = mdcGlyph[name];
  return (
    <Text
      style={[
        styles.mc,
        {
          fontSize: size,
          color,
        } as any,
        style,
      ]}
      {...props}
    >
      {point ? String.fromCodePoint(point) : "?"}
    </Text>
  );
};

const styles = StyleSheet.create({
  md: {
    fontFamily: "material",
  },
  mc: {
    fontFamily: "material-community",
  },
});

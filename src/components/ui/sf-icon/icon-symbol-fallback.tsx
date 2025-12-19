// This file is a fallback for using MaterialCommunityIcons on Android and web.
import { useCssElement } from "react-native-css";

import { SymbolWeight } from "expo-symbols";
import React from "react";
import {
  StyleSheet,
  type ColorValue,
  type StyleProp,
  type TextStyle,
} from "react-native";

import {
  ALIAS_MATERIAL_COMMUNITY,
  ALIAS_MATERIAL_DESIGN,
  SFIconName,
} from "./aliases";

import { MaterialIcons, MaterialCommunityIcons } from "./vector-icons";

type Props = {
  name: SFIconName;
  size?: number;
  color?: null | ColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;

  /** iOS-only */
  animationSpec?: import("expo-symbols").SymbolViewProps["animationSpec"];
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialCommunityIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialCommunityIcons and MaterialIcons.
 *
 * Icons aliases can be defined in the `src/+sf.ts` file.
 *
 * ```ts
 * // src/+sf.ts
 *
 * export const mc = {
 *   star: "battery-20",
 *   // Material community icons
 * } satisfies import("baconx/sf/config").toMC;
 * ```
 */
function IconSymbolMaterialInner({ name, size, color, style }: Props) {
  const iistyle = StyleSheet.flatten(style) || {};
  const c = color ?? iistyle.color;
  let s = size ?? iistyle.fontSize;

  // Web can have class name defining it's default size and we wouldn't be able to detect it here.
  if (process.env.EXPO_OS !== "web") {
    s ??= 24;
    // if (iistyle.className?.includes("text")) {
    // }
  }

  const materialCommunityIcon = ALIAS_MATERIAL_COMMUNITY[name];
  if (materialCommunityIcon) {
    if (__DEV__) {
      const all = require("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json");
      if (!all[materialCommunityIcon]) {
        console.error(
          `baconx/sf: Invalid alias for SF Symbol "${name}" to "${materialCommunityIcon}" which does not exist in MaterialCommunityIcons. Update the alias in src/+sf.ts.`
        );
      }
    }

    return (
      <MaterialCommunityIcons
        color={c}
        size={s}
        name={materialCommunityIcon}
        style={style}
      />
    );
  }
  const materialDesignIcon = ALIAS_MATERIAL_DESIGN[name];
  if (__DEV__) {
    if (!materialDesignIcon) {
      console.warn(
        `baconx/sf: Missing Material icon alias for "${name}". Define it in src/+sf.ts.`
      );
    } else {
      const all = require("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json");
      if (!all[materialDesignIcon]) {
        console.error(
          `baconx/sf: Invalid alias for SF Symbol "${name}" to "${materialDesignIcon}" which does not exist in MaterialIcons. Update the alias in src/+sf.ts.`
        );
      }
    }
  }
  return (
    <MaterialIcons
      color={c}
      size={s}
      name={ALIAS_MATERIAL_DESIGN[name]}
      style={style}
    />
  );
}

export function IconSymbolMaterial(props: Props & { className?: string }) {
  return useCssElement(IconSymbolMaterialInner, props, {
    className: "style",
  });
}

import { useCssElement } from "react-native-css";

import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight,
} from "expo-symbols";
import {
  StyleSheet,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Props = {
  name: SymbolViewProps["name"];
  size?: number;
  color?: ColorValue | null;
  style?: StyleProp<ViewStyle & { fontSize?: number; color?: ColorValue }>;
  weight?: SymbolWeight;
  animationSpec?: SymbolViewProps["animationSpec"];
};

function SFIconInner({
  name,
  size,
  color,
  style,
  weight = "regular",
  animationSpec,
  ...props
}: Props) {
  const iistyle = StyleSheet.flatten(style) || {};
  return (
    <SymbolView
      {...props}
      weight={weight}
      tintColor={color ?? iistyle.color ?? undefined}
      resizeMode="scaleAspectFit"
      animationSpec={animationSpec}
      name={name}
      style={[
        {
          width: size ?? iistyle.fontSize ?? 24,
          height: size ?? iistyle.fontSize ?? 24,
        },
        iistyle,
      ]}
    />
  );
}

export function SFIcon(props: Props & { className?: string }) {
  return useCssElement(SFIconInner, props, {
    className: "style",
  });
}

import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ColorValue, StyleProp, ViewStyle } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular",
  animationSpec,
  ...props
}: {
  name: SymbolViewProps["name"];
  size?: number;
  color?: ColorValue | null;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  animationSpec?: SymbolViewProps["animationSpec"];
}) {
  return (
    <SymbolView
      {...props}
      weight={weight}
      tintColor={color ?? undefined}
      resizeMode="scaleAspectFit"
      animationSpec={animationSpec}
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}

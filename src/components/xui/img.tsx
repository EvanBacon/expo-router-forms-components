import Animated from "react-native-reanimated";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { IconSymbol } from "./icon-symbol";
import { SymbolViewProps } from "expo-symbols";
import { ColorValue } from "react-native";

export type SFSymbolSource = `sf:${SymbolViewProps["name"]}`;

export type ImageProps = Omit<ExpoImageProps, "tintColor"> & {
  tintColor?: ColorValue | null;
} & {
  source: SFSymbolSource;
  size?: number;
  weight?: SymbolViewProps["weight"];
  animationSpec?: SymbolViewProps["animationSpec"];
};

function CImage(props: ImageProps) {
  const { source } = props;

  if (typeof source === "string") {
    if (source.startsWith("sf:")) {
      return (
        <IconSymbol
          {...props}
          name={source.substring(3) as SymbolViewProps["name"]}
          color={props.tintColor}
        />
      );
    }
  }

  return <ExpoImage {...props} />;
}

export const Image = Animated.createAnimatedComponent(CImage);

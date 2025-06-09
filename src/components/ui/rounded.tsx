import { View, ViewProps } from "react-native";

export function Rounded({
  rounded,
  padding,
  capsule,
  ...props
}: ViewProps & {
  padding?: number | boolean;
  rounded?: boolean;
  capsule?: boolean;
}) {
  const paddingStyle =
    padding === true ? { padding: 16 } : padding ? { padding } : {};
  return (
    <View
      {...props}
      style={[
        paddingStyle,
        {
          borderCurve: "continuous",
          borderRadius: 10,
        },
        capsule && {
          borderCurve: "circular",
          borderRadius: 9999,
        },
        props.style,
      ]}
    />
  );
}

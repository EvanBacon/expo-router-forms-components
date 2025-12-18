import {
  NativeTabs,
  Icon,
  Label,
} from "expo-router/unstable-native-tabs";
import type { IconProps, LabelProps } from "expo-router/unstable-native-tabs";
import React from "react";

type TabScreenProps = {
  /** The route name to link to */
  name: string;
  /** SF Symbol name for iOS, can be string or {default, selected} object */
  sf?: IconProps["sf"];
  /** Tab label text */
  title?: string;
  /** Hide the label */
  hideLabel?: boolean;
};

function TabScreen({ name, sf, title, hideLabel }: TabScreenProps) {
  return (
    <NativeTabs.Trigger name={name}>
      {sf && <Icon sf={sf} />}
      {title && <Label hidden={hideLabel}>{title}</Label>}
    </NativeTabs.Trigger>
  );
}

export default function Tabs({
  children,
  ...props
}: Omit<React.ComponentProps<typeof NativeTabs>, "children"> & {
  children?: React.ReactNode;
}) {
  return <NativeTabs {...props}>{children}</NativeTabs>;
}

Tabs.Screen = TabScreen;

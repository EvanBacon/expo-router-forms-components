"use client";

import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import * as AppleColors from "@bacons/apple-colors";
import { Href, LinkProps, Link as RouterLink, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Button,
  OpaqueColorValue,
  Text as RNText,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableHighlight,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { BodyScrollView } from "./BodyScrollView";
import { HeaderButton } from "./Header";

type ListStyle = "grouped" | "auto";

const ListStyleContext = React.createContext<ListStyle>("auto");

export function List({
  contentContainerStyle,
  ...props
}: ScrollViewProps & {
  /** Set the Expo Router `<Stack />` title when mounted. */
  navigationTitle?: string;
  listStyle?: ListStyle;
}) {
  return (
    <>
      {props.navigationTitle && (
        <Stack.Screen options={{ title: props.navigationTitle }} />
      )}
      <ListStyleContext value={props.listStyle ?? "auto"}>
        <BodyScrollView
          contentContainerStyle={mergedStyleProp(
            {
              paddingVertical: 16,
              gap: 24,
            },
            contentContainerStyle
          )}
          style={{
            maxWidth: 650,
            marginHorizontal:
              process.env.EXPO_OS === "web" ? "auto" : undefined,
          }}
          {...props}
        />
      </ListStyleContext>
    </>
  );
}

if (__DEV__) List.displayName = "FormList";

export function HStack(props: ViewProps) {
  return (
    <View
      {...props}
      style={mergedStyles(
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          wordWrap: "break-word",
          // flexWrap: "wrap",
        },
        props
      )}
    />
  );
}

const minItemHeight = 20;

const styles = StyleSheet.create({
  itemPadding: {
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
});

export function FormItem({
  children,
  href,
  onPress,
  ref,
}: Pick<ViewProps, "children"> & {
  href?: Href<any>;
  onPress?: () => void;
  ref?: React.Ref<View>;
}) {
  if (href == null) {
    if (onPress == null) {
      return (
        <View style={styles.itemPadding}>
          <HStack style={{ minHeight: minItemHeight }}>{children}</HStack>
        </View>
      );
    }
    return (
      <TouchableHighlight
        ref={ref}
        underlayColor={AppleColors.systemGray4}
        onPress={onPress}
      >
        <View style={styles.itemPadding}>
          <HStack style={{ minHeight: minItemHeight }}>{children}</HStack>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <Link asChild href={href} onPress={onPress}>
      <TouchableHighlight ref={ref} underlayColor={AppleColors.systemGray4}>
        <View style={styles.itemPadding}>
          <HStack style={{ minHeight: minItemHeight }}>{children}</HStack>
        </View>
      </TouchableHighlight>
    </Link>
  );
}

const Colors = {
  systemGray4: AppleColors.systemGray4, // "rgba(209, 209, 214, 1)",
  secondarySystemGroupedBackground:
    AppleColors.secondarySystemGroupedBackground, // "rgba(255, 255, 255, 1)",
  separator: AppleColors.separator, // "rgba(61.2, 61.2, 66, 0.29)",
};

type SystemImageProps =
  | IconSymbolName
  | {
      name: IconSymbolName;
      color?: OpaqueColorValue;
      size?: number;
    };

/** Text but with iOS default color and sizes. */
export function Text({
  bold,
  ...props
}: TextProps & {
  /** Value displayed on the right side of the form item. */
  hint?: React.ReactNode;
  /** Adds a prefix SF Symbol image to the left of the text */
  systemImage?: SystemImageProps;

  bold?: boolean;
}) {
  const font: TextStyle = {
    ...FormFont.default,
    flexShrink: 0,
    fontWeight: bold ? "600" : "normal",
  };

  return (
    <RNText
      dynamicTypeRamp="body"
      {...props}
      style={mergedStyleProp(font, props.style)}
    />
  );
}

if (__DEV__) Text.displayName = "FormText";

export function Link({
  bold,
  children,
  headerRight,
  hintImage,
  ...props
}: LinkProps & {
  /** Value displayed on the right side of the form item. */
  hint?: React.ReactNode;
  /** Adds a prefix SF Symbol image to the left of the text. */
  systemImage?: SystemImageProps | React.ReactNode;

  /** Changes the right icon. */
  hintImage?: SystemImageProps | React.ReactNode;

  // TODO: Automatically detect this somehow.
  /** Is the link inside a header. */
  headerRight?: boolean;

  bold?: boolean;
}) {
  const font: TextStyle = {
    ...FormFont.default,
    fontWeight: bold ? "600" : "normal",
  };

  const resolvedChildren = (() => {
    if (headerRight) {
      if (process.env.EXPO_OS === "web") {
        return <div style={{ paddingRight: 16 }}>{children}</div>;
      }
      const wrappedTextChildren = React.Children.map(children, (child) => {
        // Filter out empty children
        if (!child) {
          return null;
        }
        if (typeof child === "string") {
          return (
            <RNText
              style={mergedStyleProp<TextStyle>(
                { ...font, color: AppleColors.link },
                props.style
              )}
            >
              {child}
            </RNText>
          );
        }
        return child;
      });

      return (
        <HeaderButton
          pressOpacity={0.7}
          style={{
            // Offset on the side so the margins line up. Unclear how to handle when this is used in headerLeft.
            // We should automatically detect it somehow.
            marginRight: -8,
          }}
        >
          {wrappedTextChildren}
        </HeaderButton>
      );
    }
    return children;
  })();

  return (
    <RouterLink
      dynamicTypeRamp="body"
      {...props}
      asChild={
        props.asChild ?? (process.env.EXPO_OS === "web" ? false : headerRight)
      }
      style={mergedStyleProp<TextStyle>(font, props.style)}
      onPress={
        process.env.EXPO_OS === "web"
          ? props.onPress
          : (e) => {
              if (
                props.target === "_blank" &&
                // Ensure the resolved href is an external URL.
                /^([\w\d_+.-]+:)?\/\//.test(RouterLink.resolveHref(props.href))
              ) {
                // Prevent the default behavior of linking to the default browser on native.
                e.preventDefault();
                // Open the link in an in-app browser.
                WebBrowser.openBrowserAsync(props.href as string, {
                  presentationStyle:
                    WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
                });
              } else {
                props.onPress?.(e);
              }
            }
      }
      children={resolvedChildren}
    />
  );
}

if (__DEV__) Link.displayName = "FormLink";

export const FormFont = {
  // From inspecting SwiftUI `List { Text("Foo") }` in Xcode.
  default: {
    color: AppleColors.label,
    // 17.00pt is the default font size for a Text in a List.
    fontSize: 17,
    // UICTFontTextStyleBody is the default fontFamily.
  },
  secondary: {
    color: AppleColors.secondaryLabel,
    fontSize: 17,
  },
  caption: {
    color: AppleColors.secondaryLabel,
    fontSize: 12,
  },
  title: {
    color: AppleColors.label,
    fontSize: 17,
    fontWeight: "600",
  },
};

export function Section({
  children,
  title,
  footer,
  ...props
}: ViewProps & {
  title?: string | React.ReactNode;
  footer?: string | React.ReactNode;
}) {
  const listStyle = React.use(ListStyleContext) ?? "auto";

  const childrenWithSeparator = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const isLastChild = index === React.Children.count(children) - 1;

    const resolvedProps = {
      ...child.props,
    };
    // Extract onPress from child
    const originalOnPress = resolvedProps.onPress;
    let wrapsFormItem = false;
    if (child.type === Button) {
      const { title, color } = resolvedProps;

      delete resolvedProps.title;
      resolvedProps.style = mergedStyleProp(
        { color: color ?? AppleColors.link },
        resolvedProps.style
      );
      child = <RNText {...resolvedProps}>{title}</RNText>;
    }

    if (
      // If child is type of Text, add default props
      child.type === RNText ||
      child.type === Text
    ) {
      child = React.cloneElement(child, {
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        ...resolvedProps,
        onPress: undefined,
        style: mergedStyleProp(FormFont.default, resolvedProps.style),
      });

      const hintView = (() => {
        if (!resolvedProps.hint) {
          return null;
        }

        return React.Children.map(resolvedProps.hint, (child) => {
          // Filter out empty children
          if (!child) {
            return null;
          }
          if (typeof child === "string") {
            return (
              <RNText
                dynamicTypeRamp="body"
                style={{
                  ...FormFont.secondary,
                  textAlign: "right",
                  flexShrink: 1,
                }}
              >
                {child}
              </RNText>
            );
          }
          return child;
        });
      })();

      const symbolView = (() => {
        if (!resolvedProps.systemImage) {
          return null;
        }

        if (
          typeof resolvedProps.systemImage !== "string" &&
          React.isValidElement(resolvedProps.systemImage)
        ) {
          return resolvedProps.systemImage;
        }

        const symbolProps =
          typeof resolvedProps.systemImage === "string"
            ? { name: resolvedProps.systemImage }
            : resolvedProps.systemImage;

        return (
          <IconSymbol
            name={symbolProps.name}
            size={symbolProps.size ?? 28}
            style={{ marginRight: 16 }}
            color={
              symbolProps.color ??
              extractStyle(resolvedProps.style, "color") ??
              AppleColors.label
            }
          />
        );
      })();

      if (hintView || symbolView) {
        child = (
          <HStack>
            {symbolView}
            {child}
            {hintView && <View style={{ flex: 1 }} />}
            {hintView}
          </HStack>
        );
      }
    } else if (child.type === RouterLink || child.type === Link) {
      wrapsFormItem = true;

      const wrappedTextChildren = React.Children.map(
        resolvedProps.children,
        (linkChild) => {
          // Filter out empty children
          if (!linkChild) {
            return null;
          }
          if (typeof linkChild === "string") {
            return (
              <RNText
                dynamicTypeRamp="body"
                style={mergedStyles(FormFont.default, resolvedProps)}
              >
                {linkChild}
              </RNText>
            );
          }
          return linkChild;
        }
      );

      const hintView = (() => {
        if (!resolvedProps.hint) {
          return null;
        }

        return React.Children.map(resolvedProps.hint, (child) => {
          // Filter out empty children
          if (!child) {
            return null;
          }
          if (typeof child === "string") {
            return <Text style={FormFont.secondary}>{child}</Text>;
          }
          return child;
        });
      })();

      const symbolView = (() => {
        if (!resolvedProps.systemImage) {
          return null;
        }

        if (
          typeof resolvedProps.systemImage !== "string" &&
          React.isValidElement(resolvedProps.systemImage)
        ) {
          return resolvedProps.systemImage;
        }

        const symbolProps =
          typeof resolvedProps.systemImage === "string"
            ? { name: resolvedProps.systemImage }
            : resolvedProps.systemImage;

        return (
          <IconSymbol
            name={symbolProps.name}
            size={symbolProps.size ?? 28}
            style={{ marginRight: 16 }}
            color={
              symbolProps.color ??
              extractStyle(resolvedProps.style, "color") ??
              AppleColors.label
            }
          />
        );
      })();

      child = React.cloneElement(child, {
        style: [
          FormFont.default,
          process.env.EXPO_OS === "web" && {
            alignItems: "stretch",
            flexDirection: "column",
            display: "flex",
          },
          resolvedProps.style,
        ],
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        // TODO: This causes issues with ref in React 19.
        asChild: process.env.EXPO_OS !== "web",
        children: (
          <FormItem>
            <HStack>
              {symbolView}
              {wrappedTextChildren}
              <View style={{ flex: 1 }} />
              {hintView}
              <View style={{ paddingLeft: 12 }}>
                <LinkChevronIcon
                  href={resolvedProps.href}
                  systemImage={resolvedProps.hintImage}
                />
              </View>
            </HStack>
          </FormItem>
        ),
      });
    }
    // Ensure child is a FormItem otherwise wrap it in a FormItem
    if (
      !wrapsFormItem &&
      !(child.props as any).custom &&
      child.type !== FormItem
    ) {
      child = <FormItem onPress={originalOnPress}>{child}</FormItem>;
    }

    return (
      <>
        {child}
        {!isLastChild && <Separator />}
      </>
    );
  });

  const contents = (
    <View
      {...props}
      style={[
        listStyle === "grouped"
          ? {
              backgroundColor: Colors.secondarySystemGroupedBackground,
              borderTopWidth: 0.5,
              borderBottomWidth: 0.5,
              borderColor: Colors.separator,
            }
          : {
              borderCurve: "continuous",
              overflow: "hidden",
              borderRadius: 10,
              backgroundColor: Colors.secondarySystemGroupedBackground,
            },
        props.style,
      ]}
      children={childrenWithSeparator}
    />
  );

  const padding = listStyle === "grouped" ? 0 : 16;

  if (!title && !footer) {
    return (
      <View
        style={{
          paddingHorizontal: padding,
        }}
      >
        {contents}
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: padding,
      }}
    >
      {title && (
        <RNText
          dynamicTypeRamp="footnote"
          style={{
            textTransform: "uppercase",
            color: AppleColors.secondaryLabel,
            paddingHorizontal: 20,
            paddingVertical: 8,
            fontSize: 14,
            // use Apple condensed font
            // fontVariant: ["small-caps"],
          }}
        >
          {title}
        </RNText>
      )}
      {contents}
      {footer && (
        <RNText
          dynamicTypeRamp="footnote"
          style={{
            color: AppleColors.secondaryLabel,
            paddingHorizontal: 20,
            paddingVertical: 8,
            fontSize: 14,
          }}
        >
          {footer}
        </RNText>
      )}
    </View>
  );
}

function LinkChevronIcon({
  href,
  systemImage,
}: {
  href?: any;
  systemImage?: SystemImageProps | React.ReactNode;
}) {
  const isHrefExternal =
    typeof href === "string" && /^([\w\d_+.-]+:)?\/\//.test(href);

  const size = process.env.EXPO_OS === "ios" ? 14 : 24;

  if (systemImage) {
    if (typeof systemImage !== "string") {
      if (React.isValidElement(systemImage)) {
        return systemImage;
      }
      return (
        <IconSymbol
          name={systemImage.name}
          size={systemImage.size ?? size}
          color={systemImage.color ?? AppleColors.tertiaryLabel}
        />
      );
    }
  }

  const resolvedName =
    typeof systemImage === "string"
      ? systemImage
      : isHrefExternal
      ? "arrow.up.right"
      : "chevron.right";

  return (
    <IconSymbol
      name={resolvedName}
      size={size}
      weight="bold"
      // from xcode, not sure which color is the exact match
      // #BFBFBF
      // #9D9DA0
      color={AppleColors.tertiaryLabel}
    />
  );
}

function Separator() {
  return (
    <View
      style={{
        marginStart: 60,
        borderBottomWidth: 0.5, //StyleSheet.hairlineWidth,
        marginTop: -0.5, // -StyleSheet.hairlineWidth,
        borderBottomColor: Colors.separator,
      }}
    />
  );
}

function mergedStyles(style: ViewStyle | TextStyle, props: any) {
  return mergedStyleProp(style, props.style);
}

export function mergedStyleProp<TStyle extends ViewStyle | TextStyle>(
  style: TStyle,
  styleProps?: StyleProp<TStyle> | null
): StyleProp<TStyle> {
  if (styleProps == null) {
    return style;
  } else if (Array.isArray(styleProps)) {
    return [style, ...styleProps];
  }
  return [style, styleProps];
}

function extractStyle(styleProp: any, key: string) {
  if (styleProp == null) {
    return undefined;
  } else if (Array.isArray(styleProp)) {
    return styleProp.find((style) => {
      return style[key] != null;
    })?.[key];
  } else if (typeof styleProp === "object") {
    return styleProp?.[key];
  }
  return null;
}

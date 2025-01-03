import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import * as AppleColors from "@bacons/apple-colors";
import { Href, Link as RouterLink, LinkProps, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { forwardRef } from "react";
import {
  OpaqueColorValue,
  Text as RNText,
  ScrollViewProps,
  StyleProp,
  TextProps,
  TextStyle,
  TouchableHighlight,
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { BodyScrollView } from "./BodyScrollView";
import { HeaderButton } from "./Header";

export const List = forwardRef<
  any,
  ScrollViewProps & {
    /** Set the Expo Router `<Stack />` title when mounted. */
    navigationTitle?: string;
  }
>(({ contentContainerStyle, ...props }, ref) => {
  return (
    <>
      {props.navigationTitle && (
        <Stack.Screen options={{ title: props.navigationTitle }} />
      )}
      <BodyScrollView
        contentContainerStyle={mergedStyleProp(
          {
            padding: 16,
            gap: 24,
          },
          contentContainerStyle
        )}
        {...props}
      />
    </>
  );
});

export function HStack(props: ViewProps) {
  return (
    <View
      {...props}
      style={mergedStyles(
        {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
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

export const FormItem = forwardRef<
  typeof TouchableHighlight,
  Pick<ViewProps, "children"> & { href?: Href<any>; onPress?: () => void }
>(function FormItem({ children, href, onPress }, ref) {
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
});

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
export const Text = React.forwardRef<
  RNText,
  TextProps & {
    /** Value displayed on the right side of the form item. */
    hint?: React.ReactNode;
    /** Adds a prefix SF Symbol image to the left of the text */
    systemImage?: SystemImageProps;

    bold?: boolean;
  }
>(({ bold, ...props }, ref) => {
  const font: TextStyle = {
    ...FormFont.default,
    fontWeight: bold ? "600" : "normal",
  };

  return (
    <RNText
      dynamicTypeRamp="body"
      {...props}
      ref={ref}
      style={mergedStyleProp(font, props.style)}
    />
  );
});

export const Link = React.forwardRef<
  typeof RouterLink,
  LinkProps & {
    /** Value displayed on the right side of the form item. */
    hint?: React.ReactNode;
    /** Adds a prefix SF Symbol image to the left of the text */
    systemImage?: SystemImageProps;

    // TODO: Automatically detect this somehow.
    /** Is the link inside a header. */
    headerRight?: boolean;

    bold?: boolean;
  }
>(({ bold, children, headerRight, ...props }, ref) => {
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
      ref={ref}
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
});

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
  const childrenWithSeparator = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const isLastChild = index === React.Children.count(children) - 1;

    // Extract onPress from child
    const originalOnPress = child.props.onPress;
    let wrapsFormItem = false;
    // If child is type of Text, add default props
    if (child.type === RNText || child.type === Text) {
      child = React.cloneElement(child, {
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        ...child.props,
        onPress: undefined,
        style: [FormFont.default, child.props.style],
      });

      const hintView = (() => {
        if (!child.props.hint) {
          return null;
        }

        return React.Children.map(child.props.hint, (child) => {
          // Filter out empty children
          if (!child) {
            return null;
          }
          if (typeof child === "string") {
            return (
              <RNText dynamicTypeRamp="body" style={FormFont.secondary}>
                {child}
              </RNText>
            );
          }
          return child;
        });
      })();

      const symbolView = (() => {
        if (!child.props.systemImage) {
          return null;
        }

        const symbolProps =
          typeof child.props.systemImage === "string"
            ? { name: child.props.systemImage }
            : child.props.systemImage;

        return (
          <IconSymbol
            name={symbolProps.name}
            size={symbolProps.size ?? 28}
            style={{ marginRight: 16 }}
            color={
              symbolProps.color ??
              extractStyle(child.props.style, "color") ??
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
        child.props.children,
        (linkChild) => {
          // Filter out empty children
          if (!linkChild) {
            return null;
          }
          if (typeof linkChild === "string") {
            return (
              <RNText
                dynamicTypeRamp="body"
                style={mergedStyles(FormFont.default, child.props)}
              >
                {linkChild}
              </RNText>
            );
          }
          return linkChild;
        }
      );

      const hintView = (() => {
        if (!child.props.hint) {
          return null;
        }

        return React.Children.map(child.props.hint, (child) => {
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
        if (!child.props.systemImage) {
          return null;
        }
        const symbolProps =
          typeof child.props.systemImage === "string"
            ? { name: child.props.systemImage }
            : child.props.systemImage;

        return (
          <IconSymbol
            name={symbolProps.name}
            size={symbolProps.size ?? 28}
            style={{ marginRight: 16 }}
            color={
              symbolProps.color ??
              extractStyle(child.props.style, "color") ??
              AppleColors.label
            }
          />
        );
      })();

      child = React.cloneElement(child, {
        style: [FormFont.default, child.props.style],
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        asChild: true,
        children: (
          <FormItem>
            <HStack>
              {symbolView}
              {wrappedTextChildren}
              <View style={{ flex: 1 }} />
              {hintView}
              <View style={{ paddingLeft: 12 }}>
                <LinkChevronIcon href={child.props.href} />
              </View>
            </HStack>
          </FormItem>
        ),
      });
    }
    // Ensure child is a FormItem otherwise wrap it in a FormItem
    if (!wrapsFormItem && child.type !== FormItem) {
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
        {
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

  if (!title && !footer) {
    return contents;
  }

  return (
    <View>
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

function LinkChevronIcon({ href }: { href?: any }) {
  const isHrefExternal =
    typeof href === "string" && /^([\w\d_+.-]+:)?\/\//.test(href);

  const size = process.env.EXPO_OS === "ios" ? 14 : 24;
  if (isHrefExternal) {
    return (
      <IconSymbol
        name="arrow.up.right"
        size={size}
        weight="bold"
        // from xcode, not sure which color is the exact match
        // #BFBFBF
        // #9D9DA0
        color={AppleColors.tertiaryLabel}
      />
    );
  }
  return (
    <IconSymbol
      name="chevron.right"
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

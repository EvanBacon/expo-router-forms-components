"use client";

import { SFIcon, SFIconName } from "./sf-icon";
import { Href, LinkProps, Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { use } from "react";
import {
  Text as RNText,
  Link as RouterLink,
  TouchableHighlight,
  View,
  TextInput,
  useCSSVariable,
  AnimatedScrollView,
} from "@/tw";
import {
  Button,
  GestureResponderEvent,
  OpaqueColorValue,
  RefreshControl,
  ScrollViewProps,
  Share,
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  View as RNView,
  ViewProps,
} from "react-native";
import DateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from "@react-native-community/datetimepicker";

import { Switch, SwitchProps } from "@/components/ui/switch";

import Animated from "react-native-reanimated";
import { SymbolWeight } from "expo-symbols";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

type ListStyle = "grouped" | "auto";

type SystemImageCustomProps = {
  name: SFIconName;
  color?: OpaqueColorValue;
  size?: number;
  weight?: SymbolWeight;
  style?: StyleProp<TextStyle>;
};

type SystemImageProps = SFIconName | SystemImageCustomProps;

const ListStyleContext = React.createContext<ListStyle>("auto");


const defaultItemPadding = { paddingVertical: 11, paddingHorizontal: 20 } as const;

const SectionStyleContext = React.createContext<{
  itemPadding: { paddingVertical: number; paddingHorizontal: number };
}>({
  itemPadding: defaultItemPadding,
});

type RefreshCallback = () => Promise<void>;

const CardStyleContext = React.createContext<{
  sheet?: boolean;
}>({
  sheet: false,
});

const RefreshContext = React.createContext<{
  subscribe: (cb: RefreshCallback) => () => void;
  hasSubscribers: boolean;
  refresh: () => Promise<void>;
  refreshing: boolean;
}>({
  subscribe: () => () => {},
  hasSubscribers: false,
  refresh: async () => {},
  refreshing: false,
});

const RefreshContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const subscribersRef = React.useRef<Set<RefreshCallback>>(new Set());
  const [subscriberCount, setSubscriberCount] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const subscribe = (cb: RefreshCallback) => {
    subscribersRef.current.add(cb);
    setSubscriberCount((count) => count + 1);

    return () => {
      subscribersRef.current.delete(cb);
      setSubscriberCount((count) => count - 1);
    };
  };

  const refresh = async () => {
    const subscribers = Array.from(subscribersRef.current);
    if (subscribers.length === 0) return;

    setRefreshing(true);
    try {
      await Promise.all(subscribers.map((cb) => cb()));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <RefreshContext
      value={{
        subscribe,
        refresh,
        refreshing,
        hasSubscribers: subscriberCount > 0,
      }}
    >
      {children}
    </RefreshContext>
  );
};

/**
 * Register a callback to be called when the user pulls down to refresh in the nearest list.
 *
 * @param callback Register a function to be called when the user pulls down to refresh.
 * The function should return a promise that resolves when the refresh is complete.
 * @returns A function that can be called to trigger a list-wide refresh.
 */
export function useListRefresh(callback?: () => Promise<void>) {
  const { subscribe, refresh } = React.use(RefreshContext);

  React.useEffect(() => {
    if (callback) {
      const unsubscribe = subscribe(callback);
      return unsubscribe;
    }
  }, [callback, subscribe]);

  return refresh;
}

type ListProps = ScrollViewProps & {
  /** Set the Expo Router `<Stack />` title when mounted. */
  navigationTitle?: string;
  listStyle?: ListStyle;
  sheet?: boolean;
};
export function List(props: ListProps) {
  return (
    <RefreshContextProvider>
      <CardStyleContext value={{ sheet: props.sheet }}>
        <InnerList {...props} />
      </CardStyleContext>
    </RefreshContextProvider>
  );
}

if (__DEV__) List.displayName = "FormList";

export function ScrollView(
  props: ScrollViewProps & { ref?: React.Ref<Animated.ScrollView> }
) {
  const { bottom } = useSafeAreaInsets();
  const { sheet } = use(CardStyleContext);
  return (
    <AnimatedScrollView
      scrollToOverflowEnabled
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      scrollIndicatorInsets={{
        bottom: process.env.EXPO_OS === "ios" ? bottom : 0,
      }}
      {...props}
      className={cn(
        sheet ? "bg-transparent" : "bg-sf-grouped-bg",
        "web:scroll-pt-[var(--header-inset,0)]",
        props.className
      )}
    />
  );
}

function InnerList({
  contentContainerClassName,
  className,
  ...props
}: ListProps) {
  const { hasSubscribers, refreshing, refresh } = React.use(RefreshContext);

  return (
    <>
      {props.navigationTitle && (
        <Stack.Screen options={{ title: props.navigationTitle }} />
      )}
      <ListStyleContext value={props.listStyle ?? "auto"}>
        <ScrollView
          contentContainerClassName={cn(
            "py-4 gap-6 native:overflow-visible web:pt-[var(--header-inset,0)]",
            contentContainerClassName
          )}
          className={cn("web:w-full web:mx-auto", className)}
          refreshControl={
            hasSubscribers ? (
              <RefreshControl refreshing={refreshing} onRefresh={refresh} />
            ) : undefined
          }
          {...props}
        />
      </ListStyleContext>
    </>
  );
}

export function LeftBadge({
  name,
  className,
}: {
  name: SFIconName;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center bg-blue-500 rounded-xl curve-sf mr-2 p-2 aspect-square",
        className
      )}
    >
      <SFIcon name={name} className="text-2xl text-white" />
    </View>
  );
}

export function FormItem({
  children,
  href,
  onPress,
  onLongPress,
  disabled,
  style,
  ref,
}: Pick<ViewProps, "children"> & {
  disabled?: boolean;
  href?: Href<any>;
  onPress?: (event: any) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  style?: { paddingVertical?: number; paddingHorizontal?: number };
  ref?: React.Ref<RNView>;
}) {
  const { itemPadding } = use(SectionStyleContext);
  const resolvedStyle = { ...itemPadding, ...style };
  const systemGray4 = useCSSVariable("--sf-gray-4");

  if (href == null) {
    if (onPress == null && onLongPress == null) {
      const childrenCount = getFlatChildren(children).length;

      // If there's only one child, avoid the HStack. This ensures that TextInput doesn't jitter horizontally when typing.
      if (childrenCount === 1) {
        return (
          <View style={resolvedStyle}>
            <View className="min-h-5">{children}</View>
          </View>
        );
      }

      return (
        <View style={resolvedStyle}>
          <HStack className="min-h-5">{children}</HStack>
        </View>
      );
    }
    return (
      <TouchableHighlight
        ref={ref}
        underlayColor={systemGray4}
        onPress={onPress}
        onLongPress={onLongPress}
        className={cn(
          "web:transition-colors web:duration-150",
          "web:hover:bg-sf-fill-2 web:active:bg-sf-fill",
          disabled && "opacity-50"
        )}
        disabled={disabled}
      >
        <View style={resolvedStyle}>
          <HStack className="min-h-5">{children}</HStack>
        </View>
      </TouchableHighlight>
    );
  }

  return (
    <RouterLink asChild href={href} onPress={onPress} onLongPress={onLongPress}>
      <TouchableHighlight
        ref={ref}
        underlayColor={systemGray4}
        disabled={disabled}
        className={cn(
          "web:transition-colors web:duration-150",
          "web:hover:bg-sf-fill-2 web:active:bg-sf-fill",
          disabled && "opacity-50"
        )}
      >
        <View style={resolvedStyle}>
          <HStack className="min-h-5">{children}</HStack>
        </View>
      </TouchableHighlight>
    </RouterLink>
  );
}

type FormTextProps = TextProps & {
  /** Value displayed on the right side of the form item. */
  hint?: React.ReactNode;
  /** A true/false value for the hint. */
  hintBoolean?: React.ReactNode;
  /** Adds a prefix SF Symbol image to the left of the text */
  systemImage?: SystemImageProps | React.ReactNode;

  imageClassName?: string;
  bold?: boolean;
};

/** Text but with iOS default color and sizes. */
export function Text({ bold, ...props }: FormTextProps) {
  return (
    <RNText
      dynamicTypeRamp="body"
      {...props}
      className={cn(
        "text-sf-text text-lg shrink-0",
        bold && "font-semibold",
        props.className
      )}
    />
  );
}

export function TextField({ ...props }: TextInputProps) {
  const placeholderText = useCSSVariable("--sf-text-placeholder");

  return (
    <TextInput
      placeholderTextColor={placeholderText}
      {...props}
      className={cn("text-sf-text text-lg", props.className)}
    />
  );
}

if (__DEV__) TextField.displayName = "FormTextField";

export function Toggle({
  value,
  onValueChange,
  ...props
}: FormTextProps & Required<Pick<SwitchProps, "value" | "onValueChange">>) {
  return <Text {...props} />;
}

if (__DEV__) Toggle.displayName = "FormToggle";

export function DatePicker({
  ...props
}: FormTextProps &
  Omit<IOSNativeProps | AndroidNativeProps, "display" | "accentColor"> & {
    /**
     * The date picker accent color.
     *
     * Sets the color of the selected, date and navigation icons.
     * Has no effect for display 'spinner'.
     */
    accentColor?: OpaqueColorValue | string;
  }) {
  return <Text {...props} />;
}

if (__DEV__) DatePicker.displayName = "FormDatePicker";

export function Link({
  bold,
  children,
  hintImage,
  ...props
}: LinkProps & {
  /** Value displayed on the right side of the form item. */
  hint?: React.ReactNode;
  /** Adds a prefix SF Symbol image to the left of the text. */
  systemImage?: SystemImageProps | React.ReactNode;
  imageClassName?: string;

  /** Changes the right icon. */
  hintImage?: SystemImageProps | React.ReactNode;

  bold?: boolean;
}) {
  return (
    <RouterLink
      dynamicTypeRamp="body"
      {...props}
      asChild={props.asChild ?? false}
      className={cn("text-sf-text", bold && "font-semibold", props.className)}
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
              } else if (
                props.target === "share" &&
                // Ensure the resolved href is an external URL.
                /^([\w\d_+.-]+:)?\/\//.test(RouterLink.resolveHref(props.href))
              ) {
                // Prevent the default behavior of linking to the default browser on native.
                e.preventDefault();
                // Open the link in an in-app browser.
                Share.share({
                  url: props.href as string,
                });
              } else {
                props.onPress?.(e);
              }
            }
      }
    >
      {children}
    </RouterLink>
  );
}

if (__DEV__) Link.displayName = "FormLink";

function getFlatChildren(children: React.ReactNode) {
  const allChildren: React.ReactNode[] = [];

  React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    // If the child is a fragment, unwrap it and add the children to the list
    if (
      child.type === React.Fragment &&
      typeof child.props === "object" &&
      child.props != null &&
      "key" in child.props &&
      child.props?.key == null &&
      "children" in child.props
    ) {
      React.Children.forEach(child.props?.children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        allChildren.push(child);
      });
      return;
    }

    allChildren.push(child);
  });
  return allChildren;
}

export function Section({
  children,
  title,
  titleHint,
  footer,
  ...props
}: ViewProps & {
  title?: string | React.ReactNode;
  titleHint?: string | React.ReactNode;
  footer?: string | React.ReactNode;
}) {
  const listStyle = React.use(ListStyleContext) ?? "auto";
  const linkColor = useCSSVariable("--sf-link");
  const placeholderText = useCSSVariable("--sf-text-placeholder");
  const allChildren = getFlatChildren(children);
  const { sheet } = use(CardStyleContext);

  const childrenWithSeparator = allChildren.map((child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const isLastChild = index === allChildren.length - 1;

    const resolvedProps = {
      ...child.props,
    };

    const isDatePicker = child.type === DatePicker;
    const isToggle = child.type === Toggle;

    if (isToggle) {
      resolvedProps.hint = (
        <Switch
          thumbColor={resolvedProps.thumbColor}
          trackColor={resolvedProps.trackColor}
          ios_backgroundColor={resolvedProps.ios_backgroundColor}
          onChange={resolvedProps.onChange}
          disabled={resolvedProps.disabled}
          value={resolvedProps.value}
          onValueChange={resolvedProps.onValueChange}
        />
      );
    } else if (isDatePicker) {
      resolvedProps.hint = (
        <DateTimePicker
          locale={resolvedProps.locale}
          minuteInterval={resolvedProps.minuteInterval}
          mode={resolvedProps.mode}
          timeZoneOffsetInMinutes={resolvedProps.timeZoneOffsetInMinutes}
          textColor={resolvedProps.textColor}
          disabled={resolvedProps.disabled}
          accentColor={resolvedProps.accentColor}
          value={resolvedProps.value}
          display={resolvedProps.display}
          onChange={resolvedProps.onChange}
        />
      );
    }

    // Set the hint for the hintBoolean prop.
    if (resolvedProps.hintBoolean != null) {
      resolvedProps.hint ??= resolvedProps.hintBoolean ? (
        <SFIcon name="checkmark.circle.fill" className="text-sf-green" />
      ) : (
        <SFIcon name="slash.circle" className="text-sf-gray" />
      );
    }

    // Extract onPress from child
    const originalOnPress = resolvedProps.onPress;
    const originalOnLongPress = resolvedProps.onLongPress;
    let wrapsFormItem = false;
    if (child.type === Button) {
      const { title, color } = resolvedProps;

      delete resolvedProps.title;
      resolvedProps.style = { color: color ?? linkColor };
      child = <RNText {...resolvedProps}>{title}</RNText>;
    }

    if (
      // If child is type of Text, add default props
      child.type === RNText ||
      child.type === Text ||
      isToggle ||
      isDatePicker
    ) {
      child = React.cloneElement(child, {
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        ...resolvedProps,
        onPress: undefined,
        onLongPress: undefined,
        className: cn("text-sf-text text-lg", resolvedProps?.className),
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
                selectable
                dynamicTypeRamp="body"
                className="text-sf-text-2 text-lg text-right shrink"
              >
                {child}
              </RNText>
            );
          }
          return child;
        });
      })();

      if (hintView || resolvedProps.systemImage) {
        child = (
          <HStack>
            <SymbolView
              systemImage={resolvedProps.systemImage}
              className={resolvedProps.imageClassName}
            />
            {child}
            {hintView && <Spacer />}
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
                className={cn("text-lg text-sf-text", resolvedProps?.className)}
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
            return (
              <Text selectable className="text-lg text-sf-text-2">
                {child}
              </Text>
            );
          }
          return child;
        });
      })();

      child = React.cloneElement(child, {
        className: cn(
          "text-sf-text text-lg web:items-stretch web:flex-col web:flex",
          "web:transition-colors web:duration-150",
          "web:hover:bg-sf-fill-2 web:active:bg-sf-fill",
          resolvedProps.className
        ),
        dynamicTypeRamp: "body",
        numberOfLines: 1,
        adjustsFontSizeToFit: true,
        // TODO: This causes issues with ref in React 19.
        asChild: process.env.EXPO_OS !== "web",
        children: (
          <FormItem>
            <HStack>
              <SymbolView
                className={resolvedProps.imageClassName}
                systemImage={resolvedProps.systemImage}
              />
              {wrappedTextChildren}
              <Spacer />
              {hintView}
              <View>
                <LinkChevronIcon
                  href={resolvedProps.href}
                  systemImage={resolvedProps.hintImage}
                />
              </View>
            </HStack>
          </FormItem>
        ),
      });
    } else if (child.type === TextInput || child.type === TextField) {
      wrapsFormItem = true;
      child = (
        <FormItem
          onPress={originalOnPress}
          onLongPress={originalOnLongPress}
          style={{ paddingVertical: 0, paddingHorizontal: 0 }}
        >
          {React.cloneElement(child, {
            placeholderTextColor: placeholderText,
            ...resolvedProps,
            onPress: undefined,
            onLongPress: undefined,
            className: cn(
              "text-sf-text text-lg px-5 py-[11px] outline-none",
              resolvedProps?.className
            ),
          })}
        </FormItem>
      );
    }

    // Ensure child is a FormItem otherwise wrap it in a FormItem
    if (!wrapsFormItem && !child.props.custom && child.type !== FormItem) {
      // Toggle needs reduced padding to account for the larger element.
      const reducedPadding =
        isToggle || isDatePicker ? { paddingVertical: 8 } : undefined;

      child = (
        <FormItem
          onPress={originalOnPress}
          onLongPress={originalOnLongPress}
          style={reducedPadding}
        >
          {child}
        </FormItem>
      );
    }

    return (
      <>
        {child}
        {!isLastChild && <Separator />}
      </>
    );
  });

  const contents = (
    <SectionStyleContext
      value={{
        itemPadding: defaultItemPadding,
      }}
    >
      <View
        {...props}
        collapsable={false}
        className={cn(
          sheet ? "bg-sf-bg-2" : "bg-sf-grouped-bg-2",
          listStyle === "grouped"
            ? "border-sf-border overflow-hidden border-t-[0.5px] border-b-[0.5px]"
            : "curve-sf rounded-3xl overflow-hidden",
          props.className
        )}
      >
        {childrenWithSeparator.map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
      </View>
    </SectionStyleContext>
  );

  const isGrouped = listStyle === "grouped";

  if (!title && !footer) {
    return (
      <View className={isGrouped ? "px-0" : "px-4"}>{contents}</View>
    );
  }

  const titleHintJsx = (() => {
    if (!titleHint) {
      return null;
    }

    if (isStringishNode(titleHint)) {
      return (
        <RNText
          dynamicTypeRamp="footnote"
          className="text-sf-text-2 py-2 text-base"
        >
          {titleHint}
        </RNText>
      );
    }

    return titleHint;
  })();

  return (
    <View className={isGrouped ? "px-0" : "px-4"}>
      <View className="px-5 gap-5 flex-row justify-between">
        {title && (
          <RNText
            dynamicTypeRamp="footnote"
            className="uppercase text-sf-text-2 py-2 text-base"
          >
            {title}
          </RNText>
        )}
        {titleHintJsx}
      </View>

      {contents}

      {footer && (
        <RNText
          dynamicTypeRamp="footnote"
          className="text-sf-text-2 text-base px-5 pt-2"
        >
          {footer}
        </RNText>
      )}
    </View>
  );
}

function SymbolView({
  systemImage,
  className,
}: {
  systemImage?: SystemImageProps | React.ReactNode;
  className?: string;
}) {
  if (!systemImage) {
    return null;
  }

  if (typeof systemImage !== "string" && React.isValidElement(systemImage)) {
    return systemImage;
  }

  const symbolProps =
    typeof systemImage === "object" && systemImage !== null && "name" in systemImage
      ? (systemImage as SystemImageCustomProps)
      : { name: systemImage as SFIconName };

  return (
    <SFIcon
      name={symbolProps.name}
      size={symbolProps.size ?? 20}
      weight={symbolProps.weight}
      color={symbolProps.color}
      className={cn("text-sf-text mr-2", className)}
    />
  );
}

export function LinkChevronIcon({
  href,
  systemImage,
  className,
}: {
  href?: any;
  systemImage?: SystemImageProps | React.ReactNode;
  className?: string;
}) {
  const isHrefExternal =
    typeof href === "string" && /^([\w\d_+.-]+:)?\/\//.test(href);

  const size = process.env.EXPO_OS === "ios" ? 14 : 24;

  if (systemImage) {
    if (typeof systemImage !== "string") {
      if (React.isValidElement(systemImage)) {
        return systemImage;
      }
      const props = systemImage as SystemImageCustomProps;
      return (
        <SFIcon
          name={props.name}
          size={props.size}
          color={props.color}
          className={cn("text-sf-text-3 text-2xl ios:text-sm", className)}
        />
      );
    }
  }

  const resolvedName: SFIconName =
    typeof systemImage === "string"
      ? (systemImage as SFIconName)
      : isHrefExternal
      ? "arrow.up.right"
      : "chevron.right";

  return (
    <SFIcon
      name={resolvedName}
      size={size}
      weight="bold"
      className={cn("text-sf-text-3 text-2xl ios:text-sm", className)}
    />
  );
}

export function HStack(props: ViewProps) {
  return (
    <View
      {...props}
      className={cn("flex-row items-center gap-2", props.className)}
    />
  );
}

export function VStack(props: ViewProps) {
  return <View {...props} className={cn("flex-1 flex-col", props.className)} />;
}

export function Spacer(props: ViewProps) {
  return <View {...props} className={cn("flex-1", props.className)} />;
}

function Separator(props: ViewProps) {
  return (
    <View
      {...props}
      className={cn(
        "border-b-sf-border ms-15 border-b-[0.5px] mt-[-0.5px]",
        props.className
      )}
    />
  );
}

/** @return true if the node should be wrapped in text. */
function isStringishNode(node: React.ReactNode): boolean {
  let containsStringChildren = typeof node === "string";

  React.Children.forEach(node, (child) => {
    if (typeof child === "string") {
      containsStringChildren = true;
    } else if (
      React.isValidElement(child) &&
      "props" in child &&
      typeof child.props === "object" &&
      child.props !== null &&
      "children" in child.props
    ) {
      containsStringChildren = isStringishNode(child.props.children as any);
    }
  });
  return containsStringChildren;
}

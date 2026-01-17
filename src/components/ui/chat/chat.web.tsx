import Animated, {
  AnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedProps,
} from "react-native-reanimated";
import React, { useImperativeHandle } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LegendList, LegendListProps, LegendListRef } from "@legendapp/list";

import { useLayoutEffect, useRef } from "react";

import { SharedValue } from "react-native-reanimated";
import { View } from "react-native";

const MeasureNodeContext = React.createContext<{
  uiHeight: SharedValue<number>;
} | null>(null);

function MeasureNode(props: { children?: React.ReactNode }) {
  const uiHeight = useSharedValue(0);
  return (
    <MeasureNodeContext
      value={{
        uiHeight,
      }}
    >
      {props.children}
    </MeasureNodeContext>
  );
}

MeasureNode.Trigger = function Trigger(props: { children?: React.ReactNode }) {
  const ref = useRef<View>(null);

  const context = React.use(MeasureNodeContext);
  if (!context) {
    throw new Error("MeasureNode.Trigger must be used within a MeasureNode");
  }
  const { uiHeight } = context;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = 'getBoundingClientRect' in ref.current ? ref.current.getBoundingClientRect() : ref.current.unstable_getBoundingClientRect()
    uiHeight.value = rect.height;
  }, [ref, uiHeight]);

  const onLayout = React.useCallback(
    ({ nativeEvent: { layout } }) => {
      // setFrame(layout);
      uiHeight.set(layout.height);
    },
    [uiHeight]
  );

  return <View {...props} ref={ref} onLayout={onLayout} />;
};

MeasureNode.useHeightSharedValue = function useFrame() {
  const context = React.use(MeasureNodeContext);
  if (!context) {
    throw new Error(
      "MeasureNode.useHeightSharedValue must be used within a MeasureNode"
    );
  }
  return context.uiHeight;
};


const AnimatedLegendListComponent =
  Animated.createAnimatedComponent(LegendList);

export function Chat(props: { children?: React.ReactNode }) {
  return <MeasureNode>{props.children}</MeasureNode>;
}

function ChatViewToolbarPadding(
  props: React.ComponentProps<typeof Animated.View>
) {
  const { bottom: paddingBottom } = useSafeAreaInsets();
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();

  const bottomStyle = useAnimatedStyle(() => {
    return {
      bottom: paddingBottom,
    };
  }, [paddingBottom, toolbarHeightSharedValue]);

  return (
    <Animated.View
      {...props}
      style={[{ position: "fixed" as "absolute" }, bottomStyle, props.style]}
      pointerEvents="box-none"
    />
  );
}

Chat.Toolbar = function ChatViewToolbar({
  children,
  ...props
}: React.ComponentProps<typeof Animated.View>) {
  return (
    <ChatViewToolbarPadding {...props}>
      <MeasureNode.Trigger>{children}</MeasureNode.Trigger>
    </ChatViewToolbarPadding>
  );
};

export type ChatScrollViewRef = AnimatedRef<LegendListRef>;
export type ChatScrollViewProps<T = any> = LegendListProps<T> & {
  ref: ChatScrollViewRef;
};

function ChatList<T>({
  children,
  ref,
  ...props
}: ChatScrollViewProps<T>) {
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();
  const scrollViewContentHeight = useSharedValue(0);

  const { bottom } = useSafeAreaInsets();
  const isTouching = useSharedValue(false);
  const scrollViewHeight = useSharedValue(0);

  useImperativeHandle(
    ref,
    () => {
      return {
        ...ref?.current,
        requestScrollToEnd: (animated: boolean) => {
          if (isTouching.value) {
            return;
          }
          if (ref?.current) {
            ref.current?.scrollToEnd({ animated });
          }
        },
      };
    },
    [ref]
  );

  const scrollIndicatorInsets = useDerivedValue(() => {
    return {
      top: 0,
      bottom: toolbarHeightSharedValue.get(),
    };
  }, [toolbarHeightSharedValue, bottom]);

  const animatedProps = useAnimatedProps(() => {
    return {
      contentInset: {
        bottom: bottom + toolbarHeightSharedValue.get(),
        top: 0,
      },
    };
  });

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: () => {
        // No-op on web - keyboard handling is automatic
      },
    },
    []
  );

  return (
    <AnimatedLegendListComponent
      {...props}
      ref={ref}
      animatedProps={animatedProps}
      scrollIndicatorInsets={scrollIndicatorInsets}
      scrollEventThrottle={16}
      onScrollBeginDrag={(e) => {
        isTouching.value = true;
        props.onScrollBeginDrag?.(e);
      }}
      onScrollEndDrag={(e) => {
        isTouching.value = false;
        props.onScrollEndDrag?.(e);
      }}
      onScroll={onScroll}
      keyboardDismissMode="interactive"
      contentInsetAdjustmentBehavior="never"
      onContentSizeChange={(width: number, height: number) => {
        scrollViewContentHeight.value = height;
        props.onContentSizeChange?.(width, height);
      }}
      onLayout={(e) => {
        scrollViewHeight.value = e.nativeEvent.layout.height;
        props.onLayout?.(e);
      }}
    />
  );
}

Chat.List = ChatList;

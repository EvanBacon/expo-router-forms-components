import Animated, {
  AnimatedRef,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedProps,
} from "react-native-reanimated";
import React, { useImperativeHandle, useState } from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LegendList, LegendListProps, LegendListRef } from "@legendapp/list";

import {
  KeyboardGestureArea,
  useReanimatedKeyboardAnimation,
  useKeyboardHandler,
} from "react-native-keyboard-controller";


import { useLayoutEffect, useRef } from "react";

import { SharedValue } from "react-native-reanimated";
import { View } from "react-native";

const MeasureNodeContext = React.createContext<{
  uiHeight: SharedValue<number>;
} | null>(null);

function MeasureNode(props: { children?: React.ReactNode }) {
  // const [frame, setFrame] = React.useState({ x: 0, y: 0, width: 0, height: 0 });
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
    const rect = 'getBoundingClientRect' in ref.current ? ref.current.getBoundingClientRect() : ref.current.unstable_getBoundingClientRect();
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
const AnimatedKeyboardGestureArea =
  Animated.createAnimatedComponent(KeyboardGestureArea);

export function Chat(props: { children?: React.ReactNode }) {
  return (
    <MeasureNode>
      {props.children}
      {/* <GestureAreaInternal>{props.children}</GestureAreaInternal> */}
    </MeasureNode>
  );
}

// NOTE: This seems broken and shifts the content up when the keyboard appears.
function GestureAreaInternal(props: { children?: React.ReactNode }) {
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();

  const animatedGestureAreaProps = useAnimatedProps(() => {
    return {
      offset: toolbarHeightSharedValue.get(),
    };
  });

  return (
    <AnimatedKeyboardGestureArea
      interpolator="ios"
      animatedProps={animatedGestureAreaProps}
      style={{ flex: 1 }}
      textInputNativeID="composer"
    >
      {props.children}
    </AnimatedKeyboardGestureArea>
  );
}

function ChatViewToolbarPadding(
  props: React.ComponentProps<typeof Animated.View>
) {
  const { bottom: paddingBottom } = useSafeAreaInsets();
  const { height, progress } = useReanimatedKeyboardAnimation();
  const keyboard = useAnimatedKeyboard();
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();

  const bottomStyle = useAnimatedStyle(() => {
    const absMax =
      progress.get() === 1
        ? Math.max(Math.abs(height.get()), keyboard.height.get())
        : Math.abs(height.get());
    return {
      bottom: Math.max(paddingBottom, absMax),
      // bottom: 0,
      // transform: [{ translateY: -Math.max(paddingBottom, absMax) }],
    };
  }, [paddingBottom, toolbarHeightSharedValue, height, keyboard, progress]);

  return (
    <Animated.View
      {...props}
      style={[{ position: "absolute" }, bottomStyle, props.style]}
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

const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  // Initialize inset with safe area bottom so contentInset is correct before any keyboard events
  const inset = useSharedValue(bottom);
  const offset = useSharedValue(0);
  const scroll = useSharedValue(0);
  const shouldUseOnMoveHandler = useSharedValue(false);
  const headerHeight = useReanimatedHeaderHeight();

  useKeyboardHandler({
    onStart: (e) => {
      "worklet";

      // i. e. the keyboard was under interactive gesture, and will be showed
      // again. Since iOS will not schedule layout animation for that we can't
      // simply update `height` to destination and we need to listen to `onMove`
      // handler to have a smooth animation
      if (progress.value !== 1 && progress.value !== 0 && e.height !== 0) {
        shouldUseOnMoveHandler.value = true;

        return;
      }

      progress.value = e.progress;
      height.value = e.height;

      inset.value = Math.max(bottom, height.value);
      // Math.max is needed to prevent overscroll when keyboard hides (and user scrolled to the top, for example)
      // Use -headerHeight.value as minimum to prevent content from sliding behind the header
      offset.value = Math.max(
        Math.max(height.value, bottom) + scroll.value,
        -headerHeight.value
      );

      //   offset.value = Math.max(e.height + scroll.value, 0);
    },
    onInteractive: (e) => {
      "worklet";

      progress.value = e.progress;
      height.value = e.height;
    },
    onMove: (e) => {
      "worklet";

      if (shouldUseOnMoveHandler.value) {
        progress.value = e.progress;
        height.value = e.height;
      }
    },
    onEnd: (e) => {
      "worklet";

      height.value = e.height;
      progress.value = e.progress;
      shouldUseOnMoveHandler.value = false;
    },
  });

  const isCloseToEnd = useSharedValue(true);

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        scroll.value = e.contentOffset.y - inset.value;
        // Keep offset in sync with actual scroll position so animatedProps
        // doesn't fight against user scrolling
        // offset.value = e.contentOffset.y;
      },
    },
    []
  );

  return { height, onScroll, inset, offset, scroll, isCloseToEnd };
};

export type ChatScrollViewRef = AnimatedRef<LegendListRef>;
export type ChatScrollViewProps<T = any> = LegendListProps<T> & {
  ref: ChatScrollViewRef;
};
import { useReanimatedHeaderHeight } from "react-native-screens/reanimated";

function ChatScrollView<T>({
  children,
  ref,

  ...props
}: ChatScrollViewProps<T>) {
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();
  const scrollViewContentHeight = useSharedValue(0);
  const { height } = useReanimatedKeyboardAnimation();

  const { bottom } = useSafeAreaInsets();
  const isTouching = useSharedValue(false);
  const scrollViewHeight = useSharedValue(0);
  const headerHeight = useReanimatedHeaderHeight();
  const controllerProps = useKeyboardAnimation();

  useImperativeHandle(
    ref,
    () => {
      return {
        ...ref?.current,
        // The ref can request scrolling to the bottom, but it can be skipped if the user is touching the scroll view.
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
      //   top: headerHeight.get(),
      bottom:
        Math.max(0, Math.abs(height.get()) - bottom) +
        toolbarHeightSharedValue.get(),
    };
  }, [toolbarHeightSharedValue, bottom, height, headerHeight]);

  const animatedProps = useAnimatedProps(() => {
    return {
      contentInset: {
        bottom:
          Math.abs(controllerProps.inset.get()) +
          toolbarHeightSharedValue.get(),
        top: headerHeight.value,
      },
      contentOffset: {
        x: 0,
        y: controllerProps.offset.get(),
      },
    };
  });

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
      onScroll={controllerProps.onScroll}
      keyboardDismissMode="interactive"
      contentInsetAdjustmentBehavior="never"
      onContentSizeChange={(width: number, height: number) => {
        scrollViewContentHeight.value = height;

        // TODO: Scroll to the bottom if not touching and if the content is already at the bottom.
        if (!isTouching.value && !controllerProps.isCloseToEnd.value) {
          // ref.current?.scrollToEnd({ animated: true });
        }
        props.onContentSizeChange?.(width, height);
      }}
      onLayout={(e) => {
        scrollViewHeight.value = e.nativeEvent.layout.height;
        props.onLayout?.(e);
      }}
    />
  );
}

Chat.List = ChatScrollView;

---
name: expo-chat-ui
description: Build a production-quality chat UI with keyboard handling, recycling lists, gestures, and platform-specific implementations
---

## Overview

This skill covers building a performant chat UI in Expo with:

- Smooth keyboard animations with interactive dismissal
- High-performance recycling list for messages
- Safe area and inset management
- Platform-specific implementations (native SwiftUI / web HTML)
- Image attachments and speech recognition

## Required Dependencies

```bash
npx expo install react-native-reanimated react-native-safe-area-context react-native-keyboard-controller @legendapp/list @react-native-masked-view/masked-view expo-haptics expo-speech-recognition expo-glass-effect @expo/ui
```

## Architecture

```
components/
├── keyboard-scroll-view.tsx    # ChatView wrapper with keyboard handling
├── measure-node.tsx            # Height measurement context
├── composer/
│   ├── composer.tsx            # Native implementation
│   ├── composer.web.tsx        # Web implementation
│   ├── composer-text-input.tsx # Text input with keyboard integration
│   ├── send-button.tsx         # Send/Mic/Stop button states
│   ├── multi-button.tsx        # Context menu for attachments
│   └── selected-media-context.tsx # Image attachment state
└── lib/
    ├── haptic.ts               # Native haptics
    └── haptic.web.ts           # Web haptics (no-op)
```

## Core Components

### 1. ChatView Wrapper

The `ChatView` component provides context for measuring toolbar height and coordinating keyboard animations.

```tsx
import { MeasureNode } from "./measure-node";

export function ChatView(props: { children?: React.ReactNode }) {
  return <MeasureNode>{props.children}</MeasureNode>;
}

// Sub-components attached to ChatView
ChatView.Toolbar = ChatViewToolbar;
ChatView.ScrollView = ChatScrollView;
```

### 2. MeasureNode Context

Tracks dynamic heights using shared values for smooth animations:

```tsx
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { View } from "react-native";

const MeasureNodeContext = React.createContext<{
  uiHeight: SharedValue<number>;
} | null>(null);

export function MeasureNode(props: { children?: React.ReactNode }) {
  const uiHeight = useSharedValue(0);
  return (
    <MeasureNodeContext value={{ uiHeight }}>
      {props.children}
    </MeasureNodeContext>
  );
}

MeasureNode.Trigger = function Trigger(props: { children?: React.ReactNode }) {
  const ref = useRef<View>(null);
  const { uiHeight } = React.use(MeasureNodeContext);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    uiHeight.value = rect.height;
  }, [ref, uiHeight]);

  const onLayout = ({ nativeEvent: { layout } }) => {
    uiHeight.set(layout.height);
  };

  return <View {...props} ref={ref} onLayout={onLayout} />;
};

MeasureNode.useHeightSharedValue = function useFrame() {
  const context = React.use(MeasureNodeContext);
  return context.uiHeight;
};
```

## Keyboard Handling

### useKeyboardAnimation Hook

Handles all keyboard lifecycle events for smooth animations:

```tsx
import {
  useReanimatedKeyboardAnimation,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useKeyboardAnimation = () => {
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  const inset = useSharedValue(0);
  const offset = useSharedValue(0);
  const scroll = useSharedValue(0);
  const shouldUseOnMoveHandler = useSharedValue(false);
  const { bottom } = useSafeAreaInsets();

  useKeyboardHandler({
    onStart: (e) => {
      "worklet";
      // Handle interactive gesture detection
      if (progress.value !== 1 && progress.value !== 0 && e.height !== 0) {
        shouldUseOnMoveHandler.value = true;
        return;
      }
      progress.value = e.progress;
      height.value = e.height;
      inset.value = Math.max(bottom, height.value);
      offset.value = Math.max(Math.max(height.value, bottom) + scroll.value, 0);
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
      },
    },
    []
  );

  return { height, onScroll, inset, offset, scroll, isCloseToEnd };
};
```

### Toolbar Positioning

Position the composer toolbar above the keyboard:

```tsx
function ChatViewToolbarPadding(
  props: React.ComponentProps<typeof Animated.View>
) {
  const { bottom: paddingBottom } = useSafeAreaInsets();
  const { height, progress } = useReanimatedKeyboardAnimation();
  const keyboard = useAnimatedKeyboard();
  const toolbarHeightSharedValue = MeasureNode.useHeightSharedValue();

  const bottomStyle = useAnimatedStyle(() => {
    const absMax =
      progress.value === 1
        ? Math.max(Math.abs(height.value), keyboard.height.value)
        : Math.abs(height.value);
    return {
      bottom: Math.max(paddingBottom, absMax),
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

ChatView.Toolbar = function ChatViewToolbar({
  children,
  ...props
}: React.ComponentProps<typeof Animated.View>) {
  return (
    <ChatViewToolbarPadding {...props}>
      <MeasureNode.Trigger>{children}</MeasureNode.Trigger>
    </ChatViewToolbarPadding>
  );
};
```

## Recycling List

### ChatScrollView with Legend List

High-performance list using `@legendapp/list`:

```tsx
import { LegendList, LegendListProps, LegendListRef } from "@legendapp/list";

const AnimatedLegendListComponent =
  Animated.createAnimatedComponent(LegendList);

export type ChatScrollViewRef = AnimatedRef<LegendListRef>;
export type ChatScrollViewProps<T = any> = LegendListProps<T> & {
  ref: ChatScrollViewRef;
};

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
  const controllerProps = useKeyboardAnimation();

  // Custom ref with requestScrollToEnd
  useImperativeHandle(
    ref,
    () => ({
      ...ref?.current,
      requestScrollToEnd: (animated: boolean) => {
        if (isTouching.value) return; // Skip if user is touching
        ref.current?.scrollToEnd({ animated });
      },
    }),
    [ref]
  );

  // Scroll indicator insets
  const scrollIndicatorInsets = useDerivedValue(
    () => ({
      top: 56, // composer header height
      bottom:
        Math.max(0, Math.abs(height.value) - bottom) +
        toolbarHeightSharedValue.value,
    }),
    [toolbarHeightSharedValue, bottom, height]
  );

  // Animated content insets
  const animatedProps = useAnimatedProps(() => ({
    contentInset: {
      bottom:
        Math.abs(controllerProps.inset.value) + toolbarHeightSharedValue.value,
    },
    contentOffset: {
      x: 0,
      y: controllerProps.offset.value,
    },
  }));

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
        props.onContentSizeChange?.(width, height);
      }}
      onLayout={(e) => {
        scrollViewHeight.value = e.nativeEvent.layout.height;
        props.onLayout?.(e);
      }}
    />
  );
}
```

### Usage

```tsx
<ChatView.ScrollView<MessageType>
  ref={scrollViewRef}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{
    gap: 16,
    paddingTop: 72,
    alignItems: "stretch",
  }}
  maintainScrollAtEnd={isThinking}
  maintainVisibleContentPosition={isThinking}
  estimatedItemSize={32}
  initialScrollIndex={messages.length - 1}
  keyExtractor={(item) => item?.id}
  recycleItems={true}
  data={messages}
  renderItem={({ item }) => <Message key={item.id} message={item} />}
  ListFooterComponent={() =>
    error ? <ChatErrorMessage error={error} /> : null
  }
/>
```

## Composer Text Input

### Native Implementation with SwiftUI

```tsx
import * as SUI from "@expo/ui/swift-ui";
import * as mod from "@expo/ui/swift-ui/modifiers";
import { ChatView } from "@/components/keyboard-scroll-view";

export function ComposerTextInput({
  authenticated,
  canSend,
  scrollViewRef,
  textInputRef,
  onSend,
  onChangeText,
  setTextInput,
}: Props) {
  return (
    <ChatView.Toolbar style={{ width: "100%" }}>
      <Host
        style={{ minWidth: "100%", maxWidth: "100%" }}
        matchContents={{ vertical: true }}
      >
        <SUI.GlassEffectContainer
          spacing={4}
          modifiers={[
            mod.disabled(!authenticated),
            frame({ idealWidth: 11111 }),
            ignoreSafeArea({ regions: "all", edges: "all" }),
          ]}
        >
          <SUI.HStack spacing={6} alignment="bottom">
            <MultiButton disabled={!authenticated} />

            <SUI.ZStack
              modifiers={[
                glassEffectId("composer", "container"),
                glassEffect({
                  glass: { variant: "regular", interactive: authenticated },
                  shape: "roundedRectangle",
                  cornerRadius: 24,
                }),
              ]}
              alignment="bottom"
            >
              <SUI.TextField
                multiline
                placeholder="Generate code..."
                allowNewlines={false}
                numberOfLines={6}
                ref={textInputRef}
                onChangeFocus={(focus) => {
                  if (focus) {
                    scrollViewRef?.current?.scrollToOffset({
                      offset: Number.MAX_SAFE_INTEGER - 1,
                      animated: true,
                    });
                  }
                }}
                onChangeText={onChangeText}
                onSubmit={onSend}
                autoFocus={authenticated}
                modifiers={[
                  mod.disabled(!authenticated),
                  mod.padding({ leading: 12, top: 8, bottom: 8, trailing: 48 }),
                  mod.frame({
                    minHeight: 44,
                    maxHeight: 200,
                    idealWidth: 10000,
                  }),
                  mod.clipShape("roundedRectangle"),
                ]}
              />
              <SendButton canSend={canSend} onSend={onSend} />
            </SUI.ZStack>
          </SUI.HStack>
        </SUI.GlassEffectContainer>
      </Host>
    </ChatView.Toolbar>
  );
}
```

## Send Button with Speech Recognition

Three-state button: recording, ready to send, or thinking:

```tsx
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { haptics } from "@/lib/haptic";

export function SendButton({
  disabled,
  canSend,
  onSend,
  setTextInput,
  textInputText,
}) {
  const isThinking = useIsAgentThinking();
  const { stop } = useAgentActions();
  const [isRecording, setIsRecording] = useState(false);

  useSpeechRecognitionEvent("start", () => setIsRecording(true));
  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    const text = textInputText?.current?.trim();
    if (text) {
      haptics.success();
      setTextInput(text, true);
    }
  });
  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript || "";
    if (text) setTextInput(text, false);
  });

  // Stop button when AI is thinking
  if (isThinking) {
    return (
      <SUI.Button variant="borderedProminent" onPress={stop}>
        <SUI.Image systemName="stop.fill" />
      </SUI.Button>
    );
  }

  // Mic button when no text / recording
  if (isRecording || !canSend) {
    return (
      <SUI.Button
        variant="borderedProminent"
        color={isRecording ? AC.systemRed : AC.label}
        onPress={async () => {
          if (isRecording) {
            ExpoSpeechRecognitionModule.stop();
            return;
          }
          haptics.impact("medium");
          const permission =
            await ExpoSpeechRecognitionModule.requestSpeechRecognizerPermissionsAsync();
          if (permission.status === "denied") {
            alert("Permission denied. Enable in App Settings.");
            return;
          }
          ExpoSpeechRecognitionModule.start({
            interimResults: true,
            continuous: false,
            addsPunctuation: true,
          });
        }}
      >
        <SUI.Image systemName={isRecording ? "stop.fill" : "mic.fill"} />
      </SUI.Button>
    );
  }

  // Send button
  return (
    <SUI.Button
      variant="borderedProminent"
      onPress={() => onSend(textInputText?.current)}
    >
      <SUI.Image systemName="arrow.up" />
    </SUI.Button>
  );
}
```

## Image Attachments

### SelectedMediaContext

```tsx
interface SelectedImage {
  url: string;
}

const SelectedMediaContext =
  createContext<SelectedMediaContextValue>(undefined);

export function SelectedMediaProvider({ children }) {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  const addImages = (images: SelectedImage[]) => {
    setSelectedImages((current) => {
      const combined = [...current, ...images];
      const unique = Array.from(
        new Map(combined.map((item) => [item.url, item])).values()
      );
      return unique.slice(-3); // Keep only last 3
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((current) => current.filter((_, i) => i !== index));
  };

  return (
    <SelectedMediaContext
      value={{ selectedImages, addImages, removeImage, clearImages, setImages }}
    >
      {children}
    </SelectedMediaContext>
  );
}
```

### Image Preview

```tsx
function ImagePreviewSection() {
  const { selectedImages, removeImage } = useSelectedMedia();

  return (
    <AnimatedFlatList
      horizontal
      entering={FadeIn}
      exiting={FadeOut}
      itemLayoutAnimation={LinearTransition}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="pt-2 px-3 gap-2"
      data={selectedImages}
      renderItem={({ item, index }) => (
        <AnimatedView entering={FadeIn} exiting={FadeOut}>
          <Image source={{ uri: item.url }} className="w-15 h-15 rounded-lg" />
          <Pressable
            onPress={() => removeImage(index)}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-black/80"
          >
            <SFIcon name="xmark" className="text-white" />
          </Pressable>
        </AnimatedView>
      )}
    />
  );
}
```

## Haptic Feedback

### Native (haptic.ts)

```tsx
import * as Haptics from "expo-haptics";

export const haptics = {
  impact(
    type:
      | "success"
      | "warning"
      | "error"
      | "select"
      | "light"
      | "medium"
      | "heavy"
  ) {
    if (type === "success" || type === "warning" || type === "error") {
      return Haptics.notificationAsync(type);
    }
    if (type === "select") {
      return Haptics.selectionAsync();
    }
    return Haptics.impactAsync(type);
  },
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
```

### Web (haptic.web.ts)

```tsx
export const haptics = {
  impact: () => {},
  success: () => {},
  warning: () => {},
  error: () => {},
};
```

## Full Composer Usage

```tsx
export function FullComposer() {
  return (
    <SelectedMediaProvider>
      <View className="flex-1">
        <ComposerModalBackdrop />
        <Composer />
      </View>
    </SelectedMediaProvider>
  );
}

function Composer() {
  const { sendMessageAsync } = useAgentActions();
  const { messages, error } = useAgentState();
  const isThinking = useIsAgentThinking();
  const textInputRef = useRef<SUI.TextFieldRef>(null);
  const scrollViewRef = useRef<ChatScrollViewRef>(null);
  const { selectedImages, clearImages } = useSelectedMedia();

  const sendMessageWrapper = async (text: string) => {
    if (!text.trim()) return;

    textInputRef.current?.setText("");
    clearImages();

    sendMessageAsync({
      text,
      images: selectedImages.length ? selectedImages : undefined,
    });
  };

  return (
    <View className="flex-1">
      <ComposerHeader />

      <ChatView>
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <View
              style={{
                flex: 1,
                experimental_backgroundImage:
                  "linear-gradient(180deg,rgba(0,0,0,0) 0%, rgba(0,0,0,1) 80px)",
              }}
            />
          }
        >
          <ChatView.ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            maintainScrollAtEnd={isThinking}
            maintainVisibleContentPosition={isThinking}
            estimatedItemSize={32}
            recycleItems={true}
            data={messages}
            renderItem={({ item }) => <Message message={item} />}
          />
        </MaskedView>

        <ComposerTextInput
          scrollViewRef={scrollViewRef}
          textInputRef={textInputRef}
          onSend={sendMessageWrapper}
        />
      </ChatView>
    </View>
  );
}
```

## Key Props Reference

### ChatView.ScrollView Props

| Prop                             | Type            | Description                               |
| -------------------------------- | --------------- | ----------------------------------------- |
| `keyboardShouldPersistTaps`      | `"handled"`     | Allow taps on buttons while keyboard open |
| `keyboardDismissMode`            | `"interactive"` | Swipe-to-dismiss keyboard                 |
| `maintainScrollAtEnd`            | `boolean`       | Auto-scroll when AI is responding         |
| `maintainVisibleContentPosition` | `boolean`       | Keep position when content updates        |
| `recycleItems`                   | `true`          | Enable view recycling for performance     |
| `estimatedItemSize`              | `number`        | Average item height for layout            |
| `contentInsetAdjustmentBehavior` | `"never"`       | Disable automatic safe area handling      |

### Keyboard Animation Shared Values

| Value      | Type     | Description                                |
| ---------- | -------- | ------------------------------------------ |
| `progress` | `0-1`    | Keyboard show/hide animation progress      |
| `height`   | `number` | Current keyboard height in pixels          |
| `inset`    | `number` | Max of bottom safe area or keyboard height |
| `offset`   | `number` | Cumulative offset for scroll positioning   |
| `scroll`   | `number` | Current scroll position relative to inset  |

## Platform-Specific Files

Use file suffixes for platform-specific implementations:

- `composer.tsx` - Native implementation with SwiftUI
- `composer.web.tsx` - Web implementation with HTML/radix
- `multi-button.tsx` - Native context menu
- `multi-button.web.tsx` - Web dropdown menu
- `haptic.ts` - Native haptics
- `haptic.web.ts` - Web haptics (no-op)

## Tips

1. **Always use `keyboardShouldPersistTaps="handled"`** to allow button interactions while keyboard is open
2. **Track `isTouching` state** to prevent auto-scroll while user is manually scrolling
3. **Use `useImperativeHandle`** to extend refs with custom methods like `requestScrollToEnd`
4. **Worklet functions** must include the `"worklet"` directive for keyboard handlers
5. **Use `useDerivedValue`** for computed animations that depend on multiple shared values
6. **Set `estimatedItemSize`** based on your average message height for optimal recycling

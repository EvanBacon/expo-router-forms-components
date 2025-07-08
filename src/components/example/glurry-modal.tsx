import React, { useEffect } from "react";

import * as Form from "@/components/ui/form";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import {
  Modal,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import TouchableBounce from "@/components/ui/touchable-bounce";
import Masked from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  impactAsync,
  ImpactFeedbackStyle,
  notificationAsync,
  NotificationFeedbackType,
} from "expo-haptics";

const ABlurView = Animated.createAnimatedComponent(BlurView);

function AnimateInBlur({
  intensity = 50,
  ...props
}: React.ComponentProps<typeof BlurView>) {
  "use no memo";
  const sharedValue = useSharedValue(0);

  React.useEffect(() => {
    sharedValue.set(
      withTiming(intensity || 50, {
        duration: 500,
        easing: Easing.out(Easing.exp),
      })
    );
  }, [intensity]);

  React.useImperativeHandle(props.ref, () => ({
    animateToZero: () => {
      return new Promise<void>((resolve) => {
        sharedValue.value = withTiming(
          0,
          {
            duration: 500,
            easing: Easing.out(Easing.exp),
          },
          () => {
            runOnJS(resolve)();
          }
        );
      });
    },
  }));

  const animatedProps = useAnimatedProps(() => ({
    intensity: sharedValue.value,
  }));
  return <ABlurView {...props} animatedProps={animatedProps} />;
}

const backgroundImage =
  process.env.EXPO_OS === "web"
    ? `backgroundImage`
    : `experimental_backgroundImage`;

function Glur({ direction }: { direction: "top" | "bottom" }) {
  return (
    <>
      <GlurLayer direction={direction} falloff={50} intensity={12} />
      <GlurLayer direction={direction} falloff={75} intensity={12} />
      <GlurLayer direction={direction} falloff={100} intensity={12} />
    </>
  );
}

function GlurLayer({
  direction,
  falloff,
  intensity,
}: {
  direction: "top" | "bottom";
  falloff: number;
  intensity?: number;
}) {
  return (
    <>
      <Masked
        maskElement={
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              [backgroundImage]: `linear-gradient(to ${direction}, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) ${falloff}%)`,
            }}
          />
        }
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 96,
        }}
      >
        <BlurView intensity={intensity} style={StyleSheet.absoluteFill} />
      </Masked>
    </>
  );
}

function GloryModal({
  children,
  onClose,
}: {
  children?: React.ReactNode;
  onClose: () => void;
}) {
  const { bottom } = useSafeAreaInsets();
  const ref = React.useRef<{ animateToZero: () => void }>(null);

  useEffect(() => {
    impactAsync(ImpactFeedbackStyle.Medium);
  }, []);

  const close = () => {
    ref.current?.animateToZero();
    onClose();
  };

  const theme = useColorScheme();

  return (
    <Modal
      animationType="none"
      transparent
      presentationStyle="overFullScreen"
      visible
      onRequestClose={close}
    >
      <Animated.View style={{ flex: 1 }} exiting={FadeOut}>
        <AnimateInBlur
          style={[StyleSheet.absoluteFill]}
          intensity={70}
          ref={ref}
          tint={
            process.env.EXPO_OS === "web"
              ? theme === "light"
                ? "systemThinMaterialLight"
                : "systemThickMaterialDark"
              : "systemThinMaterial"
          }
        />

        {children}

        {process.env.EXPO_OS !== "web" && (
          <Animated.View entering={FadeIn} exiting={FadeOutDown}>
            <Glur direction="bottom" />
          </Animated.View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            position: "absolute",
            bottom: 0,
            paddingHorizontal: 16,
            paddingBottom: bottom || 16,
            left: 0,
            right: 0,
          }}
        >
          <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
            <TouchableBounce sensory onPress={close}>
              <BlurView
                style={{
                  borderRadius: 16,
                  padding: 16,
                  overflow: "hidden",
                  borderWidth: 0.5,
                  borderColor: AC.separator,
                  borderCurve: "continuous",
                }}
              >
                <IconSymbol name="xmark" color={AC.label} size={24} />
              </BlurView>
            </TouchableBounce>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

export function GlurryList({ setShow }: { setShow: (show: boolean) => void }) {
  const providers = [
    {
      title: "Expo",
      icon: "https://simpleicons.org/icons/expo.svg",
      color: "#000000",
      selected: true,
    },
    {
      title: "Google",
      icon: "https://simpleicons.org/icons/google.svg",
      color: "#4285F4",
    },
    {
      title: "Tesla",
      icon: "https://simpleicons.org/icons/tesla.svg",
      color: "#CC0000",
    },
    {
      title: "Facebook",
      icon: "https://simpleicons.org/icons/facebook.svg",
      color: "#0866FF",
    },
    {
      title: "GitHub",
      icon: "https://simpleicons.org/icons/github.svg",
      color: "#181717",
    },
  ];

  return (
    <GloryModal onClose={() => setShow(false)}>
      <Animated.View
        entering={SlideInDown.duration(500).easing(Easing.out(Easing.exp))}
        exiting={SlideOutDown.easing(Easing.in(Easing.exp))}
        style={{ flex: 1 }}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setShow(false)}>
          <Form.List
            navigationTitle="Components"
            style={{
              transform: [{ scaleY: -1 }],
              backgroundColor: "transparent",
              // backgroundColor: "blue",
            }}
            contentContainerStyle={{
              justifyContent: "flex-end",
              transform: [{ scaleY: -1 }],
            }}
          >
            <View style={{ gap: 8 }}>
              {providers.map((provider) => (
                <TouchableBounce
                  sensory
                  key={provider.title}
                  onPress={() => {
                    setShow(false);
                  }}
                >
                  <Form.HStack
                    key={provider.title}
                    style={{
                      gap: 16,
                      marginHorizontal: 16,
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      borderRadius: 16,
                      backgroundColor: provider.selected
                        ? `rgba(0, 0, 0, 0.05)`
                        : "transparent",
                    }}
                  >
                    <Image
                      source={{ uri: provider.icon }}
                      tintColor={provider.color}
                      style={{
                        tintColor: provider.color,
                        aspectRatio: 1,
                        height: 24,
                      }}
                    />
                    <View style={{ gap: 4 }}>
                      <Form.Text style={Form.FormFont.default}>
                        {provider.title}
                      </Form.Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    {provider.selected && (
                      <IconSymbol
                        color={AC.label}
                        name="checkmark.circle.fill"
                        weight="bold"
                        size={24}
                      />
                    )}
                  </Form.HStack>
                </TouchableBounce>
              ))}
            </View>
          </Form.List>
        </Pressable>
      </Animated.View>
    </GloryModal>
  );
}

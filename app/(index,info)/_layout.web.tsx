import Stack from "@/components/ui/Stack";
import * as AC from "@bacons/apple-colors";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import * as Form from "@/components/ui/Form";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { BlurView } from "expo-blur";
import { Link, useSegments } from "expo-router";
import { useMemo } from "react";

export const unstable_settings = {
  index: {
    initialRouteName: "index",
  },
  info: {
    initialRouteName: "info",
  },
};

function WebHeader(props: NativeStackHeaderProps) {
  const { headerTitle, headerRight } = props.options;
  const title =
    typeof headerTitle === "function"
      ? headerTitle({
          children: props.options.title ?? props.route.name,
          tintColor: props.options.headerTintColor,
        })
      : headerTitle;
  const right =
    typeof headerRight === "function"
      ? headerRight({
          canGoBack: props.navigation.canGoBack(),
          tintColor: props.options.headerTintColor,
        })
      : headerRight;

  return (
    <BlurView
      tint="systemChromeMaterialDark"
      style={{
        height: 55,
        backdropFilter: "blur(10px)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 6,
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", gap: 16 }}>
        {title}

        <View />

        <HeaderTab route="(index)">Home</HeaderTab>
        <HeaderTab route="(info)">Info</HeaderTab>
      </View>
      <div style={{ flex: 1 }} />

      <View style={{ flexDirection: "row", gap: 16 }}>{right}</View>
    </BlurView>
  );
}

function HeaderTab({
  children,
  route,
}: {
  children: React.ReactNode;
  route: ReturnType<typeof useSegments>[0];
}) {
  const [first] = useSegments();
  return (
    <Link
      href={route}
      style={{
        color: first === route ? AC.label : AC.secondaryLabel,
        display: "flex",
        fontSize: 16,
        alignItems: "center",
      }}
    >
      {children}
    </Link>
  );
}

export default function Layout({ segment }: { segment: string }) {
  const screenName = segment.match(/\((.*)\)/)?.[1]!;

  const firstScreen = useMemo(() => {
    if (screenName === "index") {
      return (
        <Stack.Screen
          name="index"
          options={{
            headerRight: () => (
              <Form.Link headerRight href="/account">
                <Avatar />
              </Form.Link>
            ),
          }}
        />
      );
    } else {
      return <Stack.Screen name={screenName} />;
    }
  }, [screenName]);

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        header: WebHeader,
      }}
    >
      {firstScreen}

      <Stack.Screen
        name="blur"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          title: "Blur",
          headerRight: () => (
            <Form.Link headerRight href="/" dismissTo>
              <IconSymbol
                name="xmark.circle.fill"
                color={AC.systemGray}
                size={28}
              />
            </Form.Link>
          ),
        }}
      />

      <Stack.Screen
        name="icon"
        sheet
        options={{
          headerLargeTitle: false,
          // Quarter sheet with no pulling allowed
          headerTransparent: false,
          sheetGrabberVisible: false,
          sheetAllowedDetents: [0.25],
          headerRight: () => (
            <Form.Link headerRight href="/" dismissTo>
              <IconSymbol
                name="xmark.circle.fill"
                color={AC.systemGray}
                size={28}
              />
            </Form.Link>
          ),
        }}
      />

      <Stack.Screen
        name="account"
        options={{
          presentation: "modal",

          headerRight: () => (
            <Form.Link headerRight bold href="/" dismissTo>
              Done
            </Form.Link>
          ),
        }}
      />
    </Stack>
  );
}

function Avatar() {
  return (
    <View
      style={{
        padding: 6,
        borderRadius: 99,
        [process.env.EXPO_OS === "web"
          ? `backgroundImage`
          : `experimental_backgroundImage`]: `linear-gradient(to bottom, #A5ABB8, #858994)`,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: process.env.EXPO_OS === "ios" ? "ui-rounded" : undefined,
          fontSize: 14,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        EB
      </Text>
    </View>
  );
}

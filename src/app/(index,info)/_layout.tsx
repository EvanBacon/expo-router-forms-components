import Stack from "@/components/ui/Stack";
import * as AC from "@bacons/apple-colors";
import { Text, View } from "react-native";

import * as Form from "@/components/ui/Form";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useMemo } from "react";

export const unstable_settings = {
  index: {
    initialRouteName: "index",
  },
  info: {
    initialRouteName: "info",
  },
};

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
    <Stack>
      {firstScreen}

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

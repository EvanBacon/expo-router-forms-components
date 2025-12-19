import React from "react";

import { ContentUnavailable } from "@/components/ui/content-unavailable";
import * as Form from "@/components/ui/form";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  Segments,
  SegmentsContent,
  SegmentsList,
  SegmentsTrigger,
} from "@/components/ui/segments";
import Stack from "@/components/layout/stack";
import * as AC from "@bacons/apple-colors";
// import { Image } from "expo-image";
import { Image } from "@/components/ui/img";
import { Link } from "expo-router";
import { ComponentProps } from "react";
import {
  Button,
  OpaqueColorValue,
  Switch,
  Text,
  Appearance,
  TextInput,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";

import { GlurryList } from "@/components/example/glurry-modal";
import ExpoSvg from "@/svg/expo.svg";
import GithubSvg from "@/svg/github.svg";

import * as Fonts from "@/constants/fonts";
import {
  Body,
  Callout,
  Caption,
  Caption2,
  Footnote,
  Headline,
  LargeTitle,
  Subheadline,
  Title,
  Title2,
  Title3,
} from "@/components/ui/title";
import { Rounded } from "@/components/ui/rounded";
import { HTMLPictureExample } from "@/components/example/html-picture";
import { toast } from "@/utils/toast";

//

function useOptimisticDarkMode() {
  const [darkMode, setDarkMode] = React.useState(() => {
    return Appearance.getColorScheme() === "dark";
  });

  return [
    darkMode,
    (value: Parameters<typeof Appearance.setColorScheme>[0]) => {
      setDarkMode(value === "dark");
      if (process.env.EXPO_OS === "ios") {
        setTimeout(() => {
          Appearance.setColorScheme(value);
          // Add some time for the iOS switch animation to complete
        }, 100);
      } else if (process.env.EXPO_OS === "android") {
        Appearance.setColorScheme(value);
      } else if (process.env.EXPO_OS === "web") {
        // Web doesn't support setting the color scheme, so we just log it
        console.log("Setting color scheme to:", value);
        // Add class= "dark" to the body element
        document.body.classList.toggle("dark", value === "dark");
      }
    },
  ] as const;
}

function Switches() {
  const [on, setOn] = React.useState(false);
  const [darkMode, setDarkMode] = useOptimisticDarkMode();
  return (
    <Form.Section title="Toggle">
      <Form.Toggle
        systemImage={{ name: "moon" }}
        value={darkMode}
        onValueChange={(value) => setDarkMode(value ? "dark" : undefined)}
      >
        Always Dark
      </Form.Toggle>
      <Form.Toggle systemImage="star" value={on} onValueChange={setOn}>
        Built-in
      </Form.Toggle>
      <Form.Text bold hint={<Switch value={on} onValueChange={setOn} />}>
        Hint
      </Form.Text>

      <Form.HStack>
        <Form.Text>Manual</Form.Text>
        <View style={{ flex: 1 }} />
        <Switch value={on} onValueChange={setOn} />
      </Form.HStack>
    </Form.Section>
  );
}

function FontSection() {
  const [bold, setBold] = React.useState(false);
  const fontWeight = bold ? "bold" : "normal";
  return (
    <>
      <Form.Section
        title="Fonts"
        titleHint={process.env.EXPO_OS === "ios" ? "San Francisco" : "Roboto"}
      >
        <Form.Text style={{ fontFamily: Fonts.system, fontWeight }}>
          system
        </Form.Text>
        <Form.Text
          style={{ fontFamily: Fonts.rounded, fontWeight }}
          hintBoolean={process.env.EXPO_OS === "ios"}
        >
          rounded
        </Form.Text>
        <Form.Text style={{ fontFamily: Fonts.monospaced, fontWeight }}>
          monospaced
        </Form.Text>
        <Form.Text style={{ fontFamily: Fonts.serif, fontWeight }}>
          serif
        </Form.Text>
      </Form.Section>
      <Form.Section>
        <Form.Toggle value={bold} onValueChange={setBold}>
          Bold fonts
        </Form.Toggle>
      </Form.Section>
    </>
  );
}

export default function Page() {
  const ref = useAnimatedRef();
  const scroll = useScrollViewOffset(ref);
  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scroll.value, [0, 30], [0, 1], "clamp"),
      transform: [
        { translateY: interpolate(scroll.value, [0, 30], [5, 0], "clamp") },
      ],
    };
  });

  return (
    <Form.List navigationTitle="Components">
      <Form.Section>
        <Rounded padding style={{ alignItems: "center", gap: 8, flex: 1 }}>
          <Image
            source={{ uri: "https://github.com/evanbacon.png" }}
            style={{
              aspectRatio: 1,
              height: 64,
              borderRadius: 8,
            }}
          />
          <Form.Text
            style={{
              fontSize: 20,
              fontFamily:
                process.env.EXPO_OS === "ios" ? "ui-rounded" : undefined,
              fontWeight: "600",
            }}
          >
            Bacon Components
          </Form.Text>
          <Form.Text style={{ textAlign: "center", fontSize: 14 }}>
            Copy/paste components for universal Expo Router apps.{" "}
            <Form.Link
              style={{
                color: AC.link,
                fontSize: 14,
              }}
              href="/info"
            >
              Learn more...
            </Form.Link>
          </Form.Text>
        </Rounded>
      </Form.Section>
    </Form.List>
  );
}

function SegmentsTest() {
  return (
    <View style={{ flex: 1 }}>
      <Segments defaultValue="account">
        <SegmentsList>
          <SegmentsTrigger value="account">Account</SegmentsTrigger>
          <SegmentsTrigger value="password">Password</SegmentsTrigger>
        </SegmentsList>

        <SegmentsContent value="account">
          <Form.Text style={{ paddingVertical: 12 }}>Account Section</Form.Text>
        </SegmentsContent>
        <SegmentsContent value="password">
          <Form.Text style={{ paddingVertical: 12 }}>
            Password Section
          </Form.Text>
        </SegmentsContent>
      </Segments>
    </View>
  );
}

function TripleItemTest() {
  return (
    <>
      <HorizontalItem title="Expires" badge="88" subtitle="Days" />

      <View
        style={{
          backgroundColor: AC.separator,
          width: 0.5,
          maxHeight: "50%",
          minHeight: "50%",
          marginVertical: "auto",
        }}
      />

      <HorizontalItem
        title="Developer"
        badge={
          <Image
            name="sf:person.text.rectangle"
            size={28}
            weight="bold"
            animationSpec={{
              effect: {
                type: "pulse",
              },
              repeating: true,
            }}
            tintColor={AC.secondaryLabel}
          />
        }
        subtitle="Evan Bacon"
      />

      <View
        style={{
          backgroundColor: AC.separator,
          width: 0.5,
          maxHeight: "50%",
          minHeight: "50%",
          marginVertical: "auto",
        }}
      />

      <HorizontalItem title="Version" badge="3.6" subtitle="Build 250" />
    </>
  );
}

function HorizontalItem({
  title,
  badge,
  subtitle,
}: {
  title: string;
  badge: React.ReactNode;
  subtitle: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 4, flex: 1 }}>
      <Form.Text
        style={{
          textTransform: "uppercase",
          fontSize: 10,
          fontWeight: "600",
          color: AC.secondaryLabel,
        }}
      >
        {title}
      </Form.Text>
      {typeof badge === "string" ? (
        <Form.Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: AC.secondaryLabel,
          }}
        >
          {badge}
        </Form.Text>
      ) : (
        badge
      )}

      <Form.Text
        style={{
          fontSize: 12,
          color: AC.secondaryLabel,
        }}
      >
        {subtitle}
      </Form.Text>
    </View>
  );
}

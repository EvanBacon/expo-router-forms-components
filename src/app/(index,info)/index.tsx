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

  const [show, setShow] = React.useState(false);

  return (
    <View style={{ flex: 1 }}>
      {show && <GlurryList setShow={setShow} />}
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          headerTitle() {
            if (process.env.EXPO_OS === "web") {
              return (
                <Animated.View
                  style={[
                    style,
                    { flexDirection: "row", gap: 12, alignItems: "center" },
                  ]}
                >
                  <Image
                    source={{ uri: "https://github.com/evanbacon.png" }}
                    style={[
                      {
                        aspectRatio: 1,
                        height: 30,
                        borderRadius: 8,
                        borderWidth: 0.5,
                        borderColor: AC.separator,
                      },
                    ]}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      color: AC.label,
                      fontWeight: "bold",
                    }}
                  >
                    Bacon Components
                  </Text>
                </Animated.View>
              );
            }
            return (
              <Animated.Image
                source={{ uri: "https://github.com/evanbacon.png" }}
                style={[
                  style,
                  {
                    aspectRatio: 1,
                    height: 30,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    borderColor: AC.separator,
                  },
                ]}
              />
            );
          },
        }}
      />
      <Form.List ref={ref} navigationTitle="Components">
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

        <FontSection />

        <Form.Section title="Details">
          <TextInput placeholder="First Name" />
          <Form.TextField placeholder="Last Name" />
        </Form.Section>

        {process.env.EXPO_OS === "ios" && (
          <Form.Section title="Date">
            <Form.DatePicker value={new Date()} accentColor={AC.label}>
              Birthday
            </Form.DatePicker>
            <Form.DatePicker value={new Date()} mode="time">
              Birthday Minute
            </Form.DatePicker>

            <Form.Text
              hint={
                <DateTimePicker
                  mode="datetime"
                  accentColor={AC.systemTeal}
                  value={new Date()}
                />
              }
            >
              Manual
            </Form.Text>
          </Form.Section>
        )}

        <Form.Section title="Features">
          <Form.Text
            onPress={() => {
              setShow(true);
            }}
          >
            Open Blur Modal
          </Form.Text>
          <Form.Link href="/settings">Apple Settings</Form.Link>
          <Form.Link href="/icon">Change App Icon</Form.Link>
          <Form.Link href="/_debug">Debug menu</Form.Link>
          <Form.Link href="/privacy">Privacy Policy</Form.Link>
        </Form.Section>

        <Form.Section title="Toasts" footer="Powered by sonner-native">
          <Form.Text
            onPress={() => {
              toast("Hello from sonner-native!");
            }}
          >
            Basic Toast
          </Form.Text>
          <Form.Text
            onPress={() => {
              toast.success("Successfully completed the action!");
            }}
          >
            Success Toast
          </Form.Text>
          <Form.Text
            onPress={() => {
              toast.error("Something went wrong!");
            }}
          >
            Error Toast
          </Form.Text>
          <Form.Text
            onPress={() => {
              toast.warning("This is a warning message!");
            }}
          >
            Warning Toast
          </Form.Text>
          <Form.Text
            onPress={() => {
              toast.info("Here's some helpful information");
            }}
          >
            Info Toast
          </Form.Text>
          <Form.Text
            onPress={() => {
              toast("Custom toast with options", {
                description: "This toast has a description and lasts longer",
                duration: 5000,
              });
            }}
          >
            Custom Toast
          </Form.Text>
        </Form.Section>

        <Form.Section>
          <Form.HStack style={{ alignItems: "stretch", gap: 12 }}>
            <TripleItemTest />
          </Form.HStack>
        </Form.Section>

        <Form.Section>
          <Form.Text
            systemImage="terminal"
            style={{
              letterSpacing: 0.5,
            }}
          >
            <Text style={{ color: AC.secondaryLabel }}>{`~ / `}</Text>
            npx testflight
          </Form.Text>

          <Form.Link
            href="https://expo.dev/eas"
            target="_blank"
            systemImage={
              <ExpoSvg
                fill={AC.label}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
            }
            style={{ color: AC.systemBlue, fontWeight: "400" }}
          >
            Deploy on Expo
          </Form.Link>
        </Form.Section>

        <Form.Section>
          <Form.Link
            href="https://github.com/EvanBacon/expo-router-forms-components"
            target="_blank"
            systemImage={
              <GithubSvg
                fill={AC.label}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
            }
            style={{ color: AC.systemBlue, fontWeight: "400" }}
          >
            Clone on GitHub
          </Form.Link>
        </Form.Section>
        <Form.Section title="Hints">
          <Form.Text hint="Long hint with extra content that should float below the content">
            Normal
          </Form.Text>

          {/* Custom with wrap-below */}
          <Form.HStack style={{ flexWrap: "wrap" }}>
            <Form.Text>Wrap Below</Form.Text>
            {/* Spacer */}
            <View style={{ flex: 1 }} />
            {/* Right */}
            <Form.Text style={{ flexShrink: 1, color: AC.secondaryLabel }}>
              Long list of text that should wrap around when it gets too long
            </Form.Text>
          </Form.HStack>
        </Form.Section>

        <Switches />
        <Form.Section
          title="Segments"
          footer="Render tabbed content declaratively"
        >
          <SegmentsTest />
        </Form.Section>
        <Form.Section>
          <Form.HStack style={{ gap: 16 }}>
            <Image
              source={{ uri: "https://github.com/evanbacon.png" }}
              style={{
                aspectRatio: 1,
                height: 48,
                borderRadius: 999,
              }}
            />
            <View style={{ gap: 4 }}>
              <Form.Text style={Form.FormFont.default}>Evan's iPhone</Form.Text>
              <Form.Text style={Form.FormFont.caption}>
                This iPhone 16 Pro Max
              </Form.Text>
            </View>

            <View style={{ flex: 1 }} />

            <Image
              source="sf:person.fill.badge.plus"
              tintColor={AC.systemBlue}
              size={24}
              animationSpec={{
                effect: {
                  type: "pulse",
                },
                repeating: true,
              }}
            />
          </Form.HStack>
        </Form.Section>

        <HTMLPictureExample />

        <Form.Section
          title="Links"
          footer={
            <Text>
              Help improve Search by allowing Apple to store the searches you
              enter into Safari, Siri, and Spotlight in a way that is not linked
              to you.{"\n\n"}Searches include lookups of general knowledge, and
              requests to do things like play music and get directions.{"\n"}
              <Link style={{ color: AC.link }} href="/two">
                About Search & Privacy...
              </Link>
            </Text>
          }
        >
          {/* Table style: | A   B |*/}
          <Link href="/two">Next</Link>

          <Form.Link target="_blank" href="https://evanbacon.dev">
            Target _blank
          </Form.Link>

          <Link href="/two">
            <View style={{ gap: 4 }}>
              <Form.Text>Evan's iPhone</Form.Text>
              <Text style={Form.FormFont.caption}>This iPhone 16 Pro Max</Text>
            </View>
          </Link>

          <Link href="https://expo.dev">Expo</Link>

          <Form.Link href="/two" hint="Normal">
            Hint + Link
          </Form.Link>
        </Form.Section>
        <Form.Section title="Icons">
          <Form.Link href="/two" systemImage="star">
            Link + Icon
          </Form.Link>
          <Form.Link
            href="/two"
            systemImage={{ name: "car.fill", color: AC.systemPurple }}
          >
            Custom color in link
          </Form.Link>
          <Form.Text systemImage="airpodspro.chargingcase.wireless.fill">
            Item
          </Form.Text>
          <FormLabel
            onPress={() => {
              console.log("hey");
            }}
            systemImage="sf:photo.on.rectangle"
          >
            Custom Icon
          </FormLabel>
          <Form.Link
            style={{
              color: AC.systemGreen,
            }}
            href="/two"
            systemImage="photo.on.rectangle"
          >
            Icon inherits link color
          </Form.Link>
        </Form.Section>
        <Form.Section title="Unavailable">
          <ContentUnavailable internet actions={<Button title="Refresh" />} />

          <ContentUnavailable search />
          <ContentUnavailable search="123" />
          <ContentUnavailable
            title="Car Not Found"
            systemImage="car"
            description="Dude, where's my car?"
          />
          <ContentUnavailable
            title="Custom Unavailable"
            systemImage={
              <Image source="sf:0.square" size={45} tintColor={AC.systemPink} />
            }
          />
        </Form.Section>
        <Form.Section title="Form Items">
          <Text>Default</Text>
          <Button
            title="RN Button"
            onPress={() => {
              console.log("Button pressed");
            }}
          />
          <Button title="RN Button + color" color={AC.systemPurple} />
          <Form.Text hint="Right">Hint</Form.Text>
          <Text
            onPress={() => {
              console.log("Hey");
            }}
          >
            Pressable
          </Text>

          <Text style={{ fontWeight: "bold", color: AC.systemPink }}>
            Custom style
          </Text>
          <Form.Text bold>Bold</Form.Text>

          <View>
            <Text>Wrapped</Text>
          </View>

          {/* Table style: | A   B |*/}
          <Form.HStack>
            <Text style={Form.FormFont.default}>Foo</Text>
            <View style={{ flex: 1 }} />
            <Text style={Form.FormFont.secondary}>Bar</Text>
          </Form.HStack>
        </Form.Section>
        <Form.Section title="Table">
          {/* Table style: | A   B |*/}
          <Form.Text hint="Expo Router v4">SDK 52</Form.Text>

          {/* Custom version of same code */}
          <Form.HStack>
            <Text style={Form.FormFont.default}>SDK 51</Text>
            <View style={{ flex: 1 }} />
            <Text style={Form.FormFont.secondary}>Expo Router v3</Text>
          </Form.HStack>
        </Form.Section>

        <Form.Section>
          <Form.Text hint="Jan 31, 2025">Release Date</Form.Text>
          <Form.Text hint="3.6 (250)">Version</Form.Text>

          <FormExpandable
            hint="Requires visionOS 1.0 or later and iOS 17.5 or later. Compatible with iPhone, iPad, and Apple Vision."
            preview="Works on this iPhone"
            custom
          >
            Compatibility
          </FormExpandable>
        </Form.Section>

        <Form.Section
          title={
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: AC.label,
                textTransform: "none",
              }}
            >
              Developer
            </Text>
          }
        >
          <Form.Link
            href="https://github.com/evanbacon"
            target="_blank"
            hintImage={{
              name: "hand.raised.fill",
              color: AC.systemBlue,
              size: 20,
            }}
            style={{ color: AC.systemBlue }}
          >
            Developer Privacy Policy
          </Form.Link>
          <Button
            title="Stop Testing"
            color={AC.systemRed}
            onPress={() => {}}
          />
        </Form.Section>

        <Rounded
          padding
          style={{
            margin: 16,
            gap: 8,
            backgroundColor: AC.secondarySystemGroupedBackground,
          }}
        >
          <LargeTitle>LargeTitle</LargeTitle>
          <Title>Title 1</Title>
          <Title2>Title 2</Title2>
          <Title3>Title 3</Title3>
          <Headline>Headline</Headline>
          <Subheadline>Subheadline</Subheadline>
          <Body>Body</Body>
          <Callout>Callout</Callout>
          <Footnote>Footnote</Footnote>
          <Caption>Caption 1</Caption>
          <Caption2>Caption 2</Caption2>
          {/* Example with rounded font */}
          <Title rounded>Rounded Title 1</Title>
          {/* Example with monospaced font */}
          <Body monospaced>Monospaced Body</Body>
        </Rounded>
      </Form.List>
    </View>
  );
}

function FormExpandable({
  children,
  hint,
  preview,
}: {
  custom: true;
  children?: React.ReactNode;
  hint?: string;
  preview?: string;
}) {
  const [open, setOpen] = React.useState(false);

  // TODO: If the entire preview can fit, then just skip the hint.

  return (
    <Form.FormItem onPress={() => setOpen(!open)}>
      <Form.HStack style={{ flexWrap: "wrap" }}>
        <Form.Text>{children}</Form.Text>
        {/* Spacer */}
        <View style={{ flex: 1 }} />
        {open && (
          <Image
            source={open ? "chevron.up" : "chevron.down"}
            size={16}
            tintColor={AC.systemGray}
          />
        )}
        {/* Right */}
        <Form.Text style={{ flexShrink: 1, color: AC.secondaryLabel }}>
          {open ? hint : preview}
        </Form.Text>
        {!open && (
          <Image
            source={open ? "sf:chevron.up" : "sf:chevron.down"}
            size={16}
            tintColor={AC.systemGray}
          />
        )}
      </Form.HStack>
    </Form.FormItem>
  );
}

function FormLabel({
  children,
  systemImage,
  color,
}: {
  /** Only used when `<FormLabel />` is a direct child of `<Section />`. */
  onPress?: () => void;
  children: React.ReactNode;
  systemImage: ComponentProps<typeof IconSymbol>["name"];
  color?: OpaqueColorValue;
}) {
  return (
    <Form.HStack style={{ gap: 16 }}>
      <Image
        source={systemImage}
        size={28}
        tintColor={color ?? AC.systemBlue}
      />
      <Text style={Form.FormFont.default}>{children}</Text>
    </Form.HStack>
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

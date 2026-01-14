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
import { cn } from "@/lib/utils";
// import { Image } from "expo-image";
import { Image } from "@/components/ui/img";
import { ComponentProps } from "react";
import { Button, OpaqueColorValue, Switch, Text, TextInput } from "react-native";
import { useTheme, ThemeMode } from "@/components/ui/theme-provider";
import { View, Link, Pressable } from "@/tw";
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

import { Rounded } from "@/components/ui/rounded";
import { HTMLPictureExample } from "@/components/example/html-picture";
import { toast } from "@/utils/toast";

//

function ThemeSwitcher() {
  const { mode, setMode, isDark } = useTheme();

  return (
    <Form.Section title="Appearance" footer="Controls app-wide color scheme. System follows your device settings.">
      <View className="py-2">
        <Segments
          value={mode}
          onValueChange={(value) => setMode(value as ThemeMode)}
        >
          <SegmentsList>
            <SegmentsTrigger value="system">System</SegmentsTrigger>
            <SegmentsTrigger value="light">Light</SegmentsTrigger>
            <SegmentsTrigger value="dark">Dark</SegmentsTrigger>
          </SegmentsList>
        </Segments>
      </View>
      <Form.Text
        systemImage={{ name: isDark ? "moon.fill" : "sun.max.fill" }}
        hint={isDark ? "Dark" : "Light"}
      >
        Current Theme
      </Form.Text>
    </Form.Section>
  );
}

function Switches() {
  const [on, setOn] = React.useState(false);
  return (
    <Form.Section title="Toggle">
      <Form.Toggle systemImage="star" value={on} onValueChange={setOn}>
        Built-in
      </Form.Toggle>
      <Form.Text bold hint={<Switch value={on} onValueChange={setOn} />}>
        Hint
      </Form.Text>

      <Form.HStack>
        <Form.Text>Manual</Form.Text>
        <View className="flex-1" />
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
        <Form.Text
          className={cn("font-sans", bold ? "font-bold" : "font-normal")}
        >
          system
        </Form.Text>
        <Form.Text
          className={cn("font-rounded", bold ? "font-bold" : "font-normal")}
          hintBoolean={process.env.EXPO_OS === "ios"}
        >
          rounded
        </Form.Text>
        <Form.Text
          className={cn("font-mono", bold ? "font-bold" : "font-normal")}
        >
          monospaced
        </Form.Text>
        <Form.Text
          className={cn("font-serif", bold ? "font-bold" : "font-normal")}
        >
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
    <View className="flex-1">
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
                  <Link href="/">
                    <Link.Trigger>
                      <Image
                        source={{ uri: "https://github.com/evanbacon.png" }}

                        style={{
                          aspectRatio: 1,
                          height: 30,
                          borderRadius: 8,
                          borderWidth: 0.5,
                          borderColor: AC.separator,
                        }}
                      />
                    </Link.Trigger>
                    <Link.Menu>
                      <Link.MenuAction
                        icon="star"
                        title="Profile"
                        onPress={() => {}}
                      />
                    </Link.Menu>
                  </Link>
                  <Text className="font-bold text-xl text-sf-text">
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
          <Rounded padding className="items-center gap-2">
            <Image
              source={{ uri: "https://github.com/evanbacon.png" }}
              style={{
                aspectRatio: 1,
                height: 64,
                borderRadius: 8,
              }}
            />
            <Form.Text className="text-xl font-rounded font-semibold">
              Bacon Components
            </Form.Text>
            <Form.Text className="text-center text-sm">
              Copy/paste components for universal Expo Router apps.{" "}
              <Form.Link className="text-sf-link text-sm" href="/info">
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

          <Link href="/settings" asChild custom>
            <Link.Trigger>
              <Pressable>
                <Text>App Settings</Text>
              </Pressable>
            </Link.Trigger>
            <Link.Menu>
              <Link.MenuAction title="Share" onPress={() => {}} />
            </Link.Menu>
          </Link>

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
          <Form.HStack className="items-stretch gap-3">
            <TripleItemTest />
          </Form.HStack>
        </Form.Section>

        <Form.Section>
          <Form.Text systemImage="terminal" className="native:tracking-tight">
            <Text className="text-sf-text-2">{`~ / `}</Text>
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
            className="text-sf-blue font-normal"
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
            className="text-sf-blue font-normal"
          >
            Clone on GitHub
          </Form.Link>
        </Form.Section>
        <Form.Section title="Hints">
          <Form.Text hint="Long hint with extra content that should float below the content">
            Normal
          </Form.Text>

          {/* Custom with wrap-below */}
          <Form.HStack className="flex-wrap">
            <Form.Text>Wrap Below</Form.Text>
            {/* Spacer */}
            <View className="flex-1" />
            {/* Right */}
            <Form.Text className="shrink text-sf-text-2">
              Long list of text that should wrap around when it gets too long
            </Form.Text>
          </Form.HStack>
        </Form.Section>

        <ThemeSwitcher />

        <Switches />
        <Form.Section
          title="Segments"
          footer="Render tabbed content declaratively"
        >
          <SegmentsTest />
        </Form.Section>
        <Form.Section>
          <Form.HStack className="gap-4">
            <Image
              source={{ uri: "https://github.com/evanbacon.png" }}
              style={{
                aspectRatio: 1,
                height: 48,
                borderRadius: 999,
              }}
            />
            <View className="gap-1">
              <Form.Text className="text-sf-text text-lg">
                Evan's iPhone
              </Form.Text>
              <Form.Text className="text-sf-text-2 text-xs">
                This iPhone 16 Pro Max
              </Form.Text>
            </View>

            <View className="flex-1" />

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
              <Link className="text-sf-link" href="/two">
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
            <View className="gap-1">
              <Form.Text>Evan's iPhone</Form.Text>
              <Text className="text-sf-text-2 text-xs">
                This iPhone 16 Pro Max
              </Text>
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
            className="text-sf-green"
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

          <Text className="font-bold text-sf-pink">Custom style</Text>
          <Form.Text bold>Bold</Form.Text>

          <View>
            <Text>Wrapped</Text>
          </View>

          {/* Table style: | A   B |*/}
          <Form.HStack>
            <Text className="text-sf-text text-lg">Foo</Text>
            <View className="flex-1" />
            <Text className="text-sf-text-2 text-xs">Bar</Text>
          </Form.HStack>
        </Form.Section>
        <Form.Section title="Table">
          {/* Table style: | A   B |*/}
          <Form.Text hint="Expo Router v4">SDK 52</Form.Text>

          {/* Custom version of same code */}
          <Form.HStack>
            <Text className="text-sf-text text-lg">SDK 51</Text>
            <View className="flex-1" />
            <Text className="text-sf-text-2 text-xs">Expo Router v3</Text>
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
            <Text className="text-sf-label text-[18px] font-bold normal-case">
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
            className="text-sf-link"
          >
            Developer Privacy Policy
          </Form.Link>
          <Button
            title="Stop Testing"
            color={AC.systemRed}
            onPress={() => {}}
          />
        </Form.Section>

      
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
      <Form.HStack className="flex-wrap">
        <Form.Text>{children}</Form.Text>
        {/* Spacer */}
        <View className="flex-1" />
        {open && (
          <Image
            source={open ? "chevron.up" : "chevron.down"}
            size={16}
            tintColor={AC.systemGray}
          />
        )}
        {/* Right */}
        <Form.Text className="flex-shrink text-sf-text-2">
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
    <Form.HStack className="gap-16">
      <Image
        source={systemImage}
        size={28}
        tintColor={color ?? AC.systemBlue}
      />
      <Text className="text-sf-text text-lg">{children}</Text>
    </Form.HStack>
  );
}

function SegmentsTest() {
  return (
    <View>
      <Segments defaultValue="account">
        <SegmentsList>
          <SegmentsTrigger value="account">Account</SegmentsTrigger>
          <SegmentsTrigger value="password">Password</SegmentsTrigger>
        </SegmentsList>

        <SegmentsContent value="account">
          <Form.Text className="py-3">Account Section</Form.Text>
        </SegmentsContent>
        <SegmentsContent value="password">
          <Form.Text className="py-3">Password Section</Form.Text>
        </SegmentsContent>
      </Segments>
    </View>
  );
}

function TripleItemTest() {
  return (
    <>
      <HorizontalItem title="Expires" badge="88" subtitle="Days" />

      <View className="bg-sf-border min-w-[0.5px] max-w-[0.5px] h-1/2 flex-1 my-auto" />

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

      <View className="bg-sf-border min-w-[0.5px] max-w-[0.5px] h-1/2 flex-1 my-auto" />

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
    <View className="items-center gap-2 flex-1">
      <Form.Text className="text-xs uppercase font-semibold text-sf-text-2">
        {title}
      </Form.Text>
      {typeof badge === "string" ? (
        <Form.Text className="text-xl font-bold text-sf-text-2">
          {badge}
        </Form.Text>
      ) : (
        badge
      )}

      <Form.Text className="text-xs text-sf-text-2">{subtitle}</Form.Text>
    </View>
  );
}

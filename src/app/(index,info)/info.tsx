import * as Form from "@/components/ui/Form";
import Stack from "@/components/ui/Stack";
import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

export default function Page() {
  const ref = useAnimatedRef();
  const scroll = useScrollViewOffset(ref);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scroll.value, [-120, -70], [50, 0], "clamp") },
    ],
  }));

  return (
    <Form.List ref={ref} navigationTitle="Bottom Sheet" listStyle="grouped">
      {process.env.EXPO_OS !== "web" && (
        <Stack.Screen
          options={{
            headerLeft: () => (
              <View
                style={{
                  overflow: "hidden",
                  paddingBottom: 10,
                  marginBottom: -10,
                }}
              >
                <Animated.View style={style}>
                  <Text
                    style={{
                      color: AC.label,
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Bottom Sheet
                  </Text>
                </Animated.View>
              </View>
            ),
            headerTitle() {
              return <></>;
            },
          }}
        />
      )}

      <Form.Section
        title="Vision"
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
        <Text>Default</Text>
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
      <Form.Section title="Links">
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
    </Form.List>
  );
}

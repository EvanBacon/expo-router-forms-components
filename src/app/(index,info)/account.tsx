import * as Form from "@/components/ui/Form";
import { IconSymbol } from "@/components/ui/IconSymbol";
import * as AC from "@bacons/apple-colors";
import { Image, View } from "react-native";

export default function Page() {
  return (
    <Form.List navigationTitle="Account">
      <Form.Section>
        <Form.HStack style={{ gap: 12 }}>
          <Image
            source={{ uri: "https://github.com/evanbacon.png" }}
            style={{
              aspectRatio: 1,
              height: 48,
              borderRadius: 999,
            }}
          />
          <View style={{ gap: 4 }}>
            <Form.Text style={Form.FormFont.default}>Evan's world</Form.Text>
            <Form.Text style={Form.FormFont.caption}>Today</Form.Text>
          </View>
        </Form.HStack>
        <Form.Link
          href="/account"
          hint="Baconator"
          systemImage={{ name: "gamecontroller.fill", color: AC.systemPink }}
        >
          Game Center
        </Form.Link>
      </Form.Section>

      <Form.Section>
        <Form.Link href="/">Apps</Form.Link>
        <Form.Link href="/">Subscriptions</Form.Link>
        <Form.Link href="/">Purchase History</Form.Link>
        <Form.Link href="/">Notifications</Form.Link>
      </Form.Section>

      <Form.Section>
        <Form.Text style={{ color: AC.link }} onPress={() => {}}>
          Redeem Gift Card or Code
        </Form.Text>
        <Form.Text style={{ color: AC.link }} onPress={() => {}}>
          Send Gift Card by Email
        </Form.Text>
        <Form.Text style={{ color: AC.link }} onPress={() => {}}>
          Add Money to Account
        </Form.Text>
      </Form.Section>

      <Form.Section>
        <Form.Link href="/">Personalized Recommendations</Form.Link>
      </Form.Section>

      <Form.Section title="Upcoming automatic updates">
        <Form.Text hint="3">Update All</Form.Text>

        <AppUpdate icon="https://github.com/expo.png" name="Expo Go" />
        <AppUpdate icon="https://github.com/facebook.png" name="Facebook" />
        <AppUpdate icon="https://github.com/apple.png" name="Apple" />
      </Form.Section>
    </Form.List>
  );
}

function AppUpdate({ name, icon }: { name: string; icon: string }) {
  return (
    <View style={{ gap: 16, flex: 1 }}>
      <Form.HStack style={{ gap: 16 }}>
        <Image
          source={{ uri: icon }}
          style={{
            aspectRatio: 1,
            height: 48,
            borderRadius: 12,
          }}
        />
        <View style={{ gap: 4 }}>
          <Form.Text style={Form.FormFont.default}>{name}</Form.Text>
          <Form.Text style={Form.FormFont.caption}>Today</Form.Text>
        </View>

        <View style={{ flex: 1 }} />

        <IconSymbol
          color={AC.systemBlue}
          name="icloud.and.arrow.down"
          weight="bold"
          size={24}
        />
      </Form.HStack>
      <Form.Text>- Minor bug-fixes</Form.Text>
    </View>
  );
}

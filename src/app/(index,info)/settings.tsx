import * as Form from "@/components/ui/form";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import * as AC from "@bacons/apple-colors";
import {
  Image,
  OpaqueColorValue,
  Platform,
  Switch,
  Text,
  View,
} from "react-native";
import * as Application from "expo-application";
import { useHeaderSearch } from "@/hooks/use-header-search";
import { useState } from "react";

function BadgeLabel({
  color,
  image,
}: {
  color?: OpaqueColorValue;
  image: IconSymbolName | React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 8,
        width: 28,
        height: 28,
        borderCurve: "continuous",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {typeof image === "string" ? (
        <IconSymbol name={image} size={16} color={"white"} />
      ) : (
        image
      )}
    </View>
  );
}

function UserSection() {
  return (
    <Form.Section>
      <Form.Link href="/">
        <Form.HStack style={{ gap: 12 }}>
          <Image
            source={{ uri: "https://github.com/evanbacon.png" }}
            style={{
              aspectRatio: 1,
              backgroundColor: AC.systemGray2,
              height: 48,
              borderRadius: 999,
            }}
          />
          <View style={{ gap: 4 }}>
            <Form.Text style={Form.FormFont.default} bold>
              Evan Bacon
            </Form.Text>
            <Form.Text style={Form.FormFont.caption}>
              Apple Account, iCloud, and more
            </Form.Text>
          </View>
        </Form.HStack>
      </Form.Link>
      <Form.Link
        href="/account"
        hint={
          <View
            style={{
              backgroundColor: AC.systemRed,
              borderRadius: 666,
              width: 26,

              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text adjustsFontSizeToFit style={{ fontSize: 16, color: "white" }}>
              3
            </Text>
          </View>
        }
      >
        Game Center
      </Form.Link>
    </Form.Section>
  );
}

function SystemSection() {
  const [on, setOn] = useState(false);
  return (
    <Form.Section
      itemStyle={{
        // shorten up padding for switch
        paddingVertical: 8,
      }}
    >
      <Form.Text
        systemImage={
          <BadgeLabel image="paperplane.fill" color={AC.systemOrange} />
        }
        hint={
          <Switch value={on} onValueChange={setOn} style={{ padding: 0 }} />
        }
      >
        Wi-Fi
      </Form.Text>
      <Form.Toggle
        systemImage={
          <BadgeLabel image="paperplane.fill" color={AC.systemOrange} />
        }
        value={on}
        onValueChange={setOn}
      >
        Wi-Fi
      </Form.Toggle>

      <Form.Link
        systemImage={<BadgeLabel image="wifi" color={AC.systemBlue} />}
        href="/info"
        hint={"Connected"}
      >
        Wi-Fi
      </Form.Link>

      <Form.Link
        systemImage={
          <BadgeLabel image="cable.connector" color={AC.systemBlue} />
        }
        href="/info"
      >
        Bluetooth
      </Form.Link>
    </Form.Section>
  );
}

function AppsSection() {
  const apps = [
    {
      img: { uri: "https://github.com/expo.png" },
      href: "/apps/expo-go",
      title: "Expo Go",
    },
    {
      img: { uri: "https://github.com/expo.png" },
      href: "/apps/snack",
      title: "Snack",
    },
    {
      img: { uri: "https://github.com/tesla.png" },
      href: "/apps/tesla",
      title: "Tesla",
    },
  ];
  return (
    <Form.Section>
      {apps.map((app, index) => (
        <Form.Link
          key={String(index)}
          systemImage={
            <Image
              source={app.img}
              style={{
                backgroundColor: AC.systemGray2,
                borderRadius: 8,
                height: 28,
                aspectRatio: 1,
              }}
            />
          }
          href={app.href}
        >
          {app.title}
        </Form.Link>
      ))}
    </Form.Section>
  );
}

export default function Page() {
  const query = useHeaderSearch({
    placeholder: "Search...",
  });

  return (
    <Form.List navigationTitle="Settings">
      <UserSection />
      <SystemSection />
      <AppsSection />

      <SettingsInfoFooter />
    </Form.List>
  );
}

function SettingsInfoFooter() {
  const name = `${Application.applicationName} for ${Platform.select({
    web: "Web",
    ios: `iOS v${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`,
    android: `Android v${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`,
  })}`;
  return (
    <View
      style={{ padding: 12, alignItems: "center", justifyContent: "center" }}
    >
      <Form.Text
        style={{
          textAlign: "center",
          fontSize: 12,
          color: AC.secondaryLabel,
        }}
      >
        {name}
      </Form.Text>
    </View>
  );
}

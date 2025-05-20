import PrivacyPolicy from "@/components/example/privacy-dom";
import { Stack } from "expo-router";
import Head from "expo-router/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy | Bacomponents</title>
      </Head>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
        }}
      />
      <PrivacyPolicy dom={{}} />
    </>
  );
}

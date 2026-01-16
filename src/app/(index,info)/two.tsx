import { BodyScrollView } from "@/components/ui/body-scroll-view";
import { StyleSheet, Text, View } from "react-native";

import { SFIcon } from "@/components/ui/sf-icon";
import Skeleton from "@/components/ui/skeleton";
import TouchableBounce from "@/components/ui/touchable-bounce";
import * as AC from "@bacons/apple-colors";
import { useState } from "react";

export default function Page() {
  return (
    <BodyScrollView>
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Hello World</Text>
          <Text style={styles.subtitle}>
            This is the first page of your app.
          </Text>

          <TouchableBounce>
            <Text>TouchableBounce</Text>
          </TouchableBounce>

          <Skeleton />

          <Skeleton dark />

          <SFIcon name="star.bubble.fill" className="text-sf-cyan" />
        </View>
      </View>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    color: AC.label,
  },
  subtitle: {
    fontSize: 36,
    color: AC.secondaryLabel,
  },
});

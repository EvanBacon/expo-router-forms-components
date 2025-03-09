import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import TouchableBounce from "@/components/ui/TouchableBounce";
import * as AC from "@bacons/apple-colors";
import { BlurView } from "expo-blur";
import { Text, View } from "react-native";
import Animated, { ZoomIn, runOnJS } from "react-native-reanimated";

import { router } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function BlurModal() {
  const tap = Gesture.Tap().onStart(() => {
    runOnJS(router.back)();
  });

  const tap2 = Gesture.Tap();

  return (
    <>
      <GestureDetector gesture={tap}>
        <BlurView
          intensity={100}
          style={{
            flex: 1,
            padding: 24,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <GestureDetector gesture={tap2}>
            <Animated.View entering={ZoomIn}>
              <View style={{ gap: 16 }} pointerEvents="box-only">
                <Item title="Camera" icon="camera.fill" onPress={() => {}} />
                <Item title="Photos" icon="photo.artframe" onPress={() => {}} />
                <Item
                  title="Files"
                  icon="filemenu.and.selection"
                  onPress={() => {}}
                />
              </View>
            </Animated.View>
          </GestureDetector>
        </BlurView>
      </GestureDetector>
    </>
  );
}

function Item({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: IconSymbolName;
  onPress: () => void;
}) {
  return (
    <TouchableBounce onPress={onPress}>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <View
          style={{
            backgroundColor: AC.label,
            padding: 8,
            borderRadius: 999,
            aspectRatio: 1,
          }}
        >
          <IconSymbol name={icon} size={24} color={AC.systemBackground} />
        </View>
        <Text
          style={{
            color: AC.label,
            fontSize: 24,
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableBounce>
  );
}

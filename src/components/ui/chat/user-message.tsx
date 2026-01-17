import { Image, Link, Text, View } from "@/tw";

import { Clipboard } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { cn } from "@/lib/utils";

export function UserMessage({
  part,
}: {
  part: { type: string; text?: string; url?: string };
}) {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        marginHorizontal: 12,
        // marginVertical: 24,
      }}
    >
      <Link
        href={part.url ? "/image?url=" + encodeURIComponent(part.url) : "#"}
        asChild
        style={{ borderRadius: 24 }}
      >
        <Link.Trigger withAppleZoom={!!part.url}>
          <View
            className={cn(
              "max-w-[80%] bg-sf-grouped-bg-2 border border-sf-border curve-sf rounded-3xl overflow-hidden gap-2",
              part.url && !part.text ? "p-0 border-0" : "p-4"
            )}
            style={{
              borderBottomRightRadius: 8,
            }}
          >
            {part.text && (
              <Text selectable className="text-sf-text text-lg web:text-base">
                {part.text}
              </Text>
            )}
            {part.url && (
              <Image
                transition={250}
                source={{ uri: part.url }}
                style={{
                  width: 200,
                  height: 150,
                }}
                className="curve-sf rounded-3xl"
                contentFit="cover"
              />
            )}
          </View>
        </Link.Trigger>
        <Link.Menu>
          {part.text && (
            <Link.MenuAction
              title="Copy"
              icon="doc.on.doc"
              onPress={() => {
                if (part.text) {
                  Clipboard.setString(part.text);
                }
              }}
            />
          )}
         
        </Link.Menu>
      </Link>
    </Animated.View>
  );
}

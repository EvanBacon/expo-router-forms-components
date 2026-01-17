import { useRef, useState, useMemo } from "react";
import { TextInput, StyleSheet } from "react-native";
import { LegendListRef } from "@legendapp/list";
import { Text, View, useCSSVariable, AppleGlassView, Pressable } from "@/tw";
import { SymbolView } from "expo-symbols";

import { Chat } from "@/components/ui/chat/chat";
import { UserMessage } from "@/components/ui/chat/user-message";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: "1", role: "user", content: "Hello! How are you?" },
  {
    id: "2",
    role: "assistant",
    content: "I'm doing well, thank you for asking! How can I help you today?",
  },
  { id: "3", role: "user", content: "Can you tell me about the weather?" },
  {
    id: "4",
    role: "assistant",
    content:
      "I'd be happy to help with weather information! However, I don't have access to real-time weather data. You could check a weather app or website for current conditions in your area.",
  },
];

export function ChatExample() {
  const scrollViewRef = useRef<LegendListRef>(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const placeholderColor = useCSSVariable("--sf-text-placeholder");
  const textColor = useCSSVariable("--sf-text");

  const flattenedItems = useMemo(() => {
    return messages.map((message) => ({
      id: message.id,
      type: "text",
      content: { type: "text", text: message.content },
      isUser: message.role === "user",
    }));
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), role: "user", content: trimmed },
    ]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <Chat>
        <Chat.List
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            gap: 16,
            alignItems: "stretch",
          }}
          style={{ flex: 1 }}
          estimatedItemSize={32}
          initialScrollIndex={messages.length - 1}
          keyExtractor={(item) => item?.id}
          recycleItems={true}
          data={flattenedItems}
          renderItem={({ item }) => (
            <MessagePart
              type={item.type}
              content={item.content}
              isUser={item.isUser}
            />
          )}
        />

        <Chat.Toolbar style={{ width: "100%" }}>
          <View style={styles.composerContainer}>
            <View className="flex-row flex-1 py-1.5 min-h-11 gap-2">
              <AppleGlassView
                className="flex-row px-2 items-end rounded-3xl flex-1 gap-1"
                style={{ borderCurve: "continuous" }}
              >
                <TextInput
                  nativeID="composer"
                  inputAccessoryViewID="composer"
                  style={[styles.input, { color: textColor }]}
                  placeholder="Message..."
                  placeholderTextColor={placeholderColor}
                  value={text}
                  onChangeText={setText}
                  onSubmitEditing={handleSend}
                  autoFocus
                  multiline
                />
                {text.trim() ? (
                  <Pressable
                    className="w-8 h-8 rounded-full items-center justify-center bg-sf-blue"
                    onPress={handleSend}
                  >
                    <SymbolView
                      name="arrow.up"
                      tintColor="white"
                      style={{ width: 18, height: 18 }}
                    />
                  </Pressable>
                ) : null}
              </AppleGlassView>
            </View>
          </View>
        </Chat.Toolbar>
      </Chat>
    </View>
  );
}

function MessagePart({
  type,
  content,
  isUser,
}: {
  type: string;
  content: any;
  isUser: boolean;
}) {
  if (type === "text") {
    if (isUser) {
      return <UserMessage part={content} />;
    }
    return (
      <Text style={styles.assistantText} className="text-sf-text mx-3">
        {content.text}
      </Text>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  assistantText: {
    fontSize: 17,
  },
  composerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
  },
});

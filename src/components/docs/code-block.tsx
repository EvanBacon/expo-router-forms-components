"use client";

import React, { useState } from "react";
import { Text as RNText } from "react-native";
import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";
import "@/components/runtime/clipboard";

interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  className,
  language,
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const code = typeof children === "string" ? children.trim() : children;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <View
      className={cn(
        "relative rounded-lg border border-sf-border overflow-hidden",
        className
      )}
    >
      {title && (
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-sf-border bg-sf-fill/50">
          <Text className="text-sm text-sf-text-2 font-medium">{title}</Text>
        </View>
      )}
      <View className="relative">
        <View
          className="p-4 overflow-x-auto bg-sf-bg"
          style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
        >
          <Text className="text-sm text-sf-text font-mono whitespace-pre">
            {showLineNumbers
              ? code.split("\n").map((line, i) => (
                  <Text key={i}>
                    <Text className="text-sf-text-3 mr-4 select-none">
                      {String(i + 1).padStart(2, " ")}
                    </Text>
                    {line}
                    {"\n"}
                  </Text>
                ))
              : code}
          </Text>
        </View>
        <Pressable
          className="absolute top-2 right-2 p-2 rounded-md bg-sf-fill/80 hover:bg-sf-fill active:bg-sf-fill/60"
          onPress={handleCopy}
        >
          <Text className="text-xs text-sf-text-2 font-medium">
            {copied ? "Copied!" : "Copy"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

// Helper to extract text content from React children
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (node == null || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as React.ReactElement).props.children);
  }
  return "";
}

export function InlineCode({ children, className }: InlineCodeProps) {
  // On native, we need to ensure children is a plain string
  const text = extractText(children);

  // Use platform check to render differently on native vs web
  if (process.env.EXPO_OS === "web") {
    // Filter out any non-string className values that MDX might pass
    const safeClassName =
      typeof className === "string" ? className : undefined;

    return (
      <Text
        className={cn(
          "px-1.5 py-0.5 rounded bg-sf-fill text-sf-text text-sm font-mono",
          safeClassName
        )}
      >
        {text}
      </Text>
    );
  }

  // On native, use raw RNText to avoid useCssElement issues with nested Text
  return (
    <RNText
      style={{
        backgroundColor: "rgba(120,120,128,0.12)",
        fontSize: 14,
        fontFamily: "ui-monospace",
      }}
    >
      {text}
    </RNText>
  );
}

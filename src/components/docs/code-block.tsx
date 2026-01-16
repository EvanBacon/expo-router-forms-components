"use client";

import React, { useState } from "react";
import { Text as RNText, useColorScheme } from "react-native";
import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";
import "@/components/runtime/clipboard";
import { Highlight, type Language, type PrismTheme } from "prism-react-renderer";

// Subdued light theme
const lightTheme: PrismTheme = {
  plain: {
    color: "#1a1a1a",
    backgroundColor: "#f5f5f7",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6e6e73" } },
    { types: ["punctuation"], style: { color: "#1a1a1a" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#1a1a1a" } },
    { types: ["selector", "attr-name", "string", "char", "builtin"], style: { color: "#505050" } },
    { types: ["operator", "entity", "url"], style: { color: "#1a1a1a" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#1a1a1a", fontWeight: "600" } },
    { types: ["function", "class-name"], style: { color: "#1a1a1a" } },
    { types: ["regex", "important", "variable"], style: { color: "#505050" } },
  ],
};

// Subdued dark theme
const darkTheme: PrismTheme = {
  plain: {
    color: "#e5e5e7",
    backgroundColor: "#1c1c1e",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6e6e73" } },
    { types: ["punctuation"], style: { color: "#e5e5e7" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol"], style: { color: "#e5e5e7" } },
    { types: ["selector", "attr-name", "string", "char", "builtin"], style: { color: "#a1a1a6" } },
    { types: ["operator", "entity", "url"], style: { color: "#e5e5e7" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#e5e5e7", fontWeight: "600" } },
    { types: ["function", "class-name"], style: { color: "#e5e5e7" } },
    { types: ["regex", "important", "variable"], style: { color: "#a1a1a6" } },
  ],
};

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
  language = "tsx",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const colorScheme = useColorScheme();

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

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <View
      className={cn(
        "relative rounded-lg border border-sf-border overflow-hidden mb-4",
        className
      )}
    >
      {title && (
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-sf-border bg-sf-fill/50">
          <Text className="text-sm text-sf-text-2 font-medium">{title}</Text>
        </View>
      )}
      <View className="relative">
        <Highlight theme={theme} code={code} language={language as Language}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <View
              className="p-4 overflow-x-auto"
              style={{ backgroundColor: style.backgroundColor }}
            >
              <Text className="text-sm font-mono whitespace-pre">
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });
                  return (
                    <Text key={i} style={lineProps.style}>
                      {showLineNumbers && (
                        <Text className="text-sf-text-3 mr-4 select-none">
                          {String(i + 1).padStart(2, " ")}
                        </Text>
                      )}
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token, key });
                        return (
                          <Text key={key} style={tokenProps.style}>
                            {tokenProps.children}
                          </Text>
                        );
                      })}
                      {"\n"}
                    </Text>
                  );
                })}
              </Text>
            </View>
          )}
        </Highlight>
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

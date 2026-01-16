"use client";

import { useState } from "react";
import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";
import "@/components/runtime/clipboard";

interface ComponentPreviewProps {
  children: React.ReactNode;
  code?: string;
  title?: string;
  className?: string;
}

export function ComponentPreview({
  children,
  code,
  title,
  className,
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
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
        "rounded-lg border border-sf-border overflow-hidden",
        className
      )}
    >
      {title && (
        <View className="px-4 py-2 border-b border-sf-border bg-sf-fill/30">
          <Text className="text-sm text-sf-text-2 font-medium">{title}</Text>
        </View>
      )}
      <View className="p-6 flex items-center justify-center min-h-[120px] bg-sf-grouped-bg">
        {children}
      </View>
      {code && (
        <>
          <View className="flex-row items-center justify-between px-4 py-2 border-t border-sf-border bg-sf-fill/30">
            <Pressable
              className="flex-row items-center gap-2"
              onPress={() => setShowCode(!showCode)}
            >
              <Text className="text-sm text-sf-text-2 font-medium">
                {showCode ? "Hide Code" : "View Code"}
              </Text>
            </Pressable>
            <Pressable
              className="p-1.5 rounded-md hover:bg-sf-fill active:bg-sf-fill/60"
              onPress={handleCopy}
            >
              <Text className="text-xs text-sf-text-2 font-medium">
                {copied ? "Copied!" : "Copy"}
              </Text>
            </Pressable>
          </View>
          {showCode && (
            <View
              className="p-4 border-t border-sf-border overflow-x-auto"
              style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
            >
              <Text className="text-sm text-sf-text font-mono whitespace-pre">
                {code.trim()}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

"use client";

import { useState } from "react";
import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";
import "@/components/runtime/clipboard";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

interface InstallBlockProps {
  packages: string | string[];
  className?: string;
  dev?: boolean;
}

const getInstallCommand = (
  pm: PackageManager,
  packages: string[],
  dev: boolean
) => {
  const pkgStr = packages.join(" ");
  switch (pm) {
    case "npm":
      return `npm install ${dev ? "-D " : ""}${pkgStr}`;
    case "yarn":
      return `yarn add ${dev ? "-D " : ""}${pkgStr}`;
    case "pnpm":
      return `pnpm add ${dev ? "-D " : ""}${pkgStr}`;
    case "bun":
      return `bun add ${dev ? "-d " : ""}${pkgStr}`;
  }
};

export function InstallBlock({
  packages,
  className,
  dev = false,
}: InstallBlockProps) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copied, setCopied] = useState(false);

  const pkgArray = Array.isArray(packages) ? packages : [packages];
  const command = getInstallCommand(pm, pkgArray, dev);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const tabs: PackageManager[] = ["npm", "yarn", "pnpm", "bun"];

  return (
    <View
      className={cn(
        "rounded-lg border border-sf-border overflow-hidden",
        className
      )}
    >
      <View className="flex-row items-center border-b border-sf-border bg-sf-fill/30">
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            className={cn(
              "px-4 py-2 border-b-2",
              pm === tab
                ? "border-sf-blue"
                : "border-transparent hover:bg-sf-fill/50"
            )}
            onPress={() => setPm(tab)}
          >
            <Text
              className={cn(
                "text-sm font-medium",
                pm === tab ? "text-sf-blue" : "text-sf-text-2"
              )}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      <View className="relative">
        <View
          className="p-4 bg-sf-bg"
          style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
        >
          <Text
            className="text-sm text-sf-text font-mono"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {command}
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

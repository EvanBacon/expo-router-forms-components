"use client";

import { View, Text, ScrollView } from "@/tw";
import { Link, useNavigation } from "expo-router";
import { cn } from "@/lib/utils";
import { CodeBlock, InlineCode } from "./code-block";
import { InstallBlock } from "./install-block";
import { ComponentPreview } from "./component-preview";
import { PropsTable } from "./props-table";
import { useEffect, useMemo } from "react";
import { MDXComponents } from "@bacons/mdx";
import { useStackHeaderConfig } from "@/components/layout/stack";

// Re-export components for use in MDX files
export { CodeBlock, InlineCode, InstallBlock, ComponentPreview, PropsTable };

// Typography components
function H1({ children, className }: { children: React.ReactNode; className?: string }) {
  // Hide on iOS since Stack shows the large header title
  if (process.env.EXPO_OS === "ios") {
    return null;
  }
  return (
    <Text className={cn("text-3xl font-bold text-sf-text mb-2", className)}>
      {children}
    </Text>
  );
}

function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-2xl font-semibold text-sf-text mt-8 mb-4", className)}>
      {children}
    </Text>
  );
}

function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-xl font-semibold text-sf-text mt-6 mb-3", className)}>
      {children}
    </Text>
  );
}

function H4({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-lg font-semibold text-sf-text mt-4 mb-2", className)}>
      {children}
    </Text>
  );
}

function Paragraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-base text-sf-text-2 mb-4 leading-relaxed", className)}>
      {children}
    </Text>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <Text className="font-semibold text-sf-text">{children}</Text>;
}

function Em({ children }: { children: React.ReactNode }) {
  return <Text className="italic">{children}</Text>;
}

function Anchor({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <Text>{children}</Text>;

  // Handle external links
  if (href.startsWith("http")) {
    return (
      <Text
        className="text-sf-blue underline"
        onPress={() => {
          if (typeof window !== "undefined") {
            window.open(href, "_blank");
          }
        }}
      >
        {children}
      </Text>
    );
  }

  // Handle internal links
  return (
    <Link href={href as any} className="text-sf-blue underline">
      {children}
    </Link>
  );
}

function UnorderedList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("mb-4 pl-4", className)}>
      {children}
    </View>
  );
}

function OrderedList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("mb-4 pl-4", className)}>
      {children}
    </View>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row mb-1">
      <Text className="text-sf-text-2 mr-2">•</Text>
      <Text className="flex-1 text-sf-text-2">{children}</Text>
    </View>
  );
}

function Blockquote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("border-l-4 border-sf-blue pl-4 py-2 mb-4 bg-sf-fill/30 rounded-r-lg", className)}>
      <Text className="text-sf-text-2 italic">{children}</Text>
    </View>
  );
}

function HorizontalRule() {
  return <View className="h-px bg-sf-border my-8" />;
}

function Pre({ children }: { children: React.ReactNode }) {
  // Extract code content from children
  const getCodeContent = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(getCodeContent).join("");
    if (node && typeof node === "object" && "props" in node) {
      const props = node.props as { children?: React.ReactNode };
      return getCodeContent(props.children);
    }
    return "";
  };

  const code = getCodeContent(children);
  return <CodeBlock>{code}</CodeBlock>;
}

function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  // Check if this is a language-prefixed code block (from markdown fenced code)
  const isBlock = className?.startsWith("language-");

  if (isBlock) {
    const language = className?.replace("language-", "");
    const code = typeof children === "string" ? children : "";
    return <CodeBlock language={language}>{code}</CodeBlock>;
  }

  return <InlineCode className={className}>{children}</InlineCode>;
}

// Table components
function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("rounded-lg border border-sf-border overflow-hidden mb-4", className)}>
      {children}
    </View>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-sf-fill/50 border-b border-sf-border">
      {children}
    </View>
  );
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("flex-row border-b border-sf-border last:border-b-0", className)}>
      {children}
    </View>
  );
}

function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("flex-1 px-4 py-3", className)}>
      <Text className="text-sm text-sf-text font-semibold">{children}</Text>
    </View>
  );
}

function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("flex-1 px-4 py-3", className)}>
      <Text className="text-sm text-sf-text-2">{children}</Text>
    </View>
  );
}

// Export all MDX components mapping
export const mdxComponents = {
  // Typography
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: Paragraph,
  strong: Strong,
  em: Em,
  a: Anchor,

  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,

  // Code
  pre: Pre,
  code: Code,

  // Other elements
  blockquote: Blockquote,
  hr: HorizontalRule,

  // Tables
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,

  // Custom components (available in MDX files)
  CodeBlock,
  InlineCode,
  InstallBlock,
  ComponentPreview,
  PropsTable,
};

// Docs layout wrapper
interface DocsLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function DocsLayout({ children, title, description }: DocsLayoutProps) {
  return (
    <ScrollView
      className="flex-1"
      style={
        process.env.EXPO_OS === "web"
          ? ({ scrollPaddingTop: "var(--header-inset, 0)" } as any)
          : undefined
      }
    >
      <View
        className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-2 px-4 py-6 md:px-0 lg:py-8"
        style={
          process.env.EXPO_OS === "web"
            ? ({ paddingTop: "var(--header-inset, 0)" } as any)
            : undefined
        }
      >
        {title && (
          <Text className="hidden web:flex text-3xl font-bold text-sf-text mb-2">
            {title}
          </Text>
        )}
        {description && (
          <Text className="text-sf-text-2 mb-6">{description}</Text>
        )}
        <View className="flex-1">{children}</View>
      </View>
    </ScrollView>
  );
}

// Wrapper for MDX docs that sets navigation title from frontmatter
interface DocsWrapperProps {
  children: React.ReactNode;
  /** Title from frontmatter to display in the Stack header */
  title?: string;
}

export function DocsWrapper({ children, title }: DocsWrapperProps) {
  const navigation = useNavigation();

  useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  // Configure web floating header
  const headerConfig = useMemo(() => ({ title }), [title]);
  useStackHeaderConfig(headerConfig);

  return (
    <ScrollView
      className="min-w-0 flex-1"
      style={
        process.env.EXPO_OS === "web"
          ? ({ scrollPaddingTop: "var(--header-inset, 0)" } as any)
          : undefined
      }
      contentContainerClassName="mx-auto w-full max-w-3xl  flex-col px-4 py-6 md:px-0 lg:py-8"
      contentContainerStyle={process.env.EXPO_OS === "web"
            ? ({ paddingTop: "var(--header-inset, 0)" } as any)
            : {}}
    >
     
        <MDXComponents components={mdxComponents}>
          {children}
        </MDXComponents>
      
    </ScrollView>
  );
}

"use client";

import { ScrollView } from "@/tw";
import { html } from "@/html";
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
    <html.h1 className={cn("text-3xl font-bold text-sf-text mb-2", className)}>
      {children}
    </html.h1>
  );
}

function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.h2 className={cn("text-2xl font-semibold text-sf-text mt-8 mb-4", className)}>
      {children}
    </html.h2>
  );
}

function H3({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.h3 className={cn("text-xl font-semibold text-sf-text mt-6 mb-3", className)}>
      {children}
    </html.h3>
  );
}

function H4({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.h4 className={cn("text-lg font-semibold text-sf-text mt-4 mb-2", className)}>
      {children}
    </html.h4>
  );
}

function Paragraph({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.p className={cn("text-base text-sf-text-2 mb-4 leading-relaxed", className)}>
      {children}
    </html.p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <html.strong className="font-semibold text-sf-text">{children}</html.strong>;
}

function Em({ children }: { children: React.ReactNode }) {
  return <html.em className="italic">{children}</html.em>;
}

function Anchor({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <html.span>{children}</html.span>;

  // Handle external links
  if (href.startsWith("http")) {
    return (
      <html.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sf-blue underline"
      >
        {children}
      </html.a>
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
    <html.ul className={cn("mb-4 pl-4 list-disc", className)}>
      {children}
    </html.ul>
  );
}

function OrderedList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.ol className={cn("mb-4 pl-4 list-decimal", className)}>
      {children}
    </html.ol>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <html.li className="mb-1 text-sf-text-2">
      {children}
    </html.li>
  );
}

function Blockquote({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.blockquote className={cn("border-l-4 border-sf-blue pl-4 py-2 mb-4 bg-sf-fill/30 rounded-r-lg text-sf-text-2 italic", className)}>
      {children}
    </html.blockquote>
  );
}

function HorizontalRule() {
  return <html.hr className="h-px bg-sf-border my-8 border-0" />;
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
    <html.table className={cn("w-full rounded-lg border border-sf-border overflow-hidden mb-4", className)}>
      {children}
    </html.table>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <html.thead className="bg-sf-fill/50 border-b border-sf-border">
      {children}
    </html.thead>
  );
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <html.tbody>{children}</html.tbody>;
}

function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.tr className={cn("border-b border-sf-border last:border-b-0", className)}>
      {children}
    </html.tr>
  );
}

function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.th className={cn("px-4 py-3 text-left text-sm text-sf-text font-semibold", className)}>
      {children}
    </html.th>
  );
}

function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <html.td className={cn("px-4 py-3 text-sm text-sf-text-2", className)}>
      {children}
    </html.td>
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
      <html.article
        className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-2 px-4 py-6 md:px-0 lg:py-8"
        style={
          process.env.EXPO_OS === "web"
            ? ({ paddingTop: "var(--header-inset, 0)" } as any)
            : undefined
        }
      >
        {title && (
          <html.h1 className="hidden web:flex text-3xl font-bold text-sf-text mb-2">
            {title}
          </html.h1>
        )}
        {description && (
          <html.p className="text-sf-text-2 mb-6">{description}</html.p>
        )}
        <html.div className="flex-1">{children}</html.div>
      </html.article>
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
      contentContainerClassName="mx-auto w-full max-w-3xl flex-col px-4 py-6 md:px-0 lg:py-8"
      contentContainerStyle={process.env.EXPO_OS === "web"
            ? ({ paddingTop: "var(--header-inset, 0)" } as any)
            : {}}
    >
      <html.article>
        <MDXComponents components={mdxComponents}>
          {children}
        </MDXComponents>
      </html.article>
    </ScrollView>
  );
}

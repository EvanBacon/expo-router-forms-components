import { DocsWrapper } from "@/components/docs";
import { useLocalSearchParams } from "expo-router";

// Auto-discover all MDX docs using require.context
const docsContext = require.context(
  "../../../../docs/ui",
  false,
  /\.mdx$/
);

// Build a map of slug -> module
const docsMap = new Map<string, { default: React.ComponentType; frontmatter: { title: string } }>();

for (const key of docsContext.keys()) {
  const slug = key.replace(/^\.\//, "").replace(/\.mdx$/, "");
  docsMap.set(slug, docsContext(key));
}

// Export available slugs for static generation
export function generateStaticParams() {
  return docsContext.keys().map((key) => ({
    ui: key.replace(/^\.\//, "").replace(/\.mdx$/, ""),
  }));
}

export default function UIDocsPage() {
  const { ui } = useLocalSearchParams<{ ui: string }>();

  const doc = docsMap.get(ui);

  if (!doc) {
    return null;
  }

  const DocsContent = doc.default;
  const title = doc.frontmatter?.title ?? ui;

  return (
    <DocsWrapper title={title}>
      <DocsContent />
    </DocsWrapper>
  );
}

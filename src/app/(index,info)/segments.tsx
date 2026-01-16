import { DocsWrapper } from "@/components/docs";
import SegmentsDocs, { frontmatter } from "../../../docs/ui/segments.mdx";

export default function SegmentsPage() {
  return (
    <DocsWrapper title={frontmatter.title}>
      <SegmentsDocs />
    </DocsWrapper>
  );
}

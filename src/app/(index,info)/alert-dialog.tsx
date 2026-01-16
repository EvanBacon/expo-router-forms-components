import { DocsWrapper } from "@/components/docs";
import AlertDialogDocs, { frontmatter } from "../../../docs/ui/alert-dialog.mdx";

export default function AlertDialogPage() {
  return (
    <DocsWrapper title={frontmatter.title}>
      <AlertDialogDocs />
    </DocsWrapper>
  );
}

import { MDXComponents } from "@bacons/mdx";
import { ScrollView } from "@/tw";
import { View } from "@/tw";
import { mdxComponents } from "@/components/docs";
import SegmentsDocs from "../../../docs/ui/segments.mdx";

export default function SegmentsPage() {
  return (
    <ScrollView className="flex-1">
      <View className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col px-4 py-6 md:px-0 lg:py-8">
        <MDXComponents components={mdxComponents}>
          <SegmentsDocs />
        </MDXComponents>
      </View>
    </ScrollView>
  );
}

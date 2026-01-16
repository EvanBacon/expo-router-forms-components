import { View, Text } from "@/tw";
import { cn } from "@/lib/utils";

interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  data: PropDefinition[];
  className?: string;
}

export function PropsTable({ data, className }: PropsTableProps) {
  return (
    <View
      className={cn(
        "rounded-lg border border-sf-border overflow-hidden",
        className
      )}
    >
      <View className="overflow-x-auto">
        {/* Header */}
        <View className="flex-row bg-sf-fill/50 border-b border-sf-border">
          <View className="flex-1 min-w-[120px] px-4 py-3">
            <Text className="text-sm text-sf-text font-semibold">Prop</Text>
          </View>
          <View className="flex-1 min-w-[150px] px-4 py-3">
            <Text className="text-sm text-sf-text font-semibold">Type</Text>
          </View>
          <View className="w-[100px] px-4 py-3">
            <Text className="text-sm text-sf-text font-semibold">Default</Text>
          </View>
          <View className="flex-[2] min-w-[200px] px-4 py-3">
            <Text className="text-sm text-sf-text font-semibold">
              Description
            </Text>
          </View>
        </View>
        {/* Rows */}
        {data.map((prop, index) => (
          <View
            key={prop.name}
            className={cn(
              "flex-row",
              index !== data.length - 1 && "border-b border-sf-border"
            )}
          >
            <View className="flex-1 min-w-[120px] px-4 py-3">
              <Text
                className="text-sm text-sf-blue font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {prop.name}
                {prop.required && (
                  <Text className="text-sf-red">*</Text>
                )}
              </Text>
            </View>
            <View className="flex-1 min-w-[150px] px-4 py-3">
              <Text
                className="text-sm text-sf-text-2 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {prop.type}
              </Text>
            </View>
            <View className="w-[100px] px-4 py-3">
              <Text
                className="text-sm text-sf-text-3 font-mono"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {prop.default || "-"}
              </Text>
            </View>
            <View className="flex-[2] min-w-[200px] px-4 py-3">
              <Text className="text-sm text-sf-text-2">{prop.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

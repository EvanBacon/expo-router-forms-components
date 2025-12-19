import { cn } from "@/lib/utils";
import { View, ViewProps } from "@/tw";

export function Rounded({
  rounded,
  padding,
  capsule,
  ...props
}: ViewProps & {
  padding?: number | boolean;
  rounded?: boolean;
  capsule?: boolean;
}) {
  return (
    <View
      {...props}
      className={cn(
        "rounded-[10px]",
        padding === true ? "p-4" : padding ? `p-[${padding}]` : "",

        rounded && "rounded-lg",
        capsule ? "rounded-full" : "curve-sf",
        props.className
      )}
    />
  );
}

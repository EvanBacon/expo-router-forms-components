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
        "curve-sf rounded-3xl",
        padding === true ? "p-4" : padding ? `p-[${padding}]` : "",

        rounded && "rounded-3xl",
        capsule ? "rounded-full" : "curve-sf",
        props.className
      )}
    />
  );
}

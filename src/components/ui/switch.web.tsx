import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

export type SwitchProps = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
};

export function Switch({
  className,
  checked,
  value,
  onCheckedChange,
  onValueChange,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked ?? value}
      onCheckedChange={onCheckedChange ?? onValueChange}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        "data-[state=checked]:bg-sf-green data-[state=unchecked]:bg-sf-fill",
        "focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2 focus-visible:ring-offset-sf-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

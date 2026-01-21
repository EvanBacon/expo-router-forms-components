"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>;

export function Slider({ className, defaultValue, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue ?? [0]}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-sf-fill"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-sf-blue"
        />
      </SliderPrimitive.Track>
      {(props.value ?? defaultValue ?? [0]).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          data-slot="slider-thumb"
          className={cn(
            "block size-5 rounded-full border border-sf-border bg-white shadow-md",
            "transition-transform hover:scale-105 active:scale-110",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2 focus-visible:ring-offset-sf-bg",
            "disabled:pointer-events-none"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

Slider.displayName = "Slider";

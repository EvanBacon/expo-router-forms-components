"use client";

import * as React from "react";
import { View, ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

export type SliderProps = ViewProps & {
  /** Current value (controlled mode) */
  value?: number[];
  /** Callback when value changes */
  onValueChange?: (value: number[]) => void;
  /** Callback when value changes during interaction (not just on release) */
  onValueCommit?: (value: number[]) => void;
  /** Default value (uncontrolled mode) */
  defaultValue?: number[];
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Minimum steps between multiple thumbs */
  minStepsBetweenThumbs?: number;
};

export function Slider({
  value: controlledValue,
  onValueChange,
  onValueCommit,
  defaultValue = [0],
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  minStepsBetweenThumbs = 0,
  className,
  ...props
}: SliderProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const trackWidth = useSharedValue(0);

  const setValue = React.useCallback(
    (newValue: number[]) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  const handleLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    trackWidth.value = event.nativeEvent.layout.width;
  };

  // Clamp and round value to step
  const clampValue = React.useCallback(
    (val: number) => {
      const stepped = Math.round((val - min) / step) * step + min;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step]
  );

  return (
    <View
      data-slot="slider"
      {...props}
      className={cn(
        "relative flex h-5 w-full touch-none items-center",
        disabled && "opacity-50",
        className
      )}
    >
      {/* Track */}
      <View
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-sf-fill"
        onLayout={handleLayout}
      >
        {/* Range (filled portion) */}
        <SliderRange
          value={value}
          min={min}
          max={max}
          trackWidth={trackWidth}
        />
      </View>

      {/* Thumbs */}
      {value.map((val, index) => (
        <SliderThumb
          key={index}
          value={val}
          index={index}
          allValues={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          trackWidth={trackWidth}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          clampValue={clampValue}
          setValue={setValue}
          onValueCommit={onValueCommit}
        />
      ))}
    </View>
  );
}

function SliderRange({
  value,
  min,
  max,
  trackWidth,
}: {
  value: number[];
  min: number;
  max: number;
  trackWidth: Animated.SharedValue<number>;
}) {
  const rangeStyle = useAnimatedStyle(() => {
    if (value.length === 1) {
      const percentage = (value[0] - min) / (max - min);
      return {
        left: 0,
        width: percentage * trackWidth.value,
      };
    }
    // For range slider (2 thumbs)
    const minVal = Math.min(...value);
    const maxVal = Math.max(...value);
    const startPercent = (minVal - min) / (max - min);
    const endPercent = (maxVal - min) / (max - min);
    return {
      left: startPercent * trackWidth.value,
      width: (endPercent - startPercent) * trackWidth.value,
    };
  });

  return (
    <Animated.View
      data-slot="slider-range"
      className="absolute h-full bg-sf-blue"
      style={rangeStyle}
    />
  );
}

function SliderThumb({
  value,
  index,
  allValues,
  min,
  max,
  step,
  disabled,
  trackWidth,
  minStepsBetweenThumbs,
  clampValue,
  setValue,
  onValueCommit,
}: {
  value: number;
  index: number;
  allValues: number[];
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  trackWidth: Animated.SharedValue<number>;
  minStepsBetweenThumbs: number;
  clampValue: (val: number) => number;
  setValue: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}) {
  const isPressed = useSharedValue(false);
  const startX = useSharedValue(0);
  const startValue = useSharedValue(value);

  const thumbStyle = useAnimatedStyle(() => {
    const percentage = (value - min) / (max - min);
    const position = percentage * trackWidth.value;
    return {
      transform: [
        { translateX: position - 10 }, // 10 = half of thumb width
        { scale: withSpring(isPressed.value ? 1.1 : 1, SPRING_CONFIG) },
      ],
    };
  });

  const updateValue = React.useCallback(
    (newVal: number) => {
      // Respect minStepsBetweenThumbs
      let constrainedVal = newVal;
      const minStep = minStepsBetweenThumbs * step;

      for (let i = 0; i < allValues.length; i++) {
        if (i !== index) {
          if (i < index) {
            // This thumb should be >= previous thumb + minStep
            constrainedVal = Math.max(constrainedVal, allValues[i] + minStep);
          } else {
            // This thumb should be <= next thumb - minStep
            constrainedVal = Math.min(constrainedVal, allValues[i] - minStep);
          }
        }
      }

      const clamped = clampValue(constrainedVal);
      const newValues = [...allValues];
      newValues[index] = clamped;
      setValue(newValues);
    },
    [allValues, index, clampValue, setValue, minStepsBetweenThumbs, step]
  );

  const commitValue = React.useCallback(() => {
    onValueCommit?.(allValues);
  }, [allValues, onValueCommit]);

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      isPressed.value = true;
      startX.value = 0;
      startValue.value = value;
    })
    .onUpdate((event) => {
      const deltaX = event.translationX;
      const deltaValue = (deltaX / trackWidth.value) * (max - min);
      const newValue = startValue.value + deltaValue;
      runOnJS(updateValue)(newValue);
    })
    .onEnd(() => {
      isPressed.value = false;
      runOnJS(commitValue)();
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        data-slot="slider-thumb"
        className="absolute size-5 rounded-full border border-sf-border bg-white shadow-md"
        style={thumbStyle}
      />
    </GestureDetector>
  );
}

// Compound component exports
Slider.displayName = "Slider";

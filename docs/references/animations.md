# Animation Patterns

This document covers animation patterns using react-native-reanimated for smooth, performant animations on native.

## Layout Animations

Use `LinearTransition` with spring physics for smooth height/layout changes:

```tsx
import { LinearTransition } from "react-native-reanimated";
import { Animated } from "@/tw/animated";

const LAYOUT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.5,
};

<Animated.View
  layout={LinearTransition.springify()
    .damping(LAYOUT_SPRING_CONFIG.damping)
    .stiffness(LAYOUT_SPRING_CONFIG.stiffness)
    .mass(LAYOUT_SPRING_CONFIG.mass)}
>
  {children}
</Animated.View>
```

### When to Use Layout Animations

- Accordion expand/collapse
- List item reordering
- Dynamic content that changes height
- Any component where siblings need to smoothly adjust position

## Entering/Exiting Animations

Use `FadeIn`/`FadeOut` for content that mounts/unmounts:

```tsx
import { FadeIn, FadeOut } from "react-native-reanimated";

const FADE_DURATION = 150;

// Content unmounts when not visible
if (!isVisible) {
  return null;
}

return (
  <Animated.View
    entering={FadeIn.duration(FADE_DURATION)}
    exiting={FadeOut.duration(FADE_DURATION)}
  >
    {children}
  </Animated.View>
);
```

### Combining Layout and Entering/Exiting

For accordion-style components, combine both:

```tsx
<Animated.View
  entering={FadeIn.duration(150)}
  exiting={FadeOut.duration(150)}
  layout={LinearTransition.springify()
    .damping(20)
    .stiffness(200)
    .mass(0.5)}
>
  {content}
</Animated.View>
```

## Rotation Animations

Use `withSpring` and `interpolate` for smooth rotation:

```tsx
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const INDICATOR_SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.5,
};

function RotatingChevron({ isExpanded }: { isExpanded: boolean }) {
  const rotation = useSharedValue(isExpanded ? 1 : 0);

  React.useEffect(() => {
    rotation.value = withSpring(isExpanded ? 1 : 0, INDICATOR_SPRING_CONFIG);
  }, [isExpanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(rotation.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <SFIcon name="chevron.down" size={14} />
    </Animated.View>
  );
}
```

## Recommended Spring Configs

### Layout Transitions (accordion, lists)
```tsx
{ damping: 20, stiffness: 200, mass: 0.5 }
```

### Indicator Animations (chevrons, icons)
```tsx
{ damping: 15, stiffness: 120, mass: 0.5 }
```

### Snappy Interactions (buttons, toggles)
```tsx
{ damping: 15, stiffness: 300, mass: 0.3 }
```

## CSS-Wrapped Animated Components

Always use the CSS-wrapped animated components from `@/tw/animated`:

```tsx
// CORRECT - supports className
import { Animated } from "@/tw/animated";
<Animated.View className="bg-sf-fill" />

// WRONG - className won't work
import Animated from "react-native-reanimated";
<Animated.View className="bg-sf-fill" />
```

## Web Animation Equivalents

For web, use CSS keyframe animations defined in `global.css`:

```css
@theme {
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }

  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
}
```

Apply with Tailwind:
```tsx
className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
```

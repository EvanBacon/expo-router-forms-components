# React Native CSS Differences

This document covers known differences and issues when using Tailwind CSS classes with react-native-css on native platforms (iOS/Android) compared to web.

## Sizing Classes

### `size-*` Classes Don't Work on Native

The `size-*` utility (e.g., `size-10`, `size-full`) does not work reliably on native.

**Problem:**
```tsx
// This works on web but NOT on native
<View className="size-10" />
```

**Solution:** Use explicit `h-*` and `w-*` classes instead:
```tsx
// This works on both web and native
<View className="h-10 w-10" />
```

### Percentage-Based Sizing with Aspect Ratio

Using `w-full h-full` with `aspect-square` on images can cause massive layout issues on native, where the image expands to fill the parent's largest dimension.

**Problem:**
```tsx
// Image may become 21923x21923 pixels on native!
<Image className="w-full h-full aspect-square" />
```

**Solution:** Use absolute positioning instead:
```tsx
<Image className="absolute inset-0" style={StyleSheet.absoluteFillObject} />
```

## Spacing Classes

### `-space-x-*` Doesn't Work on Native

The negative space utilities (e.g., `-space-x-2`) use CSS `> * + *` selectors with negative margin, which don't work on native.

**Problem:**
```tsx
// Avatars won't overlap on native
<View className="flex -space-x-2">
  <Avatar />
  <Avatar />
</View>
```

**Solution:** Apply negative margin directly to individual elements:
```tsx
<View className="flex-row">
  <Avatar />
  <Avatar className="ml-[-8px]" />
  <Avatar className="ml-[-8px]" />
</View>
```

## CSS Selectors

### `*:` Child Selectors Don't Work

Tailwind's arbitrary child selectors like `*:data-[slot=avatar]:ring-2` don't work on native.

**Problem:**
```tsx
// Ring won't be applied on native
<View className="*:data-[slot=avatar]:ring-2">
  <Avatar />
</View>
```

**Solution:** Apply styles directly to each child:
```tsx
<View>
  <Avatar className="ring-2 ring-sf-bg" />
</View>
```

### `data-*` Attributes

The `data-slot` and other data attributes work for component identification but cannot be used for styling on native (only web).

## Flexbox Differences

### Default Flex Direction

React Native defaults to `flexDirection: 'column'` while web CSS defaults to `row`.

**Solution:** Always be explicit:
```tsx
<View className="flex-row" />  // horizontal
<View className="flex-col" />  // vertical
```

## Component Imports

### Always Use CSS-Wrapped Components

Standard React Native components don't support `className`. Always import from `@/tw`:

```tsx
// WRONG - className won't work
import { View, Text } from 'react-native';

// CORRECT - className works
import { View, Text } from '@/tw';
```

## Style Priority

### Inline Styles vs className

When both `style` and `className` are used, the behavior may differ from web. Inline styles from `StyleSheet.create()` may override className values.

**Solution:** Conditionally apply inline styles:
```tsx
const hasCustomSize = className && /\b(h-|w-|size-)/.test(className);

<View
  style={[hasCustomSize ? undefined : styles.default, style]}
  className={cn("base-classes", !hasCustomSize && "h-10 w-10", className)}
/>
```

## Best Practices

1. **Test on native early** - Don't assume web CSS behavior works on native
2. **Use explicit sizing** - Prefer `h-X w-X` over `size-X`
3. **Avoid complex selectors** - Apply styles directly to elements
4. **Use absolute positioning** - For overlay elements like images in containers
5. **Import from @/tw** - Never use raw React Native components with className

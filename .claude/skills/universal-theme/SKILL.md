---
name: universal-theme
description: Configure light/dark/system theme handling across iOS, Android, and Web with universal CSS
---

# Universal Theme Handling for Expo

This guide covers implementing proper light/dark/system theme handling across all platforms while respecting web static rendering. This is specifically for projects using universal CSS (Tailwind v4 + react-native-css).

## Overview

The approach uses:

- **CSS `color-scheme`** - For automatic system preference detection via `prefers-color-scheme`
- **CSS classes (`.light`/`.dark`)** - For manual theme override (shadcn/ui pattern)
- **React Native Appearance API** - For native platform theme control
- **ThemeContextProvider** - Unified React context for theme state management

## CSS Setup

### Theme Control in CSS

Update your CSS file (e.g., `src/css/sf.css`) to use `color-scheme` for automatic system preference detection:

```css
@layer base {
  /*
   * Theme handling with light-dark() CSS function
   * https://lightningcss.dev/transpilation.html#light-dark
   *
   * By default, use "light dark" which enables automatic switching based on
   * prefers-color-scheme media query (system preference).
   *
   * Use .light or .dark class on html/body to force a specific theme.
   * This follows the shadcn/ui pattern for theme control.
   */
  html {
    color-scheme: light dark;
  }

  /* Force light mode when .light class is applied */
  html.light,
  .light {
    color-scheme: light;
  }

  /* Force dark mode when .dark class is applied */
  html.dark,
  .dark {
    color-scheme: dark;
  }
}
```

### Using light-dark() for Colors

Define CSS variables that automatically switch based on the resolved color scheme:

```css
:root {
  /* Colors automatically switch based on color-scheme */
  --sf-text: light-dark(rgb(0 0 0), rgb(255 255 255));
  --sf-bg: light-dark(rgb(255 255 255), rgb(0 0 0));
  --sf-blue: light-dark(rgb(0 122 255), rgb(10 132 255));
}
```

When `color-scheme: light dark` is set (system mode), `light-dark()` responds to the user's system preference automatically via `prefers-color-scheme` media query.

## Theme Context Provider

Create a theme context that manages light/dark/system modes across platforms.

### Types

```typescript
// src/components/ui/theme-context.tsx

/**
 * Theme mode values:
 * - "system": Use the system's color scheme (default)
 * - "light": Force light mode
 * - "dark": Force dark mode
 */
export type ThemeMode = "system" | "light" | "dark";

/**
 * Resolved theme is always either "light" or "dark"
 */
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** The current theme mode setting (system/light/dark) */
  mode: ThemeMode;
  /** The resolved theme based on mode and system preference */
  resolvedTheme: ResolvedTheme;
  /** Set the theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Whether the resolved theme is dark */
  isDark: boolean;
}
```

### Web Theme Application

On web, apply `.light` or `.dark` classes to the `<html>` element. For system mode, remove both classes to let CSS handle it via `prefers-color-scheme`:

```typescript
function applyWebTheme(mode: ThemeMode): void {
  if (process.env.EXPO_OS !== "web") return;

  const html = document.documentElement;

  // Remove existing theme classes
  html.classList.remove("light", "dark");

  // Apply appropriate class based on mode
  if (mode === "light") {
    html.classList.add("light");
  } else if (mode === "dark") {
    html.classList.add("dark");
  }
  // For "system" mode, no class is needed - CSS will use prefers-color-scheme
}
```

### Native Theme Application

On iOS and Android, use React Native's `Appearance.setColorScheme()` API:

```typescript
import { Appearance, ColorSchemeName } from "react-native";

function applyNativeTheme(mode: ThemeMode): void {
  if (process.env.EXPO_OS === "web") return;

  // Map theme mode to ColorSchemeName (null = system)
  const colorScheme: ColorSchemeName = mode === "system" ? null : mode;

  if (process.env.EXPO_OS === "ios") {
    // On iOS, delay slightly to allow for smooth animations
    setTimeout(() => {
      Appearance.setColorScheme(colorScheme);
    }, 100);
  } else {
    // On Android, apply immediately
    Appearance.setColorScheme(colorScheme);
  }
}
```

### Full Context Provider Implementation

```typescript
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  use,
} from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}

interface ThemeContextProviderProps {
  children: React.ReactNode;
  /** Initial theme mode, defaults to "system" */
  defaultMode?: ThemeMode;
}

export function ThemeContextProvider({
  children,
  defaultMode = "system",
}: ThemeContextProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);

  // Get the current system color scheme
  const systemColorScheme = useColorScheme();

  // Resolve the actual theme based on mode and system preference
  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (mode === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return mode;
  }, [mode, systemColorScheme]);

  const isDark = resolvedTheme === "dark";

  // Apply theme when mode changes
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);

    if (process.env.EXPO_OS === "web") {
      applyWebTheme(newMode);
    } else {
      applyNativeTheme(newMode);
    }
  }, []);

  // Apply initial theme on mount
  useEffect(() => {
    if (process.env.EXPO_OS === "web") {
      applyWebTheme(mode);
    } else {
      applyNativeTheme(mode);
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      isDark,
    }),
    [mode, resolvedTheme, setMode, isDark]
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
```

## Theme Provider with React Navigation

Wrap the theme context with React Navigation's theme provider for proper navigation theming:

```typescript
// src/components/ui/theme-provider.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { ThemeContextProvider, useTheme } from "./theme-context";

// Re-export for convenience
export { useTheme } from "./theme-context";
export type { ThemeMode, ResolvedTheme } from "./theme-context";

function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  return (
    <RNTheme value={isDark ? DarkTheme : DefaultTheme}>{children}</RNTheme>
  );
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContextProvider defaultMode="system">
      <NavigationThemeProvider>{children}</NavigationThemeProvider>
    </ThemeContextProvider>
  );
}
```

## How It Works

### On Web

1. **System mode**: No class on `<html>`, `color-scheme: light dark` enables `prefers-color-scheme` media query
2. **Light mode**: `.light` class on `<html>`, forces `color-scheme: light`
3. **Dark mode**: `.dark` class on `<html>`, forces `color-scheme: dark`
4. CSS `light-dark()` function automatically picks the correct color based on the resolved `color-scheme`

### On Native (iOS/Android)

1. **System mode**: `Appearance.setColorScheme(null)` - follows device settings
2. **Light mode**: `Appearance.setColorScheme("light")` - forces light mode
3. **Dark mode**: `Appearance.setColorScheme("dark")` - forces dark mode
4. On iOS, theme changes are delayed 100ms for smooth animations
5. `useColorScheme()` hook reactively provides the resolved theme

## Key Benefits

1. **Static rendering support**: No JavaScript needed for initial theme on web - CSS handles it
2. **System preference detection**: Automatic via `prefers-color-scheme` media query
3. **Manual override**: Users can force light or dark mode
4. **Platform-native behavior**: Uses native APIs on iOS/Android
5. **Smooth transitions**: Delayed theme application on iOS prevents jarring flashes
6. **Single source of truth**: React context manages state across all components

## Platform-Specific Notes

### iOS

- Uses `Appearance.setColorScheme()` with 100ms delay for animation smoothness
- Native `platformColor()` values automatically respond to system theme

### Android

- Uses `Appearance.setColorScheme()` immediately (no delay needed)
- Uses `light-dark()` CSS fallbacks for web-style color handling

### Web

- Uses CSS classes on `<html>` element (shadcn/ui pattern)
- `color-scheme` property controls how `light-dark()` resolves colors
- Works with static rendering - no hydration mismatch issues

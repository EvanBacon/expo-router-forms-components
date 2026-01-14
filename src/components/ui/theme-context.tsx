import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  use,
} from "react";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";

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

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Hook to access the theme context
 */
export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}

/**
 * Apply theme to the web document
 */
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

/**
 * Apply theme to native platforms using React Native's Appearance API
 */
function applyNativeTheme(mode: ThemeMode): void {
  if (process.env.EXPO_OS === "web") return;

  // Map theme mode to ColorSchemeName
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

interface ThemeContextProviderProps {
  children: React.ReactNode;
  /** Initial theme mode, defaults to "system" */
  defaultMode?: ThemeMode;
}

/**
 * Theme context provider that handles light/dark/system mode
 * across iOS, Android, and Web platforms.
 *
 * On native (iOS/Android):
 * - Uses React Native's Appearance API to control the color scheme
 * - Defaults to system theme
 *
 * On Web:
 * - Uses CSS classes to control the color-scheme property
 * - Follows shadcn/ui pattern with .light/.dark classes
 * - System mode uses prefers-color-scheme media query
 */
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

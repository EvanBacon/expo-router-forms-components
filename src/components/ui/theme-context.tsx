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

/** localStorage key for persisting theme preference */
const STORAGE_KEY = "theme-mode";

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
 * Safely get theme from localStorage
 */
function getStoredTheme(): ThemeMode | null {
  if (process.env.EXPO_OS !== "web") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return null;
}

/**
 * Safely save theme to localStorage
 */
function saveTheme(mode: ThemeMode): void {
  if (process.env.EXPO_OS !== "web") return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Disable CSS transitions temporarily during theme change.
 * Returns a cleanup function to re-enable transitions.
 * Pattern borrowed from next-themes.
 */
function disableTransitions(): () => void {
  if (process.env.EXPO_OS !== "web") return () => {};

  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
    )
  );
  document.head.appendChild(style);

  return () => {
    // Force a reflow to ensure transitions are disabled before cleanup
    (() => window.getComputedStyle(document.body))();
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1);
  };
}

/**
 * Apply theme to the web document
 */
function applyWebTheme(mode: ThemeMode, disableAnimations = false): void {
  if (process.env.EXPO_OS !== "web") return;

  const enableTransitions = disableAnimations ? disableTransitions() : null;

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

  enableTransitions?.();
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
  // Initialize from localStorage on web, otherwise use defaultMode
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (process.env.EXPO_OS === "web") {
      return getStoredTheme() ?? defaultMode;
    }
    return defaultMode;
  });

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
    saveTheme(newMode);

    if (process.env.EXPO_OS === "web") {
      // Disable transitions when user explicitly changes theme
      applyWebTheme(newMode, true);
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

  // Cross-tab synchronization via storage events (web only)
  useEffect(() => {
    if (process.env.EXPO_OS !== "web") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;

      const newMode = e.newValue as ThemeMode | null;
      if (newMode === "light" || newMode === "dark" || newMode === "system") {
        setModeState(newMode);
        applyWebTheme(newMode, true);
      } else {
        // Invalid or cleared - reset to default
        setModeState(defaultMode);
        applyWebTheme(defaultMode, true);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultMode]);

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

/**
 * Inline script that runs before React hydration to prevent flash of incorrect theme.
 * Pattern borrowed from next-themes.
 *
 * This script:
 * 1. Reads the theme preference from localStorage
 * 2. Applies the appropriate class to <html> immediately
 * 3. Runs synchronously before any content renders
 *
 * Add this to your root layout's <head> or at the start of <body>.
 */
export function ThemeScript({
  defaultMode = "system",
  storageKey = STORAGE_KEY,
}: {
  defaultMode?: ThemeMode;
  storageKey?: string;
}) {
  // Only render on web
  if (process.env.EXPO_OS !== "web") {
    return null;
  }

  // The script that runs before hydration
  const script = `
(function() {
  try {
    var mode = localStorage.getItem('${storageKey}') || '${defaultMode}';
    var html = document.documentElement;
    html.classList.remove('light', 'dark');
    if (mode === 'light') {
      html.classList.add('light');
    } else if (mode === 'dark') {
      html.classList.add('dark');
    }
    // For 'system', no class needed - CSS handles it via prefers-color-scheme
  } catch (e) {}
})();
`;

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}

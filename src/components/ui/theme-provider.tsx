import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { ThemeContextProvider, useTheme } from "./theme-context";

// Re-export the theme hook and types for convenience
export { useTheme } from "./theme-context";
export type { ThemeMode, ResolvedTheme } from "./theme-context";

/**
 * Inner theme provider that uses the theme context to determine
 * which react-navigation theme to use.
 */
function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  return (
    <RNTheme value={isDark ? DarkTheme : DefaultTheme}>{children}</RNTheme>
  );
}

/**
 * Theme provider that wraps the app with:
 * 1. ThemeContextProvider - manages light/dark/system mode
 * 2. React Navigation ThemeProvider - provides navigation theming
 *
 * On iOS/Android: Defaults to system theme, uses Appearance API for control
 * On Web: Uses CSS classes for theme control (shadcn-style)
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContextProvider defaultMode="dark">
      <NavigationThemeProvider>{children}</NavigationThemeProvider>
    </ThemeContextProvider>
  );
}

"use client";

import * as React from "react";
import { useNavigation } from "expo-router";

/* ----------------------------------------------------------------------------------
 * Stack Header Context
 * ----------------------------------------------------------------------------------
 *
 * Context for managing the custom web stack header.
 * Screens can use useStackHeaderConfig to set their header content.
 *
 * Extracted to a separate file to avoid require cycles between stack.web.tsx
 * and toolbar.web.tsx.
 */

export interface StackHeaderConfig {
  title?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerShown?: boolean;
}

export interface StackHeaderContextValue {
  /** Whether the sidebar is open (from tab bar controller) */
  isSidebarOpen: boolean;
  /** Whether we're inside a tab bar controller */
  isInsideTabBar: boolean;
  /** Current header configuration */
  headerConfig: StackHeaderConfig;
  /** Set header configuration */
  setHeaderConfig: (config: StackHeaderConfig) => void;
}

export const StackHeaderContext = React.createContext<StackHeaderContextValue>({
  isSidebarOpen: false,
  isInsideTabBar: false,
  headerConfig: {},
  setHeaderConfig: () => {},
});

export function useStackHeaderContext() {
  return React.useContext(StackHeaderContext);
}

/** Hook for screens to configure their header */
export function useStackHeaderConfig(config: StackHeaderConfig) {
  const { setHeaderConfig } = useStackHeaderContext();

  React.useEffect(() => {
    setHeaderConfig(config);
    return () => setHeaderConfig({});
  }, [config.title, config.headerShown, setHeaderConfig]);

  // Also update when headerLeft/headerRight change
  React.useEffect(() => {
    setHeaderConfig(config);
  }, [config.headerLeft, config.headerRight, setHeaderConfig]);
}

/**
 * Hook to reactively check if navigation can go back.
 * Uses navigation.canGoBack() but subscribes to state changes
 * to trigger re-renders when the navigation state changes.
 */
export function useCanGoBack(): boolean {
  const navigation = useNavigation();

  const getSnapshot = React.useCallback(() => {
    return navigation.canGoBack();
  }, [navigation]);

  const subscribe = React.useCallback(
    (callback: () => void) => {
      const unsubscribe = navigation.addListener("state", callback);
      return unsubscribe;
    },
    [navigation]
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

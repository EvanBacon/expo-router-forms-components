"use client";

import * as React from "react";

/* ----------------------------------------------------------------------------------
 * Stack Header Context (Native)
 * ----------------------------------------------------------------------------------
 *
 * Native version - mostly a no-op since iOS uses native header APIs.
 * Provides the same interface for cross-platform compatibility.
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

/** Hook for screens to configure their header - no-op on native */
export function useStackHeaderConfig(_config: StackHeaderConfig) {
  // No-op on native - header is controlled by native stack navigator
}

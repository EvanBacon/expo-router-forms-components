"use client";

import * as React from "react";
import { Stack as ExpoStack, useRouter } from "expo-router";
import { cn } from "@/lib/utils";
import { SFIcon } from "@/components/ui/sf-icon";
import { useTabBarController, ProgressiveBlurBackdrop } from "@/components/ui/tab-bar-controller.web";
import {
  StackHeaderContext,
  useStackHeaderContext,
  useStackHeaderConfig,
  useCanGoBack,
  type StackHeaderConfig,
} from "@/components/layout/stack-context.web";
import { KonstaStackHeader, KonstaHeaderButton } from "./konsta-stack-header.web";

/* Stack Header Context is imported from stack-context.web.tsx to avoid require cycles */

/* ----------------------------------------------------------------------------------
 * Inner component that uses the tab bar hook
 * ----------------------------------------------------------------------------------*/

function TabBarAwareProviderInner({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useTabBarController();
  const [headerConfig, setHeaderConfig] = React.useState<StackHeaderConfig>({});

  const value = React.useMemo(
    () => ({ isSidebarOpen, isInsideTabBar: true, headerConfig, setHeaderConfig }),
    [isSidebarOpen, headerConfig]
  );

  return (
    <StackHeaderContext.Provider value={value}>
      {children}
    </StackHeaderContext.Provider>
  );
}

function TabBarAwareProviderFallback({ children }: { children: React.ReactNode }) {
  const [headerConfig, setHeaderConfig] = React.useState<StackHeaderConfig>({});

  const value = React.useMemo(
    () => ({ isSidebarOpen: false, isInsideTabBar: false, headerConfig, setHeaderConfig }),
    [headerConfig]
  );

  return (
    <StackHeaderContext.Provider value={value}>
      {children}
    </StackHeaderContext.Provider>
  );
}

/* ----------------------------------------------------------------------------------
 * Standalone Floating Header (for manual use)
 * ----------------------------------------------------------------------------------
 * Updated to use iOS Liquid Glass styling with enhanced blur effects
 */

interface StackFloatingHeaderProps {
  /** The page title */
  title?: string;
  /** Left toolbar content (replaces back button if provided) */
  headerLeft?: React.ReactNode;
  /** Right toolbar content */
  headerRight?: React.ReactNode;
  /** Whether to show the header */
  headerShown?: boolean;
  /** Whether a back button should be shown */
  canGoBack?: boolean;
  /** Custom class name for the header */
  className?: string;
}

function StackFloatingHeader({
  title,
  headerLeft,
  headerRight,
  headerShown = true,
  canGoBack = false,
  className,
}: StackFloatingHeaderProps) {
  const router = useRouter();
  const { isSidebarOpen, isInsideTabBar } = useStackHeaderContext();

  if (!headerShown) {
    return null;
  }

  const showCenterTitle = !isInsideTabBar || isSidebarOpen;
  const hasLeftContent = canGoBack || headerLeft;
  const hasRightContent = !!headerRight;

  // Liquid glass pill styling
  const liquidGlassStyle: React.CSSProperties = {
    background: "color-mix(in srgb, var(--sf-grouped-bg-2) 65%, transparent)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    boxShadow: `
      0 0 0 0.5px color-mix(in srgb, var(--sf-border) 50%, transparent),
      0 2px 8px -2px rgba(0, 0, 0, 0.15),
      0 8px 24px -4px rgba(0, 0, 0, 0.12)
    `.trim(),
  };

  return (
    <>
      {/* Progressive blur backdrop */}
      <ProgressiveBlurBackdrop position="top" className="absolute" />

      <header
        data-slot="stack-floating-header"
        data-sidebar-open={isSidebarOpen}
        className={cn(
          "pointer-events-none absolute top-4 left-0 right-0 z-20",
          "flex items-start justify-between gap-2",
          "px-4",
          className
        )}
      >
        <div
          data-slot="stack-header-left"
          className={cn(
            "pointer-events-auto flex items-center",
            "rounded-full overflow-hidden",
            "transition-all duration-300",
            !hasLeftContent && "opacity-0 scale-95 pointer-events-none"
          )}
          style={liquidGlassStyle}
        >
          {canGoBack && !headerLeft && (
            <button
              onClick={() => router.back()}
              className={cn(
                "flex h-10 items-center gap-1 rounded-full pl-2 pr-3",
                "text-sf-text hover:bg-sf-fill",
                "transition-colors"
              )}
            >
              <SFIcon name="chevron.left" className="text-sf-text text-xl" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}
          {headerLeft}
        </div>

        <div
          data-slot="stack-header-center"
          className={cn(
            "pointer-events-auto",
            "rounded-full px-4 py-2.5 overflow-hidden",
            "transition-all duration-300 ease-out",
            showCenterTitle && title
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          )}
          style={liquidGlassStyle}
        >
          <span className="text-sm font-semibold text-(--sf-text) whitespace-nowrap">
            {title}
          </span>
        </div>

        <div
          data-slot="stack-header-right"
          className={cn(
            "pointer-events-auto flex items-center",
            "rounded-full overflow-hidden",
            "transition-all duration-300",
            !hasRightContent && "opacity-0 scale-95 pointer-events-none"
          )}
          style={liquidGlassStyle}
        >
          {headerRight}
        </div>
      </header>
    </>
  );
}

/* ----------------------------------------------------------------------------------
 * Header Toolbar Button
 * ----------------------------------------------------------------------------------
 * Re-export from Konsta header for consistency
 */

const HeaderButton = KonstaHeaderButton;

/* ----------------------------------------------------------------------------------
 * Screen Wrapper with Header
 * ----------------------------------------------------------------------------------
 *
 * Use this to wrap your screen content when you want the floating header.
 */

interface StackScreenProps {
  /** The page title */
  title?: string;
  /** Left toolbar content */
  headerLeft?: React.ReactNode;
  /** Right toolbar content */
  headerRight?: React.ReactNode;
  /** Whether to show the header */
  headerShown?: boolean;
  /** Whether a back button should be shown */
  canGoBack?: boolean;
  /** Screen content */
  children: React.ReactNode;
  /** Custom class name for the content area */
  className?: string;
}

function StackScreen({
  title,
  headerLeft,
  headerRight,
  headerShown = true,
  canGoBack = false,
  children,
  className,
}: StackScreenProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <StackFloatingHeader
        title={title}
        headerLeft={headerLeft}
        headerRight={headerRight}
        headerShown={headerShown}
        canGoBack={canGoBack}
      />
      <div
        data-slot="stack-screen-content"
        className={cn(
          "flex flex-1 flex-col",
          // Note: The TabBarControllerSlot already provides pt-16 for the floating bar area.
          // The header is positioned absolute within that space, so content doesn't need
          // additional padding when inside a tab bar. Only add padding when header is shown
          // AND we're not relying on the slot's padding.
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * Stack Component
 * ----------------------------------------------------------------------------------*/

interface StackProps extends React.ComponentProps<typeof ExpoStack> {}

function StackInner({
  screenOptions,
  children,
  ...props
}: StackProps) {
  return (
    <TabBarAwareProviderInner>
      <KonstaStackHeader />
      <ExpoStack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
          ...screenOptions,
        }}
        {...props}
      >
        {children}
      </ExpoStack>
    </TabBarAwareProviderInner>
  );
}

function StackFallback({
  screenOptions,
  children,
  ...props
}: StackProps) {
  return (
    <TabBarAwareProviderFallback>
      <KonstaStackHeader />
      <ExpoStack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
          ...screenOptions,
        }}
        {...props}
      >
        {children}
      </ExpoStack>
    </TabBarAwareProviderFallback>
  );
}

/* ----------------------------------------------------------------------------------
 * Error Boundary for Tab Bar Context
 * ----------------------------------------------------------------------------------*/

class TabBarContextBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Wrapper that handles the conditional context usage via Error Boundary
function Stack(props: StackProps) {
  return (
    <TabBarContextBoundary fallback={<StackFallback {...props} />}>
      <StackInner {...props} />
    </TabBarContextBoundary>
  );
}

/* ----------------------------------------------------------------------------------
 * Stack.Screen
 * ----------------------------------------------------------------------------------
 *
 * Re-export ExpoStack.Screen directly. Screen components are configuration elements,
 * not rendered components, so we can't use hooks in them.
 * Use useStackHeaderConfig() in your actual screen component to configure the header.
 */

type StackScreenComponentProps = React.ComponentProps<typeof ExpoStack.Screen> & {
  /** Make the sheet open as a bottom sheet with default options on iOS. */
  sheet?: boolean;
  /** Make the screen open as a modal. */
  modal?: boolean;
};

Stack.Screen = ExpoStack.Screen as React.FC<StackScreenComponentProps>;

// Re-export Toolbar as a sub-component of Stack
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarMenu,
  ToolbarMenuItem,
  ToolbarMenuSeparator,
  ToolbarMenuLabel,
  ToolbarMenuCheckboxItem,
  ToolbarMenuRadioGroup,
  ToolbarMenuRadioItem,
  ToolbarMenuSub,
  ToolbarGroup,
  ToolbarToggleItem,
  ToolbarSpacer,
} from "./toolbar.web";

Stack.Toolbar = Toolbar;
Stack.ToolbarButton = ToolbarButton;
Stack.ToolbarSeparator = ToolbarSeparator;
Stack.ToolbarLink = ToolbarLink;
Stack.ToolbarMenu = ToolbarMenu;
Stack.ToolbarMenuItem = ToolbarMenuItem;
Stack.ToolbarMenuSeparator = ToolbarMenuSeparator;
Stack.ToolbarMenuLabel = ToolbarMenuLabel;
Stack.ToolbarMenuCheckboxItem = ToolbarMenuCheckboxItem;
Stack.ToolbarMenuRadioGroup = ToolbarMenuRadioGroup;
Stack.ToolbarMenuRadioItem = ToolbarMenuRadioItem;
Stack.ToolbarMenuSub = ToolbarMenuSub;
Stack.ToolbarGroup = ToolbarGroup;
Stack.ToolbarToggleItem = ToolbarToggleItem;
Stack.ToolbarSpacer = ToolbarSpacer;

export default Stack;

/* ----------------------------------------------------------------------------------
 * Exports
 * ----------------------------------------------------------------------------------*/

export {
  StackFloatingHeader,
  StackScreen,
  HeaderButton,
  KonstaStackHeader,
  KonstaHeaderButton,
  useStackHeaderContext,
  useStackHeaderConfig,
  useCanGoBack,
  StackHeaderContext,
};

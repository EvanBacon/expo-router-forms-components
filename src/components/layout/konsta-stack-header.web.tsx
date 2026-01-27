"use client";

import * as React from "react";
import { useRouter } from "expo-router";
import { KonstaProvider, Navbar, NavbarBackLink } from "konsta/react";
import { cn } from "@/lib/utils";
import { SFIcon } from "@/components/ui/sf-icon";
import {
  useStackHeaderContext,
  useCanGoBack,
} from "@/components/layout/stack-context.web";

/* ----------------------------------------------------------------------------------
 * Konsta UI Web Stack Header
 * ----------------------------------------------------------------------------------
 *
 * A liquid glass-style header using Konsta UI's Navbar component.
 * Designed to match iOS 26+ Liquid Glass appearance on the web.
 */

interface KonstaStackHeaderProps {
  /** Whether to use the floating pill style (true) or full-width bar (false) */
  floatingStyle?: boolean;
}

export function KonstaStackHeader({ floatingStyle = true }: KonstaStackHeaderProps = {}) {
  const router = useRouter();
  const { isSidebarOpen, isInsideTabBar, headerConfig } = useStackHeaderContext();
  const canGoBack = useCanGoBack();

  const { title, headerLeft, headerRight, headerShown = true } = headerConfig;

  if (!headerShown) {
    return null;
  }

  // When floating bar is visible (sidebar closed in tab bar mode),
  // hide the center title to let the floating bar be prominent
  const showCenterTitle = !isInsideTabBar || isSidebarOpen;

  const hasLeftContent = canGoBack || !!headerLeft;
  const hasRightContent = !!headerRight;

  // Don't render header if there's nothing to show
  if (!hasLeftContent && !hasRightContent && !title) {
    return null;
  }

  // Render floating pill-style header (iOS Liquid Glass style)
  if (floatingStyle) {
    return (
      <KonstaProvider theme="ios" dark>
        <div
          data-slot="konsta-stack-header-wrapper"
          className={cn(
            "pointer-events-none fixed top-4 z-30",
            "flex items-start justify-between gap-2",
            "right-4",
            isSidebarOpen ? "left-78" : "left-4"
          )}
        >
          {/* Left pill - Back button or custom left content */}
          <div
            data-slot="konsta-header-left"
            className={cn(
              "pointer-events-auto",
              "overflow-hidden rounded-full",
              // Liquid Glass styling
              "liquid-glass-pill",
              "transition-all duration-300",
              !hasLeftContent && "opacity-0 scale-95 pointer-events-none"
            )}
          >
            {canGoBack && !headerLeft ? (
              <NavbarBackLink
                text="Back"
                showText
                onClick={() => router.back()}
                className="konsta-back-link"
              />
            ) : (
              headerLeft
            )}
          </div>

          {/* Center pill - Title */}
          <div
            data-slot="konsta-header-center"
            className={cn(
              "pointer-events-auto",
              "overflow-hidden rounded-full px-4 py-2.5",
              // Liquid Glass styling
              "liquid-glass-pill",
              "transition-all duration-300 ease-out",
              showCenterTitle && title
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            <span className="text-sm font-semibold text-(--sf-text) whitespace-nowrap">
              {title}
            </span>
          </div>

          {/* Right pill - Custom right content */}
          <div
            data-slot="konsta-header-right"
            className={cn(
              "pointer-events-auto",
              "overflow-hidden rounded-full",
              // Liquid Glass styling
              "liquid-glass-pill",
              "transition-all duration-300",
              !hasRightContent && "opacity-0 scale-95 pointer-events-none"
            )}
          >
            {headerRight}
          </div>
        </div>

        {/* Embedded styles for liquid glass effect */}
        <style>{`
          .liquid-glass-pill {
            background: color-mix(in srgb, var(--sf-grouped-bg-2) 65%, transparent);
            backdrop-filter: blur(40px) saturate(180%);
            -webkit-backdrop-filter: blur(40px) saturate(180%);
            box-shadow:
              0 0 0 0.5px color-mix(in srgb, var(--sf-border) 50%, transparent),
              0 2px 8px -2px rgba(0, 0, 0, 0.15),
              0 8px 24px -4px rgba(0, 0, 0, 0.12);
          }

          @media (prefers-color-scheme: dark) {
            .liquid-glass-pill {
              background: color-mix(in srgb, var(--sf-grouped-bg-2) 55%, transparent);
              box-shadow:
                0 0 0 0.5px color-mix(in srgb, var(--sf-border) 40%, transparent),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 2px 8px -2px rgba(0, 0, 0, 0.4),
                0 8px 24px -4px rgba(0, 0, 0, 0.3);
            }
          }

          .konsta-back-link {
            display: flex !important;
            align-items: center;
            gap: 0.25rem;
            padding: 0.5rem 0.75rem 0.5rem 0.5rem;
            color: var(--sf-text);
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 150ms;
          }

          .konsta-back-link:hover {
            background-color: var(--sf-fill);
          }
        `}</style>
      </KonstaProvider>
    );
  }

  // Render full-width bar style (alternative mode)
  return (
    <KonstaProvider theme="ios" dark>
      <div
        data-slot="konsta-stack-header-bar"
        className={cn(
          "fixed top-0 z-30 w-full",
          isSidebarOpen ? "left-78" : "left-0",
          "right-0"
        )}
      >
        <Navbar
          title={showCenterTitle ? title : undefined}
          left={
            canGoBack && !headerLeft ? (
              <NavbarBackLink
                text="Back"
                showText
                onClick={() => router.back()}
              />
            ) : (
              headerLeft
            )
          }
          right={headerRight}
          transparent={false}
          bgClassName="liquid-glass-bar"
          className="konsta-navbar"
        />
      </div>

      <style>{`
        .liquid-glass-bar {
          background: color-mix(in srgb, var(--sf-grouped-bg-2) 65%, transparent) !important;
          backdrop-filter: blur(40px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(40px) saturate(180%) !important;
        }

        .konsta-navbar {
          --k-navbar-bg-color: transparent;
          border-bottom: 0.5px solid color-mix(in srgb, var(--sf-border) 50%, transparent);
        }
      `}</style>
    </KonstaProvider>
  );
}

/* ----------------------------------------------------------------------------------
 * Konsta Header Button
 * ----------------------------------------------------------------------------------
 *
 * A button component styled to match Konsta UI's iOS appearance
 * for use in the header's left/right areas.
 */

interface KonstaHeaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  children?: React.ReactNode;
}

export function KonstaHeaderButton({
  icon,
  children,
  className,
  ...props
}: KonstaHeaderButtonProps) {
  return (
    <button
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-full px-3",
        "text-sf-text hover:bg-sf-fill",
        "transition-colors",
        className
      )}
      {...props}
    >
      {icon && <SFIcon name={icon as any} className="text-sf-text text-xl" />}
      {children && <span className="text-sm font-medium">{children}</span>}
    </button>
  );
}

export default KonstaStackHeader;

"use client";

import "@/global.css";

import ThemeProvider from "@/components/ui/theme-provider";
import { AsyncFont } from "@/components/data/async-font";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import { Link, type Href } from "expo-router";
import { TabList, TabTrigger } from "expo-router/ui";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { cn } from "@/lib/utils";

import {
  TabBarControllerTabs,
  TabBarControllerSidebar,
  TabBarControllerHeader,
  TabBarControllerEditTrigger,
  TabBarControllerContent,
  TabBarControllerMenu,
  TabBarControllerMenuItem,
  TabBarControllerLink,
  TabBarControllerGroup,
  TabBarControllerGroupLabel,
  TabBarControllerGroupContent,
  TabBarControllerInset,
  TabBarControllerRouterFloatingBar,
  TabBarControllerSlot,
} from "@/components/ui/tab-bar-controller.web";

// Auto-discover all pages using require.context (excluding special files and ui folder)
const routeContext = require.context(
  "./(index,info)",
  false,
  /^\.\/(?!_layout|_debug|ui)[^/]+\.tsx$/
);

// Auto-discover all MDX docs from docs/ui/
const docsContext = require.context(
  "../../docs/ui",
  false,
  /\.mdx$/
);

// Convert filename to route info for pages
function getPageRouteInfo(key: string) {
  const filename = key.replace(/^\.\//, "").replace(/\.tsx$/, "");
  const title = filename
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return { name: filename, title, href: `/(index)/${filename}` as Href };
}

// Convert MDX filename to route info for docs
function getDocsRouteInfo(key: string) {
  const filename = key.replace(/^\.\//, "").replace(/\.mdx$/, "");
  // Try to get title from frontmatter, fallback to filename
  const mod = docsContext(key);
  const title = mod.frontmatter?.title ?? filename
    .split("-")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return { name: `ui-${filename}`, title, href: `/(index)/ui/${filename}` as Href };
}

// Get all discovered page routes, excluding index and info (handled separately)
const discoveredPages = routeContext
  .keys()
  .map(getPageRouteInfo)
  .filter((route) => !["index", "info"].includes(route.name))
  .sort((a, b) => a.title.localeCompare(b.title));

// Get all discovered docs routes
const discoveredDocs = docsContext
  .keys()
  .map(getDocsRouteInfo)
  .sort((a, b) => a.title.localeCompare(b.title));

// Simple sidebar link that doesn't register as a tab
function SidebarLink({
  href,
  icon,
  children,
}: {
  href: Href;
  icon: IconSymbolName;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-sm",
        "transition-colors duration-150",
        "hover:bg-(--sf-fill)"
      )}
    >
      <IconSymbol name={icon} size={20} color="var(--sf-text)" />
      <span className="flex-1 truncate text-(--sf-text)">{children}</span>
    </Link>
  );
}

SplashScreen.preventAutoHideAsync();

function SplashFallback() {
  useEffect(
    () => () => {
      SplashScreen.hideAsync();
    },
    []
  );
  return null;
}

export default function Layout() {
  return (
    <Suspense fallback={<SplashFallback />}>
      <AsyncFont src={SourceCodePro_400Regular} fontFamily="Source Code Pro" />
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1, display: "contents" }}>
          <TabBarControllerTabs className="bg-sf-grouped-bg">
            {/* Hidden TabList to register routes with Expo Router */}
            <TabList style={{ display: "none" }}>
              <TabTrigger name="index" href="/(index)" />
              <TabTrigger name="info" href="/(info)" />
            </TabList>

            <TabBarControllerSidebar>
              <TabBarControllerHeader>
                {/* <TabBarControllerTitle>Tabs</TabBarControllerTitle> */}
                <TabBarControllerEditTrigger />
              </TabBarControllerHeader>

              <TabBarControllerContent>
                <TabBarControllerMenu>
                  <TabBarControllerMenuItem>
                    <TabBarControllerLink
                      href="/(index)"
                      name="index"
                      icon="house.fill"
                      pinned
                    >
                      Home
                    </TabBarControllerLink>
                  </TabBarControllerMenuItem>
                  <TabBarControllerMenuItem>
                    <TabBarControllerLink
                      href="/(info)"
                      name="info"
                      icon="info.circle.fill"
                      pinned
                    >
                      Info
                    </TabBarControllerLink>
                  </TabBarControllerMenuItem>
                </TabBarControllerMenu>

                <TabBarControllerGroup>
                  <TabBarControllerGroupLabel>
                    Documentation
                  </TabBarControllerGroupLabel>
                  <TabBarControllerGroupContent>
                    <TabBarControllerMenu>
                      {discoveredDocs.map((route) => (
                        <TabBarControllerMenuItem key={route.name}>
                          <SidebarLink href={route.href} icon="doc.text">
                            {route.title}
                          </SidebarLink>
                        </TabBarControllerMenuItem>
                      ))}
                    </TabBarControllerMenu>
                  </TabBarControllerGroupContent>
                </TabBarControllerGroup>

                {discoveredPages.length > 0 && (
                  <TabBarControllerGroup>
                    <TabBarControllerGroupLabel>
                      Examples
                    </TabBarControllerGroupLabel>
                    <TabBarControllerGroupContent>
                      <TabBarControllerMenu>
                        {discoveredPages.map((route) => (
                          <TabBarControllerMenuItem key={route.name}>
                            <SidebarLink href={route.href} icon="rectangle.grid.2x2">
                              {route.title}
                            </SidebarLink>
                          </TabBarControllerMenuItem>
                        ))}
                      </TabBarControllerMenu>
                    </TabBarControllerGroupContent>
                  </TabBarControllerGroup>
                )}

              </TabBarControllerContent>
            </TabBarControllerSidebar>

            <TabBarControllerInset>
              <TabBarControllerRouterFloatingBar />
              <TabBarControllerSlot />
            </TabBarControllerInset>
          </TabBarControllerTabs>
          <Toaster />
        </GestureHandlerRootView>
      </ThemeProvider>
    </Suspense>
  );
}

"use client";

import "@/global.css";

import ThemeProvider from "@/components/ui/theme-provider";
import { AsyncFont } from "@/components/data/async-font";
import { SplashScreen } from "expo-router";
import { Suspense, useEffect } from "react";
import { Toaster } from "@/utils/toast";
import { GestureHandlerRootView } from "@/utils/native-gesture-provider";
import { SourceCodePro_400Regular } from "@expo-google-fonts/source-code-pro";
import { TabList, TabTrigger } from "expo-router/ui";

import {
  TabBarControllerTabs,
  TabBarControllerSidebar,
  TabBarControllerHeader,
  TabBarControllerTitle,
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
          <TabBarControllerTabs>
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
                  <TabBarControllerGroupLabel>Favorites</TabBarControllerGroupLabel>
                  <TabBarControllerGroupContent>
                    <TabBarControllerMenu>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="star.fill"
                        >
                          Starred
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="heart.fill"
                        >
                          Liked
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="bookmark.fill"
                        >
                          Bookmarks
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                    </TabBarControllerMenu>
                  </TabBarControllerGroupContent>
                </TabBarControllerGroup>

                <TabBarControllerGroup>
                  <TabBarControllerGroupLabel>Settings</TabBarControllerGroupLabel>
                  <TabBarControllerGroupContent>
                    <TabBarControllerMenu>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="gearshape.fill"
                        >
                          Preferences
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="person.fill"
                        >
                          Account
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                      <TabBarControllerMenuItem>
                        <TabBarControllerLink
                          href="/(index)"
                          name="index"
                          icon="bell.fill"
                        >
                          Notifications
                        </TabBarControllerLink>
                      </TabBarControllerMenuItem>
                    </TabBarControllerMenu>
                  </TabBarControllerGroupContent>
                </TabBarControllerGroup>
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

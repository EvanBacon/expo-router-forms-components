"use client";

import {
  TabBarControllerProvider,
  TabBarControllerSidebar,
  TabBarControllerHeader,
  TabBarControllerTitle,
  TabBarControllerEditTrigger,
  TabBarControllerContent,
  TabBarControllerMenu,
  TabBarControllerMenuItem,
  TabBarControllerMenuButton,
  TabBarControllerGroup,
  TabBarControllerGroupLabel,
  TabBarControllerGroupContent,
  TabBarControllerInset,
  TabBarControllerFloatingBar,
  TabBarControllerPanel,
} from "@/components/ui/tab-bar-controller.web";

export default function TabBarDemo() {
  return (
    <TabBarControllerProvider defaultValue="third">
      <TabBarControllerSidebar>
        <TabBarControllerHeader>
          <TabBarControllerTitle>Tabs</TabBarControllerTitle>
          <TabBarControllerEditTrigger />
        </TabBarControllerHeader>

        <TabBarControllerContent>
          <TabBarControllerMenu>
            <TabBarControllerMenuItem>
              <TabBarControllerMenuButton value="first" icon="1.square" pinned>
                First
              </TabBarControllerMenuButton>
            </TabBarControllerMenuItem>
            <TabBarControllerMenuItem>
              <TabBarControllerMenuButton value="second" icon="2.square" pinned>
                Second
              </TabBarControllerMenuButton>
            </TabBarControllerMenuItem>
            <TabBarControllerMenuItem>
              <TabBarControllerMenuButton value="third" icon="3.square" pinned>
                Third
              </TabBarControllerMenuButton>
            </TabBarControllerMenuItem>
            <TabBarControllerMenuItem>
              <TabBarControllerMenuButton value="favorites" icon="heart.fill" pinned>
                Favorites
              </TabBarControllerMenuButton>
            </TabBarControllerMenuItem>
            <TabBarControllerMenuItem>
              <TabBarControllerMenuButton value="search" icon="magnifyingglass">
                Search
              </TabBarControllerMenuButton>
            </TabBarControllerMenuItem>
          </TabBarControllerMenu>

          <TabBarControllerGroup>
            <TabBarControllerGroupLabel>Section 1</TabBarControllerGroupLabel>
            <TabBarControllerGroupContent>
              <TabBarControllerMenu>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-a" icon="doc">
                    Subitem A
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-b" icon="folder.fill">
                    Subitem B
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-c" icon="star">
                    Subitem C
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-d" icon="bookmark">
                    Subitem D
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
              </TabBarControllerMenu>
            </TabBarControllerGroupContent>
          </TabBarControllerGroup>

          <TabBarControllerGroup>
            <TabBarControllerGroupLabel>Section 2</TabBarControllerGroupLabel>
            <TabBarControllerGroupContent>
              <TabBarControllerMenu>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-e" icon="gearshape">
                    Subitem E
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
                <TabBarControllerMenuItem>
                  <TabBarControllerMenuButton value="subitem-f" icon="info.circle">
                    Subitem F
                  </TabBarControllerMenuButton>
                </TabBarControllerMenuItem>
              </TabBarControllerMenu>
            </TabBarControllerGroupContent>
          </TabBarControllerGroup>
        </TabBarControllerContent>
      </TabBarControllerSidebar>

      <TabBarControllerInset>
        <TabBarControllerFloatingBar />

        <TabBarControllerPanel value="first">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">First Tab</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">This is the content for the first tab.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="second">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Second Tab</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">This is the content for the second tab.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="third">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Third Tab</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">This is the content for the third tab.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="favorites">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Favorites</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Your favorite items will appear here.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="search">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Search</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Search for items here.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-a">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem A</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem A.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-b">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem B</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem B.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-c">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem C</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem C.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-d">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem D</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem D.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-e">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem E</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem E.</p>
          </div>
        </TabBarControllerPanel>

        <TabBarControllerPanel value="subitem-f">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[var(--sf-text)]">Subitem F</h1>
            <p className="mt-2 text-[var(--sf-text-2)]">Content for Subitem F.</p>
          </div>
        </TabBarControllerPanel>
      </TabBarControllerInset>
    </TabBarControllerProvider>
  );
}

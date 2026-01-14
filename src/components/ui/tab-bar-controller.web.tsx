"use client";

import * as React from "react";
import {
  Tabs as RouterTabs,
  TabList,
  TabTrigger,
  TabSlot,
} from "expo-router/ui";

import { cn } from "@/lib/utils";
import { IconSymbol, IconSymbolName } from "./icon-symbol";

/* ----------------------------------------------------------------------------------
 * Context
 * ----------------------------------------------------------------------------------*/

interface TabBarItem {
  value: string;
  label: React.ReactNode;
  icon?: IconSymbolName;
  pinned: boolean;
  order: number;
  /** Route href for Expo Router navigation */
  href?: React.ComponentProps<typeof TabTrigger>["href"];
}

type TabBarControllerContextProps = {
  value: string;
  setValue: (value: string) => void;
  isEditMode: boolean;
  setIsEditMode: (editing: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  items: Map<string, TabBarItem>;
  registerItem: (item: Omit<TabBarItem, "order">) => void;
  unregisterItem: (value: string) => void;
  togglePin: (value: string) => void;
  pinnedItems: TabBarItem[];
  /** Whether the controller is being used with Expo Router */
  isRouterMode: boolean;
};

const TabBarControllerContext =
  React.createContext<TabBarControllerContextProps | null>(null);

function useTabBarController() {
  const context = React.useContext(TabBarControllerContext);
  if (!context) {
    throw new Error(
      "useTabBarController must be used within a TabBarControllerProvider."
    );
  }
  return context;
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerProvider
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerProviderProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultSidebarOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** @internal Used by TabBarControllerTabs to indicate router mode */
  isRouterMode?: boolean;
}

function TabBarControllerProvider({
  defaultValue = "",
  value: valueProp,
  onValueChange,
  defaultSidebarOpen = false,
  children,
  className,
  style,
  isRouterMode = false,
}: TabBarControllerProviderProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(defaultSidebarOpen);
  const [items, setItems] = React.useState<Map<string, TabBarItem>>(new Map());
  const orderRef = React.useRef(0);

  const [_value, _setValue] = React.useState(defaultValue);
  const value = valueProp ?? _value;
  const setValue = React.useCallback(
    (newValue: string) => {
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        _setValue(newValue);
      }
    },
    [onValueChange]
  );

  const registerItem = React.useCallback((item: Omit<TabBarItem, "order">) => {
    setItems((prev) => {
      const newMap = new Map(prev);
      if (!newMap.has(item.value)) {
        newMap.set(item.value, { ...item, order: orderRef.current++ });
      }
      return newMap;
    });
  }, []);

  const unregisterItem = React.useCallback((itemValue: string) => {
    setItems((prev) => {
      const newMap = new Map(prev);
      newMap.delete(itemValue);
      return newMap;
    });
  }, []);

  const togglePin = React.useCallback((itemValue: string) => {
    setItems((prev) => {
      const newMap = new Map(prev);
      const item = newMap.get(itemValue);
      if (item) {
        newMap.set(itemValue, { ...item, pinned: !item.pinned });
      }
      return newMap;
    });
  }, []);

  const pinnedItems = React.useMemo(() => {
    return Array.from(items.values())
      .filter((item) => item.pinned)
      .sort((a, b) => a.order - b.order);
  }, [items]);

  const contextValue = React.useMemo<TabBarControllerContextProps>(
    () => ({
      value,
      setValue,
      isEditMode,
      setIsEditMode,
      isSidebarOpen,
      setIsSidebarOpen,
      items,
      registerItem,
      unregisterItem,
      togglePin,
      pinnedItems,
      isRouterMode,
    }),
    [
      value,
      setValue,
      isEditMode,
      setIsEditMode,
      isSidebarOpen,
      setIsSidebarOpen,
      items,
      registerItem,
      unregisterItem,
      togglePin,
      pinnedItems,
      isRouterMode,
    ]
  );

  return (
    <TabBarControllerContext.Provider value={contextValue}>
      <div
        data-slot="tabbar-wrapper"
        data-editing={isEditMode}
        data-sidebar-open={isSidebarOpen}
        style={style}
        className={cn("flex min-h-svh w-full", className)}
      >
        {children}
      </div>
    </TabBarControllerContext.Provider>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerSidebar
 * ----------------------------------------------------------------------------------*/

function TabBarControllerSidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isSidebarOpen } = useTabBarController();

  return (
    <div
      data-slot="tabbar-sidebar-wrapper"
      className={cn(
        "flex overflow-hidden p-3",
        "transition-all duration-300 ease-out",
        isSidebarOpen ? "w-74 min-w-74" : "w-0 min-w-0 p-0"
      )}
    >
      <div
        data-slot="tabbar-sidebar"
        data-open={isSidebarOpen}
        className={cn(
          "flex h-full w-72 flex-col overflow-hidden rounded-2xl",
          "bg-(--sf-grouped-bg-2)/80 backdrop-blur-xl",
          "shadow-xl shadow-black/15",
          "transition-all duration-300 ease-out",
          isSidebarOpen
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-95 blur-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerSidebarTrigger
 * ----------------------------------------------------------------------------------*/

function TabBarControllerSidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isSidebarOpen, setIsSidebarOpen } = useTabBarController();

  return (
    <button
      data-slot="tabbar-sidebar-trigger"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md",
        "text-(--sf-text-2) hover:bg-(--sf-fill)",
        "transition-colors",
        className
      )}
      {...props}
    >
      <IconSymbol name="line.3.horizontal" size={18} color="currentColor" />
    </button>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerHeader
 * ----------------------------------------------------------------------------------*/

function TabBarControllerHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { setIsSidebarOpen } = useTabBarController();

  return (
    <div
      data-slot="tabbar-header"
      className={cn(
        "flex shrink-0 flex-row items-center justify-between px-4 py-3",
        className
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-3">{children}</div>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-(--sf-text-2) hover:bg-(--sf-fill) transition-colors"
      >
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={18}
          color="currentColor"
        />
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerTitle
 * ----------------------------------------------------------------------------------*/

function TabBarControllerTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabbar-title"
      className={cn("text-sm font-medium text-(--sf-text-2)", className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerEditTrigger
 * ----------------------------------------------------------------------------------*/

function TabBarControllerEditTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { isEditMode, setIsEditMode } = useTabBarController();

  return (
    <button
      data-slot="tabbar-edit-trigger"
      onClick={() => setIsEditMode(!isEditMode)}
      className={cn(
        "text-sm text-(--sf-link)",
        "hover:opacity-70 transition-opacity",
        className
      )}
      {...props}
    >
      {isEditMode ? "Done" : "Edit"}
    </button>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerContent
 * ----------------------------------------------------------------------------------*/

function TabBarControllerContent({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { isEditMode } = useTabBarController();
  const [isScrolled, setIsScrolled] = React.useState(false);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 4);
  }, []);

  return (
    <div
      data-slot="tabbar-content"
      data-editing={isEditMode}
      data-scrolled={isScrolled}
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden px-2 pb-2",
        className
      )}
      style={{
        maskImage: isScrolled
          ? "linear-gradient(to bottom, transparent 0%, black 10px, black 100%)"
          : undefined,
        WebkitMaskImage: isScrolled
          ? "linear-gradient(to bottom, transparent 0%, black 10px, black 100%)"
          : undefined,
        scrollbarWidth: "thin",
        scrollbarColor: "var(--color-sf-gray-2) transparent",
        ...style,
      }}
      onScroll={handleScroll}
      {...props}
    >
      {isEditMode && (
        <p className="px-2 py-2 text-xs text-(--sf-text-3)">
          Drag to customize items in the sidebar or tab bar.
        </p>
      )}
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerMenu
 * ----------------------------------------------------------------------------------*/

function TabBarControllerMenu({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="tabbar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerMenuItem
 * ----------------------------------------------------------------------------------*/

function TabBarControllerMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="tabbar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    >
      {children}
    </li>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerMenuButton
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerMenuButtonProps
  extends Omit<React.ComponentProps<"button">, "value"> {
  value: string;
  icon?: IconSymbolName;
  pinned?: boolean;
}

function TabBarControllerMenuButton({
  value: itemValue,
  icon,
  pinned = false,
  className,
  children,
  ...props
}: TabBarControllerMenuButtonProps) {
  const {
    value,
    setValue,
    isEditMode,
    registerItem,
    unregisterItem,
    togglePin,
    items,
  } = useTabBarController();

  const isActive = value === itemValue;
  const item = items.get(itemValue);
  const isPinned = item?.pinned ?? pinned;

  React.useEffect(() => {
    registerItem({
      value: itemValue,
      label: children,
      icon,
      pinned,
    });
    return () => unregisterItem(itemValue);
  }, [itemValue, icon, pinned, registerItem, unregisterItem]);

  const handleClick = () => {
    if (isEditMode) {
      togglePin(itemValue);
    } else {
      setValue(itemValue);
    }
  };

  return (
    <button
      data-slot="tabbar-menu-button"
      data-active={isActive}
      data-pinned={isPinned}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-sm",
        "transition-colors duration-150",
        "hover:bg-(--sf-fill)",
        "data-[active=true]:bg-(--sf-fill-2)",
        className
      )}
      {...props}
    >
      {isEditMode && (
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            "border-2 transition-colors",
            isPinned
              ? "border-(--sf-blue) bg-(--sf-blue)"
              : "border-(--sf-text-3) bg-transparent"
          )}
        >
          {isPinned && <IconSymbol name="checkmark" size={12} color="white" />}
        </span>
      )}
      {icon && <IconSymbol name={icon} size={20} color="var(--sf-text)" />}
      <span
        className={cn(
          "flex-1 truncate text-(--sf-text)",
          isActive && "font-medium"
        )}
      >
        {children}
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerGroup
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerGroupProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
}

const GroupContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

function TabBarControllerGroup({
  defaultOpen = true,
  className,
  children,
  ...props
}: TabBarControllerGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <GroupContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        data-slot="tabbar-group"
        data-state={isOpen ? "open" : "closed"}
        className={cn("relative flex w-full min-w-0 flex-col", className)}
        {...props}
      >
        {children}
        {/* Border that shows when closed */}
        <div
          className={cn(
            "mx-2 my-1 border-b border-(--sf-border)",
            "transition-opacity duration-200",
            isOpen ? "opacity-0" : "opacity-100"
          )}
        />
      </div>
    </GroupContext.Provider>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerGroupLabel
 * ----------------------------------------------------------------------------------*/

function TabBarControllerGroupLabel({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const groupContext = React.useContext(GroupContext);
  if (!groupContext) {
    throw new Error(
      "TabBarControllerGroupLabel must be used within TabBarControllerGroup"
    );
  }

  const { isOpen, setIsOpen } = groupContext;

  return (
    <button
      data-slot="tabbar-group-label"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-11 w-full shrink-0 items-center justify-between gap-2 rounded-full px-2",
        "text-sm text-(--sf-text-2)",
        "hover:bg-(--sf-fill) transition-colors",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        className={cn(
          "transition-transform duration-200",
          isOpen ? "rotate-90" : "rotate-0"
        )}
      >
        <IconSymbol name="chevron.right" size={18} color="var(--sf-text-3)" />
      </span>
    </button>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerGroupContent
 * ----------------------------------------------------------------------------------*/

function TabBarControllerGroupContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const groupContext = React.useContext(GroupContext);
  if (!groupContext) {
    throw new Error(
      "TabBarControllerGroupContent must be used within TabBarControllerGroup"
    );
  }

  const { isOpen } = groupContext;
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      data-slot="tabbar-group-content"
      className={cn(
        "overflow-hidden transition-all duration-200 ease-out",
        className
      )}
      style={{ height: isOpen ? height : 0 }}
      {...props}
    >
      <div ref={contentRef} className="pl-4">
        {children}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerInset
 * ----------------------------------------------------------------------------------*/

function TabBarControllerInset({
  className,
  children,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="tabbar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col",
        "bg-(--sf-grouped-bg)",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerFloatingBar
 * ----------------------------------------------------------------------------------*/

function TabBarControllerFloatingBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { pinnedItems, value, setValue, isSidebarOpen, setIsSidebarOpen } =
    useTabBarController();

  return (
    <div
      data-slot="tabbar-floating-bar"
      className={cn(
        "absolute left-1/2 top-4 z-10 -translate-x-1/2",
        "flex flex-row items-center gap-0.5",
        "rounded-full px-1 py-1",
        "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
        "shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        isSidebarOpen
          ? "opacity-0 scale-95 blur-md pointer-events-none"
          : "opacity-100 scale-100 blur-0",
        className
      )}
      {...props}
    >
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "text-(--sf-text-2) hover:bg-(--sf-fill)",
          "transition-colors"
        )}
      >
        <IconSymbol name="line.3.horizontal" size={18} color="currentColor" />
      </button>

      {pinnedItems.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            data-active={isActive}
            onClick={() => setValue(item.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5",
              "text-sm transition-colors",
              isActive
                ? "bg-(--sf-fill) text-(--sf-text) font-medium"
                : "text-(--sf-text-2) hover:bg-(--sf-fill)"
            )}
          >
            {item.icon && (
              <IconSymbol
                name={item.icon}
                size={16}
                color={isActive ? "var(--sf-text)" : "var(--sf-text-2)"}
              />
            )}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerPanel
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerPanelProps extends React.ComponentProps<"div"> {
  value: string;
}

function TabBarControllerPanel({
  value: panelValue,
  className,
  children,
  ...props
}: TabBarControllerPanelProps) {
  const { value } = useTabBarController();

  if (value !== panelValue) {
    return null;
  }

  return (
    <div
      data-slot="tabbar-panel"
      className={cn("flex-1 pt-16", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerTabs (Expo Router Integration)
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerTabsProps
  extends Omit<TabBarControllerProviderProps, "isRouterMode"> {
  children: React.ReactNode;
}

/**
 * Expo Router-integrated tab bar controller.
 * Use this as a layout component to get routing support.
 *
 * @example
 * ```tsx
 * // app/(tabs)/_layout.tsx
 * export default function Layout() {
 *   return (
 *     <TabBarControllerTabs defaultSidebarOpen>
 *       <TabBarControllerSidebar>
 *         <TabBarControllerHeader>
 *           <TabBarControllerTitle>Tabs</TabBarControllerTitle>
 *         </TabBarControllerHeader>
 *         <TabBarControllerContent>
 *           <TabBarControllerMenu>
 *             <TabBarControllerMenuItem>
 *               <TabBarControllerMenuButton href="/home" name="home" icon="house.fill" pinned>
 *                 Home
 *               </TabBarControllerMenuButton>
 *             </TabBarControllerMenuItem>
 *           </TabBarControllerMenu>
 *         </TabBarControllerContent>
 *       </TabBarControllerSidebar>
 *       <TabBarControllerInset>
 *         <TabBarControllerFloatingBar />
 *         <TabBarControllerSlot />
 *       </TabBarControllerInset>
 *     </TabBarControllerTabs>
 *   );
 * }
 * ```
 */
function TabBarControllerTabs({
  children,
  defaultSidebarOpen,
  className,
  style,
}: TabBarControllerTabsProps) {
  return (
    <TabBarControllerProvider
        defaultSidebarOpen={defaultSidebarOpen}
        className={className}
        style={style}
        isRouterMode
      >
    <RouterTabs style={{ display: "contents" }}>
        {children}
    </RouterTabs>
      </TabBarControllerProvider>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerSlot (Expo Router Integration)
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerSlotProps {
  className?: string;
}

/**
 * Renders the currently active tab route when using Expo Router.
 * Use this instead of TabBarControllerPanel when in router mode.
 */
function TabBarControllerSlot({ className }: TabBarControllerSlotProps) {
  return (
    <div data-slot="tabbar-slot" className={cn("flex-1 pt-16", className)}>
      <TabSlot />
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerLink (Expo Router Integration)
 * ----------------------------------------------------------------------------------*/

interface TabBarControllerLinkProps
  extends Omit<React.ComponentProps<"button">, "value"> {
  /** Route href for Expo Router navigation */
  href: React.ComponentProps<typeof TabTrigger>["href"];
  /** Tab name for Expo Router (usually matches the route segment) */
  name: string;
  icon?: IconSymbolName;
  pinned?: boolean;
}

/**
 * A menu button that integrates with Expo Router for navigation.
 * Use this instead of TabBarControllerMenuButton when in router mode.
 */
function TabBarControllerLink({
  href,
  name,
  icon,
  pinned = false,
  className,
  children,
  ...props
}: TabBarControllerLinkProps) {
  const { isEditMode, registerItem, unregisterItem, togglePin, items } =
    useTabBarController();

  const item = items.get(name);
  const isPinned = item?.pinned ?? pinned;

  React.useEffect(() => {
    registerItem({
      value: name,
      label: children,
      icon,
      pinned,
      href,
    });
    return () => unregisterItem(name);
  }, [name, icon, pinned, href, registerItem, unregisterItem, children]);

  const handleEditClick = () => {
    togglePin(name);
  };

  if (isEditMode) {
    return (
      <button
        data-slot="tabbar-menu-button"
        data-pinned={isPinned}
        onClick={handleEditClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-sm",
          "transition-colors duration-150",
          "hover:bg-(--sf-fill)",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            "border-2 transition-colors",
            isPinned
              ? "border-(--sf-blue) bg-(--sf-blue)"
              : "border-(--sf-text-3) bg-transparent"
          )}
        >
          {isPinned && <IconSymbol name="checkmark" size={12} color="white" />}
        </span>
        {icon && <IconSymbol name={icon} size={20} color="var(--sf-text)" />}
        <span className="flex-1 truncate text-(--sf-text)">{children}</span>
      </button>
    );
  }

  return (
    <TabTrigger name={name} href={href} asChild>
      <button
        data-slot="tabbar-menu-button"
        data-pinned={isPinned}
        className={cn(
          "flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-sm",
          "transition-colors duration-150",
          "hover:bg-(--sf-fill)",
          "data-[active=true]:bg-(--sf-fill-2)",
          className
        )}
        {...props}
      >
        {icon && <IconSymbol name={icon} size={20} color="var(--sf-text)" />}
        <span className="flex-1 truncate text-(--sf-text)">{children}</span>
      </button>
    </TabTrigger>
  );
}

/* ----------------------------------------------------------------------------------
 * TabBarControllerRouterFloatingBar (Expo Router Integration)
 * ----------------------------------------------------------------------------------*/

/**
 * A floating bar that integrates with Expo Router for navigation.
 * Use this instead of TabBarControllerFloatingBar when in router mode.
 */
function TabBarControllerRouterFloatingBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { pinnedItems, isSidebarOpen, setIsSidebarOpen } =
    useTabBarController();

  return (
    <div
      data-slot="tabbar-floating-bar"
      className={cn(
        "absolute left-1/2 top-4 z-10 -translate-x-1/2",
        "flex flex-row items-center gap-0.5",
        "rounded-full px-1 py-1",
        "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
        "shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        isSidebarOpen
          ? "opacity-0 scale-95 blur-md pointer-events-none"
          : "opacity-100 scale-100 blur-0",
        className
      )}
      {...props}
    >
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "text-(--sf-text-2) hover:bg-(--sf-fill)",
          "transition-colors"
        )}
      >
        <IconSymbol name="line.3.horizontal" size={18} color="currentColor" />
      </button>

      {pinnedItems.map((item) => (
        <TabTrigger
          key={item.value}
          name={item.value}
          href={item.href}
          asChild
        >
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5",
              "text-sm transition-colors",
              "data-[active=true]:bg-(--sf-fill) data-[active=true]:font-medium",
              "text-(--sf-text-2) hover:bg-(--sf-fill)"
            )}
          >
            {item.icon && (
              <IconSymbol name={item.icon} size={16} color="currentColor" />
            )}
            <span>{item.label}</span>
          </button>
        </TabTrigger>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
 * Exports
 * ----------------------------------------------------------------------------------*/

export {
  // Standalone components
  TabBarControllerProvider,
  TabBarControllerSidebar,
  TabBarControllerSidebarTrigger,
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
  useTabBarController,
  // Expo Router integration
  TabBarControllerTabs,
  TabBarControllerSlot,
  TabBarControllerLink,
  TabBarControllerRouterFloatingBar,
};

export type {
  TabBarItem,
  TabBarControllerMenuButtonProps,
  TabBarControllerLinkProps,
};

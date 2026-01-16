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
  const { isSidebarOpen, setIsSidebarOpen } = useTabBarController();

  return (
    <>
      {/* Backdrop for medium screens - click to dismiss */}
      <div
        data-slot="tabbar-sidebar-backdrop"
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/30",
          "transition-opacity duration-300 ease-out",
          "lg:hidden", // Only show on medium and smaller screens
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar wrapper */}
      <div
        data-slot="tabbar-sidebar-wrapper"
        className={cn(
          "p-3",
          // Large screens: inline, pushes content
          "lg:flex lg:overflow-hidden",
          "lg:transition-[width,min-width,padding] lg:duration-300 lg:ease-out",
          isSidebarOpen ? "lg:w-74 lg:min-w-74" : "lg:w-0 lg:min-w-0 lg:p-0",
          // Medium screens: fixed overlay
          "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:bottom-0 max-lg:z-50",
          "max-lg:transition-transform max-lg:duration-300 max-lg:ease-out",
          isSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
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
    </>
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
      <svg
        width="18"
        height="18"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.52758 32H30.4724C33.5005 32 35 30.4764 35 27.4585V9.57082C35 6.55291 33.5005 5.0293 30.4724 5.0293H5.52758C2.514 5.0293 1 6.53825 1 9.57082V27.4585C1 30.4911 2.514 32 5.52758 32ZM5.55642 29.6414C4.11452 29.6414 3.32147 28.8649 3.32147 27.3414V9.68802C3.32147 8.16442 4.11452 7.38796 5.55642 7.38796H30.4436C31.8711 7.38796 32.6786 8.16442 32.6786 9.68802V27.3414C32.6786 28.8649 31.8711 29.6414 30.4436 29.6414H5.55642ZM11.9873 30.0955H14.2511V6.94846H11.9873V30.0955ZM9.21885 12.8231C9.65142 12.8231 10.0407 12.4276 10.0407 12.0027C10.0407 11.5632 9.65142 11.1823 9.21885 11.1823H6.11876C5.68619 11.1823 5.31129 11.5632 5.31129 12.0027C5.31129 12.4276 5.68619 12.8231 6.11876 12.8231H9.21885ZM9.21885 16.6175C9.65142 16.6175 10.0407 16.2219 10.0407 15.7824C10.0407 15.3429 9.65142 14.9767 9.21885 14.9767H6.11876C5.68619 14.9767 5.31129 15.3429 5.31129 15.7824C5.31129 16.2219 5.68619 16.6175 6.11876 16.6175H9.21885ZM9.21885 20.3973C9.65142 20.3973 10.0407 20.0309 10.0407 19.5915C10.0407 19.152 9.65142 18.7711 9.21885 18.7711H6.11876C5.68619 18.7711 5.31129 19.152 5.31129 19.5915C5.31129 20.0309 5.68619 20.3973 6.11876 20.3973H9.21885Z"
          fill="currentColor"
        />
      </svg>
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.4724 5H5.52756C2.49954 5 0.999999 6.5105 0.999999 9.53181V27.4536C0.999999 30.4747 2.49954 32 5.52756 32H30.4724C33.486 32 35 30.4747 35 27.4536V9.53181C35 6.5105 33.486 5 30.4724 5ZM30.4436 7.36127C31.8855 7.36127 32.6785 8.13845 32.6785 9.66382V27.3216C32.6785 28.8468 31.8855 29.6388 30.4436 29.6388H5.55636C4.12887 29.6388 3.32137 28.8468 3.32137 27.3216V9.66382C3.32137 8.13845 4.12887 7.36127 5.55636 7.36127H30.4436Z"
            fill="currentColor"
          />
          <rect x="7" y="10" width="22" height="4" rx="2" fill="currentColor" />
        </svg>
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
        "text-sm text-sf-text",
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
  style,
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
      style={{
        // Provide CSS custom property for header inset that scroll views can use
        // This enables contentInsetAdjustmentBehavior-like behavior on web
        "--header-inset": "4rem",
        ...style,
      } as React.CSSProperties}
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
        "absolute top-4 z-10",
        "flex flex-row items-center gap-0.5",
        "rounded-full px-1 py-1",
        "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
        "shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        isSidebarOpen
          ? "left-44 translate-x-0 opacity-0 scale-95 blur-md pointer-events-none"
          : "left-1/2 -translate-x-1/2 opacity-100 scale-100 blur-0",
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.52758 32H30.4724C33.5005 32 35 30.4764 35 27.4585V9.57082C35 6.55291 33.5005 5.0293 30.4724 5.0293H5.52758C2.514 5.0293 1 6.53825 1 9.57082V27.4585C1 30.4911 2.514 32 5.52758 32ZM5.55642 29.6414C4.11452 29.6414 3.32147 28.8649 3.32147 27.3414V9.68802C3.32147 8.16442 4.11452 7.38796 5.55642 7.38796H30.4436C31.8711 7.38796 32.6786 8.16442 32.6786 9.68802V27.3414C32.6786 28.8649 31.8711 29.6414 30.4436 29.6414H5.55642ZM11.9873 30.0955H14.2511V6.94846H11.9873V30.0955ZM9.21885 12.8231C9.65142 12.8231 10.0407 12.4276 10.0407 12.0027C10.0407 11.5632 9.65142 11.1823 9.21885 11.1823H6.11876C5.68619 11.1823 5.31129 11.5632 5.31129 12.0027C5.31129 12.4276 5.68619 12.8231 6.11876 12.8231H9.21885ZM9.21885 16.6175C9.65142 16.6175 10.0407 16.2219 10.0407 15.7824C10.0407 15.3429 9.65142 14.9767 9.21885 14.9767H6.11876C5.68619 14.9767 5.31129 15.3429 5.31129 15.7824C5.31129 16.2219 5.68619 16.6175 6.11876 16.6175H9.21885ZM9.21885 20.3973C9.65142 20.3973 10.0407 20.0309 10.0407 19.5915C10.0407 19.152 9.65142 18.7711 9.21885 18.7711H6.11876C5.68619 18.7711 5.31129 19.152 5.31129 19.5915C5.31129 20.0309 5.68619 20.3973 6.11876 20.3973H9.21885Z"
            fill="currentColor"
          />
        </svg>
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
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(
    defaultSidebarOpen ?? false
  );
  const [items, setItems] = React.useState<Map<string, TabBarItem>>(new Map());
  const orderRef = React.useRef(0);
  const [_value, _setValue] = React.useState("");

  const setValue = React.useCallback((newValue: string) => {
    _setValue(newValue);
  }, []);

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
      value: _value,
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
      isRouterMode: true,
    }),
    [
      _value,
      setValue,
      isEditMode,
      isSidebarOpen,
      items,
      registerItem,
      unregisterItem,
      togglePin,
      pinnedItems,
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
        <RouterTabs
          style={{
            display: "contents",
          }}
        >
          {children}
        </RouterTabs>
      </div>
    </TabBarControllerContext.Provider>
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
    <div
      data-slot="tabbar-slot"
      className={cn("flex flex-1 flex-col", className)}
    >
      <TabSlot style={{ flex: 1 }} />
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
      <TabBarLinkButton
        icon={icon}
        isPinned={isPinned}
        className={className}
        {...props}
      >
        {children}
      </TabBarLinkButton>
    </TabTrigger>
  );
}

/** Button that receives isFocused from TabTrigger asChild */
function TabBarLinkButton({
  icon,
  isPinned,
  className,
  children,
  isFocused,
  onPress,
  ...props
}: {
  icon?: IconSymbolName;
  isPinned: boolean;
  isFocused?: boolean;
  onPress?: () => void;
} & React.ComponentProps<"button">) {
  return (
    <button
      data-slot="tabbar-menu-button"
      data-pinned={isPinned}
      data-active={isFocused}
      className={cn(
        "flex w-full items-center gap-3 rounded-full px-2 py-2 text-left text-sm",
        "transition-colors duration-150",
        "hover:bg-(--sf-fill)",
        isFocused && "bg-(--sf-fill-2)",
        className
      )}
      onClick={onPress}
      {...props}
    >
      {icon && <IconSymbol name={icon} size={20} color="var(--sf-text)" />}
      <span
        className={cn(
          "flex-1 truncate text-(--sf-text)",
          isFocused && "font-medium"
        )}
      >
        {children}
      </span>
    </button>
  );
}

/** Floating bar button that receives isFocused from TabTrigger asChild */
function FloatingBarButton({
  icon,
  label,
  isFocused,
  onPress,
  ...props
}: {
  icon?: IconSymbolName;
  label: React.ReactNode;
  isFocused?: boolean;
  onPress?: () => void;
} & React.ComponentProps<"button">) {
  return (
    <button
      data-active={isFocused}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-sm transition-colors",
        isFocused
          ? "bg-(--sf-fill) text-(--sf-text) font-medium"
          : "text-(--sf-text-2) hover:bg-(--sf-fill)"
      )}
      onClick={onPress}
      {...props}
    >
      {icon && (
        <IconSymbol
          name={icon}
          size={16}
          color={isFocused ? "var(--sf-text)" : "var(--sf-text-2)"}
        />
      )}
      <span>{label}</span>
    </button>
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
        "absolute top-4 z-10",
        "flex flex-row items-center gap-0.5",
        "rounded-full px-1 py-1",
        "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
        "shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        isSidebarOpen
          ? "left-44 translate-x-0 opacity-0 scale-95 blur-md pointer-events-none"
          : "left-1/2 -translate-x-1/2 opacity-100 scale-100 blur-0",
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.52758 32H30.4724C33.5005 32 35 30.4764 35 27.4585V9.57082C35 6.55291 33.5005 5.0293 30.4724 5.0293H5.52758C2.514 5.0293 1 6.53825 1 9.57082V27.4585C1 30.4911 2.514 32 5.52758 32ZM5.55642 29.6414C4.11452 29.6414 3.32147 28.8649 3.32147 27.3414V9.68802C3.32147 8.16442 4.11452 7.38796 5.55642 7.38796H30.4436C31.8711 7.38796 32.6786 8.16442 32.6786 9.68802V27.3414C32.6786 28.8649 31.8711 29.6414 30.4436 29.6414H5.55642ZM11.9873 30.0955H14.2511V6.94846H11.9873V30.0955ZM9.21885 12.8231C9.65142 12.8231 10.0407 12.4276 10.0407 12.0027C10.0407 11.5632 9.65142 11.1823 9.21885 11.1823H6.11876C5.68619 11.1823 5.31129 11.5632 5.31129 12.0027C5.31129 12.4276 5.68619 12.8231 6.11876 12.8231H9.21885ZM9.21885 16.6175C9.65142 16.6175 10.0407 16.2219 10.0407 15.7824C10.0407 15.3429 9.65142 14.9767 9.21885 14.9767H6.11876C5.68619 14.9767 5.31129 15.3429 5.31129 15.7824C5.31129 16.2219 5.68619 16.6175 6.11876 16.6175H9.21885ZM9.21885 20.3973C9.65142 20.3973 10.0407 20.0309 10.0407 19.5915C10.0407 19.152 9.65142 18.7711 9.21885 18.7711H6.11876C5.68619 18.7711 5.31129 19.152 5.31129 19.5915C5.31129 20.0309 5.68619 20.3973 6.11876 20.3973H9.21885Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {pinnedItems.map((item) => (
        <TabTrigger key={item.value} name={item.value} href={item.href} asChild>
          <FloatingBarButton icon={item.icon} label={item.label} />
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

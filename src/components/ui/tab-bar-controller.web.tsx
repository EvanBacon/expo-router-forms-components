"use client";

import * as React from "react";

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
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultSidebarOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function TabBarControllerProvider({
  defaultValue,
  value: valueProp,
  onValueChange,
  defaultSidebarOpen = false,
  children,
  className,
  style,
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

  const registerItem = React.useCallback(
    (item: Omit<TabBarItem, "order">) => {
      setItems((prev) => {
        const newMap = new Map(prev);
        if (!newMap.has(item.value)) {
          newMap.set(item.value, { ...item, order: orderRef.current++ });
        }
        return newMap;
      });
    },
    []
  );

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
      {/* Backdrop overlay */}
      <div
        data-slot="tabbar-backdrop"
        onClick={() => setIsSidebarOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/20",
          "transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Floating sidebar panel */}
      <div
        data-slot="tabbar-sidebar"
        data-open={isSidebarOpen}
        className={cn(
          "fixed left-4 top-4 bottom-4 z-50 w-80",
          "flex flex-col overflow-hidden",
          "bg-[var(--sf-grouped-bg-2)] rounded-2xl",
          "shadow-2xl shadow-black/20",
          "transition-all duration-300 ease-out",
          isSidebarOpen
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-8 scale-95 pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
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
        "flex h-8 w-8 items-center justify-center rounded-full",
        "text-[var(--sf-text-2)] hover:bg-[var(--sf-fill)]",
        "transition-colors",
        className
      )}
      {...props}
    >
      <IconSymbol
        name="line.3.horizontal"
        size={18}
        color="currentColor"
      />
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
        "flex flex-row items-center gap-2 p-4",
        className
      )}
      {...props}
    >
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--sf-link)] hover:bg-[var(--sf-fill)] transition-colors"
      >
        <IconSymbol name="checkmark" size={20} color="currentColor" />
      </button>
      <div className="flex flex-1 flex-row items-center justify-between">
        {children}
      </div>
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
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="tabbar-title"
      className={cn(
        "flex-1 text-base font-semibold text-[var(--sf-text)]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
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
        "text-base font-normal text-[var(--sf-link)]",
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
  ...props
}: React.ComponentProps<"div">) {
  const { isEditMode } = useTabBarController();

  return (
    <div
      data-slot="tabbar-content"
      data-editing={isEditMode}
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2",
        className
      )}
      {...props}
    >
      {isEditMode && (
        <p className="px-2 py-1 text-xs text-[var(--sf-text-2)]">
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
        "flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm",
        "transition-colors duration-150",
        "hover:bg-[var(--sf-fill)]",
        "data-[active=true]:bg-[var(--sf-fill-2)]",
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
              ? "border-[var(--sf-blue)] bg-[var(--sf-blue)]"
              : "border-[var(--sf-text-3)] bg-transparent"
          )}
        >
          {isPinned && (
            <IconSymbol name="checkmark" size={12} color="white" />
          )}
        </span>
      )}
      {icon && (
        <IconSymbol
          name={icon}
          size={20}
          color={
            isActive ? "var(--sf-blue)" : "var(--sf-text-2)"
          }
        />
      )}
      <span
        className={cn(
          "flex-1 truncate",
          isActive
            ? "font-medium text-[var(--sf-text)]"
            : "text-[var(--sf-text)]"
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
        "flex h-8 w-full shrink-0 items-center gap-2 rounded-md px-2",
        "text-xs font-medium uppercase text-[var(--sf-text-2)]",
        "hover:bg-[var(--sf-fill)] transition-colors",
        className
      )}
      {...props}
    >
      <IconSymbol
        name={isOpen ? "chevron.down" : "chevron.right"}
        size={12}
        color="var(--sf-text-2)"
      />
      <span className="flex-1 text-left">{children}</span>
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-slot="tabbar-group-content"
      className={cn("w-full pl-2", className)}
      {...props}
    >
      {children}
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
        "bg-[var(--sf-grouped-bg)]",
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

  if (isSidebarOpen) {
    return null;
  }

  return (
    <div
      data-slot="tabbar-floating-bar"
      className={cn(
        "absolute left-1/2 top-4 z-10 -translate-x-1/2",
        "flex flex-row items-center gap-1",
        "rounded-full px-1.5 py-1.5",
        "bg-[var(--sf-grouped-bg-2)]/90 backdrop-blur-xl",
        "shadow-lg shadow-black/15",
        className
      )}
      {...props}
    >
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          "text-[var(--sf-text-2)] hover:bg-[var(--sf-fill)]",
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
              "flex items-center gap-2 rounded-full px-3 py-1.5",
              "text-sm transition-colors",
              isActive
                ? "bg-[var(--sf-fill)] text-[var(--sf-text)] font-medium"
                : "text-[var(--sf-text-2)] hover:bg-[var(--sf-fill)]"
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
 * Exports
 * ----------------------------------------------------------------------------------*/

export {
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
};

export type { TabBarItem, TabBarControllerMenuButtonProps };

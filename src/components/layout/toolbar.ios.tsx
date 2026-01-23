"use client";

import * as React from "react";
import { ActionSheetIOS, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { BlurView } from "@/tw/glass";
import { SFIcon } from "@/components/ui/sf-icon";

/* ----------------------------------------------------------------------------------
 * Toolbar Context
 * ----------------------------------------------------------------------------------*/

export type ToolbarPlacement = "top" | "bottom" | "relative";

interface ToolbarContextValue {
  placement: ToolbarPlacement;
}

const ToolbarContext = React.createContext<ToolbarContextValue | undefined>(undefined);

export function useToolbarContext() {
  const context = React.useContext(ToolbarContext);
  if (!context) {
    throw new Error("Toolbar components must be used within a Toolbar");
  }
  return context;
}

/* ----------------------------------------------------------------------------------
 * Menu Context (for collecting menu items)
 * ----------------------------------------------------------------------------------*/

interface MenuItemConfig {
  label: string;
  icon?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface MenuContextValue {
  registerItem: (item: MenuItemConfig) => () => void;
}

const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

/* ----------------------------------------------------------------------------------
 * Toolbar (Root)
 * ----------------------------------------------------------------------------------*/

export interface ToolbarProps {
  /** Toolbar placement - 'top' integrates with header, 'bottom' renders fixed bar, 'relative' for inline use */
  placement?: ToolbarPlacement;
  /** Toolbar content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function Toolbar({ placement = "bottom", children, className }: ToolbarProps) {
  const insets = useSafeAreaInsets();
  const contextValue = React.useMemo(() => ({ placement }), [placement]);

  const isFixed = placement === "bottom";
  const bottomPadding = isFixed ? Math.max(insets.bottom, 8) : 8;

  return (
    <ToolbarContext.Provider value={contextValue}>
      <View
        className={className}
        style={[
          styles.container,
          isFixed && styles.fixedBottom,
          { paddingBottom: bottomPadding },
        ]}
      >
        <BlurView
          intensity={80}
          tint="systemChromeMaterial"
          className="flex-row items-center gap-1 rounded-full px-1.5 py-1"
          style={styles.blurContainer}
        >
          {children}
        </BlurView>
      </View>
    </ToolbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  blurContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
});

/* ----------------------------------------------------------------------------------
 * Toolbar.Button
 * ----------------------------------------------------------------------------------*/

export interface ToolbarButtonProps {
  /** SF Symbol icon name */
  icon?: string;
  /** Button label */
  children?: React.ReactNode;
  /** Called when the button is pressed */
  onPress?: () => void;
  /** Whether the button appears pressed/active */
  active?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarButton({
  icon,
  children,
  onPress,
  active,
  disabled,
  className,
}: ToolbarButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={[
        "flex-row items-center gap-1.5 rounded-full px-3 h-10",
        active && "bg-sf-fill",
        disabled && "opacity-50",
        className,
      ].filter(Boolean).join(" ")}
    >
      {icon && (
        <SFIcon
          name={icon as any}
          className="text-sf-blue"
          size={20}
        />
      )}
      {children && (
        <Text className="text-sm font-medium text-sf-blue">
          {typeof children === "string" ? children : null}
        </Text>
      )}
    </Pressable>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Separator
 * ----------------------------------------------------------------------------------*/

export interface ToolbarSeparatorProps {
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarSeparator({ className }: ToolbarSeparatorProps) {
  return (
    <View className={["w-px h-5 bg-sf-border mx-1", className].filter(Boolean).join(" ")} />
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Link
 * ----------------------------------------------------------------------------------*/

export interface ToolbarLinkProps extends ToolbarButtonProps {
  /** The route to navigate to */
  href: string;
}

export function ToolbarLink({
  href,
  icon,
  children,
  active,
  disabled,
  className,
}: ToolbarLinkProps) {
  return (
    <Link href={href as any} asChild>
      <Pressable
        disabled={disabled}
        className={[
          "flex-row items-center gap-1.5 rounded-full px-3 h-10",
          active && "bg-sf-fill",
          disabled && "opacity-50",
          className,
        ].filter(Boolean).join(" ")}
      >
        {icon && (
          <SFIcon
            name={icon as any}
            className="text-sf-blue"
            size={20}
          />
        )}
        {children && (
          <Text className="text-sm font-medium text-sf-blue">
            {typeof children === "string" ? children : null}
          </Text>
        )}
      </Pressable>
    </Link>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Menu
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuProps {
  /** Menu trigger content */
  trigger?: React.ReactNode;
  /** SF Symbol icon for the trigger */
  icon?: string;
  /** Menu items */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenu({
  trigger,
  icon,
  children,
  className,
}: ToolbarMenuProps) {
  const itemsRef = React.useRef<MenuItemConfig[]>([]);

  const registerItem = React.useCallback((item: MenuItemConfig) => {
    itemsRef.current.push(item);
    return () => {
      const index = itemsRef.current.indexOf(item);
      if (index > -1) {
        itemsRef.current.splice(index, 1);
      }
    };
  }, []);

  const showMenu = () => {
    const items = itemsRef.current;
    const options = items.map((item) => item.label);
    const destructiveIndex = items.findIndex((item) => item.destructive);
    const disabledIndices = items
      .map((item, index) => (item.disabled ? index : -1))
      .filter((i) => i !== -1);

    // Add cancel button
    options.push("Cancel");
    const cancelButtonIndex = options.length - 1;

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex: destructiveIndex >= 0 ? destructiveIndex : undefined,
        disabledButtonIndices: disabledIndices,
      },
      (buttonIndex) => {
        if (buttonIndex !== cancelButtonIndex && items[buttonIndex]?.onSelect) {
          items[buttonIndex].onSelect?.();
        }
      }
    );
  };

  return (
    <MenuContext.Provider value={{ registerItem }}>
      {/* Render children to collect menu items */}
      <View style={{ display: "none" }}>{children}</View>

      <Pressable
        onPress={showMenu}
        className={[
          "flex-row items-center gap-1.5 rounded-full px-3 h-10",
          className,
        ].filter(Boolean).join(" ")}
      >
        {icon && (
          <SFIcon
            name={icon as any}
            className="text-sf-blue"
            size={20}
          />
        )}
        {trigger && (
          <Text className="text-sm font-medium text-sf-blue">
            {typeof trigger === "string" ? trigger : null}
          </Text>
        )}
      </Pressable>
    </MenuContext.Provider>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuItem
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuItemProps {
  /** SF Symbol icon name */
  icon?: string;
  /** Item label */
  children?: React.ReactNode;
  /** Called when the item is selected */
  onSelect?: () => void;
  /** Whether this is a destructive action (shows in red) */
  destructive?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuItem({
  icon,
  children,
  onSelect,
  destructive,
  disabled,
}: ToolbarMenuItemProps) {
  const context = React.useContext(MenuContext);

  React.useEffect(() => {
    if (!context) return;

    const label = typeof children === "string" ? children : "";
    return context.registerItem({
      label,
      icon,
      onSelect,
      destructive,
      disabled,
    });
  }, [context, children, icon, onSelect, destructive, disabled]);

  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuSeparator
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuSeparatorProps {
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuSeparator(_props: ToolbarMenuSeparatorProps) {
  // ActionSheetIOS doesn't support separators
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuLabel
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuLabelProps {
  /** Label text */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuLabel(_props: ToolbarMenuLabelProps) {
  // ActionSheetIOS doesn't support labels
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Group
 * ----------------------------------------------------------------------------------*/

export interface ToolbarGroupProps {
  /** Group content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarGroup({ children, className }: ToolbarGroupProps) {
  return (
    <View className={["flex-row items-center", className].filter(Boolean).join(" ")}>
      {children}
    </View>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.ToggleItem
 * ----------------------------------------------------------------------------------*/

export interface ToolbarToggleItemProps {
  /** Unique value for this toggle item */
  value: string;
  /** SF Symbol icon name */
  icon?: string;
  /** Button label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarToggleItem({
  icon,
  children,
  disabled,
  className,
}: ToolbarToggleItemProps) {
  return (
    <Pressable
      disabled={disabled}
      className={[
        "flex-row items-center gap-1.5 rounded-full px-3 h-10",
        disabled && "opacity-50",
        className,
      ].filter(Boolean).join(" ")}
    >
      {icon && (
        <SFIcon
          name={icon as any}
          className="text-sf-blue"
          size={20}
        />
      )}
      {children && (
        <Text className="text-sm font-medium text-sf-blue">
          {typeof children === "string" ? children : null}
        </Text>
      )}
    </Pressable>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuCheckboxItem
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuCheckboxItemProps {
  /** Whether the item is checked */
  checked?: boolean;
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Item label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuCheckboxItem({
  checked,
  onCheckedChange,
  children,
  disabled,
}: ToolbarMenuCheckboxItemProps) {
  const context = React.useContext(MenuContext);

  React.useEffect(() => {
    if (!context) return;

    const label = typeof children === "string" ? children : "";
    const displayLabel = checked ? `✓ ${label}` : label;

    return context.registerItem({
      label: displayLabel,
      onSelect: () => onCheckedChange?.(!checked),
      disabled,
    });
  }, [context, children, checked, onCheckedChange, disabled]);

  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuRadioGroup & RadioItem
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuRadioGroupProps {
  /** The selected value */
  value?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Radio items */
  children?: React.ReactNode;
}

const RadioGroupContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | undefined>(undefined);

export function ToolbarMenuRadioGroup({
  value,
  onValueChange,
  children,
}: ToolbarMenuRadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      {children}
    </RadioGroupContext.Provider>
  );
}

export interface ToolbarMenuRadioItemProps {
  /** The value of this radio item */
  value: string;
  /** Item label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuRadioItem({
  value,
  children,
  disabled,
}: ToolbarMenuRadioItemProps) {
  const menuContext = React.useContext(MenuContext);
  const radioContext = React.useContext(RadioGroupContext);

  React.useEffect(() => {
    if (!menuContext) return;

    const label = typeof children === "string" ? children : "";
    const isSelected = radioContext?.value === value;
    const displayLabel = isSelected ? `● ${label}` : `○ ${label}`;

    return menuContext.registerItem({
      label: displayLabel,
      onSelect: () => radioContext?.onValueChange?.(value),
      disabled,
    });
  }, [menuContext, radioContext, value, children, disabled]);

  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuSub (Submenu)
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuSubProps {
  /** Menu trigger content */
  trigger: React.ReactNode;
  /** SF Symbol icon for the trigger */
  icon?: string;
  /** Submenu items */
  children?: React.ReactNode;
  /** Whether the submenu is disabled */
  disabled?: boolean;
}

export function ToolbarMenuSub(_props: ToolbarMenuSubProps) {
  // ActionSheetIOS doesn't support submenus
  // Could implement as a separate ActionSheet triggered from parent
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Spacer
 * ----------------------------------------------------------------------------------*/

export interface ToolbarSpacerProps {
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarSpacer({ className }: ToolbarSpacerProps) {
  return <View className={["flex-1", className].filter(Boolean).join(" ")} />;
}

/* ----------------------------------------------------------------------------------
 * Attach sub-components to Toolbar
 * ----------------------------------------------------------------------------------*/

Toolbar.Button = ToolbarButton;
Toolbar.Separator = ToolbarSeparator;
Toolbar.Link = ToolbarLink;
Toolbar.Menu = ToolbarMenu;
Toolbar.MenuItem = ToolbarMenuItem;
Toolbar.MenuSeparator = ToolbarMenuSeparator;
Toolbar.MenuLabel = ToolbarMenuLabel;
Toolbar.MenuCheckboxItem = ToolbarMenuCheckboxItem;
Toolbar.MenuRadioGroup = ToolbarMenuRadioGroup;
Toolbar.MenuRadioItem = ToolbarMenuRadioItem;
Toolbar.MenuSub = ToolbarMenuSub;
Toolbar.Group = ToolbarGroup;
Toolbar.ToggleItem = ToolbarToggleItem;
Toolbar.Spacer = ToolbarSpacer;

/* ----------------------------------------------------------------------------------
 * Exports
 * ----------------------------------------------------------------------------------*/

export {
  useToolbarContext as useToolbar,
  ToolbarContext,
};

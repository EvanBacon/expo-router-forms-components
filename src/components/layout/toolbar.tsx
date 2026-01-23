"use client";

import * as React from "react";

/* ----------------------------------------------------------------------------------
 * Toolbar Context
 * ----------------------------------------------------------------------------------
 *
 * Context for managing toolbar state across the component tree.
 * On native, this is mostly a no-op since iOS uses native toolbar APIs.
 * Android and web implementations provide full rendering.
 */

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
 * Toolbar (Root)
 * ----------------------------------------------------------------------------------
 *
 * On native iOS, toolbars are rendered by the native stack navigator.
 * This component is a no-op on iOS but could render a bottom toolbar on Android.
 */

export interface ToolbarProps {
  /** Toolbar placement - 'top' integrates with header, 'bottom' renders fixed bar */
  placement?: ToolbarPlacement;
  /** Toolbar content */
  children?: React.ReactNode;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function Toolbar({ placement = "bottom", children }: ToolbarProps) {
  // On native iOS, toolbar is handled by the native stack navigator
  // For now, this is a no-op. Android support can be added later.
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Button
 * ----------------------------------------------------------------------------------
 *
 * A toolbar button. On native, registers with the toolbar context.
 * On web, renders an interactive button.
 */

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
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarButton(_props: ToolbarButtonProps) {
  // No-op on native - handled by native toolbar
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Separator
 * ----------------------------------------------------------------------------------
 *
 * Visual separator between toolbar items.
 */

export interface ToolbarSeparatorProps {
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarSeparator(_props: ToolbarSeparatorProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Link
 * ----------------------------------------------------------------------------------
 *
 * A toolbar button that navigates to a route.
 */

export interface ToolbarLinkProps extends ToolbarButtonProps {
  /** The route to navigate to */
  href: string;
}

export function ToolbarLink(_props: ToolbarLinkProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Menu
 * ----------------------------------------------------------------------------------
 *
 * A dropdown menu in the toolbar. Uses context menu on native iOS,
 * Radix dropdown on web.
 */

export interface ToolbarMenuProps {
  /** Menu trigger content */
  trigger?: React.ReactNode;
  /** SF Symbol icon for the trigger */
  icon?: string;
  /** Menu items */
  children?: React.ReactNode;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenu(_props: ToolbarMenuProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuItem
 * ----------------------------------------------------------------------------------
 *
 * An item in the toolbar menu.
 */

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
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenuItem(_props: ToolbarMenuItemProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuSeparator
 * ----------------------------------------------------------------------------------
 *
 * A separator between menu items.
 */

export interface ToolbarMenuSeparatorProps {
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenuSeparator(_props: ToolbarMenuSeparatorProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuLabel
 * ----------------------------------------------------------------------------------
 *
 * A non-interactive label in a menu group.
 */

export interface ToolbarMenuLabelProps {
  /** Label text */
  children?: React.ReactNode;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenuLabel(_props: ToolbarMenuLabelProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Group
 * ----------------------------------------------------------------------------------
 *
 * Groups toolbar items together visually.
 */

export interface ToolbarGroupProps {
  /** Group content */
  children?: React.ReactNode;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarGroup({ children }: ToolbarGroupProps) {
  return <>{children}</>;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.ToggleItem
 * ----------------------------------------------------------------------------------
 *
 * A toggle item within a toggle group.
 */

export interface ToolbarToggleItemProps {
  /** Unique value for this toggle item */
  value: string;
  /** SF Symbol icon name */
  icon?: string;
  /** Button label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarToggleItem(_props: ToolbarToggleItemProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuCheckboxItem
 * ----------------------------------------------------------------------------------
 *
 * A checkbox item in a menu.
 */

export interface ToolbarMenuCheckboxItemProps {
  /** Whether the item is checked */
  checked?: boolean;
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Item label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenuCheckboxItem(_props: ToolbarMenuCheckboxItemProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuRadioGroup & RadioItem
 * ----------------------------------------------------------------------------------
 *
 * Radio group and items for mutually exclusive options.
 */

export interface ToolbarMenuRadioGroupProps {
  /** The selected value */
  value?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
  /** Radio items */
  children?: React.ReactNode;
}

export function ToolbarMenuRadioGroup({ children }: ToolbarMenuRadioGroupProps) {
  return <>{children}</>;
}

export interface ToolbarMenuRadioItemProps {
  /** The value of this radio item */
  value: string;
  /** Item label */
  children?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarMenuRadioItem(_props: ToolbarMenuRadioItemProps) {
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuSub (Submenu)
 * ----------------------------------------------------------------------------------
 *
 * A submenu within a menu.
 */

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
  return null;
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Spacer
 * ----------------------------------------------------------------------------------
 *
 * Flexible spacer that pushes items apart.
 */

export interface ToolbarSpacerProps {
  /** Additional CSS classes (web only) */
  className?: string;
}

export function ToolbarSpacer(_props: ToolbarSpacerProps) {
  return null;
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

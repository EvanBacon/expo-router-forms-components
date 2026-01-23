"use client";

import * as React from "react";
import * as ToolbarPrimitive from "@radix-ui/react-toolbar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Link as RouterLink } from "expo-router";

import { cn } from "@/lib/utils";
import { SFIcon } from "@/components/ui/sf-icon";
import { useStackHeaderContext } from "@/components/layout/stack.web";
import { ProgressiveBlurBackdrop } from "@/components/ui/tab-bar-controller.web";

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
 * Toolbar (Root)
 * ----------------------------------------------------------------------------------
 *
 * A floating toolbar that can be positioned at the top or bottom of the screen.
 * Uses Radix UI Toolbar for accessibility and keyboard navigation.
 */

export interface ToolbarProps {
  /** Toolbar placement - 'top' integrates with header, 'bottom' renders fixed bar, 'relative' for inline use */
  placement?: ToolbarPlacement;
  /** Toolbar content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function Toolbar({ placement = "bottom", children, className }: ToolbarProps) {
  const stackContext = useStackHeaderContextSafe();
  const isSidebarOpen = stackContext?.isSidebarOpen ?? false;

  const contextValue = React.useMemo(() => ({ placement }), [placement]);

  return (
    <ToolbarContext.Provider value={contextValue}>
      {placement === "bottom" && (
        <ProgressiveBlurBackdrop
          position="bottom"
          className={cn(
            "fixed z-20",
            isSidebarOpen ? "left-78" : "left-0"
          )}
        />
      )}

      <ToolbarPrimitive.Root
        data-slot="toolbar"
        data-placement={placement}
        className={cn(
          "pointer-events-auto flex items-center gap-1",
          "rounded-full px-1.5 py-1",
          "bg-(--sf-grouped-bg-2)/80 backdrop-blur-xl",
          "shadow-lg shadow-black/10",
          // Fixed positioning for bottom placement
          placement === "bottom" && cn(
            "fixed bottom-4 left-1/2 z-30 -translate-x-1/2",
            isSidebarOpen && "translate-x-[calc(-50%+156px)]"
          ),
          // Relative positioning for top and relative placements
          (placement === "top" || placement === "relative") && "relative",
          className
        )}
      >
        {children}
      </ToolbarPrimitive.Root>
    </ToolbarContext.Provider>
  );
}

// Safe version of useStackHeaderContext that doesn't throw
function useStackHeaderContextSafe() {
  try {
    return useStackHeaderContext();
  } catch {
    return null;
  }
}

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
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      data-active={active}
      disabled={disabled}
      onClick={onPress}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-3",
        "text-sf-text transition-colors",
        "hover:bg-sf-fill",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        active && "bg-sf-fill",
        !children && icon && "px-2.5", // Icon-only button
        className
      )}
    >
      {icon && <SFIcon name={icon as any} className="text-sf-text text-lg" />}
      {children && <span className="text-sm font-medium">{children}</span>}
    </ToolbarPrimitive.Button>
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
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("mx-1 h-5 w-px bg-sf-border", className)}
    />
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
    <ToolbarPrimitive.Link asChild>
      <RouterLink
        href={href as any}
        data-slot="toolbar-link"
        data-active={active}
        aria-disabled={disabled}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-3",
          "text-sf-text transition-colors no-underline",
          "hover:bg-sf-fill",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
          disabled && "pointer-events-none opacity-50",
          active && "bg-sf-fill",
          !children && icon && "px-2.5",
          className
        )}
      >
        {icon && <SFIcon name={icon as any} className="text-sf-text text-lg" />}
        {children && <span className="text-sm font-medium">{children}</span>}
      </RouterLink>
    </ToolbarPrimitive.Link>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Menu
 * ----------------------------------------------------------------------------------*/

interface ToolbarMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ToolbarMenuContext = React.createContext<ToolbarMenuContextValue | undefined>(undefined);

export interface ToolbarMenuProps {
  /** Menu trigger content (overrides icon) */
  trigger?: React.ReactNode;
  /** SF Symbol icon for the trigger */
  icon?: string;
  /** Trigger label text */
  label?: string;
  /** Menu items */
  children?: React.ReactNode;
  /** Additional CSS classes for the trigger */
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Default open state */
  defaultOpen?: boolean;
  /** Menu content alignment */
  align?: "start" | "center" | "end";
  /** Menu content side */
  side?: "top" | "bottom" | "left" | "right";
}

export function ToolbarMenu({
  trigger,
  icon = "ellipsis",
  label,
  children,
  className,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  align = "center",
  side = "top",
}: ToolbarMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setUncontrolledOpen;

  const contextValue = React.useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <ToolbarMenuContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
        <DropdownMenuPrimitive.Trigger asChild>
          {trigger || (
            <button
              data-slot="toolbar-menu-trigger"
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-full px-3",
                "text-sf-text transition-colors",
                "hover:bg-sf-fill",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
                !label && icon && "px-2.5",
                className
              )}
            >
              {icon && <SFIcon name={icon as any} className="text-sf-text text-lg" />}
              {label && <span className="text-sm font-medium">{label}</span>}
            </button>
          )}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            data-slot="toolbar-menu-content"
            align={align}
            side={side}
            sideOffset={8}
            className={cn(
              "z-50 min-w-[180px] overflow-hidden rounded-xl",
              "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
              "border border-sf-border",
              "shadow-lg shadow-black/10",
              "p-1",
              // Reset prose styles that leak into menus
              "[&_p]:m-0 [&_span]:m-0",
              // Animations
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2",
              "data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2",
              "data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {children}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </ToolbarMenuContext.Provider>
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
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuItem({
  icon,
  children,
  onSelect,
  destructive,
  disabled,
  shortcut,
  className,
}: ToolbarMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="toolbar-menu-item"
      data-destructive={destructive}
      disabled={disabled}
      onSelect={onSelect}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none",
        "transition-colors",
        destructive
          ? "text-sf-red focus:bg-sf-red/10"
          : "text-sf-text focus:bg-sf-fill",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      {icon && (
        <SFIcon
          name={icon as any}
          className={cn("text-lg", destructive ? "text-sf-red" : "text-sf-text-2")}
        />
      )}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="ml-auto text-xs text-sf-text-3 tracking-widest">
          {shortcut}
        </span>
      )}
    </DropdownMenuPrimitive.Item>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.MenuSeparator
 * ----------------------------------------------------------------------------------*/

export interface ToolbarMenuSeparatorProps {
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarMenuSeparator({ className }: ToolbarMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="toolbar-menu-separator"
      className={cn("my-1 h-px bg-sf-border", className)}
    />
  );
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

export function ToolbarMenuLabel({ children, className }: ToolbarMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="toolbar-menu-label"
      className={cn(
        "px-2.5 py-1.5 text-xs font-semibold text-sf-text-2 uppercase tracking-wider",
        className
      )}
    >
      {children}
    </DropdownMenuPrimitive.Label>
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
  className,
}: ToolbarMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="toolbar-menu-checkbox-item"
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pr-2.5 pl-8 text-sm outline-none",
        "text-sf-text transition-colors",
        "focus:bg-sf-fill",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <SFIcon name="checkmark" className="text-sf-blue text-sm" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
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

export function ToolbarMenuRadioGroup({
  value,
  onValueChange,
  children,
}: ToolbarMenuRadioGroupProps) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="toolbar-menu-radio-group"
      value={value}
      onValueChange={onValueChange}
    >
      {children}
    </DropdownMenuPrimitive.RadioGroup>
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
  className,
}: ToolbarMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="toolbar-menu-radio-item"
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pr-2.5 pl-8 text-sm outline-none",
        "text-sf-text transition-colors",
        "focus:bg-sf-fill",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      <span className="absolute left-2.5 flex h-4 w-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <SFIcon name="checkmark" className="text-sf-blue text-sm" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
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

export function ToolbarMenuSub({
  trigger,
  icon,
  children,
  disabled,
}: ToolbarMenuSubProps) {
  return (
    <DropdownMenuPrimitive.Sub>
      <DropdownMenuPrimitive.SubTrigger
        data-slot="toolbar-menu-sub-trigger"
        disabled={disabled}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none",
          "text-sf-text transition-colors",
          "focus:bg-sf-fill",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        )}
      >
        {icon && <SFIcon name={icon as any} className="text-sf-text-2 text-lg" />}
        <span className="flex-1">{trigger}</span>
        <SFIcon name="chevron.right" className="text-sf-text-3 text-sm" />
      </DropdownMenuPrimitive.SubTrigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.SubContent
          data-slot="toolbar-menu-sub-content"
          sideOffset={4}
          alignOffset={-4}
          className={cn(
            "z-50 min-w-[180px] overflow-hidden rounded-xl",
            "bg-(--sf-grouped-bg-2)/95 backdrop-blur-xl",
            "border border-sf-border",
            "shadow-lg shadow-black/10",
            "p-1",
            // Reset prose styles that leak into menus
            "[&_p]:m-0 [&_span]:m-0",
            // Animations
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {children}
        </DropdownMenuPrimitive.SubContent>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Sub>
  );
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
    <div
      data-slot="toolbar-group"
      className={cn("flex items-center", className)}
    >
      {children}
    </div>
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
  value,
  icon,
  children,
  disabled,
  className,
}: ToolbarToggleItemProps) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-toggle-item"
      data-value={value}
      disabled={disabled}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-3",
        "text-sf-text transition-colors",
        "hover:bg-sf-fill",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        !children && icon && "px-2.5",
        className
      )}
    >
      {icon && <SFIcon name={icon as any} className="text-lg" />}
      {children && <span className="text-sm font-medium">{children}</span>}
    </ToolbarPrimitive.Button>
  );
}

/* ----------------------------------------------------------------------------------
 * Toolbar.Spacer
 * ----------------------------------------------------------------------------------*/

export interface ToolbarSpacerProps {
  /** Additional CSS classes */
  className?: string;
}

export function ToolbarSpacer({ className }: ToolbarSpacerProps) {
  return <div data-slot="toolbar-spacer" className={cn("flex-1", className)} />;
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

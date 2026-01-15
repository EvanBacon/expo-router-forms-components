"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";

// Context for sharing input value between components
interface AlertDialogInputContextValue {
  value: string;
  setValue: (value: string) => void;
}

const AlertDialogInputContext = React.createContext<AlertDialogInputContextValue | null>(null);

function useAlertDialogInput() {
  return React.useContext(AlertDialogInputContext);
}

function AlertDialog({
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <AlertDialogInputContext.Provider value={{ value: inputValue, setValue: setInputValue }}>
      <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props}>
        {children}
      </AlertDialogPrimitive.Root>
    </AlertDialogInputContext.Provider>
  );
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-sf-bg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border border-sf-border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-sf-text text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sf-text-2 text-sm", className)}
      {...props}
    />
  );
}

// Input component for prompt dialogs
interface AlertDialogInputProps {
  type?: "plain-text" | "secure-text" | "login-password";
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

function AlertDialogInput({
  type = "plain-text",
  defaultValue = "",
  placeholder,
  className,
}: AlertDialogInputProps) {
  const inputContext = useAlertDialogInput();

  React.useEffect(() => {
    if (inputContext && defaultValue) {
      inputContext.setValue(defaultValue);
    }
  }, [defaultValue, inputContext]);

  if (!inputContext) return null;

  const inputType = type === "secure-text" ? "password" : "text";

  return (
    <input
      data-slot="alert-dialog-input"
      type={inputType}
      value={inputContext.value}
      onChange={(e) => inputContext.setValue(e.target.value)}
      placeholder={placeholder}
      autoFocus
      className={cn(
        "flex h-10 w-full rounded-lg border border-sf-border bg-sf-bg px-3 py-2 text-sm text-sf-text placeholder:text-sf-text-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
}

interface AlertDialogActionProps extends Omit<React.ComponentProps<typeof AlertDialogPrimitive.Action>, "onClick"> {
  /** Called when action is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
}

function AlertDialogAction({
  className,
  onPress,
  onClick,
  ...props
}: AlertDialogActionProps & { onClick?: React.MouseEventHandler }) {
  const inputContext = useAlertDialogInput();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onPress?.(inputContext?.value);
  };

  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-action"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sf-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sf-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

interface AlertDialogCancelProps extends Omit<React.ComponentProps<typeof AlertDialogPrimitive.Cancel>, "onClick"> {
  /** Called when cancel is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
}

function AlertDialogCancel({
  className,
  onPress,
  onClick,
  ...props
}: AlertDialogCancelProps & { onClick?: React.MouseEventHandler }) {
  const inputContext = useAlertDialogInput();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onPress?.(inputContext?.value);
  };

  return (
    <AlertDialogPrimitive.Cancel
      data-slot="alert-dialog-cancel"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-sf-border bg-sf-bg px-4 py-2 text-sm font-medium text-sf-text transition-colors hover:bg-sf-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

interface AlertDialogDestructiveProps extends Omit<React.ComponentProps<typeof AlertDialogPrimitive.Action>, "onClick"> {
  /** Called when action is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
}

function AlertDialogDestructive({
  className,
  onPress,
  onClick,
  ...props
}: AlertDialogDestructiveProps & { onClick?: React.MouseEventHandler }) {
  const inputContext = useAlertDialogInput();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    onPress?.(inputContext?.value);
  };

  return (
    <AlertDialogPrimitive.Action
      data-slot="alert-dialog-destructive"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sf-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sf-red/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogInput,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDestructive,
};

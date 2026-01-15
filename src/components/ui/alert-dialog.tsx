"use client";

import * as React from "react";
import { createContext, use, Children, isValidElement, cloneElement } from "react";
import { Alert, AlertButton, AlertType, KeyboardTypeOptions } from "react-native";
import { Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";

// Types for prompt input
interface PromptConfig {
  type: AlertType;
  defaultValue?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}

// Extended action that can receive input value
interface AlertActionWithInput extends Omit<AlertButton, "onPress"> {
  onPress?: (value?: string) => void;
}

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  actions: AlertActionWithInput[];
  registerAction: (action: AlertActionWithInput) => () => void;
  promptConfig: PromptConfig | null;
  setPromptConfig: (config: PromptConfig | null) => void;
  showAlert: () => void;
}

// Context
const AlertDialogContext = createContext<AlertDialogContextValue | undefined>(
  undefined
);

function useAlertDialog() {
  const context = use(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within an AlertDialog");
  }
  return context;
}

// Root component
interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open: controlledOpen, onOpenChange, children }: AlertDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [promptConfig, setPromptConfig] = React.useState<PromptConfig | null>(null);
  const actionsRef = React.useRef<AlertActionWithInput[]>([]);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  const registerAction = React.useCallback((action: AlertActionWithInput) => {
    actionsRef.current.push(action);
    forceUpdate();
    return () => {
      actionsRef.current = actionsRef.current.filter((a) => a !== action);
      forceUpdate();
    };
  }, []);

  const showAlert = React.useCallback(() => {
    // Convert actions to AlertButton format
    const buttons: AlertButton[] = actionsRef.current.map((action) => ({
      text: action.text,
      style: action.style,
      onPress: action.onPress as AlertButton["onPress"],
    }));

    if (promptConfig) {
      // Use Alert.prompt for input dialogs (iOS only, falls back to alert on Android)
      Alert.prompt(
        title,
        description,
        actionsRef.current.map((action) => ({
          text: action.text,
          style: action.style,
          onPress: action.onPress,
        })),
        promptConfig.type,
        promptConfig.defaultValue,
        promptConfig.keyboardType
      );
    } else {
      Alert.alert(title, description, buttons, {
        cancelable: true,
        onDismiss: () => setOpen(false),
      });
    }
  }, [title, description, promptConfig, setOpen]);

  // Auto-show alert when open becomes true (for controlled mode)
  React.useEffect(() => {
    if (open && isControlled) {
      showAlert();
    }
  }, [open, isControlled, showAlert]);

  return (
    <AlertDialogContext
      value={{
        open,
        setOpen,
        title,
        setTitle,
        description,
        setDescription,
        actions: actionsRef.current,
        registerAction,
        promptConfig,
        setPromptConfig,
        showAlert,
      }}
    >
      {children}
    </AlertDialogContext>
  );
}

// Trigger - wraps children and shows alert on press
interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

function AlertDialogTrigger({ children, asChild, className }: AlertDialogTriggerProps) {
  const { showAlert } = useAlertDialog();

  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      onPress: (e: any) => {
        (children as React.ReactElement<any>).props.onPress?.(e);
        showAlert();
      },
    });
  }

  // If children is just text, render a styled button
  if (typeof children === "string") {
    return (
      <Pressable onPress={showAlert} className={cn(className)}>
        <Text className="text-center">{children}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={showAlert} className={cn(className)}>
      {children}
    </Pressable>
  );
}

// Content - renders nothing on native, just collects metadata from children
interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

function AlertDialogContent({ children }: AlertDialogContentProps) {
  // On native, we just render children to collect their effects
  // The actual UI is handled by the native Alert
  return <>{children}</>;
}

// Header - container for title and description (renders nothing on native)
interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function AlertDialogHeader({ children }: AlertDialogHeaderProps) {
  return <>{children}</>;
}

// Footer - container for actions (renders nothing on native)
interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

function AlertDialogFooter({ children }: AlertDialogFooterProps) {
  return <>{children}</>;
}

// Title - registers title with context
interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

function AlertDialogTitle({ children }: AlertDialogTitleProps) {
  const { setTitle } = useAlertDialog();

  React.useEffect(() => {
    if (typeof children === "string") {
      setTitle(children);
    } else {
      // Try to extract text from children
      const text = extractTextFromChildren(children);
      setTitle(text);
    }
  }, [children, setTitle]);

  return null;
}

// Description - registers description with context
interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function AlertDialogDescription({ children }: AlertDialogDescriptionProps) {
  const { setDescription } = useAlertDialog();

  React.useEffect(() => {
    if (typeof children === "string") {
      setDescription(children);
    } else {
      const text = extractTextFromChildren(children);
      setDescription(text);
    }
  }, [children, setDescription]);

  return null;
}

// Input - registers input configuration for Alert.prompt
interface AlertDialogInputProps {
  type?: "plain-text" | "secure-text" | "login-password";
  defaultValue?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  className?: string;
}

function AlertDialogInput({
  type = "plain-text",
  defaultValue,
  keyboardType,
}: AlertDialogInputProps) {
  const { setPromptConfig } = useAlertDialog();

  React.useEffect(() => {
    setPromptConfig({
      type,
      defaultValue,
      keyboardType,
    });

    return () => {
      setPromptConfig(null);
    };
  }, [type, defaultValue, keyboardType, setPromptConfig]);

  return null;
}

// Action button - registers as a confirm action
interface AlertDialogActionProps {
  children: React.ReactNode;
  /** Called when action is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
  className?: string;
}

function AlertDialogAction({ children, onPress }: AlertDialogActionProps) {
  const { registerAction, setOpen } = useAlertDialog();

  React.useEffect(() => {
    const text =
      typeof children === "string" ? children : extractTextFromChildren(children);

    return registerAction({
      text,
      style: "default",
      onPress: (value?: string) => {
        onPress?.(value);
        setOpen(false);
      },
    });
  }, [children, onPress, registerAction, setOpen]);

  return null;
}

// Cancel button - registers as a cancel action
interface AlertDialogCancelProps {
  children: React.ReactNode;
  /** Called when cancel is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
  className?: string;
}

function AlertDialogCancel({ children, onPress }: AlertDialogCancelProps) {
  const { registerAction, setOpen } = useAlertDialog();

  React.useEffect(() => {
    const text =
      typeof children === "string" ? children : extractTextFromChildren(children);

    return registerAction({
      text,
      style: "cancel",
      onPress: (value?: string) => {
        onPress?.(value);
        setOpen(false);
      },
    });
  }, [children, onPress, registerAction, setOpen]);

  return null;
}

// Destructive action - styled as destructive/red
interface AlertDialogDestructiveProps {
  children: React.ReactNode;
  /** Called when action is pressed. Receives input value if AlertDialogInput is present. */
  onPress?: (value?: string) => void;
  className?: string;
}

function AlertDialogDestructive({ children, onPress }: AlertDialogDestructiveProps) {
  const { registerAction, setOpen } = useAlertDialog();

  React.useEffect(() => {
    const text =
      typeof children === "string" ? children : extractTextFromChildren(children);

    return registerAction({
      text,
      style: "destructive",
      onPress: (value?: string) => {
        onPress?.(value);
        setOpen(false);
      },
    });
  }, [children, onPress, registerAction, setOpen]);

  return null;
}

// Portal and Overlay are no-ops on native
function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay(_props: { className?: string }) {
  return null;
}

// Utility to extract text from React children
function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children) return "";

  const childArray = Children.toArray(children);
  return childArray
    .map((child) => {
      if (typeof child === "string") return child;
      if (typeof child === "number") return String(child);
      if (isValidElement(child)) {
        const props = child.props as { children?: React.ReactNode };
        if (props.children) {
          return extractTextFromChildren(props.children);
        }
      }
      return "";
    })
    .join("");
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

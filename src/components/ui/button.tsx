"use client";

import * as React from "react";
import { createContext, use, useMemo } from "react";
import { type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { View, Text } from "@/tw";
import { Pressable } from "@/tw/touchable";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Variant definitions using CVA
// -----------------------------------------------------------------------------

const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-sf-blue",
        secondary: "bg-sf-fill",
        outline: "border border-sf-border bg-transparent",
        ghost: "bg-transparent",
        destructive: "bg-sf-red",
        link: "bg-transparent",
      },
      size: {
        sm: "h-9 px-3 rounded-lg",
        default: "h-11 px-4 rounded-xl",
        lg: "h-14 px-6 rounded-2xl",
        icon: "h-11 w-11 rounded-xl p-0",
        "icon-sm": "h-9 w-9 rounded-lg p-0",
        "icon-lg": "h-14 w-14 rounded-2xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-sf-text",
      outline: "text-sf-text",
      ghost: "text-sf-blue",
      destructive: "text-white",
      link: "text-sf-blue",
    },
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
      icon: "text-base",
      "icon-sm": "text-sm",
      "icon-lg": "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

interface ButtonContextValue {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
}

interface ButtonProps
  extends Omit<PressableProps, "disabled">,
    VariantProps<typeof buttonVariants> {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface ButtonTextProps {
  className?: string;
  children?: React.ReactNode;
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const ButtonContext = createContext<ButtonContextValue | undefined>(undefined);

function useButtonContext() {
  const context = use(ButtonContext);
  if (!context) {
    throw new Error("Button compound components must be used within a Button");
  }
  return context;
}

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const ButtonRoot = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = useMemo(
      () => ({ variant, size, disabled }),
      [variant, size, disabled]
    );

    // Check if children is a string - if so, wrap it in ButtonText
    const content = useMemo(() => {
      if (typeof children === "string") {
        return <ButtonText>{children}</ButtonText>;
      }
      return children;
    }, [children]);

    return (
      <ButtonContext value={contextValue}>
        <Pressable
          ref={ref}
          data-slot="button"
          disabled={disabled}
          className={cn(
            buttonVariants({ variant, size }),
            disabled && "opacity-50",
            className
          )}
          {...props}
        >
          {content}
        </Pressable>
      </ButtonContext>
    );
  }
);
ButtonRoot.displayName = "Button";

const ButtonText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  ButtonTextProps
>(({ className, children, ...props }, ref) => {
  const { variant, size } = useButtonContext();

  return (
    <Text
      ref={ref}
      data-slot="button-text"
      className={cn(buttonTextVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Text>
  );
});
ButtonText.displayName = "Button.Text";

const ButtonIcon = React.forwardRef<
  React.ComponentRef<typeof View>,
  { className?: string; children?: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const { variant } = useButtonContext();

  // Determine icon color based on variant
  const iconColorClass = useMemo(() => {
    switch (variant) {
      case "default":
      case "destructive":
        return "text-white";
      case "secondary":
      case "outline":
        return "text-sf-text";
      case "ghost":
      case "link":
        return "text-sf-blue";
      default:
        return "text-sf-text";
    }
  }, [variant]);

  return (
    <View
      ref={ref}
      data-slot="button-icon"
      className={cn("items-center justify-center", iconColorClass, className)}
      {...props}
    >
      {children}
    </View>
  );
});
ButtonIcon.displayName = "Button.Icon";

// -----------------------------------------------------------------------------
// Compound component export
// -----------------------------------------------------------------------------

/**
 * A comprehensive Button component with multiple variants and sizes.
 *
 * @example Basic usage
 * ```tsx
 * <Button>Click me</Button>
 * <Button variant="secondary">Secondary</Button>
 * <Button variant="destructive">Delete</Button>
 * ```
 *
 * @example With icons
 * ```tsx
 * <Button>
 *   <Button.Icon><SFIcon name="plus" /></Button.Icon>
 *   <Button.Text>Add Item</Button.Text>
 * </Button>
 * ```
 *
 * @example Icon only
 * ```tsx
 * <Button size="icon">
 *   <Button.Icon><SFIcon name="gear" /></Button.Icon>
 * </Button>
 * ```
 */
const Button = Object.assign(ButtonRoot, {
  /** Text content for the button */
  Text: ButtonText,
  /** Icon wrapper that inherits color from button variant */
  Icon: ButtonIcon,
});

export {
  Button,
  ButtonText,
  ButtonIcon,
  buttonVariants,
  buttonTextVariants,
  useButtonContext,
};
export type { ButtonProps, ButtonTextProps, ButtonVariant, ButtonSize };

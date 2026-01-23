"use client";

import * as React from "react";
import { createContext, use, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Variant definitions using CVA
// -----------------------------------------------------------------------------

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-sf-blue text-white",
          "hover:bg-[light-dark(rgb(0,100,220),rgb(30,150,255))]",
          "active:bg-[light-dark(rgb(0,80,200),rgb(50,170,255))]",
        ],
        secondary: [
          "bg-sf-fill text-sf-text",
          "hover:bg-sf-fill-2",
          "active:bg-sf-fill-3",
        ],
        outline: [
          "border border-sf-border bg-transparent text-sf-text",
          "hover:bg-sf-fill",
          "active:bg-sf-fill-2",
        ],
        ghost: [
          "bg-transparent text-sf-blue",
          "hover:bg-sf-fill",
          "active:bg-sf-fill-2",
        ],
        destructive: [
          "bg-sf-red text-white",
          "hover:bg-[light-dark(rgb(220,50,50),rgb(255,80,80))]",
          "active:bg-[light-dark(rgb(200,40,40),rgb(255,100,100))]",
        ],
        link: [
          "bg-transparent text-sf-blue underline-offset-4",
          "hover:underline",
          "active:opacity-80",
        ],
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-11 px-4 text-base rounded-xl",
        lg: "h-14 px-6 text-lg rounded-2xl",
        icon: "size-11 rounded-xl p-0",
        "icon-sm": "size-9 rounded-lg p-0",
        "icon-lg": "size-14 rounded-2xl p-0",
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

interface ButtonTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
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

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      disabled = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const contextValue = useMemo(
      () => ({ variant, size, disabled }),
      [variant, size, disabled]
    );

    // Check if children is a string - if so, wrap it in a span for proper text styling
    const content = useMemo(() => {
      if (typeof children === "string") {
        return <ButtonText>{children}</ButtonText>;
      }
      return children;
    }, [children]);

    return (
      <ButtonContext value={contextValue}>
        <Comp
          ref={ref}
          data-slot="button"
          disabled={disabled}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {content}
        </Comp>
      </ButtonContext>
    );
  }
);
ButtonRoot.displayName = "Button";

const ButtonText = React.forwardRef<HTMLSpanElement, ButtonTextProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { variant, size } = useButtonContext();
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="button-text"
        className={cn(buttonTextVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
ButtonText.displayName = "Button.Text";

const ButtonIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }
>(({ className, asChild = false, children, ...props }, ref) => {
  const { variant } = useButtonContext();
  const Comp = asChild ? Slot : "span";

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
    <Comp
      ref={ref}
      data-slot="button-icon"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        iconColorClass,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
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
 * @example With asChild for custom elements
 * ```tsx
 * <Button asChild>
 *   <Link href="/dashboard">Go to Dashboard</Link>
 * </Button>
 * ```
 *
 * @example With icons
 * ```tsx
 * <Button>
 *   <Button.Icon><PlusIcon /></Button.Icon>
 *   <Button.Text>Add Item</Button.Text>
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

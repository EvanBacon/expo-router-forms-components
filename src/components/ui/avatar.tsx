import * as React from "react";
import { StyleSheet } from "react-native";

import { View, Text, ViewProps, Image, ImageProps } from "@/tw";
import { cn } from "@/lib/utils";

type AvatarContextValue = {
  hasImage: boolean;
  imageLoaded: boolean;
  setImageLoaded: (loaded: boolean) => void;
};

const AvatarContext = React.createContext<AvatarContextValue | undefined>(
  undefined
);

function useAvatarContext() {
  const context = React.use(AvatarContext);
  if (!context) {
    throw new Error("Avatar components must be used within an Avatar");
  }
  return context;
}

export type AvatarProps = ViewProps & {
  className?: string;
};

export function Avatar({ className, style, children, ...props }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Check if AvatarImage is a child
  const hasImage = React.useMemo(() => {
    let found = false;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === AvatarImage) {
        found = true;
      }
    });
    return found;
  }, [children]);

  // Check if custom size is provided via className
  const hasCustomSize = className && /\b(h-|w-|size-)/.test(className);

  return (
    <AvatarContext value={{ hasImage, imageLoaded, setImageLoaded }}>
      <View
        style={[hasCustomSize ? undefined : styles.avatar, style]}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full",
          !hasCustomSize && "h-10 w-10",
          className
        )}
        {...props}
      >
        {children}
      </View>
    </AvatarContext>
  );
}

export type AvatarImageProps = Omit<ImageProps, "source"> & {
  className?: string;
  src?: string;
  source?: ImageProps["source"];
  alt?: string;
};

export function AvatarImage({
  className,
  src,
  source,
  alt,
  style,
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { setImageLoaded } = useAvatarContext();
  const [hasError, setHasError] = React.useState(false);

  const imageSource = src ? { uri: src } : source;

  if (!imageSource || hasError) {
    return null;
  }

  return (
    <Image
      source={imageSource}
      accessibilityLabel={alt}
      style={[styles.image, style]}
      className={cn("absolute inset-0", className)}
      onLoad={(e) => {
        setImageLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setHasError(true);
        setImageLoaded(false);
        onError?.(e);
      }}
      {...props}
    />
  );
}

export type AvatarFallbackProps = ViewProps & {
  className?: string;
  delayMs?: number;
};

export function AvatarFallback({
  className,
  style,
  children,
  delayMs = 0,
  ...props
}: AvatarFallbackProps) {
  const { hasImage, imageLoaded } = useAvatarContext();
  const [canRender, setCanRender] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => setCanRender(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  // Don't render fallback if image loaded successfully
  if (hasImage && imageLoaded) {
    return null;
  }

  // Don't render until delay has passed
  if (!canRender) {
    return null;
  }

  return (
    <View
      style={[styles.fallback, style]}
      className={cn(
        "bg-sf-fill flex items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-sf-text-2 text-sm font-medium">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
  },
});

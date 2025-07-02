import React, { HTMLAttributes, useEffect, useState } from "react";
import { Image as ExpoImage, ImageProps, ImageSource } from "expo-image";
import { Dimensions, Appearance, ColorSchemeName } from "react-native";

const PictureContext = React.createContext<ImageSource | null>(null);

type PictureSource = {
  media?: string;
  srcSet: ImageSource;
};

type MediaQuery = {
  type: "all" | "screen" | "print";
  conditions: MediaCondition[];
};

type MediaCondition = {
  feature: string;
  value: string | number;
  operator: "min" | "max" | "exact";
  unit?: string;
};

// Parse media query string into structured format
function parseMediaQuery(query: string): MediaQuery {
  const result: MediaQuery = {
    type: "all",
    conditions: [],
  };

  // Remove extra spaces and normalize
  query = query.trim().toLowerCase();

  // Extract media type if present
  const typeMatch = query.match(/^(all|screen|print)\s+and\s+/);
  if (typeMatch) {
    result.type = typeMatch[1] as MediaQuery["type"];
    query = query.substring(typeMatch[0].length);
  }

  // Parse conditions
  const conditionRegex = /\(([^)]+)\)/g;
  let match;

  while ((match = conditionRegex.exec(query)) !== null) {
    const condition = match[1].trim();

    // Parse min/max conditions
    const minMaxMatch = condition.match(/^(min|max)-([\w-]+):\s*(.+)$/);
    if (minMaxMatch) {
      const [, operator, feature, value] = minMaxMatch;
      const parsed = parseValue(value);
      result.conditions.push({
        feature,
        value: parsed.value,
        operator: operator as "min" | "max",
        unit: parsed.unit,
      });
      continue;
    }

    // Parse exact value conditions
    const exactMatch = condition.match(/^([\w-]+):\s*(.+)$/);
    if (exactMatch) {
      const [, feature, value] = exactMatch;
      const parsed = parseValue(value);
      result.conditions.push({
        feature,
        value: parsed.value,
        operator: "exact",
        unit: parsed.unit,
      });
    }
  }

  return result;
}

// Parse values with units
function parseValue(value: string): { value: number | string; unit?: string } {
  value = value.trim();

  // Check for numeric values with units
  const numericMatch = value.match(/^(\d+(?:\.\d+)?)(px|em|rem|vw|vh|%)?$/);
  if (numericMatch) {
    return {
      value: parseFloat(numericMatch[1]),
      unit: numericMatch[2] || "px",
    };
  }

  // Return as string for non-numeric values
  return { value };
}

// Evaluate if a media query matches current conditions
function evaluateMediaQuery(query: MediaQuery, context: MediaContext): boolean {
  // Handle media type
  if (query.type === "print") return false; // React Native doesn't support print

  // Evaluate all conditions
  return query.conditions.every((condition) =>
    evaluateCondition(condition, context)
  );
}

type MediaContext = {
  width: number;
  height: number;
  colorScheme: ColorSchemeName;
  orientation: "portrait" | "landscape";
  aspectRatio: number;
  devicePixelRatio: number;
};

function evaluateCondition(
  condition: MediaCondition,
  context: MediaContext
): boolean {
  const { feature, value, operator, unit } = condition;

  // Convert value to pixels if needed
  const convertedValue = convertToPixels(value, unit, context);

  switch (feature) {
    case "width":
      if (operator === "min") return context.width >= convertedValue;
      if (operator === "max") return context.width <= convertedValue;
      return context.width === convertedValue;

    case "height":
      if (operator === "min") return context.height >= convertedValue;
      if (operator === "max") return context.height <= convertedValue;
      return context.height === convertedValue;

    case "device-width":
      const deviceWidth = Dimensions.get("screen").width;
      if (operator === "min") return deviceWidth >= convertedValue;
      if (operator === "max") return deviceWidth <= convertedValue;
      return deviceWidth === convertedValue;

    case "device-height":
      const deviceHeight = Dimensions.get("screen").height;
      if (operator === "min") return deviceHeight >= convertedValue;
      if (operator === "max") return deviceHeight <= convertedValue;
      return deviceHeight === convertedValue;

    case "orientation":
      return context.orientation === value;

    case "aspect-ratio":
      if (typeof value === "string" && value.includes("/")) {
        const [w, h] = value.split("/").map(Number);
        const targetRatio = w / h;
        if (operator === "min") return context.aspectRatio >= targetRatio;
        if (operator === "max") return context.aspectRatio <= targetRatio;
        return Math.abs(context.aspectRatio - targetRatio) < 0.01;
      }
      return false;

    case "device-aspect-ratio":
      const screen = Dimensions.get("screen");
      const deviceRatio = screen.width / screen.height;
      if (typeof value === "string" && value.includes("/")) {
        const [w, h] = value.split("/").map(Number);
        const targetRatio = w / h;
        if (operator === "min") return deviceRatio >= targetRatio;
        if (operator === "max") return deviceRatio <= targetRatio;
        return Math.abs(deviceRatio - targetRatio) < 0.01;
      }
      return false;

    case "resolution":
    case "device-pixel-ratio":
      if (operator === "min") return context.devicePixelRatio >= Number(value);
      if (operator === "max") return context.devicePixelRatio <= Number(value);
      return context.devicePixelRatio === Number(value);

    case "prefers-color-scheme":
      return context.colorScheme === value;

    default:
      // Unsupported feature
      return false;
  }
}

function convertToPixels(
  value: string | number,
  unit: string | undefined,
  context: MediaContext
): number {
  if (typeof value === "number") {
    switch (unit) {
      case "em":
      case "rem":
        // Assuming 16px base font size
        return value * 16;
      case "vw":
        return (value / 100) * context.width;
      case "vh":
        return (value / 100) * context.height;
      case "%":
        // For width/height queries, % is relative to viewport
        return (value / 100) * context.width;
      default:
        return value;
    }
  }
  return 0;
}

// Helper to check if media queries need specific listeners
function analyzeMediaQueries(sources: PictureSource[]): {
  needsDimensions: boolean;
  needsColorScheme: boolean;
} {
  let needsDimensions = false;
  let needsColorScheme = false;

  for (const source of sources) {
    if (!source.media) continue;

    const mediaLower = source.media.toLowerCase();

    // Check for dimension-related queries
    if (
      mediaLower.includes("width") ||
      mediaLower.includes("height") ||
      mediaLower.includes("orientation") ||
      mediaLower.includes("aspect-ratio")
    ) {
      needsDimensions = true;
    }

    // Check for color scheme queries
    if (mediaLower.includes("prefers-color-scheme")) {
      needsColorScheme = true;
    }

    // Early exit if both are needed
    if (needsDimensions && needsColorScheme) break;
  }

  return { needsDimensions, needsColorScheme };
}

function useMatchMedia(sources: PictureSource[]): PictureSource | null {
  const [source, setSource] = useState<PictureSource | null>(null);
  const [context, setContext] = useState<MediaContext>(() => {
    const { width, height } = Dimensions.get("window");
    return {
      width,
      height,
      colorScheme: Appearance.getColorScheme(),
      orientation: width > height ? "landscape" : "portrait",
      aspectRatio: width / height,
      devicePixelRatio: 2, // Default, can be enhanced
    };
  });

  // Analyze which listeners we need
  const { needsDimensions, needsColorScheme } = React.useMemo(
    () => analyzeMediaQueries(sources),
    [sources]
  );

  // Update context on dimension changes (only if needed)
  useEffect(() => {
    if (!needsDimensions) return;

    const updateDimensions = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      setContext((prev) => ({
        ...prev,
        width: window.width,
        height: window.height,
        orientation: window.width > window.height ? "landscape" : "portrait",
        aspectRatio: window.width / window.height,
      }));
    };

    const dimensionsSub = Dimensions.addEventListener(
      "change",
      updateDimensions
    );

    return () => {
      dimensionsSub?.remove();
    };
  }, [needsDimensions]);

  // Update context on color scheme changes (only if needed)
  useEffect(() => {
    if (!needsColorScheme) return;

    const updateColorScheme = ({
      colorScheme,
    }: {
      colorScheme: ColorSchemeName;
    }) => {
      setContext((prev) => ({ ...prev, colorScheme }));
    };

    const appearanceSub = Appearance.addChangeListener(updateColorScheme);

    return () => {
      appearanceSub?.remove();
    };
  }, [needsColorScheme]);

  // Evaluate media queries and find matching source
  useEffect(() => {
    let matchedSource: PictureSource | null = null;

    for (const src of sources) {
      if (!src.media) {
        // No media query means it's a fallback
        if (!matchedSource) {
          matchedSource = src;
        }
        continue;
      }

      const query = parseMediaQuery(src.media);
      if (evaluateMediaQuery(query, context)) {
        matchedSource = src;
        break; // First match wins
      }
    }

    setSource(matchedSource);
  }, [sources, context]);

  return source;
}

export function Picture({ children }: HTMLAttributes<HTMLPictureElement>) {
  const compliantChildren: React.ReactNode[] = [];
  const sources: PictureSource[] = [];

  React.Children.toArray(children).forEach((child) => {
    if (!React.isValidElement(child)) return null;

    if (child.type === "source" || child.type === Picture.Source) {
      const media = child.props.media;
      const srcSet = child.props.srcSet;
      sources.push({ media, srcSet });
    } else {
      compliantChildren.push(child);
    }
  });

  const source = useMatchMedia(sources);

  return (
    <PictureContext value={source?.srcSet || null}>
      {compliantChildren}
    </PictureContext>
  );
}

/** Return the matching <source /> if any. */
Picture.useSource = function useSource() {
  const source = React.useContext(PictureContext);
  if (source === undefined) {
    throw new Error("useSource must be used within a Picture component");
  }
  return source;
};

function Image(props: ImageProps) {
  const source = Picture.useSource();

  return <ExpoImage {...props} source={source || props.source} />;
}

Picture.Image = Image;

Picture.Source = function Source(props: { media?: string; srcSet: any }) {
  return null;
};

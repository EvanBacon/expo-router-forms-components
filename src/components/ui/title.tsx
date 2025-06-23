import { OpaqueColorValue, Text, TextProps } from "react-native";
import * as AC from "@bacons/apple-colors";
import * as Fonts from "@/constants/fonts";

// Type for common props
interface FontProps extends TextProps {
  rounded?: boolean;
  monospaced?: boolean;
  bold?: boolean;
  color?: string | OpaqueColorValue;
}

// Typography style configuration
const typographyStyles = {
  LargeTitle: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 41,
    letterSpacing: 0.4,
  },
  Title1: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 34,
    letterSpacing: 0.3,
  },
  Title2: {
    fontSize: 22,
    fontWeight: "bold",
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  Title3: {
    fontSize: 20,

    lineHeight: 26,
    letterSpacing: 0.2,
  },
  Headline: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  Subheadline: {
    fontSize: 15,

    lineHeight: 20,
    letterSpacing: 0.1,
  },
  Body: {
    fontSize: 17,

    lineHeight: 22,
    letterSpacing: 0.1,
  },
  Callout: {
    fontSize: 16,

    lineHeight: 21,
    letterSpacing: 0.1,
  },
  Footnote: {
    fontSize: 13,

    lineHeight: 18,
    letterSpacing: 0.0,
  },
  Caption1: {
    fontSize: 12,

    lineHeight: 16,
    letterSpacing: 0.0,
  },
  Caption2: {
    fontSize: 11,

    lineHeight: 15,
    letterSpacing: 0.0,
  },
} as const;

// Generic typography component
function createTypographyComponent(
  styleConfig: (typeof typographyStyles)[keyof typeof typographyStyles]
) {
  return function TypographyComponent({
    rounded,
    monospaced,
    bold,
    color,
    ...props
  }: FontProps) {
    return (
      <Text
        allowFontScaling
        {...props}
        style={[
          {
            fontWeight: bold ? "bold" : undefined,
            fontFamily: rounded
              ? Fonts.rounded
              : monospaced
              ? Fonts.monospaced
              : Fonts.system,
            color: color ?? AC.label,
            ...styleConfig,
          },
          props.style,
        ]}
      />
    );
  };
}

// Export individual typography components
export const LargeTitle = createTypographyComponent(
  typographyStyles.LargeTitle
);
export const Title = createTypographyComponent(typographyStyles.Title1);
export const Title2 = createTypographyComponent(typographyStyles.Title2);
export const Title3 = createTypographyComponent(typographyStyles.Title3);
export const Headline = createTypographyComponent(typographyStyles.Headline);
export const Subheadline = createTypographyComponent(
  typographyStyles.Subheadline
);
export const Body = createTypographyComponent(typographyStyles.Body);
export const Callout = createTypographyComponent(typographyStyles.Callout);
export const Footnote = createTypographyComponent(typographyStyles.Footnote);
export const Caption = createTypographyComponent(typographyStyles.Caption1);
export const Caption2 = createTypographyComponent(typographyStyles.Caption2);

// Apple UIFonts as React Native Components
import { Text, TextProps } from "react-native";
import * as AC from "@bacons/apple-colors";
import * as Fonts from "@/constants/fonts";

// Type for common props
interface FontProps extends TextProps {
  rounded?: boolean;
  monospaced?: boolean;
}

// LargeTitle (provided, included for completeness)
export function LargeTitle({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 34,
          fontWeight: "bold",
          lineHeight: 41,
          letterSpacing: 0.4,
        },
        props.style,
      ]}
    />
  );
}

// Title1
export function Title({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 28,
          fontWeight: "bold",
          lineHeight: 34,
          letterSpacing: 0.3,
        },
        props.style,
      ]}
    />
  );
}

// Title2
export function Title2({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 22,
          fontWeight: "bold",
          lineHeight: 28,
          letterSpacing: 0.2,
        },
        props.style,
      ]}
    />
  );
}

// Title3
export function Title3({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 20,
          fontWeight: "normal", // Regular
          lineHeight: 26,
          letterSpacing: 0.2,
        },
        props.style,
      ]}
    />
  );
}

// Headline
export function Headline({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
        },
        {
          color: AC.label,
          fontSize: 17,
          fontWeight: "600", // Semibold
          lineHeight: 22,
          letterSpacing: 0.1,
        },
        props.style,
      ]}
    />
  );
}

// Subheadline
export function Subheadline({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 15,
          fontWeight: "normal", // Regular
          lineHeight: 20,
          letterSpacing: 0.1,
        },
        props.style,
      ]}
    />
  );
}

// Body
export function Body({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 17,
          fontWeight: "normal", // Regular
          lineHeight: 22,
          letterSpacing: 0.1,
        },
        props.style,
      ]}
    />
  );
}

// Callout
export function Callout({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 16,
          fontWeight: "normal", // Regular
          lineHeight: 21,
          letterSpacing: 0.1,
        },
        props.style,
      ]}
    />
  );
}

// Footnote
export function Footnote({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 13,
          fontWeight: "normal", // Regular
          lineHeight: 18,
          letterSpacing: 0.0,
        },
        props.style,
      ]}
    />
  );
}

// Caption1
export function Caption({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 12,
          fontWeight: "normal", // Regular
          lineHeight: 16,
          letterSpacing: 0.0,
        },
        props.style,
      ]}
    />
  );
}

// Caption2
export function Caption2({ rounded, monospaced, ...props }: FontProps) {
  return (
    <Text
      allowFontScaling
      {...props}
      style={[
        {
          fontFamily: rounded
            ? Fonts.rounded
            : monospaced
            ? Fonts.monospaced
            : Fonts.system,
          color: AC.label,
          fontSize: 11,
          fontWeight: "normal", // Regular
          lineHeight: 15,
          letterSpacing: 0.0,
        },
        props.style,
      ]}
    />
  );
}

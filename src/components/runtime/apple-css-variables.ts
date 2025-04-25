// Polyfill to add support for Apple CSS variables for colors in React Native

import { LogBox, StyleSheet } from "react-native";

// @ts-expect-error
import ReactNativeStyleAttributes from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

import * as AC from "@bacons/apple-colors";

const CSS_VARIABLES: Record<string, any> = {
  "--apple-blue": AC.systemBlue,
  "--apple-brown": AC.systemBrown,
  "--apple-cyan": AC.systemCyan,
  "--apple-green": AC.systemGreen,
  "--apple-indigo": AC.systemIndigo,
  "--apple-mint": AC.systemMint,
  "--apple-orange": AC.systemOrange,
  "--apple-pink": AC.systemPink,
  "--apple-purple": AC.systemPurple,
  "--apple-red": AC.systemRed,
  "--apple-teal": AC.systemTeal,
  "--apple-yellow": AC.systemYellow,
  "--apple-gray": AC.systemGray,
  "--apple-gray2": AC.systemGray2,
  "--apple-gray3": AC.systemGray3,
  "--apple-gray4": AC.systemGray4,
  "--apple-gray5": AC.systemGray5,
  "--apple-gray6": AC.systemGray6,
  "--apple-label": AC.label,
  "--apple-secondary-label": AC.secondaryLabel,
  "--apple-tertiary-label": AC.tertiaryLabel,
  "--apple-quaternary-label": AC.quaternaryLabel,
  "--apple-fill": AC.systemFill,
  "--apple-secondary-fill": AC.secondarySystemFill,
  "--apple-tertiary-fill": AC.tertiarySystemFill,
  "--apple-quaternary-fill": AC.quaternarySystemFill,
  "--apple-placeholder-text": AC.placeholderText,
  "--apple-background": AC.systemBackground,
  "--apple-secondary-background": AC.secondarySystemBackground,
  "--apple-tertiary-background": AC.tertiarySystemBackground,
  "--apple-grouped-background": AC.systemGroupedBackground,
  "--apple-secondary-grouped-background": AC.secondarySystemGroupedBackground,
  "--apple-tertiary-grouped-background": AC.tertiarySystemGroupedBackground,
  "--apple-separator": AC.separator,
  "--apple-opaque-separator": AC.opaqueSeparator,
  "--apple-link": AC.link,
  "--apple-dark-text": AC.darkText,
  "--apple-light-text": AC.lightText,
};

function customColorProcessor(processor: (value: any) => any, value: any) {
  if (typeof value === "string") {
    const cssVariable = value.match(/var\((.*)\)/)?.[1];
    if (cssVariable) {
      const cssValue = CSS_VARIABLES[cssVariable];
      if (cssValue) {
        return processor(cssValue);
      } else {
        console.warn(`CSS variable ${cssVariable} not found`);
      }
    }
  }
  return processor(value);
}

LogBox.ignoreLogs([/Overwriting (\w+) style attribute preprocessor/]);

const colorAttr = ReactNativeStyleAttributes.color;
for (const [key, value] of Object.entries(ReactNativeStyleAttributes)) {
  if (value === colorAttr) {
    StyleSheet.setStyleAttributePreprocessor(
      key,
      // @ts-expect-error
      customColorProcessor.bind(null, value.process)
    );
  }
}

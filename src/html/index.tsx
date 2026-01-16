import { useCssElement } from "react-native-css";

import React from "react";

import { html as rsd } from "react-strict-dom";
import { StyleSheet } from "react-native";

function createCssComponent<T extends keyof typeof rsd>(
  elementName: T,
  displayName?: string
) {
  type Props = React.ComponentProps<(typeof rsd)[T]> & {
    className?: string;
  };

  let Component: (props: Props) => React.ReactElement;
  if (process.env.EXPO_OS === "web") {
    Component = (props: Props) => {
      // eslint-disable-next-line import/namespace
      return useCssElement(rsd[elementName], props, {
        // @ts-expect-error
        className: "style",
      });
    };
  } else {
    Component = ({ style, ...props }: Props) => {
      const normal: any = props;
      if (style) {
        normal.style = normalizeStyle(style);
      }
      return useCssElement(
        // eslint-disable-next-line import/namespace
        rsd[elementName],
        normal,
        {
          // @ts-expect-error
          className: "style",
        }
      );
    };
  }

  (Component as any).displayName = displayName || `CSS(${elementName})`;

  return Component;
}

function normalizeStyle(style: any) {
  if (!style) return style;
  const flat = StyleSheet.flatten(style);
  if (flat.backgroundImage) {
    flat.experimental_backgroundImage = flat.backgroundImage;
    delete flat.backgroundImage;
  }
  return flat;
}

export const html = {
  // Interactive
  button: createCssComponent("button"),
  a: createCssComponent("a"),
  input: createCssComponent("input"),
  textarea: createCssComponent("textarea"),

  // Layout
  div: createCssComponent("div"),
  span: createCssComponent("span"),
  main: createCssComponent("main"),
  section: createCssComponent("section"),
  article: createCssComponent("article"),
  aside: createCssComponent("aside"),
  nav: createCssComponent("nav"),
  header: createCssComponent("header"),
  footer: createCssComponent("footer"),

  // Typography
  h1: createCssComponent("h1"),
  h2: createCssComponent("h2"),
  h3: createCssComponent("h3"),
  h4: createCssComponent("h4"),
  h5: createCssComponent("h5"),
  h6: createCssComponent("h6"),
  p: createCssComponent("p"),
  strong: createCssComponent("strong"),
  em: createCssComponent("em"),
  b: createCssComponent("b"),
  i: createCssComponent("i"),
  blockquote: createCssComponent("blockquote"),

  // Lists
  ul: createCssComponent("ul"),
  ol: createCssComponent("ol"),
  li: createCssComponent("li"),

  // Code
  pre: createCssComponent("pre"),
  code: createCssComponent("code"),

  // Table
  table: createCssComponent("table"),
  thead: createCssComponent("thead"),
  tbody: createCssComponent("tbody"),
  tr: createCssComponent("tr"),
  th: createCssComponent("th"),
  td: createCssComponent("td"),

  // Other
  img: createCssComponent("img"),
  hr: createCssComponent("hr"),
  label: createCssComponent("label"),
  form: createCssComponent("form"),
};

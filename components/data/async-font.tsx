import React from "react";

import * as Font from "expo-font";

function wrapPromise<T>(promise: Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T | unknown;
  let suspender = promise.then(
    (r: T) => {
      //   console.log("font loaded", r);
      status = "success";
      result = r;
    },
    (e: unknown) => {
      //   console.log("font error", e);
      status = "error";
      result = e;
    }
  );
  return {
    read(): T {
      if (status === "pending") {
        // console.log("font pending");
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result as T;
      }
      throw new Error("Unexpected state");
    },
  };
}

const fontMap = new Map();

const getSuspendingFont = (fontFamily: string, src: Font.FontSource) => {
  const id = JSON.stringify(fontFamily + "|" + JSON.stringify(src));
  if (!fontMap.has(id)) {
    const loader = wrapPromise(Font.loadAsync({ [fontFamily]: src }));
    fontMap.set(id, loader);
    return loader.read();
  }

  return fontMap.get(id).read();
};

const getLoadedFont = React.cache(getSuspendingFont);

type FontProps = {
  src: number | string;
  fontFamily: string;
  display?: Font.FontDisplay;
};

function SuspendingFont({ src, fontFamily }: FontProps) {
  getLoadedFont(fontFamily, src);
  return null;
}

function CSSFont({ src, fontFamily, display }: FontProps) {
  // This font depends on CSS for the state updating.
  // @ts-ignore
  Font.useFonts({
    [fontFamily]:
      typeof src === "string"
        ? { uri: src, fontDisplay: display }
        : { default: src, fontDisplay: display },
  });

  return null;
}
export const AsyncFont =
  process.env.EXPO_OS === "web" ? CSSFont : SuspendingFont;

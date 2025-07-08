import React, { HTMLAttributes } from "react";
import { ImageProps } from "expo-image";

export function Picture(props: HTMLAttributes<HTMLPictureElement>) {
  return <picture {...props} />;
}

/** This is native-only */
Picture.useSource = function useSource() {
  return null;
};

import ExpoImage from "expo-image/src/web/ImageWrapper";

// TODO: Web needs some rethinking...
Picture.Image = function Image({ source, ...props }: ImageProps) {
  typeof source === "string" ? { uri: source } : source;

  return (
    <ExpoImage
      {...props}
      source={{
        type: "srcset",
        uri: typeof source === "string" ? source : source.uri,
        srcset: "",
      }}
    />
  );
};

Picture.Source = function Source({
  srcSet,
  ...props
}: {
  media?: string;
  srcSet: any;
}) {
  return (
    <source
      {...props}
      srcSet={
        typeof srcSet === "object" && "uri" in srcSet ? srcSet.uri : srcSet
      }
    />
  );
};

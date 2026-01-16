declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "*.md" {
  import React from "react";
  import { CustomComponentsProp } from "@bacons/mdx";
  const Component: React.FC<{ components?: CustomComponentsProp }>;
  export default Component;
}

declare module "*.mdx" {
  import React from "react";
  import { CustomComponentsProp } from "@bacons/mdx";
  const Component: React.FC<{ components?: CustomComponentsProp }>;
  export default Component;
}

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
  // Frontmatter export from remark-mdx-frontmatter
  export const frontmatter: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
}

declare module "*.mdx" {
  import React from "react";
  import { CustomComponentsProp } from "@bacons/mdx";
  const Component: React.FC<{ components?: CustomComponentsProp }>;
  export default Component;
  // Frontmatter export from remark-mdx-frontmatter
  export const frontmatter: {
    title?: string;
    description?: string;
    [key: string]: unknown;
  };
}

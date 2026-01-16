const upstreamTransformer = require("@expo/metro-config/babel-transformer");
const { createTransformer } = require("@bacons/mdx/metro-transformer");
const remarkFrontmatter = require("remark-frontmatter").default;
const remarkMdxFrontmatter = require("remark-mdx-frontmatter").default;

// Create MDX transformer with frontmatter support
const mdxTransformer = createTransformer({
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
});

async function convertSvgModule(projectRoot, src, options) {
  const { resolveConfig, transform } = require("@svgr/core");
  const isNotNative = !options.platform || options.platform === "web";

  const defaultSVGRConfig = {
    native: !isNotNative,
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    svgoConfig: {
      // TODO: Maybe there's a better config for web?
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              inlineStyles: {
                onlyMatchedOnce: false,
              },
              removeViewBox: false,
              removeUnknownsAndDefaults: false,
              convertColors: false,
            },
          },
        },
      ],
    },
  };

  const svgUserConfig = await resolveConfig(projectRoot);
  const svgrConfig = svgUserConfig
    ? { ...defaultSVGRConfig, ...svgUserConfig }
    : defaultSVGRConfig;

  const output = await transform(
    src,
    // @ts-expect-error
    svgrConfig
  );

  if (isNotNative) {
    // If the SVG is not native, we need to add a wrapper to make it work
    return output;
  }

  // RNSVG doesn't support RSC yet.
  return '"use client";\n' + output;
}

module.exports.transform = async ({ src, filename, options }) => {
  // Handle MDX/MD files
  if (filename.endsWith(".mdx") || filename.endsWith(".md")) {
    src = (await mdxTransformer.transform({ src, filename, options })).src;
  }

  // Handle SVG files
  if (filename.endsWith(".svg")) {
    src = await convertSvgModule(options.projectRoot, src, {
      platform: options.platform,
    });
  }

  // Pass the source through the upstream Expo transformer.
  return upstreamTransformer.transform({ src, filename, options });
};

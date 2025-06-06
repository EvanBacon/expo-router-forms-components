module.exports = ({ config }) => {
  // This just makes it easier to deploy while preserving the ability to clone the repo as a template.
  // This file can be deleted and EAS CLI will generate the values automatically.
  if (process.env.LOCAL_BUNDLE_ID) {
    config.ios.bundleIdentifier = process.env.LOCAL_BUNDLE_ID;
  }
  if (process.env.LOCAL_EAS_PROJECT_ID) {
    if (!config.extra) {
      config.extra = {};
    }
    if (!config.extra.eas) {
      config.extra.eas = {};
    }
    config.extra.eas.projectId = process.env.LOCAL_EAS_PROJECT_ID;
  }
};

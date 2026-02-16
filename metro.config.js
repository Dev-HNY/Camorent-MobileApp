// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {});

// Add platform-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs", "cjs"];

// Platform-specific module resolution
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

// Performance optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Cache improvements
config.resetCache = false;
config.cacheStores = [
  new (require('metro-cache')).FileStore({
    root: require('path').join(__dirname, '.metro'),
  }),
];

module.exports = config;

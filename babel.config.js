module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: ["transform-remove-console"],
      },
    },
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: false,
          disableExtraction: false,
          disableDebounceOptimization: true,
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};

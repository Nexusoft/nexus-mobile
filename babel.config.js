module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
        },
      ],
      'react-native-reanimated/plugin'
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};

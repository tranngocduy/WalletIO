module.exports = function (api) {
  const babelEnv = api.env();

  api.cache(true);

  const plugins = [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ];

  if (babelEnv !== 'development') plugins.push(['transform-remove-console']);

  return { presets: ['module:@react-native/babel-preset'], plugins };
};

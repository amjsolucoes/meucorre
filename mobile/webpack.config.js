const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-google-mobile-ads'],
      },
    },
    argv
  );

  // Adicionar alias para mockar react-native-google-mobile-ads na web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-google-mobile-ads': require.resolve('./mocks/react-native-google-mobile-ads.web.js'),
  };

  return config;
};

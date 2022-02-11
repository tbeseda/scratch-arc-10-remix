const MY_NAME = 'remix';
const MY_PLUGIN_NAME = `architect/plugin-${MY_NAME}`;
const BUILD_DIR = `.${MY_NAME}`;
const REMIX_CONFIG = {
  appDirectory: `${MY_NAME}/`,
  // TODO put assets in BUILD_DIR and deploy to a bucket
  assetsBuildDirectory: `public/${BUILD_DIR}/`,
  cacheDirectory: `${BUILD_DIR}/.cache/`,
  serverBuildDirectory: `${BUILD_DIR}/server/build/`,
  publicPath: `/_static/${BUILD_DIR}/`,
  ignoredRouteFiles: ['.*'],
};

module.exports = {
  MY_NAME,
  MY_PLUGIN_NAME,
  BUILD_DIR,
  REMIX_CONFIG,
};

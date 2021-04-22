const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

var config = {
  watch: true,
  mode: process.env.NODE_ENV || 'development',
  // plugins: [new BundleAnalyzerPlugin()],
};

const serverConfig = merge(common, config);
module.exports = serverConfig;

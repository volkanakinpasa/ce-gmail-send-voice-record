const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

var options = {
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;

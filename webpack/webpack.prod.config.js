const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var config = {
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimize: false,
  },
};

const serverConfig = merge(common, config);
module.exports = serverConfig;

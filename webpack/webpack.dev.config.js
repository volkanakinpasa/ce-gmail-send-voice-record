const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const publicPath = '/';
const PORT = 8080;

var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};

var options = {
  watch: true,
  mode: process.env.NODE_ENV || 'development',

  output: {
    filename: '[name].bundle.js',
  },

  plugins: [new ChromeExtensionReloader()],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;

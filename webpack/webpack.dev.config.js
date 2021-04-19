const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

const publicPath = '/';
const PORT = 8080;

var options = {
  watch: true,
  mode: process.env.NODE_ENV || 'development',

  output: {
    filename: '[name].bundle.js',
  },

  plugins: [
    new ChromeExtensionReloader(),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/resources/128.png',
          to: 'resources/128.png',
        },
        {
          from: 'src/resources/microphone.svg',
          to: 'resources/microphone.svg',
        },
        {
          from: 'src/resources/oauth.json',
          to: 'resources/oauth.json',
        },
        {
          from: 'src/resources/pi.js',
          to: 'resources/pi.js',
        },
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
        {
          from: 'src/resources/inboxsdk.js',
          to: 'resources/inboxsdk.js',
        },
        {
          from: 'src/resources/jquery.js',
          to: 'resources/jquery.js',
        },
      ],
    }),
  ],
};

const serverConfig = merge(common, options);
module.exports = serverConfig;

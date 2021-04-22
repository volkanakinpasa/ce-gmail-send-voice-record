const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const output = {
  filename: '[name].bundle.js',
  path: path.join(__dirname, '..', 'dist'),
};

const config = {
  entry: {
    background: path.join(__dirname, '..', 'src', 'background.js'),
    content: path.join(__dirname, '..', 'src', 'content.js'),
  },
  target: 'web',
  output,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
          'postcss-loader',
        ],
      },

      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: 'file-loader?name=media/[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // {
      //   test: /\.(ts|tsx)$/,
      //   loader: 'ts-loader',
      //   exclude: /node_modules/,
      // },
    ],
  },
  resolve: {
    extensions: ['*', '.jsx', '.js', '.css'],
  },
  plugins: [
    new ProgressBarPlugin(),
    new CopyPlugin({
      patterns: [
        // {
        //   from: 'src/resources/128.png',
        //   to: 'resources/128.png',
        // },
        // {
        //   from: 'src/resources/microphone.svg',
        //   to: 'resources/microphone.svg',
        // },
        // {
        //   from: 'src/resources/oauth.json',
        //   to: 'resources/oauth.json',
        // },
        // {
        //   from: 'src/resources/pi.js',
        //   to: 'resources/pi.js',
        // },

        // {
        //   from: 'src/resources/inboxsdk.js',
        //   to: 'resources/inboxsdk.js',
        // },
        // {
        //   from: 'src/resources/jquery.js',
        //   to: 'resources/jquery.js',
        // },

        {
          from: 'src/resources',
          to: 'resources',
        },
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
      ],
    }),
    // // expose and write the allowed env vars on the compiled bundle
    // new ProgressBarPlugin(),
    // new CleanWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '..', 'src', 'popup.html'),
    //   filename: 'popup.html',
    //   chunks: ['popup'],
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '..', 'src', 'options.html'),
    //   filename: 'options.html',
    //   chunks: ['options'],
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, '..', 'src', 'background.html'),
    //   filename: 'background.html',
    //   chunks: ['background'],
    // }),
    // new WriteFilePlugin(),
    // // new BundleAnalyzerPlugin(),
  ],
};
module.exports = config;

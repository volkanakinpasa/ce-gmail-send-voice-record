const path = require('path');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WriteFilePlugin = require('write-file-webpack-plugin');

const output = {
  filename: '[name].js',
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
      // {
      //   test: /\.(ts|tsx)$/,
      //   loader: 'ts-loader',
      //   exclude: /node_modules/,
      // },
    ],
  },
  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js', '.css'],
  },
  plugins: [
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

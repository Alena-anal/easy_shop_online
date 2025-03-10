const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlagin = require('copy-webpack-plugin');
const {watchFile} = require('fs');

module.exports = {
  mode: 'development', entry: './src/index.js', output: {
    filename: 'bundle.js', path: path.resolve(__dirname, 'dist'), clean: true, publicPath: '/',

  }, module: {
    rules: [{
      test: /\.js$/, exclude: /node_modules/, use: {
        loader: 'babel-loader', options: {
          presets: ['@babel/preset-env'],
        },
      },
    }, {
      test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',],
    },],
  }, plugins: [new HtmlWebpackPlugin({
    template: './src/index.html', inject: 'body',
  }), new MiniCssExtractPlugin({
    filename: 'styles.css',
  }), new CopyWebpackPlagin({
    patterns: [{from: 'src/images', to: 'images'}]
  })], resolve: {
    extensions: ['.js', '.json', '.scss'],
  }, devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    }, compress: true, port: 9000, open: true, hot: false, liveReload: true, watchFiles: ['src/**/*']
  }, devtool: 'source-map',
};

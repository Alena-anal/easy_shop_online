const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlagin = require('copy-webpack-plugin');
const { watchFile } = require('fs');

module.exports = {
  mode: 'development', // или 'production' для продакшн сборки
  entry: './src/index.js', // основной файл входа
  output: {
    filename: 'bundle.js', // имя итогового файла
    path: path.resolve(__dirname, 'dist'), // папка для сборки
    clean: true, // очищает папку dist перед каждой сборкой
    publicPath: '/', // Указываем базовый путь для статики
  },
  module: {
    rules: [
      // Обработка JavaScript файлов
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // для транспиляции JavaScript
          options: {
            presets: ['@babel/preset-env'], // поддержка ES6+
          },
        },
      },
      // Обработка стилей (Sass)
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // выгрузка CSS в отдельный файл
          'css-loader', // для обработки CSS
          'sass-loader', // для компиляции Sass в CSS
        ],
      },
      // Обработка изображений
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // шаблон для HTML
      inject: 'body', // Вставлять скрипты в body (опционально)
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/result.html', // шаблон для HTML
      filename: 'result.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css', // итоговый файл стилей
    }),
    new CopyWebpackPlagin({
      patterns: [{from: 'src/images', to: 'images'}]
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.scss'], // поддержка расширений
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // указываем папку с файлами
    },
    compress: true, // сжатие
    port: 9000, // порт для локального сервера
    open: true, // открывает браузер при запуске
    hot: false,
    liveReload: true,
    watchFiles: ['src/**/*']
  },
  devtool: 'source-map', // для удобства отладки
};

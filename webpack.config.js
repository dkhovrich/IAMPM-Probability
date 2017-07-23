const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProduction = process.env.NODE_ENV = "production";

module.exports = {
  // entry: './src/js/app.js',
  entry: {
    app: './src/js/app.js',
    vendor: './src/js/vendor.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'assets'),
    library: 'app'
  },
  devtool: "source-map",
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    }, {
      test: /\.scss$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader", options: {
          sourceMap: true
        }
      }, {
        loader: "sass-loader", options: {
          sourceMap: true
        }
      }]
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        "babel-loader",
        "eslint-loader",
      ],
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['assets']),
    new ExtractTextPlugin("style.css"),
  ]
};
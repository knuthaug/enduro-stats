const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const isProduction = process.env['NODE_ENV'] === 'production'
const sourceMapEnabled = isProduction
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    bundle: './server/src/js/index.js',
    rider: './server/src/js/rider.js',
    race: './server/src/js/race.js',
    cal: './server/src/js/cal.js'
  },
  output: {
    filename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'server', 'dist', 'js')
  },
  devtool: sourceMapEnabled ? 'source-map' : false,
  optimization: {
    minimize: isProduction
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }

    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'server/src/js' }
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new AssetsPlugin({ filename: 'bundlemap-js.json' })
  ]
}

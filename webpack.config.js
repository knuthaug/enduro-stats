const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    bundle: './src/js/index.js',
    rider: './src/js/rider.js',
    race: './src/js/race.js',
    cal: './src/js/cal.js',
    fullrace: './src/js/fullrace.js',
    riders: './src/js/riders.js',
    compare: './src/js/compare.js',
    rank: './src/js/rank.js',
    map: './src/js/map.js',
    series: './src/js/series.js'
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
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/js' }
      ]
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new AssetsPlugin({ filename: 'bundlemap-js.json', fullPath: false, removeFullPathAutoPrefix: true })
  ]
}

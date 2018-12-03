const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const isProduction = process.env['NODE_ENV'] === 'production'
const sourceMapEnabled = isProduction

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './server/src/js/index.js',
  },
  output: {
    filename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'server', 'dist', 'js')
  },
  devtool: sourceMapEnabled ? 'source-map' : false,
  optimization: {
    minimize: isProduction,
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
  }
}

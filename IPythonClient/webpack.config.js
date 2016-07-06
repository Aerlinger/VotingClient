var webpack = require('webpack');
/**
 devtool: "source-map" cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It’s something for production.
 devtool: "eval-source-map" is really as good as devtool: "source-map", but can cache SourceMaps for modules. It’s much faster for rebuilds.
 devtool: "eval-cheap-module-source-map" offers SourceMaps that only maps lines (no column mappings) and are much faster.
 devtool: "eval-cheap-source-map" is similar but doesn’t generate SourceMaps for modules (i.e., jsx to js mappings).
 devtool: "eval" has the best performance, but it only maps to compiled source code per module. In many cases this is good enough. (Hint: combine it with output.pathinfo: true.)
 */

module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};

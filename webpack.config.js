//var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {  
  entry: './sources/js/bootstrap.tsx',
  output: {
    path: __dirname + '/',
    publicPath: './publish/',
    filename: './publish/bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html', '.css']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
/*
    new HtmlWebpackPlugin({
      title: 'Dreamscape',
      filename: './publish/index.html',
      template: './sources/index.html'
    })
*/
  ]

}
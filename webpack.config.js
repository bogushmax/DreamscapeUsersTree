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
  plugins: []
}
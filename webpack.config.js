const webpack = require('webpack')

module.exports = {
  entry: './index.js',

  output: {
    filename:'./dist/splitPanel.js',
    library: 'SplitPanel',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              module: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-0']
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}

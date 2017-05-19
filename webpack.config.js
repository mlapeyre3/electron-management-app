const path = require('path');
const webpack = require('webpack')

module.exports = {
  // This is the "main" file which should include all other modules
  entry: './app/main.js',
  // Where should the compiled file go?
  output: {
    // To the `dist` folder
    path: path.resolve(__dirname, 'dist'),
    publicPath: path.resolve(__dirname, './app/assets/'),
    // With the filename `build.js` so it's dist/build.js
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        },
        exclude: /node_modules/
      },
      {
        test: /\.(jpeg|png|gif|svg|tsv|json)$/,
        loader: "file-loader?name=/[name].[ext]"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    }
  }
};
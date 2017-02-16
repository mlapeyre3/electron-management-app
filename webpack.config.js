module.exports = {
  // This is the "main" file which should include all other modules
  entry: './app/main.js',
  // Where should the compiled file go?
  output: {
    // To the `dist` folder
    path: './dist',
    // With the filename `build.js` so it's dist/build.js
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  }
}
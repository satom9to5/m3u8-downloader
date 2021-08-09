const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    backgrounds: './src/backgrounds/main.ts',
    contents: './src/contents/main.ts',
    popups: './src/popups/main.ts',
    preferences: './src/preferences/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: [".ts", ".vue", ".js", ".yml", ".yaml", ".css"],
    alias: {
      '@config': path.resolve(__dirname, 'config'),
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ],
}


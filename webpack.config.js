const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')

const reactDocs = require('react-docgen')

// This will attempt to:
// 1. find the target component in the current directory
// 2. find the target component in the src directory
// 3. look at the package.json main entry to find the file if a target component name isn't provided

let filePath
const fileName = process.argv[2]
if (process.argv[2]) {
  const currDirPath = path.resolve('.', `${fileName}.js`)
  const srcDirPath = path.resolve('.', 'src', `${fileName}.js`)
  const isInCurrentDir = fs.existsSync(currDirPath)
  const isInSrcDir = fs.existsSync(srcDirPath)
  filePath = (isInCurrentDir && currDirPath) || (isInSrcDir && srcDirPath)
} else {
  const packageJson = require(path.resolve('.', 'package.json'))
  filePath = path.resolve(packageJson.main)
}

if (!filePath) console.error(`No file available on path: ${fileName}`)

const fileContents = fs.readFileSync(filePath, 'utf8')
const componentInfo = reactDocs.parse(fileContents)

module.exports = {
  context: path.resolve('.', 'src'),
  mode: 'production',
  cache: true,

  // Enables source maps
  devtool: 'source-map',

  entry: {
    'render-demo': path.resolve(__dirname, 'src/DemoRenderer.js'),
  },

  plugins: [
    // Passes on the info about the component
    new webpack.DefinePlugin({
      'process.env.COMPONENT_INFO': JSON.stringify(componentInfo),
    }),
    // Generates the HTML file for the demo
    new HtmlWebpackPlugin({ title: componentInfo.displayName }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  resolve: {
    symlinks: false,
    alias: {
      // Resolve the path to the target demo
      DemoFile: filePath,
      // Resolve the path to React so we don't import multiple react versions
      react: path.resolve(__dirname, './node_modules/react'),
      'parse-prop-types': path.resolve(__dirname, 'node_modules', 'parse-prop-types'),
    },
  },

  // This needed so svg-inline-loader (and others) will work correctly
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
  },

  output: {
    path: path.resolve(__dirname, '/'),
    publicPath: '/',
    filename: '[name].js', // Has to be name for some reason? Anything else doesn't load render-demo
    libraryTarget: 'umd', // make the bundle export
  },

  optimization: {
    runtimeChunk: 'multiple',
    moduleIds: 'hashed',
    minimize: false,
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!@fs)/,
          name: 'vendors',
          chunks: 'all',
        },
        fs: {
          test: /[\\/]node_modules[\\/]@fs[\\/]/,
          name: 'fs',
          chunks: 'all',
        },
        targetComponent: {
          test: path.resolve('.', 'src'),
          name: 'target-component',
          chunks: 'all',
        },
      },
      chunks: 'all',
    },
  },

  module: {
    rules: [
      {
        test: /demo\.js/,
        loader: 'imports-loader?parsePropTypes=parse-prop-types',
      },
      {
        test: /\.js$/,
        include: [
          path.resolve('.', 'src'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@fs'),
          path.resolve('node_modules/@fs'),
        ],
        exclude: /node_modules\/(?!@fs)/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-react',
                ['@babel/preset-env', { targets: { node: 'current' } }],
                '@emotion/babel-preset-css-prop',
              ],
              plugins: [
                ['babel-plugin-emotion', { sourceMaps: true }],
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
        ],
      },
      {
        test: /\.(html|png)$/,
        loader: 'file-loader?name=[name].[ext]',
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
}

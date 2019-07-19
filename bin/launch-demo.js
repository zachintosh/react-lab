#!/usr/bin/env node

// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.config');
const port = 5000;
const path = require('path');

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  // open: true,
  contentBase: path.resolve(__dirname, '../public'),
  index: 'index.html',
  stats: {
    builtAt: false,
    colors: true,
    timings: true,
    entrypoints: false,
    assets: false,
    modules: false,
    warnings: false,
    version: false,
    hash: false,
  },
}

const server = new WebpackDevServer(webpack(config), options);

server.listen(port, function (err) {
  if (err) {
    console.log(err);
  }
})
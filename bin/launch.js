#!/usr/bin/env node

// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const fs = require('fs')
const express = require('express')
const WebSocket = require('ws')
const reactDocs = require('react-docgen')
const config = require('../webpack.config')

const wss = new WebSocket.Server({ port: 8001 })
const app = express()
const port = 8080
const compiler = webpack(config)

let componentInfo

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

function parseComponentFile() {
  const fileContents = fs.readFileSync(filePath, 'utf8')
  return JSON.stringify(reactDocs.parse(fileContents))
}

app.use(
  middleware(compiler, {
    noInfo: true,
    publicPath: '/',
    hot: true,
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
  })
)

const wphmw = hotMiddleware(compiler)
app.use(wphmw)

app.use('/', (req, res, next) => {
  const indexPath = path.join(compiler.outputPath, 'index.html')
  // eslint-disable-next-line consistent-return
  compiler.outputFileSystem.readFile(indexPath, (err, result) => {
    if (err) return next(err)
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

wss.on('connection', ws => {
  componentInfo = parseComponentFile()
  ws.send(componentInfo)

  // Watch the file for any changes to it's documentation (proptypes, name, default prop values, etc.)
  fs.watchFile(filePath, { interval: 1000 }, () => {
    const updatedComponentInfo = parseComponentFile()
    // Check if they are the same, so we know if documentation updates happened or not
    if (updatedComponentInfo !== componentInfo) {
      console.log('Component documentation updated...')
      componentInfo = updatedComponentInfo
      ws.send(updatedComponentInfo)
    }
  })
})

app.listen(port, err => {
  if (err) {
    console.log(err)
  }
})

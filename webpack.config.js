import { fileURLToPath } from 'url'
import path from 'path'
import webpack from 'webpack'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'development'

export default {
  entry: {
    core: './client/js/core.js'
  },
  output: {
    path: path.resolve(__dirname, 'server/public/build/js'),
    library: '[name]'
  },
  mode: !inDev ? 'production' : 'development',
  devtool: !inDev ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      GA_ID: '' // use '' unless process.env.GA_ID is defined
    })
  ]
}

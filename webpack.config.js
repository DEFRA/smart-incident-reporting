import { fileURLToPath } from 'url'
import path from 'path'
import webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const env = process.env.NODE_ENV
const inDev = env === 'development'

export default {
  entry: {
    checkYourAnswers: './client/js/pages/check-your-answers.js',
    core: './client/js/core.js',
    cookies: './client/js/pages/cookies.js',
    locationMap: './client/js/pages/location-map.js'
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
    }),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/@friendlycaptcha/sdk/site.min.js' },
        { from: 'node_modules/@friendlycaptcha/sdk/site.compat.min.js' }
      ]
    })
  ]
}

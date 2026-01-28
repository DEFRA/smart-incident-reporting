import vision from '@hapi/vision'
import path from 'path'
import nunjucks from 'nunjucks'
import config from '../utils/config.js'
import constants from '../utils/constants.js'
import fs from 'fs'
import dirname from '../../dirname.cjs'
import { findErrorMessageById, getAnswer } from '../utils/template-helpers.js'
import getServiceDetails from '../utils/get-service-details.js'
const { version } = JSON.parse(fs.readFileSync('./package.json'))
const analyticsAccount = config.analyticsAccount

export default {
  plugin: vision,
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          const serviceNameAndURL = getServiceDetails(options.filename)
          return context => template.render({ ...context, ...serviceNameAndURL })
        },
        prepare: (options, next) => {
          const env = options.compileOptions.environment = nunjucks.configure(options.path, {
            autoescape: true,
            watch: false
          })
          // Add global functions for view templates
          env.addGlobal('govukRebrand', true)
          env.addGlobal('findErrorMessageById', findErrorMessageById)
          env.addGlobal('getAnswer', getAnswer)
          return next()
        }
      }
    },
    path: [
      path.join(dirname, 'public', 'build', 'views'),
      path.join(dirname, 'server', 'views'),
      path.join(dirname, 'node_modules', 'govuk-frontend')
    ],
    relativeTo: dirname,
    isCached: !config.isDev,
    context: {
      appVersion: version,
      env: config.env,
      deploymentEnv: config.deploymentEnv,
      assetPath: '/public',
      govUkHome: constants.urls.GOV_UK_HOME,
      analyticsAccount
    }
  }
}

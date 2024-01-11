import vision from '@hapi/vision'
import path from 'path'
import nunjucks from 'nunjucks'
import config from '../utils/config.js'
import constants from '../utils/constants.js'
import fs from 'fs'
import dirname from '../../dirname.cjs'
const { version } = JSON.parse(fs.readFileSync('./package.json'))
const analyticsAccount = config.analyticsAccount

export default {
  plugin: vision,
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return context => template.render(context)
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure(options.path, {
            autoescape: true,
            watch: false
          })
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
      assetPath: '/public',
      govUkHome: constants.urls.GOV_UK_HOME,
      serviceNameUrl: constants.urls.GOV_UK_SERVICE_HOME,
      serviceName: config.serviceName,
      pageTitle: `${config.serviceName} - GOV.UK`,
      analyticsAccount
    }
  }
}

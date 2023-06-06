'use strict'

const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../utils/config')
const constants = require('../utils/constants')
const pkg = require('../../package.json')
const analyticsAccount = config.analyticsAccount

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return context => template.render(context)
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure(
            [
              path.join(options.relativeTo || process.cwd(), options.path),
              'node_modules/govuk-frontend/'
            ],
            {
              autoescape: true,
              watch: false
            }
          )

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    isCached: !config.isDev,
    context: {
      appVersion: pkg.version,
      assetPath: '/assets',
      govUkHome: constants.Urls.GOV_UK_HOME,
      serviceNameUrl: constants.Urls.GOV_UK_SERVICE_HOME,
      serviceName: config.serviceName,
      pageTitle: `${config.serviceName} - GOV.UK`,
      analyticsAccount: analyticsAccount
    }
  }
}

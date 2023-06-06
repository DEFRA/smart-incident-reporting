'use strict'

const os = require('os')

module.exports = [
  {
    method: 'GET',
    path: '/assets/all.js',
    handler: {
      file: 'node_modules/govuk-frontend/govuk/all.js'
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: [
          os.tmpdir(),
          'server/public/static',
          'server/public/build',
          'server/public/js',
          'node_modules/govuk-frontend/govuk/assets',
          'node_modules/ispinner.css'
        ]
      }
    }
  }
]

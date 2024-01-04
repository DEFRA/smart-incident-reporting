'use strict'

const os = require('os')

module.exports = [
  {
    method: 'GET',
    path: '/assets/manifest.json',
    handler: {
      file: 'node_modules/govuk-frontend/dist/govuk/assets/manifest.json'
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
          'node_modules/govuk-frontend/dist/govuk',
          'node_modules/govuk-frontend/dist/govuk/assets',
          'node_modules/ispinner.css'
        ]
      }
    }
  }
]

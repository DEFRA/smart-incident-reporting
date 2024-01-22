export default [{
    method: 'GET',
    path: '/robots.txt',
    handler: {
      file: 'server/public/static/robots.txt'
    }
  }, {
    method: 'GET',
    path: '/public/all.js',
    handler: {
      file: 'node_modules/govuk-frontend/govuk/all.js'
    }
  },
  {
    method: 'GET',
    path: '/public/{path*}',
    handler: {
      directory: {
        path: [
          'server/public/static',
          'server/public/build',
          'server/public/js',
          'node_modules/govuk-frontend/govuk',
          'node_modules/govuk-frontend/govuk/assets',
          'node_modules/ispinner.css'
        ]
      }
    }
  }
]

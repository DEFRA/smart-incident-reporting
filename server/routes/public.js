export default [{
  method: 'GET',
  path: '/robots.txt',
  handler: {
    file: 'server/public/static/robots.txt'
  },
  options: {
    auth: false
  }
}, {
  method: 'GET',
  path: '/public/all.js',
  handler: {
    file: 'node_modules/govuk-frontend/govuk/all.js'
  },
  options: {
    auth: false
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
  },
  options: {
    auth: false
  }
}
]

'use strict'

const { Paths } = require('../utils/constants')

const routes = [].concat(
  require('../routes/home.route'),
  require('../routes/public.route'),
  ...Object.values(Paths).map(path => require(`../routes${path}.route`))
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}

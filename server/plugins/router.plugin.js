'use strict'

const { Paths } = require('../utils/constants')

const routes = [].concat(
  require('../routes/home.route'),
  require('../routes/public.route'),
  require('../routes/welcome.route'),
  require('../routes/incident-type.route'),
  require('../routes/water-quality/water-type.route'),
  require('../routes/location.route'),
  require('../routes/success.route')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}

'use strict'

const { Paths } = require('../utils/constants')

const routes = [].concat(
  require('../routes/home.route'),
  require('../routes/public.route'),
  require('../routes/welcome.route'),
  require('../routes/incident-type.route'),
  require('../routes/water-quality/water-type.route'),
  require('../routes/water-quality/location.route'),
  require('../routes/water-quality/substance.route'),
  require('../routes/water-quality/appearance.route'),
  require('../routes/water-quality/source.route'),
  require('../routes/water-quality/extent.route'),
  require('../routes/water-quality/extent_two.route'),
  require('../routes/water-quality/aquaticlife.route'),
  require('../routes/water-quality/aquaticlife_two.route'),
  require('../routes/fishing/fishing.route'),
  require('../routes/fishing/fishing-reportreason.route'),
  require('../routes/location.route'),
  require('../routes/success.route'),
  require('../routes/evidence.route'),
  require('../routes/anonymous.route'),
  require('../routes/updates.route')
)

module.exports = {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}

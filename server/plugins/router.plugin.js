'use strict'
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
  require('../routes/fishing/fishing.location'),
  require('../routes/fishing/fishing-reportreason.route'),
  require('../routes/fishing/fishing-equipment.route'),
  require('../routes/fishing/fishing-caughtorkilled.route'),
  require('../routes/fishing/fishing-typeoffish.route'),
  require('../routes/fishing/fishing-numberoffish.route'),
  require('../routes/fishing/fishing-numberofanglers.route'),
  require('../routes/fishing/fishing-current.route'),
  require('../routes/fishing/fishing-otherinfo.route'),
  require('../routes/fishing/fishing-when.route'),
  require('../routes/fishing/fishing.locationpinpoint.route'),
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

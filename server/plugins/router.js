// TODO refactor into a loop through files
import homeRoute from '../routes/home.route.js'
import publicRoute from '../routes/public.route.js'
import welcomeRoute from '../routes/welcome.route.js'
import incidentTypeRoute from '../routes/incident-type.route.js'

const routes = [].concat(
  homeRoute,
  publicRoute,
  welcomeRoute,
  incidentTypeRoute
  // ,
  // require('../routes/water-quality/water-type.route'),
  // require('../routes/water-quality/location.route'),
  // require('../routes/water-quality/location-map-or-desc.route'),
  // require('../routes/water-quality/location-address-option.route'),
  // require('../routes/water-quality/location-mapping-option.route'),
  // require('../routes/water-quality/location-desc-option.route'),
  // require('../routes/water-quality/reported.route'),
  // require('../routes/water-quality/when.route'),
  // require('../routes/water-quality/recurring.route'),
  // require('../routes/water-quality/past.route'),
  // require('../routes/water-quality/substance-v2.route'),
  // require('../routes/water-quality/smell-desc.route'),
  // require('../routes/water-quality/substance.route'),
  // require('../routes/water-quality/appearance.route'),
  // require('../routes/water-quality/source.route'),
  // require('../routes/water-quality/extent.route'),
  // require('../routes/water-quality/extent_two.route'),
  // require('../routes/water-quality/extent-three.route'),
  // require('../routes/water-quality/other-info.route'),
  // require('../routes/water-quality/aquaticlife.route'),
  // require('../routes/water-quality/aquaticlife-two.route'),
  // require('../routes/water-quality/contact.route'),
  // require('../routes/water-quality/volunteer-media-contact.route'),
  // require('../routes/fishing/fishing.location'),
  // require('../routes/fishing/fishing-reportreason.route'),
  // require('../routes/fishing/fishing-equipment.route'),
  // require('../routes/fishing/fishing-caughtorkilled.route'),
  // require('../routes/fishing/fishing-typeoffish.route'),
  // require('../routes/fishing/fishing-numberoffish.route'),
  // require('../routes/fishing/fishing-numberofanglers.route'),
  // require('../routes/fishing/fishing-current.route'),
  // require('../routes/fishing/fishing-otherinfo.route'),
  // require('../routes/fishing/fishing-when.route'),
  // require('../routes/fishing/fishing.locationpinpoint.route'),
  // require('../routes/location.route'),
  // require('../routes/success.route'),
  // require('../routes/evidence.route'),
  // require('../routes/anonymous.route'),
  // require('../routes/updates.route'),
  // require('../routes/notices/cookies.route'),
  // require('../routes/notices/privacy.route'),
  // require('../routes/notices/accessibility.route')
)

export default {
  plugin: {
    name: 'router',
    register: server => {
      server.route(routes)
    }
  }
}

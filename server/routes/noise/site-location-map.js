import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.NOISE_CONFIRM_SITE
  }
})

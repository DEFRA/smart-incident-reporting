import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'dust',
  route: constants.routes.DUST_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.DUST_CONFIRM_SITE
  }
})

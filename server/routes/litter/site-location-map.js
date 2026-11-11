import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.LITTER_CONFIRM_SITE
  }
})

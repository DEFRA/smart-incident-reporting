import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.PESTS_CONFIRM_SITE
  }
})

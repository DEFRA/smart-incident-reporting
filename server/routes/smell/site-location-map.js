import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.SMELL_CONFIRM_SITE
  }
})

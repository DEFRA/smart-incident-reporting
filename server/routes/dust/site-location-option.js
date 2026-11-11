import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'dust',
  route: constants.routes.DUST_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.DUST_CHOOSE_SITE,
    siteLocationMap: constants.routes.DUST_SITE_LOCATION_MAP
  }
})

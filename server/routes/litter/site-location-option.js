import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.LITTER_CHOOSE_SITE,
    siteLocationMap: constants.routes.LITTER_SITE_LOCATION_MAP
  }
})

import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'noise',
  route: constants.routes.NOISE_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.NOISE_CHOOSE_SITE,
    siteLocationMap: constants.routes.NOISE_SITE_LOCATION_MAP
  }
})

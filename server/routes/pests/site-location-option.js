import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.PESTS_CHOOSE_SITE,
    siteLocationMap: constants.routes.PESTS_SITE_LOCATION_MAP
  }
})

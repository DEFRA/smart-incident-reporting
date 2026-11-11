import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.SMELL_CHOOSE_SITE,
    siteLocationMap: constants.routes.SMELL_SITE_LOCATION_MAP
  }
})

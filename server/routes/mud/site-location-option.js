import constants from '../../utils/constants.js'
import createSiteLocationOptionRoutes from '../rars/site-location-option.js'

export default createSiteLocationOptionRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SITE_LOCATION_OPTION,
  redirect: {
    chooseSite: constants.routes.MUD_CHOOSE_SITE,
    siteLocationMap: constants.routes.MUD_SITE_LOCATION_MAP
  }
})

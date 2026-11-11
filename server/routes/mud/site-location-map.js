import constants from '../../utils/constants.js'
import createSiteLocationMapRoutes from '../rars/site-location-map.js'

export default createSiteLocationMapRoutes({
  problem: 'mud',
  route: constants.routes.MUD_SITE_LOCATION_MAP,
  redirect: {
    confirmSite: constants.routes.MUD_CONFIRM_SITE
  }
})

import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'dust',
  route: constants.routes.DUST_CHOOSE_SITE,
  redirect: {
    changeAddress: constants.routes.DUST_LOCATION_HOME,
    confirmSite: constants.routes.DUST_CONFIRM_SITE,
    manualSite: constants.routes.DUST_SOURCE_DETAILS
  }
})

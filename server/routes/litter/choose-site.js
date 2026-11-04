import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'litter',
  route: constants.routes.LITTER_CHOOSE_SITE,
  redirect: {
    changeAddress: constants.routes.LITTER_LOCATION_HOME,
    confirmSite: constants.routes.LITTER_CONFIRM_SITE,
    manualSite: constants.routes.LITTER_SOURCE_DETAILS
  }
})

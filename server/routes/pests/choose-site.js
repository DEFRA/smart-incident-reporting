import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'vermin/pests',
  route: constants.routes.PESTS_CHOOSE_SITE,
  redirect: {
    changeAddress: constants.routes.PESTS_LOCATION_HOME,
    confirmSite: constants.routes.PESTS_CONFIRM_SITE,
    manualSite: constants.routes.PESTS_SOURCE_DETAILS
  }
})

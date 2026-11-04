import constants from '../../utils/constants.js'
import createChooseSiteRoutes from '../rars/choose-site.js'

export default createChooseSiteRoutes({
  problem: 'smell',
  route: constants.routes.SMELL_CHOOSE_SITE,
  redirect: {
    changeAddress: constants.routes.SMELL_LOCATION_HOME,
    confirmSite: constants.routes.SMELL_CONFIRM_SITE,
    manualSite: constants.routes.SMELL_SOURCE_DETAILS
  }
})
